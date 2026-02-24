'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createPaymentIntent } from '@/app/actions/bookings'

let stripePromise: ReturnType<typeof loadStripe> | null = null

function getStripePromise() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      console.error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
      return null
    }
    stripePromise = loadStripe(key)
  }
  return stripePromise
}

interface PaymentFormContentProps {
  bookingId: string
  providerId: string
  onSuccess: () => void
}

function PaymentFormContent({ bookingId, providerId, onSuccess }: PaymentFormContentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || 'Failed to submit payment')
        setIsProcessing(false)
        return
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/${providerId}/success?booking=${bookingId}`,
        },
      })

      if (confirmError) {
        setError(confirmError.message || 'Payment failed')
        setIsProcessing(false)
      } else {
        // Payment successful, redirect will happen automatically
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
          {error}
        </div>
      )}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-amber-600 hover:bg-amber-700"
      >
        {isProcessing ? 'Processing...' : 'Confirm & Pay'}
      </Button>
    </form>
  )
}

interface PaymentFormProps {
  bookingId: string
  providerId: string
  amount: number
  onSuccess?: () => void
}

export function PaymentForm({ bookingId, providerId, amount, onSuccess }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializePayment = async () => {
      setIsLoading(true)
      const result = await createPaymentIntent(bookingId)

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      if (result.data?.clientSecret) {
        setClientSecret(result.data.clientSecret)
      }
      setIsLoading(false)
    }

    initializePayment()
  }, [bookingId])

  const stripePromise = getStripePromise()

  if (!stripePromise) {
    return (
      <Card className="p-6">
        <div className="text-red-500">
          Payment system is not configured. Please contact support.
        </div>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-500">{error}</div>
      </Card>
    )
  }

  if (!clientSecret) {
    return (
      <Card className="p-6">
        <div className="text-red-500">Failed to initialize payment</div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'night',
            variables: {
              colorPrimary: '#d97706',
            },
          },
        }}
      >
        <PaymentFormContent
          bookingId={bookingId}
          providerId={providerId}
          onSuccess={onSuccess || (() => {})}
        />
      </Elements>
    </Card>
  )
}
