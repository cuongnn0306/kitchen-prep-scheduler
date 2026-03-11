'use client'
// ============================================================
// components/ui/Keypad.tsx
// Touch-friendly number keypad — không dùng <input> thường
// Dùng cho Inventory (nhập tồn kho) và Forecast (nhập số bát)
// ============================================================
import { useCallback } from 'react'
import { Delete, CornerDownLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KeypadProps {
  value: string
  onChange: (value: string) => void
  onConfirm?: () => void
  maxLength?: number
  allowDecimal?: boolean
  className?: string
}

const MAX_DEFAULT = 8

export function Keypad({
  value,
  onChange,
  onConfirm,
  maxLength = MAX_DEFAULT,
  allowDecimal = true,
  className,
}: KeypadProps) {
  const handleKey = useCallback(
    (key: string) => {
      if (key === 'DEL') {
        onChange(value.slice(0, -1) || '0')
        return
      }
      if (key === 'CONFIRM') {
        onConfirm?.()
        return
      }
      // Chặn nhiều dấu chấm
      if (key === '.' && value.includes('.')) return
      // Chặn số 0 đầu (trừ "0.")
      if (key !== '.' && value === '0') {
        onChange(key)
        return
      }
      // Giới hạn độ dài
      if (value.length >= maxLength) return
      onChange(value + key)
    },
    [value, onChange, onConfirm, maxLength]
  )

  const KEYS = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    [allowDecimal ? '.' : null, '0', 'DEL'],
  ]

  return (
    <div className={cn('select-none', className)}>
      {/* Display */}
      <div className="bg-stone-800 rounded-2xl px-5 py-4 mb-3 flex items-end justify-end gap-1 min-h-[72px]">
        <span className="font-display text-4xl font-bold text-white tracking-tight leading-none">
          {value || '0'}
        </span>
      </div>

      {/* Keys grid */}
      <div className="grid grid-cols-3 gap-2">
        {KEYS.flat().map((key, i) => {
          if (key === null) {
            // Ô trống (khi allowDecimal = false)
            return <div key={`empty-${i}`} />
          }
          if (key === 'DEL') {
            return (
              <KeyButton
                key="del"
                onPress={() => handleKey('DEL')}
                variant="danger"
                aria-label="Xóa"
              >
                <Delete className="w-5 h-5" />
              </KeyButton>
            )
          }
          return (
            <KeyButton
              key={key}
              onPress={() => handleKey(key)}
              variant={key === '.' ? 'secondary' : 'default'}
            >
              {key}
            </KeyButton>
          )
        })}

        {/* Confirm button — chiếm full width */}
        {onConfirm && (
          <KeyButton
            onPress={() => handleKey('CONFIRM')}
            variant="confirm"
            className="col-span-3 mt-1"
            aria-label="Xác nhận"
          >
            <span className="flex items-center gap-2">
              <CornerDownLeft className="w-4 h-4" />
              Xác nhận
            </span>
          </KeyButton>
        )}
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// Internal KeyButton
// ------------------------------------------------------------
interface KeyButtonProps {
  onPress: () => void
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'danger' | 'confirm'
  className?: string
  'aria-label'?: string
}

function KeyButton({
  onPress,
  children,
  variant = 'default',
  className,
  'aria-label': ariaLabel,
}: KeyButtonProps) {
  const base =
    'flex items-center justify-center h-14 rounded-xl font-display font-semibold text-xl transition-all duration-100 active:scale-95 select-none touch-none'

  const variants = {
    default:
      'bg-white text-stone-800 shadow-sm border border-stone-100 hover:bg-orange-50 hover:border-orange-200 active:bg-orange-100',
    secondary:
      'bg-amber-50 text-stone-600 border border-amber-200 hover:bg-amber-100 active:bg-amber-200',
    danger:
      'bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 active:bg-red-200',
    confirm:
      'bg-orange-500 text-white shadow-md shadow-orange-200 hover:bg-orange-600 active:bg-orange-700 text-base',
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onPointerDown={(e) => {
        e.preventDefault() // ngăn focus vào button, giữ focus trên display
        onPress()
      }}
      className={cn(base, variants[variant], className)}
    >
      {children}
    </button>
  )
}
