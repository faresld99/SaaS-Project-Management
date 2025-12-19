import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password | ProjectFlow",
  description: "Reset your ProjectFlow password",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
