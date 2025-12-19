import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for individuals and small projects",
    features: ["Up to 3 projects", "Basic kanban boards", "5 team members", "1GB storage", "Community support"],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/user/month",
    description: "For growing teams that need more power",
    features: [
      "Unlimited projects",
      "Advanced kanban & timeline",
      "Unlimited team members",
      "100GB storage",
      "Priority support",
      "Custom fields",
      "Automations",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with advanced needs",
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "Advanced security",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "Onboarding & training",
    ],
    cta: "Contact sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Choose the plan that fits your team. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border bg-card p-6 ${
                plan.popular ? "border-foreground shadow-lg" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">{plan.name}</h3>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="mb-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-foreground" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                <Link href="/register">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
