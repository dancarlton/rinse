import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Rinse — Mobile Car Care',
    template: '%s | Rinse',
  },
  description: 'On-demand mobile car wash and detailing. Find professional detailers near you.',
  keywords: ['car wash', 'car detailing', 'mobile car wash', 'auto detailing', 'on-demand'],
  authors: [{ name: 'Rinse' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rinse-it.vercel.app',
    siteName: 'Rinse',
    title: 'Rinse — Mobile Car Care',
    description: 'On-demand mobile car wash and detailing.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rinse — Mobile Car Care',
    description: 'On-demand mobile car wash and detailing.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  )
}
