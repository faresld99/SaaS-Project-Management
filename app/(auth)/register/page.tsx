import { RegisterForm } from "@/components/auth/register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up | ProjectFlow",
  description: "Create your ProjectFlow account",
}

export default function RegisterPage() {
  return <RegisterForm />
}
