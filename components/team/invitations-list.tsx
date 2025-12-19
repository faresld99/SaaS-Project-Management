"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { acceptInvitation, rejectInvitation } from "@/lib/actions/team"
import { useToast } from "@/hooks/use-toast"
import { Check, X, Loader2, Mail } from "lucide-react"
import type { WorkspaceInvitation } from "@/lib/db/schema"

interface InvitationsListProps {
    invitations: (WorkspaceInvitation & {
        workspace: {
            id: string
            name: string
            owner: {
                id: string
                name: string
                email: string
            }
        }
        inviter: {
            id: string
            name: string
            email: string
        }
    })[]
}

export function InvitationsList({ invitations }: InvitationsListProps) {
    const { toast } = useToast()
    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
    const [isPending, startTransition] = useTransition()

    const handleAccept = async (invitationId: string) => {
        setProcessingIds((prev) => new Set(prev).add(invitationId))
        startTransition(async () => {
            const result = await acceptInvitation(invitationId)
            if (result.success) {
                toast({
                    title: "Invitation accepted",
                    description: result.message || "You have successfully joined the workspace.",
                })
                // Refresh the page to update the UI
                window.location.reload()
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to accept the invitation.",
                    variant: "destructive",
                })
                setProcessingIds((prev) => {
                    const next = new Set(prev)
                    next.delete(invitationId)
                    return next
                })
            }
        })
    }

    const handleReject = async (invitationId: string) => {
        setProcessingIds((prev) => new Set(prev).add(invitationId))
        startTransition(async () => {
            const result = await rejectInvitation(invitationId)
            if (result.success) {
                toast({
                    title: "Invitation declined",
                    description: result.message || "The invitation has been declined.",
                })
                // Refresh the page to update the UI
                window.location.reload()
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to decline the invitation.",
                    variant: "destructive",
                })
                setProcessingIds((prev) => {
                    const next = new Set(prev)
                    next.delete(invitationId)
                    return next
                })
            }
        })
    }

    if (invitations.length === 0) {
        return null
    }

    return (
        <div className="mb-4 space-y-3 sm:mb-6">
            {invitations.map((invitation) => {
                const isProcessing = processingIds.has(invitation.id)
                return (
                    <Card key={invitation.id} className="border-primary/20 bg-primary/5">
                        <CardHeader className="p-4 sm:p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                                    <CardTitle className="text-sm font-semibold sm:text-base">Workspace invitation</CardTitle>
                                </div>
                            </div>
                            <CardDescription className="mt-2 text-xs leading-relaxed sm:text-sm">
                                <strong className="font-medium">{invitation.inviter.name || invitation.inviter.email}</strong> has
                                invited you to join the workspace{" "}
                                <strong className="font-medium">&quot;{invitation.workspace.name}&quot;</strong>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                            <div className="space-y-1.5 text-xs text-muted-foreground sm:space-y-1 sm:text-sm">
                                <p>
                                    <span className="font-medium">Workspace:</span> {invitation.workspace.name}
                                </p>
                                <p>
                                    <span className="font-medium">Role:</span>{" "}
                                    {invitation.role === "admin" ? "Admin" : "Member"}
                                </p>
                                <p>
                                    <span className="font-medium">Invited by:</span>{" "}
                                    {invitation.inviter.name || invitation.inviter.email}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2 px-4 pb-4 sm:flex-row sm:px-6 sm:pb-6">
                            <Button
                                onClick={() => handleAccept(invitation.id)}
                                disabled={isProcessing || isPending}
                                className="w-full flex-1 text-xs sm:text-sm"
                                size="sm"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Check className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                                        Accept
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={() => handleReject(invitation.id)}
                                disabled={isProcessing || isPending}
                                variant="outline"
                                className="w-full flex-1 text-xs sm:text-sm"
                                size="sm"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <X className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                                        Decline
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}

