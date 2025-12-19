"use server"

import { db, workspaceMembers, workspaceInvitations, users } from "@/lib/db"
import { eq, and } from "drizzle-orm"
import { getWorkspaceId } from "./workspace"
import { getCurrentUser } from "@/lib/auth/session"
import { inviteMemberSchema } from "@/lib/validations"

export async function getTeamMembers() {
    const workspaceId = await getWorkspaceId()

    if (!workspaceId) {
        return []
    }

    const result = await db.query.workspaceMembers.findMany({
        where: eq(workspaceMembers.workspaceId, workspaceId),
        with: {
            user: true,
        },
    })

    return result.map((m) => ({
        ...m.user,
        role: m.role,
    }))
}

export async function getWorkspaceUsers() {
    const workspaceId = await getWorkspaceId()

    if (!workspaceId) {
        return []
    }

    const result = await db.query.workspaceMembers.findMany({
        where: eq(workspaceMembers.workspaceId, workspaceId),
        with: {
            user: true,
        },
    })

    return result.map((m) => m.user)
}

export async function inviteMember(formData: FormData) {
    const rawData = {
        email: formData.get("email"),
        role: formData.get("role"),
    }

    // Validate input
    const validatedData = inviteMemberSchema.safeParse(rawData)
    if (!validatedData.success) {
        return {
            success: false,
            error: validatedData.error.errors[0].message,
        }
    }

    const { email, role } = validatedData.data

    // Get current user and workspace
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return {
            success: false,
            error: "You must be logged in to invite members",
        }
    }

    const workspaceId = await getWorkspaceId()
    if (!workspaceId) {
        return {
            success: false,
            error: "No workspace found",
        }
    }

    // Check if user is trying to invite themselves
    if (currentUser.email.toLowerCase() === email.toLowerCase()) {
        return {
            success: false,
            error: "You cannot invite yourself to the workspace",
        }
    }

    // Check if user exists and is already a member
    const invitedUser = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
    })

    if (invitedUser) {
        const existingMember = await db.query.workspaceMembers.findFirst({
            where: and(
                eq(workspaceMembers.workspaceId, workspaceId),
                eq(workspaceMembers.userId, invitedUser.id)
            ),
        })

        if (existingMember) {
            return {
                success: false,
                error: "This user is already a member of the workspace",
            }
        }
    }

    // Check if there's already a pending invitation for this email and workspace
    const existingInvitation = await db.query.workspaceInvitations.findFirst({
        where: and(
            eq(workspaceInvitations.email, email.toLowerCase()),
            eq(workspaceInvitations.workspaceId, workspaceId),
            eq(workspaceInvitations.status, "pending")
        ),
    })

    if (existingInvitation) {
        return {
            success: false,
            error: "An invitation has already been sent to this email",
        }
    }

    // Create invitation
    try {
        await db.insert(workspaceInvitations).values({
            email: email.toLowerCase(),
            workspaceId,
            role,
            invitedBy: currentUser.id,
            status: "pending",
        })

        return {
            success: true,
            message: `Invitation sent to ${email}`,
        }
    } catch (error) {
        console.error("Error creating invitation:", error)
        return {
            success: false,
            error: "Failed to send invitation. Please try again.",
        }
    }
}

export async function getPendingInvitations() {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return []
    }

    // Get all pending invitations for the current user's email
    const invitations = await db.query.workspaceInvitations.findMany({
        where: and(
            eq(workspaceInvitations.email, currentUser.email.toLowerCase()),
            eq(workspaceInvitations.status, "pending")
        ),
        with: {
            workspace: {
                with: {
                    owner: true,
                },
            },
            inviter: true,
        },
        orderBy: (invitations, { desc }) => [desc(invitations.createdAt)],
    })

    return invitations
}

export async function acceptInvitation(invitationId: string) {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return {
            success: false,
            error: "You must be logged in to accept invitations",
        }
    }

    // Find the invitation
    const invitation = await db.query.workspaceInvitations.findFirst({
        where: eq(workspaceInvitations.id, invitationId),
        with: {
            workspace: true,
        },
    })

    if (!invitation) {
        return {
            success: false,
            error: "Invitation not found",
        }
    }

    // Verify the invitation is for the current user
    if (invitation.email.toLowerCase() !== currentUser.email.toLowerCase()) {
        return {
            success: false,
            error: "This invitation is not for you",
        }
    }

    // Verify the invitation is still pending
    if (invitation.status !== "pending") {
        return {
            success: false,
            error: "This invitation has already been processed",
        }
    }

    // Check if user is already a member
    const existingMember = await db.query.workspaceMembers.findFirst({
        where: and(
            eq(workspaceMembers.workspaceId, invitation.workspaceId),
            eq(workspaceMembers.userId, currentUser.id)
        ),
    })

    if (existingMember) {
        // Update invitation status to accepted even if already a member
        await db
            .update(workspaceInvitations)
            .set({ status: "accepted", updatedAt: new Date() })
            .where(eq(workspaceInvitations.id, invitationId))

        return {
            success: true,
            message: "You are already a member of this workspace",
        }
    }

    try {
        // Add user to workspace
        await db.insert(workspaceMembers).values({
            userId: currentUser.id,
            workspaceId: invitation.workspaceId,
            role: invitation.role,
        })

        // Update invitation status
        await db
            .update(workspaceInvitations)
            .set({ status: "accepted", updatedAt: new Date() })
            .where(eq(workspaceInvitations.id, invitationId))

        return {
            success: true,
            message: `You have joined ${invitation.workspace.name}`,
        }
    } catch (error) {
        console.error("Error accepting invitation:", error)
        return {
            success: false,
            error: "Failed to accept invitation. Please try again.",
        }
    }
}

export async function rejectInvitation(invitationId: string) {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return {
            success: false,
            error: "You must be logged in to reject invitations",
        }
    }

    // Find the invitation
    const invitation = await db.query.workspaceInvitations.findFirst({
        where: eq(workspaceInvitations.id, invitationId),
    })

    if (!invitation) {
        return {
            success: false,
            error: "Invitation not found",
        }
    }

    // Verify the invitation is for the current user
    if (invitation.email.toLowerCase() !== currentUser.email.toLowerCase()) {
        return {
            success: false,
            error: "This invitation is not for you",
        }
    }

    // Verify the invitation is still pending
    if (invitation.status !== "pending") {
        return {
            success: false,
            error: "This invitation has already been processed",
        }
    }

    try {
        // Update invitation status
        await db
            .update(workspaceInvitations)
            .set({ status: "rejected", updatedAt: new Date() })
            .where(eq(workspaceInvitations.id, invitationId))

        return {
            success: true,
            message: "Invitation rejected",
        }
    } catch (error) {
        console.error("Error rejecting invitation:", error)
        return {
            success: false,
            error: "Failed to reject invitation. Please try again.",
        }
    }
}
