import { Header } from "@/components/dashboard/header"
import { ProjectsList } from "@/components/projects/projects-list"
import { getProjects } from "@/lib/actions/projects"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import {QuickCreate} from "@/components/dashboard/quick-create";

export const metadata: Metadata = {
  title: "Projects | ProjectFlow",
  description: "Manage your projects",
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Projects"
        description={`${projects.length} project${projects.length === 1 ? "" : "s"}`}
        action={<QuickCreate />}
      />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <ProjectsList projects={projects} />
      </div>
    </div>
  )
}
