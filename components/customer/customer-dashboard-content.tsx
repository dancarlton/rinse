'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookingStatusBadge } from '@/components/booking/booking-status-badge'
import { ReviewForm } from '@/components/customer/review-form'
import { updateBookingStatus } from '@/app/actions/bookings'
import { getReviewForBooking } from '@/app/actions/reviews'
import { useRealtimeNotification } from '@/hooks/useRealtimeNotification'
import { Calendar, MapPin, DollarSign, Users, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Booking {
  id: string
  scheduled_at: string
  address: string
  status: string
  amount: number
  provider: {
    full_name: string
    avatar_url: string | null
    phone: string | null
  }
  service: {
    title: string
    price: number
    duration_minutes: number
  }
}

interface CustomerDashboardContentProps {
  bookings: Booking[]
  userId: string
}

export function CustomerDashboardContent({ bookings, userId }: CustomerDashboardContentProps) {
  const router = useRouter()
  const [cancelling, setCancelling] = useState<string | null>(null)

  // Enable real-time notifications
  useRealtimeNotification(userId, 'customer')
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [bookingReviews, setBookingReviews] = useState<Record<string, boolean>>({})

  // Split bookings into upcoming and past
  const upcomingBookings = bookings.filter(
    (b) => ['pending', 'confirmed', 'in_progress'].includes(b.status)
  ).sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())

  const pastBookings = bookings.filter(
    (b) => ['completed', 'cancelled'].includes(b.status)
  ).sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())

  // Calculate stats
  const totalBookings = bookings.length
  const completedBookings = bookings.filter((b) => b.status === 'completed')
  const totalSpent = completedBookings.reduce((sum, b) => sum + b.amount, 0)
  const uniqueProviders = new Set(bookings.map((b) => b.provider.full_name)).size

  // Load review status for completed bookings
  useEffect(() => {
    const loadReviews = async () => {
      const reviews: Record<string, boolean> = {}
      for (const booking of completedBookings) {
        const result = await getReviewForBooking(booking.id)
        reviews[booking.id] = !!result.data
      }
      setBookingReviews(reviews)
    }
    if (completedBookings.length > 0) {
      loadReviews()
    }
  }, [completedBookings.length])

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    setCancelling(bookingId)
    const result = await updateBookingStatus(bookingId, 'cancelled')

    if (result.error) {
      alert(`Error: ${result.error}`)
    } else {
      router.refresh()
    }

    setCancelling(null)
  }

  const handleLeaveReview = (booking: Booking) => {
    setSelectedBooking(booking)
    setReviewModalOpen(true)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your car detailing appointments
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Total Bookings
            </CardDescription>
            <CardTitle className="text-3xl">{totalBookings}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Spent
            </CardDescription>
            <CardTitle className="text-3xl">${totalSpent.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Providers Used
            </CardDescription>
            <CardTitle className="text-3xl">{uniqueProviders}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Bookings tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        {/* Upcoming bookings */}
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No upcoming bookings</p>
                <Link href="/providers">
                  <Button>Find a Detailer</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            upcomingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {booking.service.title}
                        <BookingStatusBadge status={booking.status as any} />
                      </CardTitle>
                      <CardDescription>
                        with {booking.provider.full_name}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        ${booking.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {booking.service.duration_minutes} min
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Booking details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{formatDate(booking.scheduled_at)}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatTime(booking.scheduled_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="text-sm">{booking.address}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancelling === booking.id}
                      >
                        {cancelling === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Past bookings */}
        <TabsContent value="past" className="space-y-4">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No past bookings</p>
              </CardContent>
            </Card>
          ) : (
            pastBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {booking.service.title}
                        <BookingStatusBadge status={booking.status as any} />
                      </CardTitle>
                      <CardDescription>
                        with {booking.provider.full_name}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        ${booking.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Booking details */}
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{formatDate(booking.scheduled_at)}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {booking.status === 'completed' && (
                      <>
                        {bookingReviews[booking.id] ? (
                          <Button variant="outline" size="sm" disabled>
                            <Star className="mr-2 h-4 w-4 fill-yellow-500 text-yellow-500" />
                            Review Left
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLeaveReview(booking)}
                          >
                            <Star className="mr-2 h-4 w-4" />
                            Leave Review
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Review form modal */}
      {selectedBooking && (
        <ReviewForm
          bookingId={selectedBooking.id}
          providerName={selectedBooking.provider.full_name}
          serviceName={selectedBooking.service.title}
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
        />
      )}
    </div>
  )
}
