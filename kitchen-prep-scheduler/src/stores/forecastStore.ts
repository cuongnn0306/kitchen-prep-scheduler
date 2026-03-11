// ============================================================
// stores/forecastStore.ts
// ============================================================
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { Dish, ForecastEntry, DailyForecast, ForecastState } from '@/types'
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage'
import { defaultDishes, getDefaultDailyForecast } from '@/lib/seedData'

let nextId = Date.now()
const genId = () => String(++nextId)

export const useForecastStore = create<ForecastState>()(
  subscribeWithSelector((set, get) => ({
    dishes: storageGet<Dish[]>(STORAGE_KEYS.DISHES) ?? defaultDishes,
    forecasts: storageGet<DailyForecast>(STORAGE_KEYS.FORECASTS) ?? getDefaultDailyForecast(),

    setForecast: (date, entries) => {
      const updated = { ...get().forecasts, [date]: entries }
      set({ forecasts: updated })
      storageSet(STORAGE_KEYS.FORECASTS, updated)
    },

    updateBowls: (date, dishId, bowls) => {
      const existing = get().forecasts[date] ?? []
      const hasEntry = existing.some((e) => e.dishId === dishId)
      const updated: ForecastEntry[] = hasEntry
        ? existing.map((e) => (e.dishId === dishId ? { ...e, bowls } : e))
        : [...existing, { dishId, bowls }]
      const newForecasts = { ...get().forecasts, [date]: updated }
      set({ forecasts: newForecasts })
      storageSet(STORAGE_KEYS.FORECASTS, newForecasts)
    },

    addDish: (dish) => {
      const newDish: Dish = { ...dish, id: genId() }
      const updated = [...get().dishes, newDish]
      set({ dishes: updated })
      storageSet(STORAGE_KEYS.DISHES, updated)
    },

    removeDish: (id) => {
      const updated = get().dishes.filter((d) => d.id !== id)
      set({ dishes: updated })
      storageSet(STORAGE_KEYS.DISHES, updated)
    },

    resetToDefaults: () => {
      set({ dishes: defaultDishes, forecasts: getDefaultDailyForecast() })
      storageSet(STORAGE_KEYS.DISHES, defaultDishes)
      storageSet(STORAGE_KEYS.FORECASTS, getDefaultDailyForecast())
    },
  }))
)
