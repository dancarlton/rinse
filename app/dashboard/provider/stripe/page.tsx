import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProviderStripePage() {
  const supabase = await createClient()
  const stripe = getStripe()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, stripe_account_id, stripe_onboarding_complete')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'provider') {
    redirect('/dashboard')
  }

  // Determine Stripe account status
  let accountStatus: 'none' | 'incomplete' | 'complete' = 'none'
  let chargesEnabled = false
  let payoutsEnabled = false

  if (profile.stripe_account_id) {
    try {
      const account = await stripe.accounts.retrieve(profile.stripe_account_id)
      chargesEnabled = account.charges_enabled || false
      payoutsEnabled = account.payouts_enabled || false

      if (chargesEnabled && payoutsEnabled) {
        accountStatus = 'complete'

        // Update DB if not already marked complete
        if (!profile.stripe_onboarding_complete) {
          await supabase
            .from('profiles')
            .update({ stripe_onboarding_complete: true })
            .eq('id', user.id)
        }
      } else {
        accountStatus = 'incomplete'
      }
    } catch (error) {
      console.error('Error retrieving Stripe account:', error)
      accountStatus = 'incomplete'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Payment Settings</h1>
        <p className="mt-2 text-zinc-400">
          Connect your Stripe account to receive payments from customers.
        </p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-white">Stripe Connect</CardTitle>
          <CardDescription>
            {accountStatus === 'none' &&
              'Set up your Stripe account to start accepting payments.'}
            {accountStatus === 'incomplete' &&
              'Complete your Stripe onboarding to activate payments.'}
            {accountStatus === 'complete' &&
              'Your Stripe account is active and ready to receive payments.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {accountStatus === 'none' && (
            <>
              <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-zinc-200 font-medium">
                    No payment method connected
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    You need to connect a Stripe account to receive payments. Rinse
                    charges a 15% platform fee on all transactions.
                  </p>
                </div>
              </div>
              <form action="/api/stripe/connect" method="POST">
                <Button
                  type="submit"
                  className="bg-yellow-500 text-zinc-950 hover:bg-yellow-600"
                >
                  Set Up Payments
                </Button>
              </form>
            </>
          )}

          {accountStatus === 'incomplete' && (
            <>
              <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-zinc-200 font-medium">
                    Onboarding incomplete
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Complete your Stripe setup to start receiving payments.
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-zinc-500">
                    <p>Charges enabled: {chargesEnabled ? 'Yes' : 'No'}</p>
                    <p>Payouts enabled: {payoutsEnabled ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
              <form action="/api/stripe/connect" method="POST">
                <Button
                  type="submit"
                  className="bg-yellow-500 text-zinc-950 hover:bg-yellow-600"
                >
                  Continue Setup
                </Button>
              </form>
            </>
          )}

          {accountStatus === 'complete' && (
            <>
              <div className="flex items-start gap-3 rounded-lg border border-green-900/50 bg-green-950/50 p-4">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-zinc-200 font-medium">
                    Payments active
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Your Stripe account is fully set up. Customers can book your
                    services and payments will be processed automatically.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`https://connect.stripe.com/express/${profile.stripe_account_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                  >
                    Open Stripe Dashboard
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-sm text-zinc-400">
                  <span className="font-medium text-zinc-200">Platform fee:</span>{' '}
                  15% of each transaction
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
