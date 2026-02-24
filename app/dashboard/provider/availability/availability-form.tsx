'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { setAvailability } from '@/app/actions/availability'
import type { Availability } from '@/types/database'
import { Clock } from 'lucide-react'

interface DaySchedule {
  day_of_week: number
  enabled: boolean
  start_time: string
  end_time: string
}

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

// Generate time options in 30-minute increments from 6:00 AM to 10:00 PM
const TIME_OPTIONS = Array.from({ length: 33 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6
  const minute = i % 2 === 0 ? '00' : '30'
  const time24 = `${hour.toString().padStart(2, '0')}:${minute}`
  const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  const ampm = hour >= 12 ? 'PM' : 'AM'
  return {
    value: time24,
    label: `${hour12}:${minute} ${ampm}`
  }
})

interface AvailabilityFormProps {
  initialAvailability: Availability[]
}

export function AvailabilityForm({ initialAvailability }: AvailabilityFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Initialize schedule state from existing availability
  const [schedule, setSchedule] = useState<DaySchedule[]>(() => {
    return DAYS.map((_, dayIndex) => {
      const existing = initialAvailability.find(a => a.day_of_week === dayIndex)
      return {
        day_of_week: dayIndex,
        enabled: !!existing,
        start_time: existing?.start_time || '09:00',
        end_time: existing?.end_time || '17:00'
      }
    })
  })

  const toggleDay = (dayIndex: number) => {
    setSchedule(prev => prev.map((day, i) =>
      i === dayIndex ? { ...day, enabled: !day.enabled } : day
    ))
    setSuccess(false)
  }

  const updateTime = (dayIndex: number, field: 'start_time' | 'end_time', value: string) => {
    setSchedule(prev => prev.map((day, i) =>
      i === dayIndex ? { ...day, [field]: value } : day
    ))
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Build slots array from enabled days
    const slots = schedule
      .filter(day => day.enabled)
      .map(day => ({
        day_of_week: day.day_of_week,
        start_time: day.start_time,
        end_time: day.end_time
      }))

    startTransition(async () => {
      try {
        await setAvailability(slots)
        setSuccess(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save availability')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-zinc-900 border-zinc-800 p-6">
        <div className="space-y-4">
          {schedule.map((day, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                day.enabled
                  ? 'bg-zinc-800/50 border-zinc-700'
                  : 'bg-zinc-900/50 border-zinc-800/50'
              }`}
            >
              {/* Day name */}
              <div className="w-32 flex-shrink-0">
                <Label className="text-base font-medium text-white">
                  {DAYS[index]}
                </Label>
              </div>

              {/* Toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    day.enabled ? 'bg-yellow-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      day.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Time selectors */}
              {day.enabled ? (
                <div className="flex items-center gap-3 flex-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <select
                    value={day.start_time}
                    onChange={(e) => updateTime(index, 'start_time', e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  >
                    {TIME_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-400">to</span>
                  <select
                    value={day.end_time}
                    onChange={(e) => updateTime(index, 'end_time', e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  >
                    {TIME_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex-1 text-sm text-gray-500">
                  Unavailable
                </div>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-md">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-900/50 rounded-md">
            <p className="text-sm text-green-400">Schedule saved successfully!</p>
          </div>
        )}

        <div className="mt-6">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-medium"
          >
            {isPending ? 'Saving...' : 'Save Schedule'}
          </Button>
        </div>
      </Card>
    </form>
  )
}
