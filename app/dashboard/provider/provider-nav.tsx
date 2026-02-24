'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Calendar, CreditCard, List } from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/dashboard/provider', icon: LayoutDashboard },
  { name: 'Services', href: '/dashboard/provider/services', icon: Package },
  { name: 'Availability', href: '/dashboard/provider/availability', icon: Calendar },
  { name: 'Bookings', href: '/dashboard/provider/bookings', icon: List },
  { name: 'Stripe', href: '/dashboard/provider/stripe', icon: CreditCard },
]

interface ProviderNavProps {
  onNavigate?: () => void
}

export function ProviderNav({ onNavigate }: ProviderNavProps) {
  const pathname = usePathname()

  return (
    <nav className="space-y-1 p-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-yellow-500/10 text-yellow-500'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
