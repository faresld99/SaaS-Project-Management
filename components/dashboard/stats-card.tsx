import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
}

export function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-6">
        <CardTitle className="text-xs font-medium sm:text-sm">{title}</CardTitle>
        <Icon className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="text-xl font-bold sm:text-2xl">{value}</div>
        {description && <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{description}</p>}
      </CardContent>
    </Card>
  )
}
