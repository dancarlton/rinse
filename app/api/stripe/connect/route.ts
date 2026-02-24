import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/config'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const stripe = getStripe()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get profile to ensure user is a provider
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, stripe_account_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (profile.role !== 'provider') {
      return NextResponse.json(
        { error: 'Only providers can create Stripe accounts' },
        { status: 403 }
      )
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // If account already exists, create new account link
    if (profile.stripe_account_id) {
      const accountLink = await stripe.accountLinks.create({
        account: profile.stripe_account_id,
        refresh_url: `${origin}/dashboard/provider/stripe?refresh=true`,
        return_url: `${origin}/dashboard/provider/stripe?success=true`,
        type: 'account_onboarding',
      })

      return NextResponse.json({ url: accountLink.url })
    }

    // Create new Express account
    const account = await stripe.accounts.create({
      type: 'express',
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })

    // Save stripe_account_id to profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ stripe_account_id: account.id })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to save Stripe account ID' },
        { status: 500 }
      )
    }

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${origin}/dashboard/provider/stripe?refresh=true`,
      return_url: `${origin}/dashboard/provider/stripe?success=true`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error)
    return NextResponse.json(
      { error: 'Failed to create Stripe Connect account' },
      { status: 500 }
    )
  }
}
