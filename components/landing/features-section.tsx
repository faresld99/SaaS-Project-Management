import { LayoutDashboard, Users, Calendar, BarChart3, Zap, Shield } from "lucide-react"

const features = [
  {
    icon: LayoutDashboard,
    title: "Kanban Boards",
    description: "Visualize your workflow with intuitive drag-and-drop kanban boards. Track progress at a glance.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time updates, comments, and @mentions.",
  },
  {
    icon: Calendar,
    title: "Due Date Tracking",
    description: "Never miss a deadline with smart reminders and calendar integrations.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Get insights into team productivity with detailed analytics and custom reports.",
  },
  {
    icon: Zap,
    title: "Automations",
    description: "Save time with powerful automations that handle repetitive tasks for you.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption and compliance certifications to keep your data safe.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to manage projects
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Powerful features to help your team ship faster and collaborate better.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/20"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <feature.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
