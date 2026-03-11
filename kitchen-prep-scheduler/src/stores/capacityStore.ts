// ============================================================
// stores/capacityStore.ts
// ============================================================
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { KitchenCapacity, CapacityState } from '@/types'
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage'
import { defaultCapacity } from '@/lib/seedData'

export const useCapacityStore = create<CapacityState>()(
  subscribeWithSelector((set, get) => ({
    capacities: storageGet<KitchenCapacity[]>(STORAGE_KEYS.CAPACITIES) ?? defaultCapacity,

    setCapacity: (entry) => {
      const existing = get().capacities
      const idx = existing.findIndex((c) => c.ingredientId === entry.ingredientId)
      const updated =
        idx >= 0
          ? existing.map((c, i) => (i === idx ? entry : c))
          : [...existing, entry]
      set({ capacities: updated })
      storageSet(STORAGE_KEYS.CAPACITIES, updated)
    },

    removeCapacity: (ingredientId) => {
      const updated = get().capacities.filter(
        (c) => c.ingredientId !== ingredientId
      )
      set({ capacities: updated })
      storageSet(STORAGE_KEYS.CAPACITIES, updated)
    },

    getCapacity: (ingredientId) =>
      get().capacities.find((c) => c.ingredientId === ingredientId),

    resetToDefaults: () => {
      set({ capacities: defaultCapacity })
      storageSet(STORAGE_KEYS.CAPACITIES, defaultCapacity)
    },
  }))
)
