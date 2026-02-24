import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Calendar, Search, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Get user profile to verify role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'customer') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation bar */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Brand */}
            <div className="flex items-center gap-8">
              <Link href="/dashboard/customer" className="text-xl font-bold text-yellow-500">
                Rinse
              </Link>

              {/* Navigation links */}
              <div className="hidden md:flex items-center gap-1">
                <Link href="/dashboard/customer">
                  <Button variant="ghost" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    My Bookings
                  </Button>
                </Link>
                <Link href="/providers">
                  <Button variant="ghost" size="sm">
                    <Search className="mr-2 h-4 w-4" />
                    Find a Detailer
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button variant="ghost" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </div>
            </div>

            {/* User info and logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm text-muted-foreground">
                {profile.full_name}
              </div>
              <form action={logout}>
                <Button type="submit" variant="outline" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile navigation */}
      <div className="md:hidden border-b border-border bg-card">
        <div className="flex items-center justify-around py-2">
          <Link href="/dashboard/customer">
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/providers">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
