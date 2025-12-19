"use server"

import { db, projects } from "@/lib/db"
import { projectSchema } from "@/lib/validations"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getWorkspaceId, getCurrentWorkspace } from "./workspace"

export async function getProjects() {
    const workspaceId = await getWorkspaceId()

    if (!workspaceId) {
        return []
    }

    const result = await db.query.projects.findMany({
        where: eq(projects.workspaceId, workspaceId),
        with: {
            tasks: true,
        },
        orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    })
    return result
}

export async function getProject(id: string) {
    const result = await db.query.projects.findFirst({
        where: eq(projects.id, id),
        with: {
            tasks: {
                with: {
                    assignee: true,
                },
                orderBy: (tasks, { asc }) => [asc(tasks.createdAt)],
            },
        },
    })
    return result
}

export async function createProject(data: { name: string; description?: string }) {
    console.log(" createProject called with data:", data)

    const workspace = await getCurrentWorkspace()
    console.log(" workspace:", workspace)

    if (!workspace) {
        console.log(" No workspace found - user might not be authenticated")
        throw new Error("No workspace found. Please make sure you are logged in.")
    }

    const validated = projectSchema.parse(data)
    console.log(" validated data:", validated)

    try {
        const [project] = await db
            .insert(projects)
            .values({
                name: validated.name,
                description: validated.description,
                workspaceId: workspace.id,
            })
            .returning()

        console.log(" Project created:", project)

        revalidatePath("/dashboard")
        revalidatePath("/dashboard/projects")
        return project
    } catch (error) {
        console.error(" Error creating project:", error)
        throw error
    }
}

export async function updateProject(id: string, data: { name: string; description?: string }) {
    const validated = projectSchema.parse(data)

    const [project] = await db
        .update(projects)
        .set({
            name: validated.name,
            description: validated.description,
        })
        .where(eq(projects.id, id))
        .returning()

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/projects")
    revalidatePath(`/dashboard/projects/${id}`)
    return project
}

export async function deleteProject(id: string) {
    await db.delete(projects).where(eq(projects.id, id))
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/projects")
}
