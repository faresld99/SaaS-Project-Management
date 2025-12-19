import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getRecentActivity } from "@/lib/actions/dashboard"

export async function RecentActivity() {
    const activities = await getRecentActivity()

    if (activities.length === 0) {
        return (
            <Card>
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Latest updates from your team</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <p className="text-xs text-muted-foreground sm:text-sm">No recent activity yet.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Latest updates from your team</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-2.5 sm:gap-3">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted sm:h-8 sm:w-8">
                                <span className="text-[10px] font-medium sm:text-xs">
                                    {activity.user
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </span>
                            </div>
                            <div className="min-w-0 flex-1 space-y-1">
                                <p className="text-xs leading-relaxed sm:text-sm">
                                    <span className="font-medium">{activity.user}</span>{" "}
                                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                                    <span className="font-medium">{activity.target}</span>
                                </p>
                                <p className="text-[10px] text-muted-foreground sm:text-xs">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
