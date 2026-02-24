'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function SearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Search error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-950 pt-20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6 border-zinc-800 bg-zinc-900">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Search Error</h2>
          <p className="text-zinc-400">
            {error.message || 'Something went wrong while searching for providers.'}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={reset}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            Try Again
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full border-zinc-700 hover:bg-zinc-800"
          >
            <Link href="/">Go Home</Link>
          </Button>
        </div>

        {error.digest && (
          <p className="text-xs text-zinc-600">Error ID: {error.digest}</p>
        )}
      </Card>
    </div>
  )
}
