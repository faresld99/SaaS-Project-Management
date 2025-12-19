"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function WorkspaceSettings() {
  const [workspaceName, setWorkspaceName] = useState("Acme Corp")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate save - replace with actual update logic
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Workspace Settings</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Manage your workspace preferences</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspaceName" className="text-sm">Workspace Name</Label>
            <Input
              id="workspaceName"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="h-9 sm:h-10"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="submit" disabled={isLoading} className="w-full text-xs sm:w-auto sm:text-sm">
              {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
