"use client"

import { useEffect, useState, useTransition, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Bell, Mail, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getPendingInvitations, acceptInvitation, rejectInvitation } from "@/lib/actions/team"
import { useToast } from "@/hooks/use-toast"
import type { WorkspaceInvitation } from "@/lib/db/schema"

export function NotificationBell() {
  const [count, setCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [invitations, setInvitations] = useState<
    (WorkspaceInvitation & {
      workspace: { id: string; name: string; owner: { id: string; name: string; email: string } }
      inviter: { id: string; name: string; email: string }
    })[]
  >([])
  const [open, setOpen] = useState(false)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const fetchInvitations = useCallback(async () => {
    try {
      const data = await getPendingInvitations()
      setInvitations(data)
      setCount(data.length)
    } catch (error) {
      console.error("Failed to fetch pending invitations", error)
      setCount(0)
      setInvitations([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Mark component as mounted to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Set up polling and event listeners on mount
  useEffect(() => {
    if (!isMounted) return

    // Initial fetch
    fetchInvitations()

    // Set up polling to refresh invitations every 10 seconds
    const interval = setInterval(() => {
      fetchInvitations()
    }, 10000) // Refresh every 10 seconds

    // Refresh when window gains focus (user switches back to tab)
    const handleFocus = () => {
      fetchInvitations()
    }
    window.addEventListener("focus", handleFocus)

    // Refresh when page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchInvitations()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [fetchInvitations, isMounted]) // Include fetchInvitations and isMounted in dependencies

  // Refresh invitations when dropdown opens
  useEffect(() => {
    if (open) {
      fetchInvitations()
    }
  }, [open, fetchInvitations])

  const handleAccept = async (invitationId: string) => {
    setProcessingIds((prev) => new Set(prev).add(invitationId))
    startTransition(async () => {
      const result = await acceptInvitation(invitationId)
      if (result.success) {
        toast({
          title: "Invitation accepted",
          description: result.message || "You have successfully joined the workspace.",
        })
        await fetchInvitations()
        setOpen(false)
        // Refresh the page to update the UI
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to accept the invitation",
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
        await fetchInvitations()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to decline the invitation",
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

  const handleViewAll = () => {
    setOpen(false)
    router.push("/dashboard/team")
  }

  const hasNotifications = isMounted && !isLoading && (count ?? 0) > 0

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Notifications</span>
          {hasNotifications && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-background dark:text-destructive-foreground sm:-right-1 sm:-top-1 sm:h-5 sm:min-w-[1.25rem] sm:px-1.5 sm:text-xs">
              {count! > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-2rem)] max-w-sm sm:w-80"
        sideOffset={8}
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Notifications</span>
            {hasNotifications && (
              <span className="text-xs text-muted-foreground">{count} pending</span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : invitations.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No pending invitations</div>
          ) : (
            <>
              {invitations.map((invitation) => {
                const isProcessing = processingIds.has(invitation.id)
                return (
                  <div key={invitation.id} className="border-b border-border last:border-b-0">
                    <div className="p-3 sm:p-4">
                      <div className="mb-3 flex items-start gap-2 sm:gap-3">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-tight sm:text-base">
                            {invitation.inviter.name || invitation.inviter.email} invited you
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed sm:text-sm">
                            Join workspace &quot;
                            <span className="font-medium">{invitation.workspace.name}</span>&quot;
                          </p>
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            Role: <span className="font-medium">{invitation.role === "admin" ? "Admin" : "Member"}</span>
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1 text-xs sm:text-sm"
                          onClick={() => handleAccept(invitation.id)}
                          disabled={isProcessing || isPending}
                        >
                          {isProcessing ? (
                            <Loader2 className="mr-1.5 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
                          ) : (
                            <Check className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                          )}
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs sm:text-sm"
                          onClick={() => handleReject(invitation.id)}
                          disabled={isProcessing || isPending}
                        >
                          {isProcessing ? (
                            <Loader2 className="mr-1.5 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
                          ) : (
                            <X className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                          )}
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
        {invitations.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleViewAll} className="cursor-pointer px-3 py-2">
              <Mail className="mr-2 h-4 w-4" />
              <span className="text-sm">View all invitations</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


