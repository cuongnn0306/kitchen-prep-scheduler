'use client'
// ============================================================
// components/recipes/RecipeEditor.tsx
// Inline-edit bảng định mức: Món ăn × Nguyên liệu
// ============================================================
import { useState } from 'react'
import { BookOpen, Info } from 'lucide-react'
import { useRecipeStore } from '@/stores/recipeStore'
import { useForecastStore } from '@/stores/forecastStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useToast } from '@/components/ui/ToastContainer'
import { cn } from '@/lib/utils'

// ─── Inline Amount Cell ───────────────────────────────────────
interface AmountCellProps {
  dishId: string
  ingredientId: string
  unit: string
}

function AmountCell({ dishId, ingredientId, unit }: AmountCellProps) {
  const recipes = useRecipeStore((s) => s.recipes)
  const setRecipeEntry = useRecipeStore((s) => s.setRecipeEntry)
  const removeRecipeEntry = useRecipeStore((s) => s.removeRecipeEntry)
  const { toast } = useToast()

  const entry = recipes.find(
    (r) => r.dishId === dishId && r.ingredientId === ingredientId
  )

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(entry?.amount ?? ''))

  function handleBlur() {
    const val = parseFloat(draft)
    if (!draft || isNaN(val) || val <= 0) {
      // Xoá entry nếu để trống hoặc = 0
      removeRecipeEntry(dishId, ingredientId)
      setDraft('')
    } else {
      setRecipeEntry({ dishId, ingredientId, amount: val })
      toast('Đã cập nhật định mức', 'success')
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
        autoFocus
        min={0}
        className="w-full h-9 px-2 rounded-lg border border-orange-400 bg-orange-50 text-center text-sm font-bold text-orange-700 focus:outline-none"
      />
    )
  }

  return (
    <button
      onClick={() => {
        setDraft(entry ? String(entry.amount) : '')
        setEditing(true)
      }}
      className={cn(
        'w-full h-9 rounded-lg text-center text-sm font-semibold transition-colors',
        entry
          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
          : 'bg-stone-50 text-stone-300 hover:bg-orange-50 hover:text-orange-400'
      )}
    >
      {entry ? `${entry.amount}` : '—'}
    </button>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export function RecipeEditor() {
  const dishes = useForecastStore((s) => s.dishes)
  const ingredients = useInventoryStore((s) => s.ingredients)

  if (dishes.length === 0 || ingredients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
          <BookOpen className="w-7 h-7 text-orange-400" />
        </div>
        <p className="font-display font-bold text-stone-700 text-lg">Chưa có dữ liệu</p>
        <p className="text-stone-400 text-sm max-w-xs">
          Cần có ít nhất 1 món ăn (trang Dự báo) và 1 nguyên liệu (trang Tồn kho) trước khi thiết lập công thức.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Hint */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-blue-700 text-sm">
          Nhấn vào ô để nhập định mức. Đơn vị tính theo đơn vị sơ chế của từng nguyên liệu.
          Để trống = nguyên liệu không dùng cho món đó.
        </p>
      </div>

      {/* Table — scroll ngang trên mobile */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide w-36 sticky left-0 bg-stone-50">
                  Nguyên liệu
                </th>
                {dishes.map((dish) => (
                  <th
                    key={dish.id}
                    className="px-3 py-3 text-center text-xs font-semibold text-stone-600 min-w-[90px]"
                  >
                    {dish.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing, idx) => (
                <tr
                  key={ing.id}
                  className={cn(
                    'border-b border-stone-50 last:border-0',
                    idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'
                  )}
                >
                  {/* Ingredient name — sticky left */}
                  <td className={cn(
                    'px-4 py-3 sticky left-0',
                    idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'
                  )}>
                    <p className="font-semibold text-stone-700 text-sm leading-tight">
                      {ing.name}
                    </p>
                    <p className="text-stone-400 text-xs">{ing.unit}</p>
                  </td>
                  {/* Amount cells per dish */}
                  {dishes.map((dish) => (
                    <td key={dish.id} className="px-3 py-2">
                      <AmountCell
                        dishId={dish.id}
                        ingredientId={ing.id}
                        unit={ing.unit}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-stone-400 px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-100 inline-block" />
          Có định mức
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-stone-100 inline-block" />
          Chưa thiết lập
        </span>
      </div>
    </div>
  )
}
