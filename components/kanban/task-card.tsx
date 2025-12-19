"use client"

import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Calendar } from "lucide-react"
import type { Task, User } from "@/lib/db/schema"

interface TaskCardProps {
  task: Task & { assignee: User | null }
  onEdit: () => void
  onDelete: () => void
}

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-chart-3/20 text-chart-3",
  high: "bg-destructive/20 text-destructive",
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id)
    e.dataTransfer.effectAllowed = "move"
  }

  return (
    <Card
      className="group cursor-grab transition-colors hover:border-foreground/20 active:cursor-grabbing"
      draggable
      onDragStart={handleDragStart}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-3 pb-2">
        <h4 className="text-sm font-medium leading-tight">{task.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-3 w-3" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        {task.description && <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          )}
          {task.assignee && (
            <div
              className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-muted"
              title={task.assignee.name}
            >
              <span className="text-[10px] font-medium">
                {task.assignee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
