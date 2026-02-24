import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function ProviderLoading() {
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <Skeleton className="w-24 h-24 rounded-full bg-zinc-800" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-9 w-48 bg-zinc-800" />
              <Skeleton className="h-5 w-32 bg-zinc-800" />
              <Skeleton className="h-5 w-64 bg-zinc-800" />
              <Skeleton className="h-16 w-full bg-zinc-800" />
            </div>
          </div>
        </Card>

        {/* Services Skeleton */}
        <section className="mb-6">
          <Skeleton className="h-8 w-32 mb-4 bg-zinc-800" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-40 mb-2 bg-zinc-800" />
                <Skeleton className="h-4 w-24 mb-3 bg-zinc-800" />
                <Skeleton className="h-4 w-full mb-2 bg-zinc-800" />
                <Skeleton className="h-4 w-3/4 bg-zinc-800" />
              </Card>
            ))}
          </div>
        </section>

        {/* Availability Skeleton */}
        <section className="mb-6">
          <Skeleton className="h-8 w-32 mb-4 bg-zinc-800" />
          <Card className="p-6">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-6 w-24 bg-zinc-800" />
                  <div className="flex-1 flex gap-2">
                    <Skeleton className="h-6 w-32 bg-zinc-800" />
                    <Skeleton className="h-6 w-32 bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Reviews Skeleton */}
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <Skeleton className="h-8 w-32 bg-zinc-800" />
            <Skeleton className="h-10 w-24 bg-zinc-800" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-full bg-zinc-800" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32 bg-zinc-800" />
                    <Skeleton className="h-4 w-24 bg-zinc-800" />
                    <Skeleton className="h-16 w-full bg-zinc-800" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
