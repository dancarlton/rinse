import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/config'
import Stripe from 'stripe'

export async function POST(request: Request) {
  try {
    const stripe = getStripe()
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle account.updated event
    if (event.type === 'account.updated') {
      const account = event.data.object as Stripe.Account

      // Check if onboarding is complete
      const isComplete = account.charges_enabled && account.payouts_enabled

      if (isComplete && account.metadata?.supabase_user_id) {
        const supabase = await createClient()

        // Update profile to mark onboarding complete
        const { error } = await supabase
          .from('profiles')
          .update({ stripe_onboarding_complete: true })
          .eq('id', account.metadata.supabase_user_id)

        if (error) {
          console.error('Failed to update profile:', error)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
