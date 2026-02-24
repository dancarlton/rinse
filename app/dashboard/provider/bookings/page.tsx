import { getProviderBookings, updateProviderBookingStatus } from '@/app/actions/bookings'
import { BookingStatusBadge } from '@/components/booking/booking-status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookingStatus } from '@/types/database'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProviderRealtimeWrapper } from '@/components/provider/provider-realtime-wrapper'

export const dynamic = 'force-dynamic'

interface BookingWithRelations {
  id: string
  scheduled_at: string
  address: string
  status: BookingStatus
  amount: number
  customer: {
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

async function BookingCard({ booking }: { booking: BookingWithRelations }) {
  async function handleStatusUpdate(status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled') {
    'use server'
    await updateProviderBookingStatus(booking.id, status)
  }

  const scheduledDate = new Date(booking.scheduled_at)
  const isPast = scheduledDate < new Date()

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {booking.service.title}
            </CardTitle>
            <p className="text-sm text-gray-400">{booking.customer.full_name}</p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Booking Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Date & Time:</span>
            <span className="text-white font-medium">
              {format(scheduledDate, 'MMM d, yyyy • h:mm a')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Duration:</span>
            <span className="text-white">{booking.service.duration_minutes} min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Amount:</span>
            <span className="text-white font-medium">${booking.amount.toFixed(2)}</span>
          </div>
          {booking.customer.phone && (
            <div className="flex justify-between">
              <span className="text-gray-400">Phone:</span>
              <span className="text-white">{booking.customer.phone}</span>
            </div>
          )}
          <div className="pt-2 border-t border-gray-700">
            <span className="text-gray-400">Location:</span>
            <p className="text-white mt-1">{booking.address}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {booking.status === 'pending' && !isPast && (
            <>
              <form action={handleStatusUpdate.bind(null, 'confirmed')} className="flex-1">
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Confirm
                </Button>
              </form>
              <form action={handleStatusUpdate.bind(null, 'cancelled')} className="flex-1">
                <Button type="submit" variant="destructive" className="w-full">
                  Decline
                </Button>
              </form>
            </>
          )}

          {booking.status === 'confirmed' && !isPast && (
            <form action={handleStatusUpdate.bind(null, 'in_progress')} className="w-full">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Start Service
              </Button>
            </form>
          )}

          {booking.status === 'in_progress' && (
            <form action={handleStatusUpdate.bind(null, 'completed')} className="w-full">
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Mark Complete
              </Button>
            </form>
          )}

          {(booking.status === 'completed' || booking.status === 'cancelled') && (
            <div className="w-full text-center text-sm text-gray-500 py-2">
              No actions available
            </div>
          )}

          {booking.status === 'pending' && isPast && (
            <div className="w-full text-center text-sm text-gray-500 py-2">
              Booking expired
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ status }: { status: string }) {
  const messages: Record<string, string> = {
    all: 'No bookings yet',
    pending: 'No pending bookings',
    confirmed: 'No confirmed bookings',
    in_progress: 'No bookings in progress',
    completed: 'No completed bookings',
    cancelled: 'No cancelled bookings',
  }

  return (
    <div className="text-center py-12">
      <p className="text-gray-400">{messages[status] || messages.all}</p>
    </div>
  )
}

export default async function ProviderBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const activeTab = params.status || 'all'

  // Get current user for realtime updates
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch bookings based on active tab
  const { data: bookings, error } = await getProviderBookings(activeTab)

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-red-500">Error loading bookings: {error}</p>
      </div>
    )
  }

  const bookingsList = (bookings || []) as BookingWithRelations[]

  return (
    <ProviderRealtimeWrapper userId={user.id}>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">My Bookings</h1>
          <p className="text-gray-400 mt-2">Manage your service bookings</p>
        </div>

        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800/50">
            <TabsTrigger value="all" asChild>
              <a href="/dashboard/provider/bookings?status=all">All</a>
            </TabsTrigger>
            <TabsTrigger value="pending" asChild>
              <a href="/dashboard/provider/bookings?status=pending">Pending</a>
            </TabsTrigger>
            <TabsTrigger value="confirmed" asChild>
              <a href="/dashboard/provider/bookings?status=confirmed">Confirmed</a>
            </TabsTrigger>
            <TabsTrigger value="in_progress" asChild>
              <a href="/dashboard/provider/bookings?status=in_progress">In Progress</a>
            </TabsTrigger>
            <TabsTrigger value="completed" asChild>
              <a href="/dashboard/provider/bookings?status=completed">Completed</a>
            </TabsTrigger>
            <TabsTrigger value="cancelled" asChild>
              <a href="/dashboard/provider/bookings?status=cancelled">Cancelled</a>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {bookingsList.length === 0 ? (
              <EmptyState status={activeTab} />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {bookingsList.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProviderRealtimeWrapper>
  )
}
