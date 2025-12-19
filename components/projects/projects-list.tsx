"use client"

import { useState } from "react"
import { ProjectCard } from "./project-card"
import { ProjectDialog } from "./project-dialog"
import { DeleteDialog } from "./delete-dialog"
import { createProject, updateProject, deleteProject } from "@/lib/actions/projects"
import { Button } from "@/components/ui/button"
import { Plus, FolderKanban } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Project, Task } from "@/lib/db/schema"

interface ProjectsListProps {
    projects: (Project & { tasks: Task[] })[]
}

export function ProjectsList({ projects }: ProjectsListProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState<(Project & { tasks: Task[] }) | null>(null)
    const router = useRouter()

    const handleCreate = () => {
        setSelectedProject(null)
        setDialogOpen(true)
    }

    const handleEdit = (project: Project & { tasks: Task[] }) => {
        setSelectedProject(project)
        setDialogOpen(true)
    }

    const handleDelete = (project: Project & { tasks: Task[] }) => {
        setSelectedProject(project)
        setDeleteDialogOpen(true)
    }

    const handleSubmit = async (data: { name: string; description?: string }) => {
        try {
            console.log(" ProjectsList handleSubmit:", { selectedProject: selectedProject?.id, data })
            if (selectedProject) {
                await updateProject(selectedProject.id, data)
            } else {
                await createProject(data)
            }
            router.refresh()
        } catch (error) {
            console.error(" Error in handleSubmit:", error)
            throw error
        }
    }

    const handleConfirmDelete = async () => {
        if (selectedProject) {
            await deleteProject(selectedProject.id)
            router.refresh()
        }
    }

    if (projects.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-6 text-center sm:gap-4 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted sm:h-16 sm:w-16">
                    <FolderKanban className="h-6 w-6 text-muted-foreground sm:h-8 sm:w-8" />
                </div>
                <div>
                    <h3 className="text-base font-semibold sm:text-lg">No projects yet</h3>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Create your first project to get started</p>
                </div>
                <Button onClick={handleCreate} size="sm" className="mt-2 sm:mt-0">
                    <Plus className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                    Create Project
                </Button>
                <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} project={null} onSubmit={handleSubmit} />
            </div>
        )
    }

    return (
        <>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onEdit={() => handleEdit(project)}
                        onDelete={() => handleDelete(project)}
                    />
                ))}
            </div>

            <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} project={selectedProject} onSubmit={handleSubmit} />

            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Project"
                description={`Are you sure you want to delete "${selectedProject?.name}"? This will also delete all tasks in this project. This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
            />
        </>
    )
}
