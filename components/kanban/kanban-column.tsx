"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TaskCard } from "./task-card"
import type { Task, User } from "@/lib/db/schema"

interface KanbanColumnProps {
  id: "todo" | "in_progress" | "done"
  title: string
  color: string
  tasks: (Task & { assignee: User | null })[]
  onCreateTask: () => void
  onEditTask: (task: Task & { assignee: User | null }) => void
  onDeleteTask: (task: Task & { assignee: User | null }) => void
  onMoveTask: (taskId: string, newStatus: "todo" | "in_progress" | "done") => void
}

export function KanbanColumn({
  id,
  title,
  color,
  tasks,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    if (taskId) {
      onMoveTask(taskId, id)
    }
  }

  return (
    <div className="flex w-80 shrink-0 flex-col rounded-lg bg-muted/50" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${color}`} />
          <h3 className="text-sm font-semibold">{title}</h3>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{tasks.length}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCreateTask}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add task</span>
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} onDelete={() => onDeleteTask(task)} />
        ))}

        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border p-4">
            <p className="text-sm text-muted-foreground">No tasks</p>
          </div>
        )}
      </div>
    </div>
  )
}
