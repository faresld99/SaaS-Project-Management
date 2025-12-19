"use server"

import { db, tasks } from "@/lib/db"
import { taskSchema } from "@/lib/validations"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function createTask(
  projectId: string,
  data: {
    title: string
    description?: string
    status?: "todo" | "in_progress" | "done"
    priority?: "low" | "medium" | "high"
    dueDate?: string
    assigneeId?: string | null
  },
) {
  const validated = taskSchema.parse(data)

  const [task] = await db
    .insert(tasks)
    .values({
      title: validated.title,
      description: validated.description,
      status: validated.status,
      priority: validated.priority,
      dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      assigneeId: validated.assigneeId,
      projectId,
    })
    .returning()

  revalidatePath(`/dashboard/projects/${projectId}`)
  return task
}

export async function updateTask(
  id: string,
  projectId: string,
  data: {
    title?: string
    description?: string
    status?: "todo" | "in_progress" | "done"
    priority?: "low" | "medium" | "high"
    dueDate?: string
    assigneeId?: string | null
  },
) {
  const [task] = await db
    .update(tasks)
    .set({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    })
    .where(eq(tasks.id, id))
    .returning()

  revalidatePath(`/dashboard/projects/${projectId}`)
  return task
}

export async function updateTaskStatus(id: string, projectId: string, status: "todo" | "in_progress" | "done") {
  const [task] = await db.update(tasks).set({ status }).where(eq(tasks.id, id)).returning()

  revalidatePath(`/dashboard/projects/${projectId}`)
  return task
}

export async function deleteTask(id: string, projectId: string) {
  await db.delete(tasks).where(eq(tasks.id, id))
  revalidatePath(`/dashboard/projects/${projectId}`)
}
