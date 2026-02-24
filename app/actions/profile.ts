'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { profile }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const full_name = formData.get('full_name') as string
  const bio = formData.get('bio') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const latitude = formData.get('latitude') as string
  const longitude = formData.get('longitude') as string

  // Update basic profile fields
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      full_name,
      bio,
      phone,
      address,
    })
    .eq('id', user.id)

  if (updateError) {
    return { error: updateError.message }
  }

  // Update location using RPC function if coordinates provided
  if (latitude && longitude) {
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)

    if (!isNaN(lat) && !isNaN(lng)) {
      const { error: locationError } = await supabase.rpc('update_profile_location', {
        user_id: user.id,
        lat,
        lng,
      })

      if (locationError) {
        return { error: locationError.message }
      }
    }
  }

  revalidatePath('/onboarding')
  return { success: true }
}

export async function completeOnboarding(formData: FormData) {
  const result = await updateProfile(formData)

  if (result.error) {
    return result
  }

  // Redirect to provider dashboard
  redirect('/dashboard/provider')
}
