"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FolderKanban, Users, Settings, ChevronDown, Plus, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/lib/actions/auth"
import type { User } from "@/lib/db/schema"
import { useTransition } from "react"
import { createWorkspace, setCurrentWorkspace } from "@/lib/actions/workspace"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
    { name: "Team", href: "/dashboard/team", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface SidebarProps {
    user: User
    workspaces: { id: string; name: string }[]
    currentWorkspaceId?: string
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

export function Sidebar({ user, workspaces, currentWorkspaceId }: SidebarProps) {
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    const currentWorkspace =
        (currentWorkspaceId && workspaces.find((w) => w.id === currentWorkspaceId)) || workspaces[0] // Default to first workspace

    const handleSwitchWorkspace = (workspaceId: string) => {
        startTransition(async () => {
            await setCurrentWorkspace(workspaceId)
            // On recharge la page pour appliquer le changement partout
            window.location.reload()
        })
    }

    const handleCreateWorkspaceClick = () => {
        const name = window.prompt("Nom du nouveau workspace")
        if (!name || !name.trim()) return

        startTransition(async () => {
            await createWorkspace(name)
            window.location.reload()
        })
    }

    return (
        <aside className="hidden w-56 flex-col border-r border-border bg-card md:flex lg:w-64">
            {/* Workspace Switcher */}
            <div className="border-b border-border p-3 lg:p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between px-2 bg-transparent lg:px-3">
                            <div className="flex min-w-0 items-center gap-2 lg:gap-3">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted lg:h-8 lg:w-8">
                                    <span className="text-[10px] font-semibold lg:text-xs">
                                        {currentWorkspace ? getInitials(currentWorkspace.name) : "WS"}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1 text-left">
                                    <p className="truncate text-xs font-medium lg:text-sm">
                                        {currentWorkspace?.name || "Workspace"}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground lg:text-xs">Free plan</p>
                                </div>
                            </div>
                            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground lg:h-4 lg:w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[calc(100vw-2rem)] max-w-[14rem] lg:w-56" align="start">
                        <DropdownMenuLabel className="text-xs lg:text-sm">Workspaces</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {workspaces.map((workspace) => (
                            <DropdownMenuItem
                                key={workspace.id}
                                className="cursor-pointer text-xs lg:text-sm"
                                onClick={() => handleSwitchWorkspace(workspace.id)}
                                disabled={isPending}
                            >
                                <div className="flex min-w-0 items-center gap-2 lg:gap-3">
                                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-muted lg:h-6 lg:w-6">
                                        <span className="text-[10px] font-medium lg:text-xs">{getInitials(workspace.name)}</span>
                                    </div>
                                    <span className="truncate">{workspace.name}</span>
                                </div>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer text-xs lg:text-sm"
                            onClick={handleCreateWorkspaceClick}
                            disabled={isPending}
                        >
                            <Plus className="mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                            Create workspace
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3 lg:p-4">
                {navigation.map((item) => {
                    const isActive =
                        pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors lg:gap-3 lg:px-3 lg:py-2 lg:text-sm",
                                isActive
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                            )}
                        >
                            <item.icon className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* User Section */}
            <div className="border-t border-border p-3 lg:p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start px-2 bg-transparent lg:px-3">
                            <div className="flex min-w-0 items-center gap-2 lg:gap-3">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted lg:h-8 lg:w-8">
                                    <span className="text-[10px] font-semibold lg:text-xs">{getInitials(user.name)}</span>
                                </div>
                                <div className="min-w-0 flex-1 text-left">
                                    <p className="truncate text-xs font-medium lg:text-sm">{user.name}</p>
                                    <p className="truncate text-[10px] text-muted-foreground lg:text-xs">{user.email}</p>
                                </div>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[calc(100vw-2rem)] max-w-[14rem] lg:w-56" align="start">
                        <DropdownMenuLabel className="text-xs lg:text-sm">My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer text-xs lg:text-sm">
                            <Link href="/dashboard/settings">
                                <Settings className="mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer text-destructive text-xs lg:text-sm">
                            <form action={logout}>
                                <button type="submit" className="flex w-full items-center">
                                    <LogOut className="mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                    Sign out
                                </button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    )
}
