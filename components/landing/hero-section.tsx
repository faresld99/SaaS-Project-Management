import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5">
            <span className="text-xs font-medium text-muted-foreground">New: Kanban boards with drag & drop</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Project management
            <br />
            <span className="text-muted-foreground">made simple</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Streamline your workflow with intuitive kanban boards, real-time collaboration, and powerful task
            management. Built for modern teams.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/register">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto bg-transparent">
              <Link href="#features">See how it works</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-border" />
              <div className="h-3 w-3 rounded-full bg-border" />
              <div className="h-3 w-3 rounded-full bg-border" />
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Todo Column */}
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                    <span className="text-xs font-medium">Todo</span>
                    <span className="ml-auto text-xs text-muted-foreground">3</span>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-md bg-card p-3 shadow-sm">
                      <div className="mb-2 h-2 w-3/4 rounded bg-foreground/10" />
                      <div className="h-2 w-1/2 rounded bg-foreground/5" />
                    </div>
                    <div className="rounded-md bg-card p-3 shadow-sm">
                      <div className="mb-2 h-2 w-2/3 rounded bg-foreground/10" />
                      <div className="h-2 w-1/3 rounded bg-foreground/5" />
                    </div>
                  </div>
                </div>

                {/* In Progress Column */}
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-chart-1" />
                    <span className="text-xs font-medium">In Progress</span>
                    <span className="ml-auto text-xs text-muted-foreground">2</span>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-md bg-card p-3 shadow-sm">
                      <div className="mb-2 h-2 w-full rounded bg-foreground/10" />
                      <div className="h-2 w-2/3 rounded bg-foreground/5" />
                    </div>
                  </div>
                </div>

                {/* Done Column */}
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-chart-2" />
                    <span className="text-xs font-medium">Done</span>
                    <span className="ml-auto text-xs text-muted-foreground">5</span>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-md bg-card p-3 shadow-sm">
                      <div className="mb-2 h-2 w-1/2 rounded bg-foreground/10" />
                      <div className="h-2 w-1/4 rounded bg-foreground/5" />
                    </div>
                    <div className="rounded-md bg-card p-3 shadow-sm">
                      <div className="mb-2 h-2 w-3/4 rounded bg-foreground/10" />
                      <div className="h-2 w-1/2 rounded bg-foreground/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
