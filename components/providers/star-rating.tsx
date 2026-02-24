import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: number
  showNumber?: boolean
}

export function StarRating({ rating, maxStars = 5, size = 16, showNumber = false }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, i) => {
        const isFilled = i < fullStars
        const isHalf = i === fullStars && hasHalfStar

        return (
          <Star
            key={i}
            size={size}
            className={`${
              isFilled || isHalf
                ? 'fill-yellow-500 text-yellow-500'
                : 'fill-none text-gray-600'
            }`}
          />
        )
      })}
      {showNumber && (
        <span className="ml-1 text-sm text-gray-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
