import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCustomerBookings } from '@/app/actions/bookings'
import { CustomerDashboardContent } from '@/components/customer/customer-dashboard-content'

export const dynamic = 'force-dynamic'

export default async function CustomerDashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'customer') {
    redirect('/dashboard')
  }

  // Fetch all bookings
  const result = await getCustomerBookings()

  if (result.error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{result.error}</p>
      </div>
    )
  }

  return <CustomerDashboardContent bookings={result.data || []} userId={user.id} />
}
