import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { StarRating } from '@/components/providers/star-rating'
import { ServiceSelector } from '@/components/providers/service-selector'
import type { Profile, Service, Availability, Review, Booking } from '@/types/database'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, bio, rating, num_ratings')
    .eq('id', id)
    .eq('role', 'provider')
    .single()

  if (!profile) {
    return {
      title: 'Provider Not Found',
    }
  }

  const description = profile.bio
    ? profile.bio.slice(0, 160)
    : `Professional mobile car detailing by ${profile.full_name}. ${profile.rating.toFixed(1)} stars from ${profile.num_ratings} reviews.`

  return {
    title: profile.full_name,
    description,
    openGraph: {
      title: `${profile.full_name} | Rinse`,
      description,
      type: 'profile',
    },
  }
}

interface ProviderWithData {
  profile: Profile
  services: Service[]
  availability: Availability[]
  reviews: (Review & {
    customer: {
      full_name: string
      avatar_url: string | null
    }
    booking?: Booking | null
  })[]
}

async function getProviderData(providerId: string): Promise<ProviderWithData | null> {
  const supabase = await createClient()

  // Fetch provider profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', providerId)
    .eq('role', 'provider')
    .single()

  if (profileError || !profile) {
    return null
  }

  // Fetch active services
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('provider_id', providerId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Fetch availability
  const { data: availability } = await supabase
    .from('availability')
    .select('*')
    .eq('provider_id', providerId)
    .order('day_of_week', { ascending: true })

  // Fetch reviews with customer info and booking verification
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      customer:profiles!reviews_customer_id_fkey (
        full_name,
        avatar_url
      ),
      booking:bookings!reviews_booking_id_fkey (
        id,
        status
      )
    `)
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })

  return {
    profile,
    services: services || [],
    availability: availability || [],
    reviews: reviews || [],
  }
}

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getProviderData(id)

  if (!data) {
    notFound()
  }

  const { profile, services, availability, reviews } = data

  // Generate initials for avatar
  const initials = profile.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Calculate average rating from reviews
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : profile.rating

  // Group availability by day
  const availabilityByDay = availability.reduce((acc, slot) => {
    if (!acc[slot.day_of_week]) {
      acc[slot.day_of_week] = []
    }
    acc[slot.day_of_week].push(slot)
    return acc
  }, {} as Record<number, Availability[]>)

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <Card className="p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-yellow-500 font-semibold text-xl sm:text-2xl">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{profile.full_name}</h1>

              <div className="flex items-center gap-3 mb-3">
                <StarRating rating={avgRating} showNumber />
                <span className="text-gray-400">
                  ({profile.num_ratings} {profile.num_ratings === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {profile.address && (
                <p className="text-gray-400 mb-3">
                  {profile.address}
                </p>
              )}

              {profile.bio && (
                <p className="text-gray-300 whitespace-pre-wrap">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Services */}
        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Services</h2>
          <ServiceSelector services={services} providerId={id} />
        </section>

        {/* Availability */}
        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Availability</h2>
          <Card className="p-4 sm:p-6">
            {availability.length === 0 ? (
              <p className="text-gray-400 text-center">No availability set</p>
            ) : (
              <div className="space-y-3 text-sm sm:text-base">
                {dayNames.map((day, index) => {
                  const slots = availabilityByDay[index]
                  return (
                    <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <div className="w-full sm:w-24 font-semibold text-gray-300">
                        {day}
                      </div>
                      <div className="flex-1">
                        {slots && slots.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {slots.map((slot) => (
                              <span
                                key={slot.id}
                                className="text-gray-400 bg-gray-800 px-3 py-1 rounded text-xs sm:text-sm"
                              >
                                {slot.start_time} - {slot.end_time}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-600">Unavailable</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </section>

        {/* Reviews */}
        <section>
          <div className="flex items-baseline justify-between mb-4 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">Reviews</h2>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-yellow-500">
                  {avgRating.toFixed(1)}
                </span>
                <div>
                  <StarRating rating={avgRating} size={16} />
                  <p className="text-xs text-gray-400 mt-0.5">
                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <Card className="p-6">
              <p className="text-gray-400 text-center">No reviews yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const isVerified = review.booking && review.booking.status === 'completed'

                return (
                  <Card key={review.id} className="p-4">
                    <div className="flex gap-3 sm:gap-4">
                      {/* Customer avatar */}
                      <div className="flex-shrink-0">
                        {review.customer.avatar_url ? (
                          <img
                            src={review.customer.avatar_url}
                            alt={review.customer.full_name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-300 font-semibold text-sm sm:text-base">
                              {review.customer.full_name
                                .split(' ')
                                .map(n => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Review content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                          <span className="font-semibold text-sm sm:text-base">
                            {review.customer.full_name}
                          </span>
                          {isVerified && (
                            <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full font-medium">
                              Verified
                            </span>
                          )}
                          <StarRating rating={review.rating} size={14} />
                          <span className="text-gray-500 text-xs sm:text-sm">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {review.comment && (
                          <p className="text-gray-300 mb-3">{review.comment}</p>
                        )}

                        {/* Provider reply */}
                        {review.reply && (
                          <div className="mt-3 pl-4 border-l-2 border-yellow-500/30">
                            <p className="text-sm font-semibold text-yellow-500 mb-1">
                              Response from {profile.full_name}
                            </p>
                            <p className="text-gray-400 text-sm">{review.reply}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
