// ============================================================
// app/layout.tsx — Root Layout
// ============================================================
import type { Metadata, Viewport } from 'next'
import { Outfit, Noto_Sans_Vietnamese } from 'next/font/google'
import './globals.css'

// Display font — dùng cho headings, KPI numbers
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

// Body font — hỗ trợ tiếng Việt đầy đủ
const notoSansVi = Noto_Sans_Vietnamese({
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
  maximumScale: 1, // Tắt pinch-zoom trên mobile để UX nhất quán
  themeColor: '#f97316', // orange-500
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${outfit.variable} ${notoSansVi.variable}`}>
      <body className="font-body bg-amber-50 text-stone-800 antialiased">
        {children}
      </body>
    </html>
  )
}
