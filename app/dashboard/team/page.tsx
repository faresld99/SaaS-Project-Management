import { Header } from "@/components/dashboard/header"
import { TeamList } from "@/components/team/team-list"
import { InviteDialog } from "@/components/team/invite-dialog"
import { InvitationsList } from "@/components/team/invitations-list"
import { getTeamMembers, getPendingInvitations } from "@/lib/actions/team"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Team | ProjectFlow",
  description: "Manage your team members",
}

export default async function TeamPage() {
  const members = await getTeamMembers()
  const invitations = await getPendingInvitations()

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Team"
        description={`${members.length} member${members.length === 1 ? "" : "s"}`}
        action={<InviteDialog />}
      />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <InvitationsList invitations={invitations} />
        <TeamList members={members} />
      </div>
    </div>
  )
}
