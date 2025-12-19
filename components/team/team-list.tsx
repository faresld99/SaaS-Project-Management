import { TeamMemberCard } from "./team-member-card"
import type { User } from "@/lib/db/schema"

interface TeamListProps {
  members: (User & { role: "admin" | "member" })[]
}

// Demo current user ID
const CURRENT_USER_ID = "11111111-1111-1111-1111-111111111111"

export function TeamList({ members }: TeamListProps) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-muted-foreground">No team members found</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <TeamMemberCard key={member.id} member={member} isCurrentUser={member.id === CURRENT_USER_ID} />
      ))}
    </div>
  )
}
