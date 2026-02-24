'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createReview(bookingId: string, rating: number, comment: string) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Validate rating
  if (rating < 1 || rating > 5) {
    return { error: 'Rating must be between 1 and 5' }
  }

  // Get booking to verify ownership and status
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('customer_id, provider_id, status')
    .eq('id', bookingId)
    .single()

  if (bookingError || !booking) {
    return { error: 'Booking not found' }
  }

  // Verify user is the customer
  if (booking.customer_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  // Verify booking is completed
  if (booking.status !== 'completed') {
    return { error: 'Can only review completed bookings' }
  }

  // Check if review already exists
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('booking_id', bookingId)
    .single()

  if (existingReview) {
    return { error: 'Review already exists for this booking' }
  }

  // Create review
  const { data: review, error: reviewError } = await supabase
    .from('reviews')
    .insert({
      booking_id: bookingId,
      provider_id: booking.provider_id,
      customer_id: user.id,
      rating,
      comment: comment.trim() || null,
    })
    .select()
    .single()

  if (reviewError) {
    console.error('Review creation error:', reviewError)
    return { error: 'Failed to create review' }
  }

  // Update provider's rating
  await updateProviderRating(booking.provider_id)

  revalidatePath('/dashboard/customer')
  return { data: review }
}

export async function getReviewsForProvider(providerId: string) {
  const supabase = await createClient()

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      *,
      customer:profiles!reviews_customer_id_fkey(full_name, avatar_url),
      booking:bookings(service:services(title))
    `)
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return { error: 'Failed to fetch reviews' }
  }

  return { data: reviews }
}

export async function getReviewForBooking(bookingId: string) {
  const supabase = await createClient()

  const { data: review, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('booking_id', bookingId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    console.error('Error fetching review:', error)
    return { error: 'Failed to fetch review' }
  }

  return { data: review || null }
}

async function updateProviderRating(providerId: string) {
  const supabase = await createClient()

  // Calculate average rating and count
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('provider_id', providerId)

  if (!reviews || reviews.length === 0) {
    return
  }

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
  const avgRating = totalRating / reviews.length

  // Update provider profile
  await supabase
    .from('profiles')
    .update({
      rating: avgRating,
      num_ratings: reviews.length,
    })
    .eq('id', providerId)
}
