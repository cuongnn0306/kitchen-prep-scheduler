'use client'
// ============================================================
// components/ui/KPICard.tsx — Dashboard metric card
// ============================================================
import { cn } from '@/lib/utils'

interface KPICardProps {
  label: string
  value: string | number
  unit?: string
  icon: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'warning' | 'success' | 'brand'
  trend?: string
  className?: string
}

const VARIANTS = {
  default: {
    card: 'bg-white border-stone-100',
    icon: 'bg-stone-100 text-stone-500',
    value: 'text-stone-800',
  },
  brand: {
    card: 'bg-orange-500 border-orange-400',
    icon: 'bg-orange-400 text-white',
    value: 'text-white',
  },
  warning: {
    card: 'bg-red-50 border-red-100',
    icon: 'bg-red-100 text-red-500',
    value: 'text-red-600',
  },
  success: {
    card: 'bg-green-50 border-green-100',
    icon: 'bg-green-100 text-green-600',
    value: 'text-green-700',
  },
}

export function KPICard({
  label,
  value,
  unit,
  icon: Icon,
  variant = 'default',
  trend,
  className,
}: KPICardProps) {
  const styles = VARIANTS[variant]

  return (
    <div
      className={cn(
        'rounded-2xl border p-4 flex items-center gap-4 shadow-sm',
        styles.card,
        className
      )}
    >
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', styles.icon)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn(
          'text-xs font-medium uppercase tracking-wide leading-none mb-1',
          variant === 'brand' ? 'text-orange-100' : 'text-stone-400'
        )}>
          {label}
        </p>
        <div className="flex items-baseline gap-1">
          <span className={cn('font-display font-bold text-2xl leading-none', styles.value)}>
            {value}
          </span>
          {unit && (
            <span className={cn(
              'text-sm font-medium',
              variant === 'brand' ? 'text-orange-100' : 'text-stone-400'
            )}>
              {unit}
            </span>
          )}
        </div>
        {trend && (
          <p className={cn(
            'text-xs mt-1',
            variant === 'brand' ? 'text-orange-100' : 'text-stone-400'
          )}>
            {trend}
          </p>
        )}
      </div>
    </div>
  )
}
