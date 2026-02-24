import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getBooking } from '@/app/actions/bookings'
import { Service, Profile } from '@/types/database'

export const dynamic = 'force-dynamic'

interface SuccessPageProps {
  params: Promise<{ providerId: string }>
  searchParams: Promise<{ booking?: string; payment_intent?: string }>
}

export default async function BookingSuccessPage({
  params,
  searchParams,
}: SuccessPageProps) {
  const { providerId } = await params
  const { booking: bookingId, payment_intent } = await searchParams

  if (!bookingId) {
    redirect(`/booking/${providerId}`)
  }

  const result = await getBooking(bookingId)

  if (result.error || !result.data) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <Card className="p-6">
          <div className="text-center text-red-500">
            {result.error || 'Failed to load booking details'}
          </div>
        </Card>
      </div>
    )
  }

  const booking = result.data
  const provider = booking.provider as Profile
  const service = booking.service as Service

  // Trigger email confirmation (fire and forget)
  if (payment_intent) {
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/bookings/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    }).catch((err) => console.error('Failed to send confirmation emails:', err))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <Card className="p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your appointment has been successfully booked.
          </p>
        </div>

        {/* Booking Details */}
        <Card className="p-6 bg-muted/50 mb-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Service</div>
              <div className="font-semibold text-lg">{service.title}</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Provider</div>
              <div className="font-semibold">{provider.full_name}</div>
              {provider.phone && (
                <div className="text-sm text-muted-foreground">{provider.phone}</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Date</div>
                <div className="font-semibold">{formatDate(booking.scheduled_at)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Time</div>
                <div className="font-semibold">{formatTime(booking.scheduled_at)}</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Location</div>
              <div className="font-semibold">{booking.address}</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Booking Reference</div>
              <div className="font-mono text-sm">#{booking.id.slice(0, 8).toUpperCase()}</div>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-muted-foreground">Total Paid</span>
              <span className="text-2xl font-bold text-amber-600">
                ${booking.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
            <a href="/dashboard">View My Bookings</a>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <a href="/">Back to Home</a>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-md">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            A confirmation email has been sent to your email address. The provider will
            contact you if there are any changes to your appointment.
          </p>
        </div>
      </Card>
    </div>
  )
}
