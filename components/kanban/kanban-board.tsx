"use client"

import { useState } from "react"
import { KanbanColumn } from "./kanban-column"
import { TaskDialog } from "./task-dialog"
import { DeleteDialog } from "@/components/projects/delete-dialog"
import { createTask, updateTask, updateTaskStatus, deleteTask } from "@/lib/actions/tasks"
import type { Task, User } from "@/lib/db/schema"

const columns = [
  { id: "todo" as const, title: "Todo", color: "bg-muted-foreground" },
  { id: "in_progress" as const, title: "In Progress", color: "bg-chart-1" },
  { id: "done" as const, title: "Done", color: "bg-chart-2" },
]

interface KanbanBoardProps {
  projectId: string
  tasks: (Task & { assignee: User | null })[]
  members: User[]
}

export function KanbanBoard({ projectId, tasks, members }: KanbanBoardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<(Task & { assignee: User | null }) | null>(null)
  const [initialStatus, setInitialStatus] = useState<"todo" | "in_progress" | "done">("todo")

  const handleCreateTask = (status: "todo" | "in_progress" | "done") => {
    setSelectedTask(null)
    setInitialStatus(status)
    setDialogOpen(true)
  }

  const handleEditTask = (task: Task & { assignee: User | null }) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  const handleDeleteTask = (task: Task & { assignee: User | null }) => {
    setSelectedTask(task)
    setDeleteDialogOpen(true)
  }

  const handleMoveTask = async (taskId: string, newStatus: "todo" | "in_progress" | "done") => {
    await updateTaskStatus(taskId, projectId, newStatus)
  }

  const handleSubmit = async (data: {
    title: string
    description?: string
    status?: "todo" | "in_progress" | "done"
    priority?: "low" | "medium" | "high"
    dueDate?: string
    assigneeId?: string | null
  }) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, projectId, data)
    } else {
      await createTask(projectId, { ...data, status: data.status || initialStatus })
    }
  }

  const handleConfirmDelete = async () => {
    if (selectedTask) {
      await deleteTask(selectedTask.id, projectId)
    }
  }

  return (
    <>
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            tasks={tasks.filter((t) => t.status === column.id)}
            onCreateTask={() => handleCreateTask(column.id)}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
          />
        ))}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
        members={members}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Task"
        description={`Are you sure you want to delete "${selectedTask?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
