'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Booking } from '@/types/database'

export function useRealtimeBookings(userId: string, role: 'provider' | 'customer') {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    const supabase = createClient()

    // Initial fetch
    const fetchBookings = async () => {
      const column = role === 'provider' ? 'provider_id' : 'customer_id'
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq(column, userId)
        .order('scheduled_at', { ascending: true })
      if (data) setBookings(data)
    }
    fetchBookings()

    // Subscribe to changes
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `${role === 'provider' ? 'provider_id' : 'customer_id'}=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookings(prev => [...prev, payload.new as Booking])
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev =>
              prev.map(b => b.id === (payload.new as Booking).id ? payload.new as Booking : b)
            )
          } else if (payload.eventType === 'DELETE') {
            setBookings(prev =>
              prev.filter(b => b.id !== (payload.old as Booking).id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, role])

  return bookings
}
