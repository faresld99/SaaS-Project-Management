import { Header } from "@/components/dashboard/header"
import { KanbanBoard } from "@/components/kanban/kanban-board"
import { getProject } from "@/lib/actions/projects"
import { getWorkspaceUsers } from "@/lib/actions/team"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const project = await getProject(id)
  return {
    title: project ? `${project.name} | ProjectFlow` : "Project | ProjectFlow",
    description: project?.description || "View and manage project tasks",
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params
  const [project, members] = await Promise.all([getProject(id), getWorkspaceUsers()])

  if (!project) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title={project.name}
        description={project.description || undefined}
        action={
          <Button variant="outline" size="sm" asChild className="bg-transparent">
            <Link href="/dashboard/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />
      <div className="flex-1 overflow-hidden p-4 md:p-6">
        <KanbanBoard projectId={project.id} tasks={project.tasks} members={members} />
      </div>
    </div>
  )
}
