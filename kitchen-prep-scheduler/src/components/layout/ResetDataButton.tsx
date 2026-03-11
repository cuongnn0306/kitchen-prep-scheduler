'use client'
// ============================================================
// components/layout/ResetDataButton.tsx
// Reset về seed data với confirm dialog
// ============================================================
import { useState } from 'react'
import { RotateCcw, AlertTriangle } from 'lucide-react'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useForecastStore } from '@/stores/forecastStore'
import { useRecipeStore } from '@/stores/recipeStore'
import { useCapacityStore } from '@/stores/capacityStore'
import { useKPIStore } from '@/stores/kpiStore'
import { useToast } from '@/hooks/useToast'

export function ResetDataButton() {
  const [open, setOpen] = useState(false)

  const resetInventory  = useInventoryStore((s) => s.resetToDefaults)
  const resetForecast   = useForecastStore((s) => s.resetToDefaults)
  const resetRecipes    = useRecipeStore((s) => s.resetToDefaults)
  const resetCapacity   = useCapacityStore((s) => s.resetToDefaults)
  const clearKPI        = useKPIStore((s) => s.clearResult)
  const { toast }       = useToast()

  function handleReset() {
    resetInventory()
    resetForecast()
    resetRecipes()
    resetCapacity()
    clearKPI()
    setOpen(false)
    toast('Đã reset về dữ liệu mặc định', 'success')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors text-[13px] font-medium"
      >
        <RotateCcw className="w-4 h-4 flex-shrink-0" />
        Reset dữ liệu
      </button>

      {/* Confirm dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-slide-up">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <h3 className="font-display font-bold text-stone-800 text-lg">
                  Reset dữ liệu?
                </h3>
                <p className="text-stone-500 text-sm mt-1">
                  Tất cả dữ liệu hiện tại sẽ bị xóa và thay bằng dữ liệu mẫu. Hành động này không thể hoàn tác.
                </p>
              </div>

              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 h-11 rounded-xl border border-stone-200 text-stone-600 font-semibold text-sm hover:bg-stone-50 transition-colors"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 h-11 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
                >
                  Reset ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
