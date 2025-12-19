import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines"
import { QuickCreate } from "@/components/dashboard/quick-create"
import { InvitationsList } from "@/components/team/invitations-list"
import { FolderKanban, CheckCircle2, Clock, Users } from "lucide-react"
import { getDashboardStats } from "@/lib/actions/dashboard"
import { getPendingInvitations } from "@/lib/actions/team"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard | ProjectFlow",
    description: "View your project overview and recent activity",
}

export default async function DashboardPage() {
    const stats = await getDashboardStats()
    const invitations = await getPendingInvitations()

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <Header title="Dashboard" description="Welcome back!" action={<QuickCreate />} />
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <InvitationsList invitations={invitations} />
                {/* Stats Grid - Now using dynamic data */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Projects"
                        value={stats.totalProjects}
                        description={`${stats.activeProjects} active`}
                        icon={FolderKanban}
                    />
                    <StatsCard
                        title="Tasks Completed"
                        value={stats.completedTasks}
                        description={`+${stats.completedThisWeek} this week`}
                        icon={CheckCircle2}
                    />
                    <StatsCard
                        title="In Progress"
                        value={stats.inProgressTasks}
                        description={`${stats.assignedTasks} assigned`}
                        icon={Clock}
                    />
                    <StatsCard title="Team Members" value={stats.teamMembers} description="In workspace" icon={Users} />
                </div>

                {/* Activity & Deadlines - Now server components fetching from DB */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <RecentActivity />
                    <UpcomingDeadlines />
                </div>
            </div>
        </div>
    )
}
