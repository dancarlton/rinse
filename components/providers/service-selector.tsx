'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Service } from '@/types/database'

interface ServiceSelectorProps {
  services: Service[]
  providerId: string
}

export function ServiceSelector({ services, providerId }: ServiceSelectorProps) {
  const router = useRouter()
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

  const selectedService = services.find(s => s.id === selectedServiceId)

  const handleContinue = () => {
    if (selectedServiceId) {
      router.push(`/booking/${providerId}?service=${selectedServiceId}`)
    }
  }

  if (services.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-gray-400 text-center">No services available</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Service Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((service) => {
          const isSelected = selectedServiceId === service.id

          return (
            <Card
              key={service.id}
              className={cn(
                'p-4 cursor-pointer transition-all',
                'hover:border-yellow-500/50',
                isSelected && 'border-yellow-500 bg-yellow-500/5'
              )}
              onClick={() => setSelectedServiceId(service.id)}
            >
              <div className="flex flex-col h-full">
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>

                {service.description && (
                  <p className="text-gray-400 text-sm mb-3 flex-1">
                    {service.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className={cn(
                    'text-2xl font-bold',
                    isSelected ? 'text-yellow-500' : 'text-yellow-500/80'
                  )}>
                    ${(service.price / 100).toFixed(2)}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {service.duration_minutes} min
                  </span>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-yellow-500/20">
                    <span className="text-sm text-yellow-500">✓ Selected</span>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Continue Button */}
      {selectedService && (
        <div className="sticky bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-800 p-4 -mx-4">
          <Button
            onClick={handleContinue}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            size="lg"
          >
            Continue to Booking - ${(selectedService.price / 100).toFixed(2)}
          </Button>
        </div>
      )}
    </div>
  )
}
