'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Availability } from '@/types/database'

interface DateTimePickerProps {
  availability: Availability[]
  bookedSlots: Array<{ start: string; duration: number }>
  selectedDate: string | null
  selectedTime: string | null
  onDateSelect: (date: string) => void
  onTimeSelect: (time: string) => void
}

export function DateTimePicker({
  availability,
  bookedSlots,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: DateTimePickerProps) {
  const [dates, setDates] = useState<Date[]>([])

  useEffect(() => {
    // Generate next 14 days
    const nextDays: Date[] = []
    for (let i = 0; i < 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      nextDays.push(date)
    }
    setDates(nextDays)
  }, [])

  // Get available time slots for selected date
  const getTimeSlots = () => {
    if (!selectedDate) return []

    const date = new Date(selectedDate)
    const dayOfWeek = date.getDay()

    // Find availability for this day
    const dayAvailability = availability.filter((a) => a.day_of_week === dayOfWeek)

    if (dayAvailability.length === 0) return []

    const slots: string[] = []

    dayAvailability.forEach((avail) => {
      const [startHour, startMin] = avail.start_time.split(':').map(Number)
      const [endHour, endMin] = avail.end_time.split(':').map(Number)

      let currentHour = startHour
      let currentMin = startMin

      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`

        // Check if this slot is already booked
        const slotDateTime = new Date(selectedDate)
        slotDateTime.setHours(currentHour, currentMin, 0, 0)

        const isBooked = bookedSlots.some((booked) => {
          const bookedStart = new Date(booked.start)
          const bookedEnd = new Date(bookedStart.getTime() + booked.duration * 60000)
          return slotDateTime >= bookedStart && slotDateTime < bookedEnd
        })

        if (!isBooked) {
          slots.push(timeString)
        }

        // Increment by 30 minutes
        currentMin += 30
        if (currentMin >= 60) {
          currentMin = 0
          currentHour += 1
        }
      }
    })

    return slots
  }

  const timeSlots = getTimeSlots()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
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
      {/* Date Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Select Date</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {dates.map((date) => {
            const dateString = date.toISOString().split('T')[0]
            const isSelected = selectedDate === dateString
            return (
              <Button
                key={dateString}
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => {
                  onDateSelect(dateString)
                  onTimeSelect('') // Reset time selection
                }}
                className={cn(
                  'h-auto py-3',
                  isSelected && 'bg-amber-600 hover:bg-amber-700'
                )}
              >
                <div className="text-center">
                  <div className="text-sm font-medium">{formatDate(date)}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Select Time</h3>
          {timeSlots.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No available time slots for this date
            </Card>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time
                return (
                  <Button
                    key={time}
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => onTimeSelect(time)}
                    className={cn(
                      'h-auto py-3',
                      isSelected && 'bg-amber-600 hover:bg-amber-700'
                    )}
                  >
                    {formatTime(time)}
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
