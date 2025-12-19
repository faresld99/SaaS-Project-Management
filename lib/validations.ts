import { z } from "zod"

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

export const workspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters"),
})

export const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
})

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().optional(),
  assigneeId: z.string().uuid().optional().nullable(),
})

export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "member"]).default("member"),
})

export type UserFormData = z.infer<typeof userSchema>
export type WorkspaceFormData = z.infer<typeof workspaceSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
export type TaskFormData = z.infer<typeof taskSchema>
export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>
