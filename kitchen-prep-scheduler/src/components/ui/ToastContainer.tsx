'use client'
// ============================================================
// components/ui/ToastContainer.tsx + hooks/useToast.ts
// Global toast notification system
// ============================================================
import { create } from 'zustand'
import { useEffect } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Toast, ToastType } from '@/types'

// ------------------------------------------------------------
// Internal store (không cần persist)
// ------------------------------------------------------------
interface ToastStore {
  toasts: Toast[]
  add: (message: string, type: ToastType, duration?: number) => void
  remove: (id: string) => void
}

const useToastStore = create<ToastStore>()((set, get) => ({
  toasts: [],
  add: (message, type, duration = 3000) => {
    const id = String(Date.now())
    set({ toasts: [...get().toasts, { id, message, type, duration }] })
    setTimeout(() => get().remove(id), duration)
  },
  remove: (id) =>
    set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))

// ------------------------------------------------------------
// Hook dùng trong components
// ------------------------------------------------------------
export function useToast() {
  const add = useToastStore((s) => s.add)
  return {
    toast: (message: string, type: ToastType = 'info', duration?: number) =>
      add(message, type, duration),
  }
}

// ------------------------------------------------------------
// Icon map
// ------------------------------------------------------------
const ICONS: Record<ToastType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertCircle,
  info:    Info,
}

const STYLES: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info:    'bg-blue-50 border-blue-200 text-blue-800',
}

const ICON_STYLES: Record<ToastType, string> = {
  success: 'text-green-500',
  error:   'text-red-500',
  warning: 'text-amber-500',
  info:    'text-blue-500',
}

// ------------------------------------------------------------
// Container (mount 1 lần trong layout)
// ------------------------------------------------------------
export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const remove = useToastStore((s) => s.remove)

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const Icon = ICONS[t.type]
        return (
          <div
            key={t.id}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg',
              'min-w-[240px] max-w-[340px] pointer-events-auto',
              'animate-slide-up',
              STYLES[t.type]
            )}
          >
            <Icon className={cn('w-5 h-5 flex-shrink-0', ICON_STYLES[t.type])} />
            <p className="text-sm font-medium flex-1">{t.message}</p>
            <button
              onClick={() => remove(t.id)}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
