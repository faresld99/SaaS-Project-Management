"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProjectDialog } from "@/components/projects/project-dialog"
import { createProject } from "@/lib/actions/projects"
import { useRouter } from "next/navigation"

export function QuickCreate() {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (data: { name: string; description?: string }) => {
        try {
            setError(null)
            console.log(" QuickCreate handleSubmit called with:", data)
            await createProject(data)
            router.refresh()
        } catch (err) {
            console.error(" Error in QuickCreate:", err)
            setError(err instanceof Error ? err.message : "Failed to create project")
            throw err
        }
    }

    return (
        <>
            <Button onClick={() => setDialogOpen(true)} size="sm" className="h-9 text-xs sm:h-10 sm:text-sm">
                <Plus className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">New Project</span>
                <span className="sm:hidden">New</span>
            </Button>

            <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} />

            {error && <p className="mt-2 text-xs text-destructive sm:text-sm">{error}</p>}
        </>
    )
}
