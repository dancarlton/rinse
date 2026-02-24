import { ProviderCard } from './provider-card'

interface Provider {
  id: string
  full_name: string
  rating: number
  num_ratings: number
  avatar_url: string | null
  address: string | null
  bio: string | null
  distance_km?: number
  top_service?: {
    title: string
    price: number
  } | null
}

interface ProviderListProps {
  providers: Provider[]
  loading?: boolean
}

export function ProviderList({ providers, loading }: ProviderListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-gray-800/50 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (providers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg mb-2">No providers found in this area</p>
        <p className="text-gray-500 text-sm">
          Try expanding your search radius or changing location.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm">
        Found {providers.length} {providers.length === 1 ? 'provider' : 'providers'}
      </p>
      {providers.map((provider) => (
        <ProviderCard
          key={provider.id}
          id={provider.id}
          name={provider.full_name}
          rating={provider.rating}
          numRatings={provider.num_ratings}
          avatarUrl={provider.avatar_url}
          location={provider.address}
          bio={provider.bio}
          distance={provider.distance_km}
          startingPrice={provider.top_service?.price}
        />
      ))}
    </div>
  )
}
