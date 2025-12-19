import type React from "react"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { getCurrentUser } from "@/lib/auth/session"
import { getUserWorkspaces, getWorkspaceId } from "@/lib/actions/workspace"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch user's workspaces (only those where the user is a member)
    const userWorkspaces = await getUserWorkspaces(user.id)
    const currentWorkspaceId = await getWorkspaceId()

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar user={user} workspaces={userWorkspaces} currentWorkspaceId={currentWorkspaceId ?? undefined} />
            <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
        </div>
    )
}
