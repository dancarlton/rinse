import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAvailability } from '@/app/actions/availability'
import { AvailabilityForm } from './availability-form'

export const dynamic = 'force-dynamic'

export default async function AvailabilityPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!profile || profile.role !== 'provider') {
    redirect('/dashboard')
  }

  const availability = await getAvailability()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Availability Schedule</h1>
        <p className="text-gray-400">
          Set your weekly working hours. Customers will only be able to book during these times.
        </p>
      </div>

      <AvailabilityForm initialAvailability={availability} />
    </div>
  )
}
