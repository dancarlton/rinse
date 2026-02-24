'use server'

import { createClient } from '@/lib/supabase/server'
import { Service } from '@/types/database'
import { revalidatePath } from 'next/cache'

export async function getProviderServices(providerId?: string): Promise<Service[]> {
  const supabase = await createClient()

  // If no providerId provided, get current user's services
  if (!providerId) {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }
    providerId = user.id
  }

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch services: ${error.message}`)
  }

  return data || []
}

export async function createService(formData: FormData): Promise<Service> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const duration_minutes = parseInt(formData.get('duration_minutes') as string, 10)
  const is_active = formData.get('is_active') === 'true'

  if (!title || isNaN(price) || isNaN(duration_minutes)) {
    throw new Error('Invalid input: title, price, and duration are required')
  }

  const { data, error } = await supabase
    .from('services')
    .insert({
      provider_id: user.id,
      title,
      description: description || null,
      price,
      duration_minutes,
      is_active,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create service: ${error.message}`)
  }

  revalidatePath('/dashboard/provider/services')
  return data
}

export async function updateService(id: string, formData: FormData): Promise<Service> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Verify ownership
  const { data: existing, error: fetchError } = await supabase
    .from('services')
    .select('provider_id')
    .eq('id', id)
    .single()

  if (fetchError || !existing) {
    throw new Error('Service not found')
  }

  if (existing.provider_id !== user.id) {
    throw new Error('Unauthorized: not the owner of this service')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const duration_minutes = parseInt(formData.get('duration_minutes') as string, 10)
  const is_active = formData.get('is_active') === 'true'

  if (!title || isNaN(price) || isNaN(duration_minutes)) {
    throw new Error('Invalid input: title, price, and duration are required')
  }

  const { data, error } = await supabase
    .from('services')
    .update({
      title,
      description: description || null,
      price,
      duration_minutes,
      is_active,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update service: ${error.message}`)
  }

  revalidatePath('/dashboard/provider/services')
  return data
}

export async function deleteService(id: string): Promise<void> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Verify ownership
  const { data: existing, error: fetchError } = await supabase
    .from('services')
    .select('provider_id')
    .eq('id', id)
    .single()

  if (fetchError || !existing) {
    throw new Error('Service not found')
  }

  if (existing.provider_id !== user.id) {
    throw new Error('Unauthorized: not the owner of this service')
  }

  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete service: ${error.message}`)
  }

  revalidatePath('/dashboard/provider/services')
}

export async function toggleServiceActive(id: string, isActive: boolean): Promise<Service> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Verify ownership
  const { data: existing, error: fetchError } = await supabase
    .from('services')
    .select('provider_id')
    .eq('id', id)
    .single()

  if (fetchError || !existing) {
    throw new Error('Service not found')
  }

  if (existing.provider_id !== user.id) {
    throw new Error('Unauthorized: not the owner of this service')
  }

  const { data, error } = await supabase
    .from('services')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to toggle service active status: ${error.message}`)
  }

  revalidatePath('/dashboard/provider/services')
  return data
}
