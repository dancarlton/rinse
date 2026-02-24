export type UserRole = 'customer' | 'provider'
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: UserRole
  bio: string | null
  phone: string | null
  address: string | null
  rating: number
  num_ratings: number
  stripe_account_id: string | null
  stripe_onboarding_complete: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  provider_id: string
  title: string
  description: string | null
  price: number
  duration_minutes: number
  photo_url: string | null
  is_active: boolean
  created_at: string
}

export interface Availability {
  id: string
  provider_id: string
  day_of_week: number // 0=Sunday, 6=Saturday
  start_time: string  // HH:MM
  end_time: string    // HH:MM
}

export interface Booking {
  id: string
  provider_id: string
  customer_id: string
  service_id: string
  scheduled_at: string
  address: string
  status: BookingStatus
  payment_intent_id: string | null
  amount: number
  platform_fee: number
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  booking_id: string
  provider_id: string
  customer_id: string
  rating: number
  comment: string | null
  reply: string | null
  created_at: string
}
