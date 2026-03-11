'use client'
// ============================================================
// components/ui/PageHeader.tsx — Reusable page title block
// ============================================================
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      <div>
        <h1 className="font-display font-bold text-2xl text-stone-800 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-stone-500 text-sm mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
