import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, DollarSign, Star, Clock, Package, List, CreditCard, User, ExternalLink, Settings } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getProviderEarnings } from '@/app/actions/bookings'
import { StarRating } from '@/components/providers/star-rating'
import { BookingStatusBadge } from '@/components/booking/booking-status-badge'

export const dynamic = 'force-dynamic'

export default async function ProviderDashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // Verify user is a provider and get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, rating, num_ratings, stripe_onboarding_complete')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'provider') {
    redirect('/dashboard')
  }

  // Check onboarding status
  if (!profile.stripe_onboarding_complete) {
    redirect('/onboarding')
  }

  // Fetch stats in parallel
  const [
    { data: allBookings },
    { data: upcomingBookings },
    { data: monthlyEarnings },
    { data: recentReviews }
  ] = await Promise.all([
    // Total bookings count
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('provider_id', user.id),

    // Upcoming bookings
    supabase
      .from('bookings')
      .select(`
        *,
        customer:profiles!bookings_customer_id_fkey(full_name, avatar_url),
        service:services(title, duration_minutes)
      `)
      .eq('provider_id', user.id)
      .in('status', ['confirmed', 'in_progress'])
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(5),

    // Monthly earnings
    getProviderEarnings('month'),

    // Recent reviews
    supabase
      .from('reviews')
      .select(`
        *,
        customer:profiles!reviews_customer_id_fkey(full_name, avatar_url)
      `)
      .eq('provider_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3)
  ])

  const totalBookings = allBookings?.length ?? 0
  const upcomingCount = upcomingBookings?.length ?? 0
  const earnings = monthlyEarnings ?? 0
  const avgRating = profile.rating
  const numRatings = profile.num_ratings

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome back, {profile.full_name || 'Provider'}!</h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-400">
          Here's an overview of your activity and upcoming bookings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-200">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{totalBookings}</div>
            <p className="text-xs text-zinc-400 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-200">Earnings (Month)</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">${earnings.toFixed(2)}</div>
            <p className="text-xs text-zinc-400 mt-1">After platform fees</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-200">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {numRatings > 0 ? avgRating.toFixed(1) : 'N/A'}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {numRatings} {numRatings === 1 ? 'review' : 'reviews'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-200">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{upcomingCount}</div>
            <p className="text-xs text-zinc-400 mt-1">Confirmed bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Bookings */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white">Upcoming Bookings</CardTitle>
            <CardDescription className="text-zinc-400">
              Your next scheduled services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingBookings && upcomingBookings.length > 0 ? (
              <>
                {upcomingBookings.map((booking: any) => (
                  <div key={booking.id} className="flex items-start justify-between border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">
                        {booking.customer?.full_name || 'Customer'}
                      </p>
                      <p className="text-sm text-zinc-400">{booking.service?.title || 'Service'}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(booking.scheduled_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </div>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                    <Button asChild size="sm" variant="outline" className="border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10">
                      <Link href={`/dashboard/provider/bookings?id=${booking.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                ))}
                <Button asChild variant="link" className="w-full text-yellow-500">
                  <Link href="/dashboard/provider/bookings">
                    View All Bookings →
                  </Link>
                </Button>
              </>
            ) : (
              <p className="text-sm text-zinc-500 text-center py-4">
                No upcoming bookings
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-white">Recent Reviews</CardTitle>
            <CardDescription className="text-zinc-400">
              Latest customer feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReviews && recentReviews.length > 0 ? (
              <>
                {recentReviews.map((review: any) => (
                  <div key={review.id} className="space-y-2 border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {review.customer?.full_name || 'Customer'}
                        </p>
                        <StarRating rating={review.rating} size={14} />
                      </div>
                      <span className="text-xs text-zinc-500">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-zinc-400 line-clamp-2">
                        {review.comment}
                      </p>
                    )}
                    {!review.reply && (
                      <Button size="sm" variant="ghost" className="h-8 text-xs text-yellow-500 hover:text-yellow-400">
                        Reply
                      </Button>
                    )}
                  </div>
                ))}
                <Button asChild variant="link" className="w-full text-yellow-500">
                  <Link href="/dashboard/provider/reviews">
                    View All Reviews →
                  </Link>
                </Button>
              </>
            ) : (
              <p className="text-sm text-zinc-500 text-center py-4">
                No reviews yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-white">Quick Links</CardTitle>
          <CardDescription className="text-zinc-400">
            Manage your provider account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="border-zinc-800 hover:bg-zinc-800 justify-start">
              <Link href="/dashboard/provider/services">
                <Package className="h-4 w-4 mr-2 text-yellow-500" />
                Manage Services
              </Link>
            </Button>

            <Button asChild variant="outline" className="border-zinc-800 hover:bg-zinc-800 justify-start">
              <Link href="/dashboard/provider/availability">
                <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                Set Availability
              </Link>
            </Button>

            <Button asChild variant="outline" className="border-zinc-800 hover:bg-zinc-800 justify-start">
              <Link href="/dashboard/provider/stripe">
                <CreditCard className="h-4 w-4 mr-2 text-yellow-500" />
                Stripe Payments
              </Link>
            </Button>

            <Button asChild variant="outline" className="border-zinc-800 hover:bg-zinc-800 justify-start">
              <Link href={`/providers/${user.id}`}>
                <User className="h-4 w-4 mr-2 text-yellow-500" />
                View Public Profile
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
