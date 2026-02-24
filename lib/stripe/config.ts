import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe() {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }
    _stripe = new Stripe(key, {
      apiVersion: '2026-01-28.clover',
    })
  }
  return _stripe
}

export const PLATFORM_FEE_PERCENT = 15
