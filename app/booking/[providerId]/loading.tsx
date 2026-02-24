import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function BookingLoading() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8 space-y-3">
        <Skeleton className="h-9 w-64 bg-zinc-800" />
        <Skeleton className="h-5 w-full max-w-2xl bg-zinc-800" />
        <Skeleton className="h-5 w-32 bg-zinc-800" />
      </div>

      {/* Booking Wizard Skeleton */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Step indicator */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full bg-zinc-800" />
                <Skeleton className="h-4 w-20 bg-zinc-800" />
              </div>
            ))}
          </div>

          {/* Service selection skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40 bg-zinc-800" />
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-4 border-zinc-800">
                  <Skeleton className="h-5 w-32 mb-2 bg-zinc-800" />
                  <Skeleton className="h-4 w-20 mb-3 bg-zinc-800" />
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                </Card>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6">
            <Skeleton className="h-10 w-24 bg-zinc-800" />
            <Skeleton className="h-10 w-24 bg-zinc-800" />
          </div>
        </div>
      </Card>
    </div>
  )
}
