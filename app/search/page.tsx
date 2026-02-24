'use client'

import { useState, useEffect } from 'react'
import { SearchMap } from '@/components/map/search-map'
import { ProviderList } from '@/components/providers/provider-list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Provider {
  id: string
  full_name: string
  rating: number
  num_ratings: number
  avatar_url: string | null
  address: string | null
  bio: string | null
  latitude: number
  longitude: number
  distance_km?: number
  top_service?: {
    title: string
    price: number
  } | null
}

export default function SearchPage() {
  const [location, setLocation] = useState('')
  const [radius, setRadius] = useState('10')
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Try to get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCenter({ lat: latitude, lng: longitude })
          // Auto-search with user's location
          fetchProviders(latitude, longitude, parseInt(radius))
        },
        (error) => {
          console.error('Geolocation error:', error)
          // Fallback to default center (San Francisco)
          setCenter({ lat: 37.7749, lng: -122.4194 })
        }
      )
    } else {
      // Fallback if geolocation not supported
      setCenter({ lat: 37.7749, lng: -122.4194 })
    }
  }, [])

  const fetchProviders = async (lat: number, lng: number, radiusKm: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/providers/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch providers')
      }

      const data = await response.json()
      setProviders(data.providers || [])
    } catch (err) {
      console.error('Error fetching providers:', err)
      setError('Failed to load providers. Please try again.')
      setProviders([])
    } finally {
      setLoading(false)
    }
  }

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCenter({ lat: latitude, lng: longitude })
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
          fetchProviders(latitude, longitude, parseInt(radius))
        },
        (error) => {
          console.error('Geolocation error:', error)
          setError('Unable to get your location. Please enter it manually.')
        }
      )
    } else {
      setError('Geolocation is not supported by your browser.')
    }
  }

  const handleSearch = () => {
    if (center) {
      fetchProviders(center.lat, center.lng, parseInt(radius))
    } else {
      setError('Please set a location first.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Search Controls */}
      <div className="border-b border-gray-800 bg-gray-900 p-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Location Input */}
            <div className="flex-1">
              <Label htmlFor="location" className="text-sm text-gray-400 mb-2">
                Location
              </Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter location or use current"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 min-h-[44px]"
                />
                <Button
                  variant="outline"
                  onClick={handleUseMyLocation}
                  className="whitespace-nowrap min-h-[44px]"
                >
                  Use My Location
                </Button>
              </div>
            </div>

            {/* Radius Selector */}
            <div className="w-full md:w-40">
              <Label htmlFor="radius" className="text-sm text-gray-400 mb-2">
                Radius
              </Label>
              <Select value={radius} onValueChange={setRadius}>
                <SelectTrigger id="radius">
                  <SelectValue placeholder="Select radius" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 km</SelectItem>
                  <SelectItem value="10">10 km</SelectItem>
                  <SelectItem value="25">25 km</SelectItem>
                  <SelectItem value="50">50 km</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={!center || loading}
              className="w-full md:w-auto min-h-[44px] bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>
      </div>

      {/* Map and Provider List */}
      <div className="flex flex-col-reverse md:flex-row h-auto md:h-[calc(100vh-12rem)]">
        {/* Provider List - Left side on desktop, bottom on mobile */}
        <div className="w-full md:w-1/2 lg:w-2/5 overflow-y-auto p-4 bg-gray-950">
          <div className="container mx-auto max-w-2xl">
            <ProviderList providers={providers} loading={loading} />
          </div>
        </div>

        {/* Map - Right side on desktop, top on mobile */}
        <div className="w-full md:w-1/2 lg:w-3/5 h-[40vh] md:h-auto">
          {center && (
            <SearchMap
              providers={providers}
              center={center}
            />
          )}
        </div>
      </div>
    </div>
  )
}
