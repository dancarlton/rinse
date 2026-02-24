import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { StarRating } from './star-rating'

interface ProviderCardProps {
  id: string
  name: string
  rating: number
  numRatings: number
  avatarUrl: string | null
  location: string | null
  bio: string | null
  distance?: number // in km
  startingPrice?: number // in dollars
}

export function ProviderCard({
  id,
  name,
  rating,
  numRatings,
  avatarUrl,
  location,
  bio,
  distance,
  startingPrice,
}: ProviderCardProps) {
  // Generate initials from name
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Link href={`/provider/${id}`}>
      <Card className="p-4 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 transition-all cursor-pointer">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <span className="text-yellow-500 font-semibold text-lg">
                  {initials}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg">{name}</h3>
              {startingPrice && (
                <span className="text-yellow-500 font-semibold whitespace-nowrap">
                  From ${startingPrice}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={rating} size={14} />
              <span className="text-sm text-gray-400">
                ({numRatings} {numRatings === 1 ? 'review' : 'reviews'})
              </span>
              {distance !== undefined && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="text-sm text-gray-400">
                    {distance < 1
                      ? `${Math.round(distance * 1000)}m away`
                      : `${distance.toFixed(1)} km away`}
                  </span>
                </>
              )}
            </div>

            {location && (
              <p className="text-sm text-gray-400 mt-1">{location}</p>
            )}

            {bio && (
              <p className="text-sm text-gray-300 mt-2 line-clamp-2">{bio}</p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
