'use client'

import { useRealtimeNotification } from '@/hooks/useRealtimeNotification'
import { ReactNode } from 'react'

interface ProviderRealtimeWrapperProps {
  userId: string
  children: ReactNode
}

export function ProviderRealtimeWrapper({ userId, children }: ProviderRealtimeWrapperProps) {
  // Enable real-time notifications for provider
  useRealtimeNotification(userId, 'provider')

  return <>{children}</>
}
