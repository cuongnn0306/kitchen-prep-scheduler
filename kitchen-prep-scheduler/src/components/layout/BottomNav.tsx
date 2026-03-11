'use client'
// ============================================================
// components/layout/BottomNav.tsx
// Mobile bottom navigation — 5 tabs chính
// ============================================================
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  PackageSearch,
  TrendingUp,
  BarChart3,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const BOTTOM_NAV = [
  { href: '/dashboard',  label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/inventory',  label: 'Tồn kho',   icon: PackageSearch },
  { href: '/forecast',   label: 'Dự báo',    icon: TrendingUp },
  { href: '/kpi',        label: 'Kết quả',   icon: BarChart3 },
  { href: '/recipes',    label: 'Khác',      icon: MoreHorizontal },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      <div className="flex items-stretch h-16">
        {BOTTOM_NAV.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
                isActive ? 'text-orange-500' : 'text-stone-400'
              )}
            >
              {/* Active indicator dot */}
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-orange-500" />
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium',
                  isActive ? 'text-orange-500' : 'text-stone-400'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
