import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Calendar, Sparkles, TrendingUp, DollarSign, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
            Premium Car Care,
            <br />
            <span className="text-primary">Delivered to You</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Connect with professional mobile detailers in your area. Get premium car care service at your home or office.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/search" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-6 min-h-[48px]">
                Find a Detailer Near You
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-6 min-h-[48px]">
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to a sparkling clean car
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10">
                  1
                </div>
                <h3 className="text-2xl font-bold">Find</h3>
                <p className="text-muted-foreground">
                  Search for professional detailers near your location. Browse profiles, services, and reviews.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10">
                  2
                </div>
                <h3 className="text-2xl font-bold">Book</h3>
                <p className="text-muted-foreground">
                  Choose your service package and schedule a time that works for you. Simple and transparent pricing.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10">
                  3
                </div>
                <h3 className="text-2xl font-bold">Relax</h3>
                <p className="text-muted-foreground">
                  Your detailer comes to you. Sit back and relax while your car gets the premium care it deserves.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Providers Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-bold">
                Grow Your Detailing Business
              </h2>
              <p className="text-xl text-muted-foreground">
                Join our platform and connect with customers looking for premium car care services.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Set Your Own Prices</h3>
                    <p className="text-muted-foreground">
                      You control your rates and services. Keep 85% of every booking.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Manage Your Schedule</h3>
                    <p className="text-muted-foreground">
                      Work when you want. Accept bookings that fit your availability.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Get Paid Directly</h3>
                    <p className="text-muted-foreground">
                      Secure payments processed through Stripe. Weekly payouts to your account.
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/register">
                  <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-6 min-h-[48px]">
                    Start Earning Today
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-muted to-background border border-border" />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-bold">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of satisfied customers experiencing premium mobile car care.
          </p>
          <div className="pt-4">
            <Link href="/register">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-6 min-h-[48px]">
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
