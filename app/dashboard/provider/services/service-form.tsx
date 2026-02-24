'use client'

import { useState, useTransition } from 'react'
import { Service } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createService, updateService } from '@/app/actions/services'
import { X } from 'lucide-react'

interface ServiceFormProps {
  service?: Service
  onCancel: () => void
  onSuccess: () => void
}

export function ServiceForm({ service, onCancel, onSuccess }: ServiceFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        if (service) {
          await updateService(service.id, formData)
        } else {
          await createService(formData)
        }
        onSuccess()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save service')
      }
    })
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">
              {service ? 'Edit Service' : 'Add New Service'}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {service ? 'Update your service details' : 'Create a new detailing service'}
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-zinc-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-200">
              Service Title *
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={service?.title}
              placeholder="e.g., Basic Wash, Full Detail"
              required
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-200">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={service?.description || ''}
              placeholder="Describe what's included in this service..."
              rows={3}
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-zinc-200">
                Price ($) *
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={service?.price}
                placeholder="30.00"
                required
                className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_minutes" className="text-zinc-200">
                Duration (minutes) *
              </Label>
              <Input
                id="duration_minutes"
                name="duration_minutes"
                type="number"
                step="15"
                min="15"
                defaultValue={service?.duration_minutes || 60}
                placeholder="60"
                required
                className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              value="true"
              defaultChecked={service?.is_active ?? true}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-yellow-500 focus:ring-yellow-500"
            />
            <Label htmlFor="is_active" className="text-zinc-200">
              Service is active and available for booking
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
              className="border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-yellow-500 text-zinc-950 hover:bg-yellow-600"
            >
              {isPending ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
