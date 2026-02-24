'use client'

import { useState } from 'react'
import { ProviderNav } from './provider-nav'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Mobile header */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4">
        <h2 className="text-lg font-semibold text-white">Provider Dashboard</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar - desktop always visible, mobile toggle */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 border-r border-zinc-800 bg-zinc-900
          transform transition-transform duration-200 ease-in-out
          md:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex h-16 items-center border-b border-zinc-800 px-6">
          <h2 className="text-lg font-semibold text-white">Provider Dashboard</h2>
        </div>
        <ProviderNav onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 pt-14 md:pt-0">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
