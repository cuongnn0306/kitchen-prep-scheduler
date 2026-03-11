'use client'
// ============================================================
// components/capacity/CapacityTable.tsx
// Cấu hình mẻ sơ chế: Batch Size + Batch Time per nguyên liệu
// ============================================================
import { useState } from 'react'
import { Gauge, Clock, Save } from 'lucide-react'
import { useCapacityStore } from '@/stores/capacityStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useToast } from '@/components/ui/ToastContainer'
import { formatTime } from '@/lib/calculations'
import { cn } from '@/lib/utils'
import type { Ingredient } from '@/types'

// ─── Editable Row ─────────────────────────────────────────────
function CapacityRow({ ingredient }: { ingredient: Ingredient }) {
  const getCapacity = useCapacityStore((s) => s.getCapacity)
  const setCapacity = useCapacityStore((s) => s.setCapacity)
  const { toast } = useToast()

  const existing = getCapacity(ingredient.id)

  const [batchSize, setBatchSize] = useState(String(existing?.batchSize ?? ''))
  const [batchTime, setBatchTime] = useState(String(existing?.batchTime ?? ''))
  const [dirty, setDirty] = useState(false)

  function handleChange(
    setter: (v: string) => void,
    value: string
  ) {
    setter(value)
    setDirty(true)
  }

  function handleSave() {
    const size = parseFloat(batchSize)
    const time = parseFloat(batchTime)
    if (!size || !time || size <= 0 || time <= 0) return
    setCapacity({ ingredientId: ingredient.id, batchSize: size, batchTime: time })
    setDirty(false)
    toast(`Đã lưu năng suất ${ingredient.name}`, 'success')
  }

  // Tính thời gian preview nếu đủ data
  const previewBatches =
    batchSize && batchTime ? Math.ceil(100 / parseFloat(batchSize)) : null
  const previewTime =
    previewBatches && batchTime
      ? previewBatches * parseFloat(batchTime)
      : null

  const inputCls =
    'w-full h-11 px-3 rounded-xl border text-stone-800 text-center font-display font-bold text-lg focus:outline-none transition-colors bg-white'

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 space-y-3 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-stone-800 text-[15px] leading-tight">
            {ingredient.name}
          </p>
          <p className="text-stone-400 text-xs mt-0.5">đơn vị: {ingredient.unit}</p>
        </div>
        {existing && !dirty && (
          <span className="text-xs bg-green-100 text-green-600 font-semibold px-2.5 py-1 rounded-full">
            Đã cấu hình
          </span>
        )}
        {dirty && (
          <span className="text-xs bg-amber-100 text-amber-600 font-semibold px-2.5 py-1 rounded-full">
            Chưa lưu
          </span>
        )}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
            Số lượng / mẻ ({ingredient.unit})
          </label>
          <input
            type="number"
            value={batchSize}
            onChange={(e) => handleChange(setBatchSize, e.target.value)}
            placeholder="vd: 500"
            min={1}
            className={cn(
              inputCls,
              batchSize
                ? 'border-orange-300 bg-orange-50'
                : 'border-stone-200'
            )}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
            Thời gian / mẻ (phút)
          </label>
          <input
            type="number"
            value={batchTime}
            onChange={(e) => handleChange(setBatchTime, e.target.value)}
            placeholder="vd: 15"
            min={1}
            className={cn(
              inputCls,
              batchTime
                ? 'border-orange-300 bg-orange-50'
                : 'border-stone-200'
            )}
          />
        </div>
      </div>

      {/* Preview + Save */}
      <div className="flex items-center justify-between gap-3">
        {previewTime !== null ? (
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>
              100 {ingredient.unit} → {previewBatches} mẻ ·{' '}
              <strong className="text-stone-700">{formatTime(previewTime)}</strong>
            </span>
          </div>
        ) : (
          <div />
        )}

        <button
          onClick={handleSave}
          disabled={!batchSize || !batchTime || !dirty}
          className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-orange-500 text-white text-sm font-semibold disabled:opacity-30 hover:bg-orange-600 transition-colors flex-shrink-0"
        >
          <Save className="w-3.5 h-3.5" /> Lưu
        </button>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export function CapacityTable() {
  const ingredients = useInventoryStore((s) => s.ingredients)
  const capacities = useCapacityStore((s) => s.capacities)

  if (ingredients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
          <Gauge className="w-7 h-7 text-orange-400" />
        </div>
        <p className="font-display font-bold text-stone-700">Chưa có nguyên liệu</p>
        <p className="text-stone-400 text-sm">Thêm nguyên liệu ở trang Tồn kho trước.</p>
      </div>
    )
  }

  const configuredCount = capacities.length
  const totalCount = ingredients.length

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="bg-white rounded-2xl border border-stone-100 px-4 py-3 flex items-center gap-3">
        <Gauge className="w-5 h-5 text-orange-400 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-stone-600 font-medium">Đã cấu hình</span>
            <span className="font-display font-bold text-stone-800">
              {configuredCount} / {totalCount}
            </span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${(configuredCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-2 stagger">
        {ingredients.map((ing) => (
          <CapacityRow key={ing.id} ingredient={ing} />
        ))}
      </div>
    </div>
  )
}
