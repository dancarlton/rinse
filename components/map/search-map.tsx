'use client'

import { useEffect, useState, useCallback } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import Link from 'next/link'
import { StarRating } from '@/components/providers/star-rating'

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

interface SearchMapProps {
  providers: Provider[]
  center?: { lat: number; lng: number }
  onLocationChange?: (lat: number, lng: number) => void
}

export function SearchMap({
  providers,
  center,
  onLocationChange
}: SearchMapProps) {
  const [viewState, setViewState] = useState({
    latitude: center?.lat || 37.7749, // Default to San Francisco
    longitude: center?.lng || -122.4194,
    zoom: 11,
  })
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [mapboxToken, setMapboxToken] = useState<string>('')

  useEffect(() => {
    // Get Mapbox token from env (client-side only)
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
    setMapboxToken(token)
  }, [])

  useEffect(() => {
    if (center) {
      setViewState(prev => ({
        ...prev,
        latitude: center.lat,
        longitude: center.lng,
      }))
    }
  }, [center])

  const handleMove = useCallback((evt: any) => {
    setViewState(evt.viewState)
    if (onLocationChange) {
      onLocationChange(evt.viewState.latitude, evt.viewState.longitude)
    }
  }, [onLocationChange])

  if (!mapboxToken) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Map token not configured</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <Map
        {...viewState}
        onMove={handleMove}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={mapboxToken}
        style={{ width: '100%', height: '100%' }}
      >
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            latitude={provider.latitude}
            longitude={provider.longitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              setSelectedProvider(provider)
            }}
          >
            <div className="cursor-pointer hover:scale-110 transition-transform">
              <svg
                width="24"
                height="32"
                viewBox="0 0 24 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z"
                  fill="#EAB308"
                />
                <circle cx="12" cy="12" r="4" fill="#1F2937" />
              </svg>
            </div>
          </Marker>
        ))}

        {selectedProvider && (
          <Popup
            latitude={selectedProvider.latitude}
            longitude={selectedProvider.longitude}
            anchor="top"
            onClose={() => setSelectedProvider(null)}
            closeOnClick={false}
            className="mapbox-popup-dark"
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-white mb-1">
                {selectedProvider.full_name}
              </h3>

              <div className="flex items-center gap-1 mb-2">
                <StarRating rating={selectedProvider.rating} size={12} />
                <span className="text-xs text-gray-400">
                  ({selectedProvider.num_ratings})
                </span>
              </div>

              {selectedProvider.top_service && (
                <p className="text-sm text-gray-300 mb-2">
                  {selectedProvider.top_service.title} - ${selectedProvider.top_service.price}
                </p>
              )}

              <Link
                href={`/provider/${selectedProvider.id}`}
                className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
              >
                View Profile →
              </Link>
            </div>
          </Popup>
        )}
      </Map>

      <style jsx global>{`
        .mapbox-popup-dark .mapboxgl-popup-content {
          background-color: #1F2937;
          color: white;
          border-radius: 0.5rem;
          padding: 0;
        }
        .mapbox-popup-dark .mapboxgl-popup-tip {
          border-top-color: #1F2937;
        }
        .mapbox-popup-dark .mapboxgl-popup-close-button {
          color: #9CA3AF;
          font-size: 20px;
          padding: 4px 8px;
        }
        .mapbox-popup-dark .mapboxgl-popup-close-button:hover {
          color: white;
          background-color: transparent;
        }
      `}</style>
    </div>
  )
}
