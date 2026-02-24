'use client'

import { useState, useTransition } from 'react'
import { Service } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ServiceForm } from './service-form'
import { deleteService, toggleServiceActive } from '@/app/actions/services'
import { Plus, Edit, Trash2, Clock, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ServicesClientProps {
  initialServices: Service[]
}

export function ServicesClient({ initialServices }: ServicesClientProps) {
  const [services, setServices] = useState(initialServices)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | undefined>()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSuccess = () => {
    setShowForm(false)
    setEditingService(undefined)
    router.refresh()
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return
    }

    startTransition(async () => {
      try {
        await deleteService(id)
        setServices(services.filter(s => s.id !== id))
        router.refresh()
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete service')
      }
    })
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await toggleServiceActive(id, !currentStatus)
        setServices(services.map(s =>
          s.id === id ? { ...s, is_active: !currentStatus } : s
        ))
        router.refresh()
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to update service')
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Services</h1>
          <p className="mt-2 text-zinc-400">
            Manage your detailing services and pricing
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => {
              setEditingService(undefined)
              setShowForm(true)
            }}
            className="bg-yellow-500 text-zinc-950 hover:bg-yellow-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        )}
      </div>

      {showForm && (
        <ServiceForm
          service={editingService}
          onCancel={() => {
            setShowForm(false)
            setEditingService(undefined)
          }}
          onSuccess={handleSuccess}
        />
      )}

      {services.length === 0 && !showForm ? (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-zinc-800 p-4 mb-4">
              <Plus className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No services yet</h3>
            <p className="text-zinc-400 text-center mb-6">
              Add your first service to start receiving bookings.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-yellow-500 text-zinc-950 hover:bg-yellow-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white">{service.title}</CardTitle>
                    <CardDescription className="mt-2 text-zinc-400">
                      {service.description || 'No description'}
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => handleToggleActive(service.id, service.is_active)}
                    disabled={isPending}
                    className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      service.is_active
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-zinc-700 text-zinc-400'
                    }`}
                  >
                    {service.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <DollarSign className="h-5 w-5 text-yellow-500" />
                    <span className="text-2xl font-bold">${service.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{service.duration_minutes} min</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleEdit(service)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(service.id)}
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    className="border-zinc-700 bg-zinc-800 text-red-400 hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
