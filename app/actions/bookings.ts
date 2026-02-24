'use server'

import { createClient } from '@/lib/supabase/server'
import { getStripe, PLATFORM_FEE_PERCENT } from '@/lib/stripe/config'
import { revalidatePath } from 'next/cache'
import { Booking } from '@/types/database'

export interface CreateBookingData {
  provider_id: string
  service_id: string
  scheduled_at: string
  address: string
}

export async function createBooking(data: CreateBookingData) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Get service to get price
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('price')
    .eq('id', data.service_id)
    .single()

  if (serviceError || !service) {
    return { error: 'Service not found' }
  }

  // Calculate platform fee
  const amount = service.price
  const platform_fee = Math.round(amount * PLATFORM_FEE_PERCENT / 100)

  // Create booking record
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      provider_id: data.provider_id,
      customer_id: user.id,
      service_id: data.service_id,
      scheduled_at: data.scheduled_at,
      address: data.address,
      status: 'pending',
      amount,
      platform_fee,
    })
    .select()
    .single()

  if (bookingError) {
    console.error('Booking creation error:', bookingError)
    return { error: 'Failed to create booking' }
  }

  return { data: booking as Booking }
}

export async function createPaymentIntent(bookingId: string) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Get booking details
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*, profiles!bookings_provider_id_fkey(stripe_account_id)')
    .eq('id', bookingId)
    .single()

  if (bookingError || !booking) {
    return { error: 'Booking not found' }
  }

  // Verify user owns this booking
  if (booking.customer_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  // Get provider's Stripe account
  const provider = booking.profiles as any
  if (!provider?.stripe_account_id) {
    return { error: 'Provider has not completed Stripe onboarding' }
  }

  // Create payment intent
  const stripe = getStripe()
  const amountInCents = Math.round(booking.amount * 100)
  const platformFeeInCents = Math.round(booking.platform_fee * 100)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      application_fee_amount: platformFeeInCents,
      transfer_data: {
        destination: provider.stripe_account_id,
      },
      metadata: {
        booking_id: bookingId,
      },
    })

    // Update booking with payment intent ID
    await supabase
      .from('bookings')
      .update({ payment_intent_id: paymentIntent.id })
      .eq('id', bookingId)

    revalidatePath(`/booking/${booking.provider_id}`)

    return { data: { clientSecret: paymentIntent.client_secret } }
  } catch (error: any) {
    console.error('Payment intent creation error:', error)
    return { error: error.message || 'Failed to create payment intent' }
  }
}

export async function getBooking(id: string) {
  const supabase = await createClient()

  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      *,
      provider:profiles!bookings_provider_id_fkey(*),
      customer:profiles!bookings_customer_id_fkey(*),
      service:services(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    return { error: 'Booking not found' }
  }

  return { data: booking }
}

export async function getProviderBookedSlots(providerId: string, date: string) {
  const supabase = await createClient()

  // Get all bookings for this provider on this date
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('scheduled_at, services(duration_minutes)')
    .eq('provider_id', providerId)
    .gte('scheduled_at', startOfDay.toISOString())
    .lte('scheduled_at', endOfDay.toISOString())
    .in('status', ['pending', 'confirmed', 'in_progress'])

  if (error) {
    console.error('Error fetching booked slots:', error)
    return { error: 'Failed to fetch booked slots' }
  }

  // Return booked time slots
  const bookedSlots = bookings.map((booking: any) => ({
    start: booking.scheduled_at,
    duration: booking.services?.duration_minutes || 60,
  }))

  return { data: bookedSlots }
}

export async function updateBookingStatus(bookingId: string, status: 'confirmed' | 'cancelled') {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Update booking
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .eq('customer_id', user.id)

  if (error) {
    return { error: 'Failed to update booking' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

// ========== TASK 4.4: PROVIDER BOOKING MANAGEMENT ==========

export async function updateProviderBookingStatus(bookingId: string, status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled') {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Get booking to verify ownership and current status
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('status, provider_id')
    .eq('id', bookingId)
    .single()

  if (bookingError || !booking) {
    return { error: 'Booking not found' }
  }

  // Verify user is the provider
  if (booking.provider_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  // Validate status transitions
  const currentStatus = booking.status
  const validTransitions: Record<string, string[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  }

  if (!validTransitions[currentStatus]?.includes(status)) {
    return { error: `Cannot transition from ${currentStatus} to ${status}` }
  }

  // Update booking status
  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)

  if (updateError) {
    console.error('Status update error:', updateError)
    return { error: 'Failed to update booking status' }
  }

  revalidatePath('/dashboard/provider/bookings')
  return { success: true }
}

export async function getProviderBookings(status?: string) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Build query
  let query = supabase
    .from('bookings')
    .select(`
      *,
      customer:profiles!bookings_customer_id_fkey(full_name, avatar_url, phone),
      service:services(title, price, duration_minutes)
    `)
    .eq('provider_id', user.id)
    .order('scheduled_at', { ascending: true })

  // Apply status filter if provided
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data: bookings, error } = await query

  if (error) {
    console.error('Error fetching provider bookings:', error)
    return { error: 'Failed to fetch bookings' }
  }

  return { data: bookings }
}

export async function getCustomerBookings(status?: string) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Build query
  let query = supabase
    .from('bookings')
    .select(`
      *,
      provider:profiles!bookings_provider_id_fkey(full_name, avatar_url, phone),
      service:services(title, price, duration_minutes)
    `)
    .eq('customer_id', user.id)
    .order('scheduled_at', { ascending: true })

  // Apply status filter if provided
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data: bookings, error } = await query

  if (error) {
    console.error('Error fetching customer bookings:', error)
    return { error: 'Failed to fetch bookings' }
  }

  return { data: bookings }
}

// ========== TASK 5.1: PROVIDER EARNINGS ==========

export async function getProviderEarnings(period: 'week' | 'month' | 'all' = 'month') {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Calculate date filter based on period
  let dateFilter: Date | null = null
  if (period === 'week') {
    dateFilter = new Date()
    dateFilter.setDate(dateFilter.getDate() - 7)
  } else if (period === 'month') {
    dateFilter = new Date()
    dateFilter.setMonth(dateFilter.getMonth() - 1)
  }

  // Build query for completed bookings
  let query = supabase
    .from('bookings')
    .select('amount, platform_fee')
    .eq('provider_id', user.id)
    .eq('status', 'completed')

  if (dateFilter) {
    query = query.gte('created_at', dateFilter.toISOString())
  }

  const { data: bookings, error } = await query

  if (error) {
    console.error('Error fetching earnings:', error)
    return { error: 'Failed to fetch earnings' }
  }

  // Calculate total earnings (amount minus platform fee)
  const totalEarnings = bookings.reduce((sum, booking) => {
    return sum + (booking.amount - booking.platform_fee)
  }, 0)

  return { data: totalEarnings }
}
