"use server"

import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { workspaces, workspaceMembers } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/auth/session"
import { and, eq } from "drizzle-orm"

const DEMO_WORKSPACE_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
const CURRENT_WORKSPACE_COOKIE = "current_workspace_id"

/**
 * Retourne tous les workspaces auxquels l'utilisateur appartient.
 */
export async function getUserWorkspaces(userId: string) {
    const userWorkspaces = await db
        .select({
            id: workspaces.id,
            name: workspaces.name,
        })
        .from(workspaceMembers)
        .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
        .where(eq(workspaceMembers.userId, userId))

    return userWorkspaces
}

export async function getCurrentWorkspace() {
    console.log(" getCurrentWorkspace called")

    const user = await getCurrentUser()
    console.log(" current user:", user)

    if (!user) {
        console.log(" No user found - not authenticated")
        return null
    }

    // Récupérer tous les workspaces de l'utilisateur
    let userWorkspaces = await getUserWorkspaces(user.id)
    console.log(" userWorkspaces:", userWorkspaces)

    // Si l'utilisateur n'a aucun workspace, on garde la logique de démo / création
    if (userWorkspaces.length === 0) {
        // Vérifier si le workspace de démo existe
        const demoWorkspace = await db.query.workspaces.findFirst({
            where: eq(workspaces.id, DEMO_WORKSPACE_ID),
        })
        console.log(" demoWorkspace:", demoWorkspace)

        if (demoWorkspace) {
            // Ajouter l'utilisateur au workspace de démo existant
            try {
                await db
                    .insert(workspaceMembers)
                    .values({
                        userId: user.id,
                        workspaceId: DEMO_WORKSPACE_ID,
                        role: "admin",
                    })
                    .onConflictDoNothing()
                console.log(" User added to demo workspace")
            } catch (error) {
                console.error(" Error adding user to demo workspace:", error)
            }

            userWorkspaces = await getUserWorkspaces(user.id)
        } else {
            // Sinon, créer un nouveau workspace pour l'utilisateur
            console.log(" Creating new workspace for user")
            const [newWorkspace] = await db
                .insert(workspaces)
                .values({
                    name: `${user.name}'s Workspace`,
                    ownerId: user.id,
                })
                .returning()

            await db.insert(workspaceMembers).values({
                userId: user.id,
                workspaceId: newWorkspace.id,
                role: "admin",
            })

            console.log(" New workspace created:", newWorkspace)
            userWorkspaces = await getUserWorkspaces(user.id)
        }
    }

    if (userWorkspaces.length === 0) {
        // Sécurité : si malgré tout il n'y a aucun workspace
        return null
    }

    const cookieStore = await cookies()
    const cookieWorkspaceId = cookieStore.get(CURRENT_WORKSPACE_COOKIE)?.value

    // Si un workspace est stocké dans un cookie et que l'utilisateur y appartient, on le prend
    if (cookieWorkspaceId) {
        const selected = userWorkspaces.find((w) => w.id === cookieWorkspaceId)
        if (selected) {
            return selected
        }
    }

    // Sinon, on prend le premier workspace de l'utilisateur
    // IMPORTANT : on ne modifie pas les cookies ici, car cette fonction
    // est appelée dans des composants serveurs (layout, pages).
    // Seules les Server Actions (setCurrentWorkspace, createWorkspace)
    // sont autorisées à modifier les cookies.
    const fallback = userWorkspaces[0]
    return fallback
}

export async function getWorkspaceId(): Promise<string | null> {
    const workspace = await getCurrentWorkspace()
    return workspace?.id ?? null
}

/**
 * Change le workspace courant de l'utilisateur (stocké dans un cookie).
 */
export async function setCurrentWorkspace(workspaceId: string) {
    const user = await getCurrentUser()

    if (!user) {
        return {
            success: false,
            error: "You must be logged in to change workspace",
        }
    }

    // Vérifier que l'utilisateur appartient bien à ce workspace
    const membership = await db.query.workspaceMembers.findFirst({
        where: and(eq(workspaceMembers.userId, user.id), eq(workspaceMembers.workspaceId, workspaceId)),
    })

    if (!membership) {
        return {
            success: false,
            error: "You do not belong to this workspace",
        }
    }

    const cookieStore = await cookies()
    cookieStore.set(CURRENT_WORKSPACE_COOKIE, workspaceId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 jours
    })

    return {
        success: true,
    }
}

/**
 * Crée un nouveau workspace et y ajoute l'utilisateur comme admin.
 */
export async function createWorkspace(name: string) {
    const user = await getCurrentUser()

    if (!user) {
        return {
            success: false,
            error: "You must be logged in to create a workspace",
        }
    }

    if (!name.trim()) {
        return {
            success: false,
            error: "Workspace name is required",
        }
    }

    const [newWorkspace] = await db
        .insert(workspaces)
        .values({
            name: name.trim(),
            ownerId: user.id,
        })
        .returning()

    await db.insert(workspaceMembers).values({
        userId: user.id,
        workspaceId: newWorkspace.id,
        role: "admin",
    })

    // Mettre ce nouveau workspace comme workspace courant
    const cookieStore = await cookies()
    cookieStore.set(CURRENT_WORKSPACE_COOKIE, newWorkspace.id, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 jours
    })

    return {
        success: true,
        workspace: newWorkspace,
    }
}
