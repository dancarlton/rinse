import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Get user profile to determine role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Redirect based on role
  if (profile?.role === 'provider') {
    redirect('/dashboard/provider')
  } else if (profile?.role === 'customer') {
    redirect('/dashboard/customer')
  }

  // Fallback - if no role found, show error or redirect to onboarding
  redirect('/login')
}
