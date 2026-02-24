import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Search Controls Skeleton */}
      <div className="border-b border-gray-800 bg-gray-900 p-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <Skeleton className="h-4 w-16 mb-2 bg-zinc-800" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 bg-zinc-800" />
                <Skeleton className="h-10 w-40 bg-zinc-800" />
              </div>
            </div>
            <div className="w-full md:w-40">
              <Skeleton className="h-4 w-12 mb-2 bg-zinc-800" />
              <Skeleton className="h-10 w-full bg-zinc-800" />
            </div>
            <Skeleton className="h-10 w-full md:w-24 bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* Map and Provider List Skeleton */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)]">
        {/* Provider List Skeleton */}
        <div className="w-full md:w-1/2 lg:w-2/5 overflow-y-auto p-4 bg-gray-950">
          <div className="container mx-auto max-w-2xl space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 border-zinc-800 bg-zinc-900">
                <div className="flex gap-4">
                  <Skeleton className="h-16 w-16 rounded-full bg-zinc-800" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32 bg-zinc-800" />
                    <Skeleton className="h-4 w-24 bg-zinc-800" />
                    <Skeleton className="h-4 w-full bg-zinc-800" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Skeleton */}
        <div className="w-full md:w-1/2 lg:w-3/5 h-64 md:h-auto bg-zinc-900 flex items-center justify-center">
          <Skeleton className="h-full w-full bg-zinc-800" />
        </div>
      </div>
    </div>
  )
}
