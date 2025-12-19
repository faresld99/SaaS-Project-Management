"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { MobileNav } from "./mobile-nav"
import { NotificationBell } from "./notification-bell"
import type { User } from "@/lib/db/schema"

interface HeaderProps {
    title: string
    description?: string
    action?: React.ReactNode
    user?: User // Added user prop for mobile nav
}

export function Header({ title, description, action, user }: HeaderProps) {
    const { theme, setTheme } = useTheme()

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4">
                    <MobileNav user={user} />
                    <div>
                        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
                        {description && <p className="text-sm text-muted-foreground">{description}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    {action}
                    <NotificationBell />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 sm:h-10 sm:w-10"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 sm:h-5 sm:w-5" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 sm:h-5 sm:w-5" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
