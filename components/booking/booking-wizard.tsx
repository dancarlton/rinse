'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Profile, Service, Availability } from '@/types/database'
import { DateTimePicker } from './datetime-picker'
import { PaymentForm } from './payment-form'
import { createBooking } from '@/app/actions/bookings'

interface BookingWizardProps {
  provider: Profile
  services: Service[]
  availability: Availability[]
  bookedSlots: Array<{ start: string; duration: number }>
  onBookedSlotsUpdate: (date: string) => void
}

type Step = 'service' | 'datetime' | 'location' | 'payment'

export function BookingWizard({
  provider,
  services,
  availability,
  bookedSlots,
  onBookedSlotsUpdate,
}: BookingWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('service')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [address, setAddress] = useState('')
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCreatingBooking, setIsCreatingBooking] = useState(false)

  const steps: Step[] = ['service', 'datetime', 'location', 'payment']
  const currentStepIndex = steps.indexOf(currentStep)

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setCurrentStep('datetime')
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    onBookedSlotsUpdate(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleDateTimeNext = () => {
    if (selectedDate && selectedTime) {
      setCurrentStep('location')
    }
  }

  const handleUseCurrentLocation = () => {
    setUseCurrentLocation(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding to get address
          // For now, just use coordinates as placeholder
          const { latitude, longitude } = position.coords
          setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
          setUseCurrentLocation(false)
        } catch (err) {
          setError('Failed to get address from location')
          setUseCurrentLocation(false)
        }
      },
      (error) => {
        setError('Unable to get your location')
        setUseCurrentLocation(false)
      }
    )
  }

  const handleLocationNext = async () => {
    if (!address.trim()) {
      setError('Please enter an address')
      return
    }

    if (!selectedService || !selectedDate || !selectedTime) {
      setError('Missing booking information')
      return
    }

    setIsCreatingBooking(true)
    setError(null)

    // Create ISO datetime string
    const [hours, minutes] = selectedTime.split(':').map(Number)
    const scheduledAt = new Date(selectedDate)
    scheduledAt.setHours(hours, minutes, 0, 0)

    const result = await createBooking({
      provider_id: provider.id,
      service_id: selectedService.id,
      scheduled_at: scheduledAt.toISOString(),
      address: address.trim(),
    })

    setIsCreatingBooking(false)

    if (result.error) {
      setError(result.error)
      return
    }

    if (result.data) {
      setBookingId(result.data.id)
      setCurrentStep('payment')
    }
  }

  const handlePaymentSuccess = () => {
    // Payment success redirect happens in PaymentForm
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    const [hour, min] = time.split(':').map(Number)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${String(min).padStart(2, '0')} ${ampm}`
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between px-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 text-xs sm:text-sm font-semibold',
                index <= currentStepIndex
                  ? 'border-amber-600 bg-amber-600 text-white'
                  : 'border-gray-600 text-gray-400'
              )}
            >
              {index + 1}
            </div>
            <div
              className={cn(
                'flex-1 h-1 mx-1 sm:mx-2',
                index < currentStepIndex ? 'bg-amber-600' : 'bg-gray-600',
                index === steps.length - 1 && 'hidden'
              )}
            />
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="p-6">
        {/* Service Selection */}
        {currentStep === 'service' && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold">Select a Service</h2>
            <div className="grid gap-4">
              {services
                .filter((s) => s.is_active)
                .map((service) => (
                  <Card
                    key={service.id}
                    className="p-4 cursor-pointer hover:border-amber-600 transition-colors min-h-[88px]"
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base sm:text-lg">{service.title}</h3>
                        {service.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {service.description}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          Duration: {service.duration_minutes} minutes
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-xl sm:text-2xl font-bold text-amber-600">
                          ${service.price}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Date & Time Selection */}
        {currentStep === 'datetime' && selectedService && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Select Date & Time</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedService.title} - {selectedService.duration_minutes} minutes
              </p>
            </div>

            <DateTimePicker
              availability={availability}
              bookedSlots={bookedSlots}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={handleDateSelect}
              onTimeSelect={handleTimeSelect}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('service')}
                className="w-full sm:flex-1 min-h-[44px]"
              >
                Back
              </Button>
              <Button
                onClick={handleDateTimeNext}
                disabled={!selectedDate || !selectedTime}
                className="w-full sm:flex-1 min-h-[44px] bg-amber-600 hover:bg-amber-700"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Location Entry */}
        {currentStep === 'location' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold">Service Location</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, State 12345"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <Button
                variant="outline"
                onClick={handleUseCurrentLocation}
                disabled={useCurrentLocation}
                className="w-full"
              >
                {useCurrentLocation ? 'Getting location...' : 'Use My Location'}
              </Button>

              {error && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('datetime')}
                className="w-full sm:flex-1 min-h-[44px]"
              >
                Back
              </Button>
              <Button
                onClick={handleLocationNext}
                disabled={!address.trim() || isCreatingBooking}
                className="w-full sm:flex-1 min-h-[44px] bg-amber-600 hover:bg-amber-700"
              >
                {isCreatingBooking ? 'Creating...' : 'Next'}
              </Button>
            </div>
          </div>
        )}

        {/* Payment */}
        {currentStep === 'payment' && selectedService && bookingId && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold">Review & Pay</h2>

            {/* Booking Summary */}
            <Card className="p-4 sm:p-6 bg-muted/50">
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium text-right">{selectedService.title}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="font-medium text-right">{provider.full_name}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-right">
                    {selectedDate && formatDate(selectedDate)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium text-right">
                    {selectedTime && formatTime(selectedTime)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium text-right max-w-[60%] break-words">{address}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span className="text-amber-600">${selectedService.price}</span>
                </div>
              </div>
            </Card>

            {/* Payment Form */}
            <PaymentForm
              bookingId={bookingId}
              providerId={provider.id}
              amount={selectedService.price}
              onSuccess={handlePaymentSuccess}
            />

            <Button
              variant="outline"
              onClick={() => setCurrentStep('location')}
              className="w-full min-h-[44px]"
            >
              Back
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
