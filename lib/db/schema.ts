import { pgTable, uuid, text, timestamp, pgEnum, index } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Enums
export const roleEnum = pgEnum("role", ["admin", "member"])
export const taskStatusEnum = pgEnum("task_status", ["todo", "in_progress", "done"])
export const priorityEnum = pgEnum("priority", ["low", "medium", "high"])

// Users table
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash"), // Added password_hash for authentication
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Workspaces table
export const workspaces = pgTable("workspaces", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    ownerId: uuid("owner_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Workspace members table
export const workspaceMembers = pgTable("workspace_members", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    workspaceId: uuid("workspace_id")
        .notNull()
        .references(() => workspaces.id, { onDelete: "cascade" }),
    role: roleEnum("role").notNull().default("member"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Projects table
export const projects = pgTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    workspaceId: uuid("workspace_id")
        .notNull()
        .references(() => workspaces.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Tasks table
export const tasks = pgTable("tasks", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    status: taskStatusEnum("status").notNull().default("todo"),
    priority: priorityEnum("priority").notNull().default("medium"),
    dueDate: timestamp("due_date"),
    projectId: uuid("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    assigneeId: uuid("assignee_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Sessions table for secure session management
export const sessions = pgTable(
    "sessions",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        token: text("token").notNull().unique(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [index("idx_sessions_token").on(table.token), index("idx_sessions_user_id").on(table.userId)],
)

// Workspace invitations table
export const workspaceInvitations = pgTable(
    "workspace_invitations",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        email: text("email").notNull(),
        workspaceId: uuid("workspace_id")
            .notNull()
            .references(() => workspaces.id, { onDelete: "cascade" }),
        role: roleEnum("role").notNull().default("member"),
        invitedBy: uuid("invited_by")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        status: text("status").notNull().default("pending"), // pending, accepted, rejected
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => [
        index("idx_invitations_email").on(table.email),
        index("idx_invitations_workspace_id").on(table.workspaceId),
    ],
)

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    ownedWorkspaces: many(workspaces),
    workspaceMemberships: many(workspaceMembers),
    assignedTasks: many(tasks),
    sessions: many(sessions), // Added sessions relation
    sentInvitations: many(workspaceInvitations),
}))

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
    owner: one(users, {
        fields: [workspaces.ownerId],
        references: [users.id],
    }),
    members: many(workspaceMembers),
    projects: many(projects),
    invitations: many(workspaceInvitations),
}))

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
    user: one(users, {
        fields: [workspaceMembers.userId],
        references: [users.id],
    }),
    workspace: one(workspaces, {
        fields: [workspaceMembers.workspaceId],
        references: [workspaces.id],
    }),
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
    workspace: one(workspaces, {
        fields: [projects.workspaceId],
        references: [workspaces.id],
    }),
    tasks: many(tasks),
}))

export const tasksRelations = relations(tasks, ({ one }) => ({
    project: one(projects, {
        fields: [tasks.projectId],
        references: [projects.id],
    }),
    assignee: one(users, {
        fields: [tasks.assigneeId],
        references: [users.id],
    }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}))

export const workspaceInvitationsRelations = relations(workspaceInvitations, ({ one }) => ({
    workspace: one(workspaces, {
        fields: [workspaceInvitations.workspaceId],
        references: [workspaces.id],
    }),
    inviter: one(users, {
        fields: [workspaceInvitations.invitedBy],
        references: [users.id],
    }),
}))

// Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect // Added session types
export type NewSession = typeof sessions.$inferInsert
export type Workspace = typeof workspaces.$inferSelect
export type NewWorkspace = typeof workspaces.$inferInsert
export type WorkspaceMember = typeof workspaceMembers.$inferSelect
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
export type WorkspaceInvitation = typeof workspaceInvitations.$inferSelect
export type NewWorkspaceInvitation = typeof workspaceInvitations.$inferInsert
