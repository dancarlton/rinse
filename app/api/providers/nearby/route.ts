import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = parseFloat(searchParams.get('lat') || '0')
  const lng = parseFloat(searchParams.get('lng') || '0')
  const radius = parseFloat(searchParams.get('radius') || '25') // km

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 })
  }

  const supabase = await createClient()

  // Call the PostGIS function defined in migration 001 (updated in 003)
  const { data, error } = await supabase.rpc('find_nearby_providers', {
    lat,
    lng,
    radius_km: radius,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform data to match expected format
  const providers = (data || []).map((provider: any) => ({
    id: provider.id,
    full_name: provider.full_name,
    avatar_url: provider.avatar_url,
    bio: provider.bio,
    address: provider.address,
    latitude: provider.latitude,
    longitude: provider.longitude,
    rating: provider.rating,
    num_ratings: provider.num_ratings,
    distance_km: provider.distance_km,
    top_service: provider.top_service_title && provider.top_service_price
      ? {
          title: provider.top_service_title,
          price: provider.top_service_price,
        }
      : null,
  }))

  return NextResponse.json({ providers })
}
