import type React from "react"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <span className="text-sm font-bold text-background">PF</span>
            </div>
            <span className="text-xl font-semibold">ProjectFlow</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">{children}</main>
    </div>
  )
}
