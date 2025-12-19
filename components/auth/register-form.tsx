"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Check } from "lucide-react"
import { register } from "@/lib/actions/auth"

export function RegisterForm() {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const passwordRequirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "Contains a number", met: /\d/.test(password) },
        { label: "Contains a letter", met: /[a-zA-Z]/.test(password) },
    ]

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }

        if (!passwordRequirements.every((req) => req.met)) {
            setError("Password does not meet requirements")
            setIsLoading(false)
            return
        }

        const formData = new FormData(e.currentTarget)
        const result = await register(formData)

        if (!result.success) {
            setError(result.error || "An error occurred")
            setIsLoading(false)
            return
        }

        router.push("/dashboard")
        router.refresh()
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                <CardDescription>Enter your details to get started with ProjectFlow</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Full name</Label>
                        <Input id="name" name="name" type="text" placeholder="John Doe" disabled={isLoading} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="name@example.com" disabled={isLoading} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                        {password && (
                            <ul className="mt-2 space-y-1">
                                {passwordRequirements.map((req) => (
                                    <li
                                        key={req.label}
                                        className={`flex items-center gap-2 text-xs ${
                                            req.met ? "text-foreground" : "text-muted-foreground"
                                        }`}
                                    >
                                        <Check className={`h-3 w-3 ${req.met ? "opacity-100" : "opacity-30"}`} />
                                        {req.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create account
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-foreground hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
