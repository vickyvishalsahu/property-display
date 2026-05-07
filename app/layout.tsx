import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { HelpPanelProvider } from '@/domains/shared/context/HelpPanelContext'
import { HelpPanel } from '@/domains/shared/components/HelpPanel'
import { GoogleMapsProvider } from '@/domains/shared/providers/GoogleMapsProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Buena',
  description: 'Property management, simplified.',
  icons: { icon: '/buena_logo.png' },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={inter.variable}>
    <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      <GoogleMapsProvider>
      <HelpPanelProvider>
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg tracking-tight">
              Buena
            </Link>
            <Link
              href="/properties/new"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
            Add Property
            </Link>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
        <HelpPanel />
      </HelpPanelProvider>
      </GoogleMapsProvider>
    </body>
  </html>
)

export default RootLayout
