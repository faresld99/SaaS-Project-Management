"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FolderKanban, Users, Settings, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"
import { logout } from "@/lib/actions/auth"
import type { User } from "@/lib/db/schema"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
    { name: "Team", href: "/dashboard/team", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface MobileNavProps {
    user?: User
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

export function MobileNav({ user }: MobileNavProps) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden sm:h-10 sm:w-10">
                    <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 sm:w-64">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-14 items-center border-b border-border px-3 sm:h-16 sm:px-4">
                        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground sm:h-8 sm:w-8">
                                <span className="text-xs font-bold text-background sm:text-sm">PF</span>
                            </div>
                            <span className="text-lg font-semibold sm:text-xl">ProjectFlow</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 overflow-y-auto p-3 sm:p-4">
                        {navigation.map((item) => {
                            const isActive =
                                pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors sm:gap-3 sm:px-3",
                                        isActive
                                            ? "bg-muted text-foreground"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                                    )}
                                >
                                    <item.icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Section */}
                    {user && (
                        <div className="border-t border-border p-3 sm:p-4">
                            <div className="mb-3 flex items-center gap-2.5 sm:mb-4 sm:gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted sm:h-10 sm:w-10">
                                    <span className="text-xs font-semibold sm:text-sm">{getInitials(user.name)}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">{user.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            <form action={logout}>
                                <Button
                                    type="submit"
                                    variant="ghost"
                                    className="w-full justify-start text-destructive hover:text-destructive"
                                    onClick={() => setOpen(false)}
                                    size="sm"
                                >
                                    <LogOut className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    Sign out
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
