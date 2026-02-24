import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find a Detailer',
  description: 'Search for professional mobile car detailers near you. Compare prices, ratings, and availability.',
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
