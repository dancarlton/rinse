import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/config'
import { sendBookingConfirmationToCustomer, sendNewBookingToProvider } from '@/lib/resend/emails'

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get booking with all related data
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        provider:profiles!bookings_provider_id_fkey(*),
        customer:profiles!bookings_customer_id_fkey(*),
        service:services(*)
      `)
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify payment was successful
    if (booking.payment_intent_id) {
      const stripe = getStripe()
      const paymentIntent = await stripe.paymentIntents.retrieve(booking.payment_intent_id)

      if (paymentIntent.status !== 'succeeded') {
        return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
      }
    }

    // Update booking status to confirmed
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId)

    if (updateError) {
      console.error('Failed to update booking status:', updateError)
      return NextResponse.json({ error: 'Failed to confirm booking' }, { status: 500 })
    }

    // Send confirmation emails
    const provider = booking.provider as any
    const customer = booking.customer as any
    const service = booking.service as any

    // Send to customer
    if (customer.email) {
      await sendBookingConfirmationToCustomer(
        booking,
        provider,
        service,
        customer.email
      )
    }

    // Send to provider
    if (provider.email) {
      await sendNewBookingToProvider(
        booking,
        customer,
        service,
        provider.email
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Booking confirmation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
