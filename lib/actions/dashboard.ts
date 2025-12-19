"use server"

import { db } from "@/lib/db"
import { projects, tasks, workspaceMembers, users } from "@/lib/db/schema"
import { eq, sql, gte, and, isNotNull } from "drizzle-orm"
import { getWorkspaceId } from "./workspace"

export async function getDashboardStats() {
    const workspaceId = await getWorkspaceId()

    console.log(" getDashboardStats - workspaceId:", workspaceId)

    if (!workspaceId) {
        return {
            totalProjects: 0,
            activeProjects: 0,
            completedTasks: 0,
            completedThisWeek: 0,
            inProgressTasks: 0,
            assignedTasks: 0,
            teamMembers: 0,
        }
    }

    try {
        // Get total projects count
        const projectsResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(projects)
            .where(eq(projects.workspaceId, workspaceId))

        const totalProjects = Number(projectsResult[0]?.count) || 0
        console.log(" getDashboardStats - totalProjects:", totalProjects)

        // Get active projects (projects with non-completed tasks)
        const activeProjectsResult = await db
            .select({ count: sql<number>`count(distinct ${projects.id})` })
            .from(projects)
            .leftJoin(tasks, eq(tasks.projectId, projects.id))
            .where(and(eq(projects.workspaceId, workspaceId), sql`${tasks.status} != 'done' OR ${tasks.status} IS NULL`))

        const activeProjects = Number(activeProjectsResult[0]?.count) || 0

        // Get completed tasks count
        const completedTasksResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(tasks)
            .innerJoin(projects, eq(tasks.projectId, projects.id))
            .where(and(eq(projects.workspaceId, workspaceId), eq(tasks.status, "done")))

        const completedTasks = Number(completedTasksResult[0]?.count) || 0

        // Get tasks completed this week
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        const completedThisWeekResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(tasks)
            .innerJoin(projects, eq(tasks.projectId, projects.id))
            .where(and(eq(projects.workspaceId, workspaceId), eq(tasks.status, "done"), gte(tasks.createdAt, oneWeekAgo)))

        const completedThisWeek = Number(completedThisWeekResult[0]?.count) || 0

        // Get in progress tasks count
        const inProgressResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(tasks)
            .innerJoin(projects, eq(tasks.projectId, projects.id))
            .where(and(eq(projects.workspaceId, workspaceId), eq(tasks.status, "in_progress")))

        const inProgressTasks = Number(inProgressResult[0]?.count) || 0

        // Get assigned tasks count (tasks with an assignee)
        const assignedResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(tasks)
            .innerJoin(projects, eq(tasks.projectId, projects.id))
            .where(and(eq(projects.workspaceId, workspaceId), eq(tasks.status, "in_progress"), isNotNull(tasks.assigneeId)))

        const assignedTasks = Number(assignedResult[0]?.count) || 0

        // Get team members count
        const membersResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(workspaceMembers)
            .where(eq(workspaceMembers.workspaceId, workspaceId))

        const teamMembers = Number(membersResult[0]?.count) || 0

        console.log(" getDashboardStats - results:", { totalProjects, completedTasks, inProgressTasks, teamMembers })

        return {
            totalProjects,
            activeProjects: totalProjects,
            completedTasks,
            completedThisWeek,
            inProgressTasks,
            assignedTasks,
            teamMembers,
        }
    } catch (error) {
        console.error(" Failed to fetch dashboard stats:", error)
        return {
            totalProjects: 0,
            activeProjects: 0,
            completedTasks: 0,
            completedThisWeek: 0,
            inProgressTasks: 0,
            assignedTasks: 0,
            teamMembers: 0,
        }
    }
}

export async function getRecentActivity() {
    const workspaceId = await getWorkspaceId()

    if (!workspaceId) {
        return []
    }

    try {
        // Get recent tasks with their assignees and projects
        const recentTasks = await db
            .select({
                id: tasks.id,
                title: tasks.title,
                status: tasks.status,
                createdAt: tasks.createdAt,
                projectName: projects.name,
                assigneeName: users.name,
            })
            .from(tasks)
            .innerJoin(projects, eq(tasks.projectId, projects.id))
            .leftJoin(users, eq(tasks.assigneeId, users.id))
            .where(eq(projects.workspaceId, workspaceId))
            .orderBy(sql`${tasks.createdAt} DESC`)
            .limit(5)

        return recentTasks.map((task) => ({
            id: task.id,
            user: task.assigneeName || "Team",
            action: task.status === "done" ? "completed" : task.status === "in_progress" ? "started working on" : "created",
            target: task.title,
            project: task.projectName,
            time: getRelativeTime(task.createdAt),
        }))
    } catch (error) {
        console.error("Failed to fetch recent activity:", error)
        return []
    }
}

export async function getUpcomingDeadlines() {
    const workspaceId = await getWorkspaceId()

    if (!workspaceId) {
        return []
    }

    try {
        const now = new Date()

        const upcomingTasks = await db
            .select({
                id: tasks.id,
                title: tasks.title,
                dueDate: tasks.dueDate,
                priority: tasks.priority,
                projectName: projects.name,
            })
            .from(tasks)
            .innerJoin(projects, eq(tasks.projectId, projects.id))
            .where(
                and(
                    eq(projects.workspaceId, workspaceId),
                    sql`${tasks.status} != 'done'`,
                    isNotNull(tasks.dueDate),
                    gte(tasks.dueDate, now),
                ),
            )
            .orderBy(tasks.dueDate)
            .limit(5)

        return upcomingTasks.map((task) => ({
            id: task.id,
            title: task.title,
            project: task.projectName,
            dueDate: task.dueDate ? formatDate(task.dueDate) : "No date",
            priority: task.priority,
        }))
    } catch (error) {
        console.error("Failed to fetch upcoming deadlines:", error)
        return []
    }
}

function getRelativeTime(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 172800) return "Yesterday"
    return `${Math.floor(diffInSeconds / 86400)} days ago`
}

function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
