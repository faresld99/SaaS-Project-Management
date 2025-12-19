import { Header } from "@/components/dashboard/header"
import { AccountSettings } from "@/components/settings/account-settings"
import { WorkspaceSettings } from "@/components/settings/workspace-settings"
import { DangerZone } from "@/components/settings/danger-zone"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings | ProjectFlow",
  description: "Manage your account and workspace settings",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Settings" description="Manage your account and workspace" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <AccountSettings />
          <WorkspaceSettings />
          <DangerZone />
        </div>
      </div>
    </div>
  )
}
