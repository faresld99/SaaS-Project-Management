import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, User, Mail } from "lucide-react"
import type { User as UserType } from "@/lib/db/schema"

interface TeamMemberCardProps {
  member: UserType & { role: "admin" | "member" }
  isCurrentUser?: boolean
}

export function TeamMemberCard({ member, isCurrentUser }: TeamMemberCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted sm:h-12 sm:w-12">
            <span className="text-sm font-medium sm:text-lg">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <p className="truncate text-sm font-medium sm:text-base">{member.name}</p>
              {isCurrentUser && (
                <Badge variant="outline" className="text-[10px] sm:text-xs">
                  You
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
              <Mail className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" />
              <span className="truncate">{member.email}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-3">
          <Badge
            variant={member.role === "admin" ? "default" : "secondary"}
            className="flex items-center gap-1 text-[10px] sm:text-xs"
          >
            {member.role === "admin" ? (
              <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            ) : (
              <User className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            )}
            {member.role === "admin" ? "Admin" : "Member"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] max-w-[10rem] sm:w-auto">
              <DropdownMenuItem className="text-xs sm:text-sm">Change role</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive text-xs sm:text-sm">Remove from workspace</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
