import type { Metadata, Viewport } from 'next'
import { Outfit, Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kitchen Prep Scheduler',
  description: 'Quản lý bếp thông minh cho quán bún, phở, cháo',
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#f97316',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${outfit.variable} ${beVietnam.variable}`}>
      <body className="font-body bg-amber-50 text-stone-800 antialiased">
        {children}
      </body>
    </html>
  )
}
