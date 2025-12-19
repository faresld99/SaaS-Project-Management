"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, FolderKanban } from "lucide-react"
import Link from "next/link"
import type { Project, Task } from "@/lib/db/schema"

interface ProjectCardProps {
  project: Project & { tasks: Task[] }
  onEdit: () => void
  onDelete: () => void
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const taskCounts = {
    todo: project.tasks.filter((t) => t.status === "todo").length,
    inProgress: project.tasks.filter((t) => t.status === "in_progress").length,
    done: project.tasks.filter((t) => t.status === "done").length,
  }

  return (
    <Card className="group transition-colors hover:border-foreground/20">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 sm:p-6">
        <div className="min-w-0 flex-1 space-y-1 pr-2">
          <CardTitle className="text-base sm:text-lg">
            <Link href={`/dashboard/projects/${project.id}`} className="hover:underline">
              {project.name}
            </Link>
          </CardTitle>
          {project.description && (
            <CardDescription className="line-clamp-2 text-xs sm:text-sm">{project.description}</CardDescription>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 opacity-100 group-hover:opacity-100 sm:h-8 sm:w-8 sm:opacity-0">
              <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] max-w-[10rem] sm:w-auto">
            <DropdownMenuItem onClick={onEdit} className="text-xs sm:text-sm">
              <Pencil className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive text-xs sm:text-sm">
              <Trash2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-4 sm:text-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground sm:h-2 sm:w-2" />
            <span className="text-muted-foreground">{taskCounts.todo} todo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-chart-1 sm:h-2 sm:w-2" />
            <span className="text-muted-foreground">{taskCounts.inProgress} in progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-chart-2 sm:h-2 sm:w-2" />
            <span className="text-muted-foreground">{taskCounts.done} done</span>
          </div>
        </div>
        <div className="mt-3 sm:mt-4">
          <Button variant="outline" size="sm" asChild className="w-full bg-transparent text-xs sm:text-sm">
            <Link href={`/dashboard/projects/${project.id}`}>
              <FolderKanban className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
              Open Board
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
