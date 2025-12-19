"use server"

import { db, users, workspaces, workspaceMembers } from "@/lib/db"
import { eq } from "drizzle-orm"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { createSession, deleteSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { z } from "zod"

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/\d/, "Password must contain a number")
        .regex(/[a-zA-Z]/, "Password must contain a letter"),
})

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

export async function register(formData: FormData) {
    const rawData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    const validatedData = registerSchema.safeParse(rawData)

    if (!validatedData.success) {
        return {
            success: false,
            error: validatedData.error.errors[0].message,
        }
    }

    const { name, email, password } = validatedData.data

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1)

    if (existingUser.length > 0) {
        return {
            success: false,
            error: "An account with this email already exists",
        }
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)

    const [newUser] = await db
        .insert(users)
        .values({
            name,
            email: email.toLowerCase(),
            passwordHash,
        })
        .returning()

    // Create a default workspace for the user
    const [workspace] = await db
        .insert(workspaces)
        .values({
            name: `${name}'s Workspace`,
            ownerId: newUser.id,
        })
        .returning()

    // Add user as admin of the workspace
    await db.insert(workspaceMembers).values({
        userId: newUser.id,
        workspaceId: workspace.id,
        role: "admin",
    })

    // Create session
    await createSession(newUser.id)

    return { success: true }
}

export async function login(formData: FormData) {
    const rawData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    const validatedData = loginSchema.safeParse(rawData)

    if (!validatedData.success) {
        return {
            success: false,
            error: validatedData.error.errors[0].message,
        }
    }

    const { email, password } = validatedData.data

    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1)

    if (!user || !user.passwordHash) {
        return {
            success: false,
            error: "Invalid email or password",
        }
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash)

    if (!isValidPassword) {
        return {
            success: false,
            error: "Invalid email or password",
        }
    }

    // Create session
    await createSession(user.id)

    return { success: true }
}

export async function logout() {
    await deleteSession()
    redirect("/login")
}
