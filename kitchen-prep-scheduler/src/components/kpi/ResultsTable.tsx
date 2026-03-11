'use client'
// ============================================================
// components/kpi/ResultsTable.tsx
// Hiển thị kết quả tính toán KPI + trigger calculate
// ============================================================
import { useState } from 'react'
import {
  BarChart3, Calculator, Printer, AlertTriangle,
  CheckCircle2, Clock, Package, ShoppingCart,
  RefreshCw, ChevronDown, ChevronUp,
} from 'lucide-react'
import { useKPIStore } from '@/stores/kpiStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useForecastStore } from '@/stores/forecastStore'
import { useRecipeStore } from '@/stores/recipeStore'
import { useCapacityStore } from '@/stores/capacityStore'
import { formatAmount, formatTime } from '@/lib/calculations'
import { formatDateVN, tomorrowKey } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { IngredientKPI } from '@/types'

function tomorrowKeyLocal(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

// ─── Result Row ───────────────────────────────────────────────
function ResultRow({ item }: { item: IngredientKPI }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden transition-all',
        item.needsRestock
          ? 'border-red-200 bg-red-50'
          : 'border-stone-100 bg-white'
      )}
    >
      {/* Main row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Status icon */}
        {item.needsRestock ? (
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
        )}

        {/* Name */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-semibold text-[15px] leading-tight',
            item.needsRestock ? 'text-red-800' : 'text-stone-800'
          )}>
            {item.ingredient.name}
          </p>
          {item.needsRestock && (
            <p className="text-red-500 text-xs font-medium mt-0.5">
              ⚠ Cần mua thêm
            </p>
          )}
        </div>

        {/* Required amount */}
        <div className="text-right flex-shrink-0">
          <p className={cn(
            'font-display font-bold text-lg leading-none',
            item.needsRestock ? 'text-red-700' : 'text-stone-800'
          )}>
            {item.requiredAmount > 0
              ? formatAmount(item.requiredAmount, item.ingredient)
              : '—'}
          </p>
          <p className={cn('text-xs mt-0.5', item.needsRestock ? 'text-red-400' : 'text-stone-400')}>
            cần sơ chế
          </p>
        </div>

        {expanded
          ? <ChevronUp className="w-4 h-4 text-stone-300 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-stone-300 flex-shrink-0" />
        }
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className={cn(
          'grid grid-cols-3 gap-0 border-t text-center',
          item.needsRestock ? 'border-red-200' : 'border-stone-100'
        )}>
          {[
            {
              icon: Package,
              label: 'Tồn kho còn',
              value: item.stockAfter >= 0
                ? formatAmount(item.stockAfter, item.ingredient)
                : `−${formatAmount(Math.abs(item.stockAfter), item.ingredient)}`,
              danger: item.stockAfter < 0,
            },
            {
              icon: RefreshCw,
              label: 'Số mẻ',
              value: item.batches > 0 ? `${item.batches} mẻ` : '—',
              danger: false,
            },
            {
              icon: Clock,
              label: 'Thời gian',
              value: formatTime(item.totalTime),
              danger: false,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={cn(
                'py-3 px-2',
                i < 2 ? (item.needsRestock ? 'border-r border-red-200' : 'border-r border-stone-100') : ''
              )}
            >
              <stat.icon className={cn(
                'w-4 h-4 mx-auto mb-1',
                stat.danger ? 'text-red-400' : 'text-stone-400'
              )} />
              <p className={cn(
                'font-display font-bold text-base leading-none',
                stat.danger ? 'text-red-600' : 'text-stone-700'
              )}>
                {stat.value}
              </p>
              <p className="text-stone-400 text-[11px] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export function ResultsTable() {
  const { result, isCalculating, calculate } = useKPIStore()
  const ingredients = useInventoryStore((s) => s.ingredients)
  const forecasts = useForecastStore((s) => s.forecasts)
  const recipes = useRecipeStore((s) => s.recipes)
  const capacities = useCapacityStore((s) => s.capacities)

  const [calcDate, setCalcDate] = useState(tomorrowKeyLocal())

  function handleCalculate() {
    const entries = forecasts[calcDate] ?? []
    calculate(calcDate, ingredients, entries, recipes, capacities)
  }

  // ─ Empty state ─
  if (!result && !isCalculating) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-200">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <div>
          <p className="font-display font-bold text-xl text-stone-800">Chưa có kết quả</p>
          <p className="text-stone-500 text-sm mt-1 max-w-xs">
            Nhấn "Tính toán" để xem lượng cần chuẩn bị và lịch trình sơ chế
          </p>
        </div>

        {/* Date selector */}
        <div className="flex flex-col items-center gap-2">
          <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
            Tính cho ngày
          </label>
          <input
            type="date"
            value={calcDate}
            onChange={(e) => setCalcDate(e.target.value)}
            className="h-11 px-4 rounded-xl border border-stone-200 text-stone-700 font-medium focus:outline-none focus:border-orange-400 bg-white text-sm"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="flex items-center gap-2 h-12 px-8 rounded-2xl bg-orange-500 text-white font-bold text-base shadow-md shadow-orange-200 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95"
        >
          <Calculator className="w-5 h-5" />
          Tính toán ngay
        </button>
      </div>
    )
  }

  // ─ Loading ─
  if (isCalculating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
          <Calculator className="w-8 h-8 text-orange-400 animate-spin" />
        </div>
        <p className="text-stone-500 font-medium">Đang tính toán...</p>
      </div>
    )
  }

  // ─ Results ─
  const restockItems = result!.items.filter((i) => i.needsRestock)
  const prepItems = result!.items.filter((i) => !i.needsRestock && i.requiredAmount > 0)
  const stockOkItems = result!.items.filter((i) => !i.needsRestock && i.requiredAmount === 0)

  return (
    <div className="space-y-5 print-show">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-orange-500 rounded-2xl p-4 text-white">
          <Clock className="w-5 h-5 text-orange-200 mb-2" />
          <p className="font-display font-bold text-3xl leading-none">
            {formatTime(result!.totalTimeSequential)}
          </p>
          <p className="text-orange-100 text-xs mt-1">Tổng thời gian</p>
        </div>
        <div className={cn(
          'rounded-2xl p-4',
          result!.restockCount > 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
        )}>
          <ShoppingCart className={cn(
            'w-5 h-5 mb-2',
            result!.restockCount > 0 ? 'text-red-400' : 'text-green-400'
          )} />
          <p className={cn(
            'font-display font-bold text-3xl leading-none',
            result!.restockCount > 0 ? 'text-red-700' : 'text-green-700'
          )}>
            {result!.restockCount}
          </p>
          <p className={cn(
            'text-xs mt-1',
            result!.restockCount > 0 ? 'text-red-400' : 'text-green-500'
          )}>
            {result!.restockCount > 0 ? 'Cần mua thêm' : 'Đủ nguyên liệu'}
          </p>
        </div>
      </div>

      {/* Date + recalculate */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Tính cho</p>
          <p className="font-semibold text-stone-700 text-sm">
            {formatDateVN(result!.date)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="print-hide flex items-center gap-1.5 h-9 px-3 rounded-xl border border-stone-200 text-stone-500 text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> In
          </button>
          <button
            onClick={handleCalculate}
            className="print-hide flex items-center gap-1.5 h-9 px-3 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Tính lại
          </button>
        </div>
      </div>

      {/* Restock needed */}
      {restockItems.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-sm font-bold text-red-600 uppercase tracking-wide mb-2">
            <AlertTriangle className="w-4 h-4" />
            Cần mua thêm ({restockItems.length})
          </h2>
          <div className="space-y-2 stagger">
            {restockItems.map((item) => (
              <ResultRow key={item.ingredient.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Need prep */}
      {prepItems.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-2">
            Cần sơ chế ({prepItems.length})
          </h2>
          <div className="space-y-2 stagger">
            {prepItems.map((item) => (
              <ResultRow key={item.ingredient.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Stock OK */}
      {stockOkItems.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-sm font-bold text-green-600 uppercase tracking-wide mb-2">
            <CheckCircle2 className="w-4 h-4" />
            Đủ tồn kho ({stockOkItems.length})
          </h2>
          <div className="space-y-2">
            {stockOkItems.map((item) => (
              <ResultRow key={item.ingredient.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {result!.items.length === 0 && (
        <div className="text-center py-10 text-stone-400">
          Không có dữ liệu dự báo cho ngày này.
        </div>
      )}
    </div>
  )
}
