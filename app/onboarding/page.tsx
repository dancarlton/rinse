import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OnboardingForm } from './onboarding-form'

export const dynamic = 'force-dynamic'

export default async function OnboardingPage() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    // Profile should exist from trigger, but handle gracefully
    console.error('Profile fetch error:', profileError)
  }

  // Check if user is a provider
  if (profile?.role !== 'provider') {
    redirect('/dashboard')
  }

  // Check if already onboarded (has bio and address)
  if (profile?.bio && profile?.address) {
    redirect('/dashboard/provider')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <OnboardingForm initialName={profile?.full_name || user.email?.split('@')[0] || ''} />
    </div>
  )
}
