"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, UserPlus } from "lucide-react"
import { inviteMember } from "@/lib/actions/team"
import { useToast } from "@/hooks/use-toast"

export function InviteDialog() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"admin" | "member">("member")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("role", role)

      const result = await inviteMember(formData)

      if (result.success) {
        toast({
          title: "Invitation sent",
          description: result.message || "The invitation has been sent successfully.",
        })
        setEmail("")
        setRole("member")
        setOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send the invitation.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error inviting member:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 text-xs sm:h-10 sm:text-sm">
          <UserPlus className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Invite member</span>
          <span className="sm:hidden">Invite</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md sm:w-full">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Invite team member</DialogTitle>
            <DialogDescription className="text-sm">Send an invitation to join your workspace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 sm:h-10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as "admin" | "member")}>
                <SelectTrigger className="h-9 sm:h-10">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {role === "admin"
                  ? "Admins can manage workspace settings and members."
                  : "Members can view and update projects and tasks."}
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full bg-transparent sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !email.trim()} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
