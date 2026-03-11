// ============================================================
// stores/kpiStore.ts
// ============================================================
import { create } from 'zustand'
import type {
  KPIState,
  Ingredient,
  ForecastEntry,
  RecipeEntry,
  KitchenCapacity,
} from '@/types'
import { calculateKPI } from '@/lib/calculations'

export const useKPIStore = create<KPIState>()((set) => ({
  result: null,
  isCalculating: false,

  calculate: (date, ingredients, forecasts, recipes, capacities) => {
    set({ isCalculating: true })
    // Wrap in setTimeout để UI có thể render spinner trước
    setTimeout(() => {
      try {
        const result = calculateKPI(date, ingredients, forecasts, recipes, capacities)
        set({ result, isCalculating: false })
      } catch (err) {
        console.error('[kpiStore] Calculation failed:', err)
        set({ isCalculating: false })
      }
    }, 50)
  },

  clearResult: () => set({ result: null }),
}))
