'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { completeOnboarding } from '@/app/actions/profile'

interface OnboardingFormProps {
  initialName?: string
}

export function OnboardingForm({ initialName }: OnboardingFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [gettingLocation, setGettingLocation] = useState(false)

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setGettingLocation(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setGettingLocation(false)
      },
      (error) => {
        setError(`Error getting location: ${error.message}`)
        setGettingLocation(false)
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    if (location) {
      formData.set('latitude', location.lat.toString())
      formData.set('longitude', location.lng.toString())
    }

    const result = await completeOnboarding(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // Success case will redirect automatically
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Complete Your Provider Profile</CardTitle>
        <CardDescription>
          Set up your business information to start receiving bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              defaultValue={initialName}
              required
              placeholder="Your business name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Business Description</Label>
            <Textarea
              id="bio"
              name="bio"
              required
              placeholder="Tell customers about your laundry service..."
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Service Area / Address</Label>
            <Input
              id="address"
              name="address"
              type="text"
              required
              placeholder="City, State or full address"
            />
          </div>

          <div className="space-y-2">
            <Label>Location (for nearby customer matching)</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleGetLocation}
                disabled={gettingLocation}
              >
                {gettingLocation ? 'Getting Location...' : 'Use My Location'}
              </Button>
              {location && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>
                    Location captured: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </span>
                </div>
              )}
            </div>
            <input type="hidden" name="latitude" value={location?.lat || ''} />
            <input type="hidden" name="longitude" value={location?.lng || ''} />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Completing Setup...' : 'Complete Setup'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
