'use client'
// ============================================================
// app/(main)/dashboard/page.tsx
// ============================================================
import Link from 'next/link'
import {
  PackageSearch, TrendingUp, Clock, ShoppingCart,
  Calculator, ArrowRight, ChefHat, Flame,
} from 'lucide-react'
import { useKPIStore } from '@/stores/kpiStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useForecastStore } from '@/stores/forecastStore'
import { useRecipeStore } from '@/stores/recipeStore'
import { useCapacityStore } from '@/stores/capacityStore'
import { KPICard } from '@/components/ui/KPICard'
import { formatTime, formatAmount } from '@/lib/calculations'
import { formatDateVN } from '@/lib/utils'

function tomorrowKey(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function DashboardPage() {
  const { result, isCalculating, calculate } = useKPIStore()
  const ingredients = useInventoryStore((s) => s.ingredients)
  const { dishes, forecasts } = useForecastStore()
  const recipes = useRecipeStore((s) => s.recipes)
  const capacities = useCapacityStore((s) => s.capacities)

  const tomorrow = tomorrowKey()
  const tomorrowForecast = forecasts[tomorrow] ?? []
  const totalBowls = tomorrowForecast.reduce((s, e) => s + e.bowls, 0)
  const lowStockCount = ingredients.filter((i) => i.currentStock === 0).length

  function handleCalculate() {
    calculate(tomorrow, ingredients, tomorrowForecast, recipes, capacities)
  }

  const now = new Date()
  const greeting =
    now.getHours() < 11 ? 'Chào buổi sáng' :
    now.getHours() < 17 ? 'Chào buổi chiều' : 'Chào buổi tối'

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center shadow-md shadow-orange-200 flex-shrink-0">
          <ChefHat className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-stone-800 leading-tight">
            {greeting}! 👋
          </h1>
          <p className="text-stone-400 text-sm">{formatDateVN(new Date())}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <KPICard label="Dự báo ngày mai" value={totalBowls} unit="bát" icon={TrendingUp}
          variant={totalBowls > 0 ? 'brand' : 'default'} trend={`${dishes.length} món ăn`} />
        <KPICard label="Tồn kho trống" value={lowStockCount} unit="NL" icon={PackageSearch}
          variant={lowStockCount > 0 ? 'warning' : 'success'} trend={`/ ${ingredients.length} nguyên liệu`} />
        <KPICard label="Thời gian sơ chế" value={result ? formatTime(result.totalTimeSequential) : '—'}
          icon={Clock} variant="default" trend={result ? 'Đã tính' : 'Chưa tính toán'} />
        <KPICard label="Cần mua thêm" value={result?.restockCount ?? '—'}
          unit={result ? 'NL' : ''} icon={ShoppingCart}
          variant={result?.restockCount ? 'warning' : 'success'}
          trend={result ? (result.restockCount > 0 ? 'Cần đặt hàng' : 'Đủ nguyên liệu') : 'Chưa tính toán'} />
      </div>

      {/* Calculate CTA */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-5 text-white shadow-lg shadow-orange-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-200" />
              <span className="text-orange-100 text-xs font-semibold uppercase tracking-wide">Tính toán nhanh</span>
            </div>
            <h2 className="font-display font-bold text-xl leading-tight">
              {result ? 'Tính lại lịch trình' : 'Tính lịch trình sơ chế'}
            </h2>
            <p className="text-orange-100 text-sm mt-1">Dựa trên {totalBowls} bát dự báo ngày mai</p>
          </div>
          <button onClick={handleCalculate} disabled={isCalculating || totalBowls === 0}
            className="flex items-center gap-2 h-11 px-5 rounded-2xl bg-white text-orange-600 font-bold text-sm shadow-md disabled:opacity-50 hover:bg-orange-50 transition-all active:scale-95 flex-shrink-0">
            <Calculator className="w-4 h-4" />
            {isCalculating ? 'Đang tính...' : 'Tính ngay'}
          </button>
        </div>
      </div>

      {/* Result summary */}
      {result && result.items.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display font-bold text-stone-700 text-base flex items-center justify-between">
            Tóm tắt cần chuẩn bị
            <Link href="/kpi" className="flex items-center gap-1 text-orange-500 text-sm font-semibold hover:underline">
              Xem chi tiết <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </h2>
          <div className="space-y-2">
            {result.items.filter((i) => i.requiredAmount > 0 || i.needsRestock).slice(0, 4).map((item) => (
              <div key={item.ingredient.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${item.needsRestock ? 'bg-red-50 border-red-200' : 'bg-white border-stone-100'}`}>
                <div className={`w-2 h-8 rounded-full flex-shrink-0 ${item.needsRestock ? 'bg-red-400' : 'bg-green-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-800 text-sm">{item.ingredient.name}</p>
                  {item.needsRestock && <p className="text-red-500 text-xs">Cần mua thêm</p>}
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-stone-800 text-sm">
                    {formatAmount(item.requiredAmount, item.ingredient)}
                  </p>
                  {item.totalTime > 0 && <p className="text-stone-400 text-xs">{formatTime(item.totalTime)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="space-y-3">
        <h2 className="font-display font-bold text-stone-700 text-base">Truy cập nhanh</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: '/inventory', icon: PackageSearch, label: 'Cập nhật tồn kho', color: 'bg-blue-50 text-blue-600 border-blue-100' },
            { href: '/forecast', icon: TrendingUp, label: 'Nhập dự báo', color: 'bg-amber-50 text-amber-600 border-amber-100' },
            { href: '/recipes', icon: ChefHat, label: 'Xem công thức', color: 'bg-green-50 text-green-600 border-green-100' },
            { href: '/kpi', icon: Clock, label: 'Lịch trình chi tiết', color: 'bg-purple-50 text-purple-600 border-purple-100' },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border font-medium text-sm hover:brightness-95 transition-all active:scale-95 ${item.color}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
