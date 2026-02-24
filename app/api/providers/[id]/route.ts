import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 })
  }

  const supabase = await createClient()

  // Fetch provider profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('role', 'provider')
    .single()

  if (profileError || !profile) {
    return NextResponse.json(
      { error: 'Provider not found' },
      { status: 404 }
    )
  }

  // Fetch active services
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*')
    .eq('provider_id', id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (servicesError) {
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }

  // Fetch availability
  const { data: availability, error: availabilityError } = await supabase
    .from('availability')
    .select('*')
    .eq('provider_id', id)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  if (availabilityError) {
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }

  // Fetch recent reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select(`
      *,
      customer:profiles!reviews_customer_id_fkey(full_name, avatar_url)
    `)
    .eq('provider_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  if (reviewsError) {
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    profile,
    services: services || [],
    availability: availability || [],
    reviews: reviews || [],
  })
}
