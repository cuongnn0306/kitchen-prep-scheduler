'use client'
// ============================================================
// components/forecast/ForecastTable.tsx
// Nhập số bát dự kiến bán cho từng món — với keypad sheet
// ============================================================
import { useState } from 'react'
import { Plus, Trash2, TrendingUp, ChevronRight } from 'lucide-react'
import { useForecastStore } from '@/stores/forecastStore'
import { useToast } from '@/components/ui/ToastContainer'
import { Keypad } from '@/components/ui/Keypad'
import { todayKey } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Dish } from '@/types'

// Dự báo cho ngày mai
function tomorrowKey(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

function formatDateLabel(key: string): string {
  const d = new Date(key + 'T00:00:00')
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  })
}

// ─── Bowl Keypad Sheet ────────────────────────────────────────
interface BowlSheetProps {
  dish: Dish
  date: string
  currentBowls: number
  onClose: () => void
}

function BowlSheet({ dish, date, currentBowls, onClose }: BowlSheetProps) {
  const updateBowls = useForecastStore((s) => s.updateBowls)
  const { toast } = useToast()
  const [raw, setRaw] = useState(String(currentBowls || 0))

  function handleConfirm() {
    const bowls = parseInt(raw) || 0
    updateBowls(date, dish.id, bowls)
    toast(`Đã cập nhật ${dish.name}: ${bowls} bát`, 'success')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end lg:justify-center lg:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl p-5 w-full lg:max-w-sm animate-slide-up">
        <div className="w-10 h-1 rounded-full bg-stone-200 mx-auto mb-4 lg:hidden" />
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-stone-800">{dish.name}</h3>
            <p className="text-stone-400 text-sm">{formatDateLabel(date)}</p>
          </div>
          <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2.5 py-1 rounded-full">
            bát
          </span>
        </div>
        <Keypad
          value={raw}
          onChange={setRaw}
          onConfirm={handleConfirm}
          allowDecimal={false}
          maxLength={4}
        />
      </div>
    </div>
  )
}

// ─── Add Dish Form ────────────────────────────────────────────
function AddDishForm({ onClose }: { onClose: () => void }) {
  const addDish = useForecastStore((s) => s.addDish)
  const { toast } = useToast()
  const [name, setName] = useState('')

  function handleAdd() {
    if (!name.trim()) return
    addDish({ name: name.trim() })
    toast(`Đã thêm món ${name}`, 'success')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm animate-slide-up">
        <h3 className="font-display font-bold text-xl text-stone-800 mb-4">Thêm món ăn</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="vd: Phở bò, Cháo gà..."
          autoFocus
          className="w-full h-12 px-4 rounded-xl border border-stone-200 text-stone-800 font-medium focus:outline-none focus:border-orange-400 bg-stone-50 text-[15px]"
        />
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-stone-200 text-stone-600 font-semibold text-sm">Huỷ</button>
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="flex-1 h-11 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 disabled:opacity-40 transition-colors"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────
export function ForecastTable() {
  const dishes = useForecastStore((s) => s.dishes)
  const forecasts = useForecastStore((s) => s.forecasts)
  const removeDish = useForecastStore((s) => s.removeDish)
  const { toast } = useToast()

  const [activeDate, setActiveDate] = useState(tomorrowKey())
  const [sheetTarget, setSheetTarget] = useState<Dish | null>(null)
  const [showAddDish, setShowAddDish] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const todayEntries = forecasts[activeDate] ?? []

  function getBowls(dishId: string): number {
    return todayEntries.find((e) => e.dishId === dishId)?.bowls ?? 0
  }

  function totalBowls(): number {
    return todayEntries.reduce((s, e) => s + e.bowls, 0)
  }

  function handleDeleteDish(id: string) {
    removeDish(id)
    setConfirmDelete(null)
    toast('Đã xoá món ăn', 'success')
  }

  // Date tabs — hôm nay và ngày mai
  const DATE_TABS = [
    { key: tomorrowKey(), label: 'Ngày mai' },
    { key: todayKey(), label: 'Hôm nay' },
  ]

  return (
    <>
      {/* Date tabs */}
      <div className="flex gap-2 mb-5">
        {DATE_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveDate(tab.key)}
            className={cn(
              'flex-1 h-10 rounded-xl text-sm font-semibold transition-all',
              activeDate === tab.key
                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                : 'bg-white text-stone-500 border border-stone-200 hover:border-orange-300'
            )}
          >
            {tab.label}
            <span className="block text-[11px] font-normal opacity-70">
              {formatDateLabel(tab.key)}
            </span>
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4">
        <TrendingUp className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <div>
          <span className="text-stone-600 text-sm">Tổng dự báo: </span>
          <span className="font-display font-bold text-stone-800 text-lg">
            {totalBowls()}
          </span>
          <span className="text-stone-500 text-sm"> bát · {dishes.length} món</span>
        </div>
      </div>

      {/* Dish list */}
      <div className="space-y-2 stagger">
        {dishes.map((dish) => {
          const bowls = getBowls(dish.id)
          return (
            <div
              key={dish.id}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden animate-slide-up"
            >
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-orange-50 transition-colors"
                onClick={() => setSheetTarget(dish)}
              >
                <div className={cn(
                  'w-2 h-12 rounded-full flex-shrink-0',
                  bowls > 0 ? 'bg-orange-400' : 'bg-stone-200'
                )} />
                <div className="flex-1">
                  <p className="font-semibold text-stone-800 text-[15px]">{dish.name}</p>
                  <p className="text-stone-400 text-sm mt-0.5">Nhấn để nhập số bát</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-display font-bold text-2xl text-stone-800 leading-none">
                    {bowls}
                  </span>
                  <p className="text-stone-400 text-xs">bát</p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300 flex-shrink-0" />
              </div>

              <div className="border-t border-stone-100">
                <button
                  onClick={() => setConfirmDelete(dish.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xoá món
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add dish button */}
      <button
        onClick={() => setShowAddDish(true)}
        className="fixed bottom-24 right-5 lg:bottom-8 lg:right-8 w-14 h-14 rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-200 flex items-center justify-center hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 z-30"
        aria-label="Thêm món ăn"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Bowl keypad */}
      {sheetTarget && (
        <BowlSheet
          dish={sheetTarget}
          date={activeDate}
          currentBowls={getBowls(sheetTarget.id)}
          onClose={() => setSheetTarget(null)}
        />
      )}

      {/* Add dish */}
      {showAddDish && <AddDishForm onClose={() => setShowAddDish(false)} />}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs text-center animate-slide-up">
            <p className="font-semibold text-stone-800 mb-1">Xoá món ăn?</p>
            <p className="text-stone-500 text-sm mb-5">Công thức liên quan cũng sẽ bị xoá.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-11 rounded-xl border border-stone-200 text-stone-600 font-semibold text-sm">Huỷ</button>
              <button onClick={() => handleDeleteDish(confirmDelete)} className="flex-1 h-11 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600">Xoá</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
