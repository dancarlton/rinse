'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile, Service, Availability } from '@/types/database'
import { BookingWizard } from '@/components/booking/booking-wizard'
import { Card } from '@/components/ui/card'

export default function BookingPage() {
  const params = useParams()
  const providerId = params.providerId as string

  const [provider, setProvider] = useState<Profile | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [availability, setAvailability] = useState<Availability[]>([])
  const [bookedSlots, setBookedSlots] = useState<Array<{ start: string; duration: number }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch provider
      const { data: providerData, error: providerError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', providerId)
        .eq('role', 'provider')
        .single()

      if (providerError || !providerData) {
        setError('Provider not found')
        setIsLoading(false)
        return
      }

      setProvider(providerData)

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', providerId)
        .eq('is_active', true)
        .order('price', { ascending: true })

      if (servicesError) {
        setError('Failed to load services')
        setIsLoading(false)
        return
      }

      setServices(servicesData || [])

      // Fetch availability
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('availability')
        .select('*')
        .eq('provider_id', providerId)
        .order('day_of_week', { ascending: true })

      if (availabilityError) {
        setError('Failed to load availability')
        setIsLoading(false)
        return
      }

      setAvailability(availabilityData || [])
      setIsLoading(false)
    }

    fetchData()
  }, [providerId])

  const handleBookedSlotsUpdate = async (date: string) => {
    const supabase = createClient()

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
      return
    }

    // Map to booked slots format
    const slots = bookings.map((booking: any) => ({
      start: booking.scheduled_at,
      duration: booking.services?.duration_minutes || 60,
    }))

    setBookedSlots(slots)
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
        </div>
      </div>
    )
  }

  if (error || !provider) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="text-center text-red-500">
            {error || 'Failed to load booking page'}
          </div>
        </Card>
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            This provider has no active services available for booking.
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Book with {provider.full_name}</h1>
        {provider.bio && (
          <p className="text-muted-foreground mt-2">{provider.bio}</p>
        )}
        {provider.rating > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-amber-600">★</span>
            <span className="font-semibold">{provider.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({provider.num_ratings} {provider.num_ratings === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        )}
      </div>

      <BookingWizard
        provider={provider}
        services={services}
        availability={availability}
        bookedSlots={bookedSlots}
        onBookedSlotsUpdate={handleBookedSlotsUpdate}
      />
    </div>
  )
}
