'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { BookingStatus } from '@/types/database'

interface BookingPayload {
  id: string
  status: BookingStatus
  provider_id: string
  customer_id: string
  service_id: string
  scheduled_at: string
}

export function useRealtimeNotification(userId: string, role: 'provider' | 'customer') {
  useEffect(() => {
    const supabase = createClient()

    // Subscribe to booking status changes
    const channel = supabase
      .channel('booking-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `${role === 'provider' ? 'provider_id' : 'customer_id'}=eq.${userId}`,
        },
        (payload) => {
          const booking = payload.new as BookingPayload

          if (payload.eventType === 'INSERT' && role === 'provider') {
            // New booking received by provider
            toast.success('New booking received!', {
              description: 'You have a new booking request.',
              duration: 5000,
            })
          } else if (payload.eventType === 'UPDATE' && booking.status) {
            // Status changed
            const statusMessages: Record<BookingStatus, string> = {
              pending: 'Booking is pending confirmation',
              confirmed: 'Booking confirmed',
              in_progress: 'Service in progress',
              completed: 'Service completed',
              cancelled: 'Booking cancelled',
            }

            const message = statusMessages[booking.status]

            if (role === 'customer') {
              // Customer notification
              if (booking.status === 'confirmed') {
                toast.success('Booking Confirmed!', {
                  description: 'Your booking has been confirmed by the provider.',
                  duration: 5000,
                })
              } else if (booking.status === 'in_progress') {
                toast.info('Service Started', {
                  description: 'Your provider has started the service.',
                  duration: 5000,
                })
              } else if (booking.status === 'completed') {
                toast.success('Service Completed!', {
                  description: 'Your service has been completed.',
                  duration: 5000,
                })
              } else if (booking.status === 'cancelled') {
                toast.error('Booking Cancelled', {
                  description: 'Your booking has been cancelled.',
                  duration: 5000,
                })
              }
            } else if (role === 'provider') {
              // Provider notification
              if (booking.status === 'cancelled') {
                toast.warning('Booking Cancelled', {
                  description: 'A customer has cancelled their booking.',
                  duration: 5000,
                })
              }
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, role])
}
