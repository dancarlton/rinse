import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-9 w-64 bg-zinc-800" />
        <Skeleton className="h-5 w-96 mt-2 bg-zinc-800" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-zinc-800 bg-zinc-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24 bg-zinc-800" />
              <Skeleton className="h-4 w-4 bg-zinc-800" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 bg-zinc-800" />
              <Skeleton className="h-3 w-20 mt-1 bg-zinc-800" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <Skeleton className="h-6 w-40 bg-zinc-800" />
              <Skeleton className="h-4 w-56 bg-zinc-800" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-start justify-between border-b border-zinc-800 pb-4 last:border-0">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32 bg-zinc-800" />
                    <Skeleton className="h-4 w-48 bg-zinc-800" />
                    <Skeleton className="h-3 w-24 bg-zinc-800" />
                  </div>
                  <Skeleton className="h-8 w-16 bg-zinc-800" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links Skeleton */}
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-zinc-800" />
          <Skeleton className="h-4 w-48 bg-zinc-800" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full bg-zinc-800" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
