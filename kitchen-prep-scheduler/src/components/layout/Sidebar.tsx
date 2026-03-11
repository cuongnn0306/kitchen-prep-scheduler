'use client'
// ============================================================
// components/layout/Sidebar.tsx
// Desktop sidebar — Icon + Label, highlight active route
// ============================================================
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  PackageSearch,
  TrendingUp,
  BookOpen,
  Gauge,
  BarChart3,
  RotateCcw,
  ChefHat,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ResetDataButton } from '@/components/layout/ResetDataButton'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Tổng quan',
    icon: LayoutDashboard,
    description: 'KPI & tóm tắt',
  },
  {
    href: '/inventory',
    label: 'Tồn kho',
    icon: PackageSearch,
    description: 'Nhập số lượng',
  },
  {
    href: '/forecast',
    label: 'Dự báo',
    icon: TrendingUp,
    description: 'Số bát ngày mai',
  },
  {
    href: '/recipes',
    label: 'Công thức',
    icon: BookOpen,
    description: 'Định mức nguyên liệu',
  },
  {
    href: '/capacity',
    label: 'Năng suất',
    icon: Gauge,
    description: 'Mẻ & thời gian',
  },
  {
    href: '/kpi',
    label: 'Kết quả',
    icon: BarChart3,
    description: 'Lịch trình sơ chế',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-dvh bg-white border-r border-orange-100 shadow-sm sticky top-0">
      {/* Logo / App name */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-orange-100">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-md shadow-orange-200 flex-shrink-0">
          <ChefHat className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-display font-bold text-stone-800 leading-tight text-[15px]">
            Kitchen Prep
          </p>
          <p className="text-[11px] text-stone-400 font-medium tracking-wide uppercase">
            Scheduler
          </p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group',
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'text-stone-600 hover:bg-orange-50 hover:text-orange-600'
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110',
                  isActive ? 'text-white' : 'text-stone-400 group-hover:text-orange-500'
                )}
              />
              <div className="min-w-0">
                <p
                  className={cn(
                    'text-[14px] font-semibold leading-tight',
                    isActive ? 'text-white' : 'text-stone-700'
                  )}
                >
                  {item.label}
                </p>
                <p
                  className={cn(
                    'text-[11px] leading-tight mt-0.5',
                    isActive ? 'text-orange-100' : 'text-stone-400'
                  )}
                >
                  {item.description}
                </p>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Reset data button — bottom of sidebar */}
      <div className="px-3 pb-5 pt-2 border-t border-orange-100">
        <ResetDataButton />
      </div>
    </aside>
  )
}
