import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProviderServices } from '@/app/actions/services'
import { ServicesClient } from './services-client'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // Verify user is a provider
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'provider') {
    redirect('/dashboard')
  }

  const services = await getProviderServices()

  return <ServicesClient initialServices={services} />
}
