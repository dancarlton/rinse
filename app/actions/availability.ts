'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Availability } from '@/types/database'

export async function getAvailability(providerId?: string) {
  const supabase = await createClient()

  // If no providerId provided, get from current user
  if (!providerId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!profile) {
      throw new Error('Profile not found')
    }

    providerId = profile.id
  }

  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('provider_id', providerId)
    .order('day_of_week', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch availability: ${error.message}`)
  }

  return data as Availability[]
}

export async function setAvailability(
  slots: Array<{ day_of_week: number; start_time: string; end_time: string }>
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    throw new Error('Profile not found')
  }

  // Delete all existing availability for this provider
  const { error: deleteError } = await supabase
    .from('availability')
    .delete()
    .eq('provider_id', profile.id)

  if (deleteError) {
    throw new Error(`Failed to delete existing availability: ${deleteError.message}`)
  }

  // Insert new slots if any
  if (slots.length > 0) {
    const slotsWithProvider = slots.map(slot => ({
      ...slot,
      provider_id: profile.id
    }))

    const { error: insertError } = await supabase
      .from('availability')
      .insert(slotsWithProvider)

    if (insertError) {
      throw new Error(`Failed to insert availability: ${insertError.message}`)
    }
  }

  revalidatePath('/dashboard/provider/availability')

  return { success: true }
}

export async function deleteAvailabilitySlot(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    throw new Error('Profile not found')
  }

  // Delete the slot, ensuring it belongs to this provider
  const { error } = await supabase
    .from('availability')
    .delete()
    .eq('id', id)
    .eq('provider_id', profile.id)

  if (error) {
    throw new Error(`Failed to delete availability slot: ${error.message}`)
  }

  revalidatePath('/dashboard/provider/availability')

  return { success: true }
}
