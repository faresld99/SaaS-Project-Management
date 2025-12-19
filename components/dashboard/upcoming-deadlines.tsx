import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { getUpcomingDeadlines } from "@/lib/actions/dashboard"

const priorityColors = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-chart-3/20 text-chart-3",
    high: "bg-destructive/20 text-destructive",
}

export async function UpcomingDeadlines() {
    const deadlines = await getUpcomingDeadlines()

    if (deadlines.length === 0) {
        return (
            <Card>
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Upcoming Deadlines</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Tasks due soon across all projects</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <p className="text-xs text-muted-foreground sm:text-sm">No upcoming deadlines.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Upcoming Deadlines</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Tasks due soon across all projects</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                    {deadlines.map((deadline) => (
                        <div
                            key={deadline.id}
                            className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                        >
                            <div className="min-w-0 flex-1 space-y-1">
                                <p className="text-xs font-medium sm:text-sm">{deadline.title}</p>
                                <p className="text-[10px] text-muted-foreground sm:text-xs">{deadline.project}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                    variant="secondary"
                                    className={`text-[10px] sm:text-xs ${priorityColors[deadline.priority as keyof typeof priorityColors]}`}
                                >
                                    {deadline.priority}
                                </Badge>
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground sm:text-xs">
                                    <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    {deadline.dueDate}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
