// ============================================================
// stores/inventoryStore.ts
// ============================================================
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { Ingredient, InventoryState } from '@/types'
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage'
import { defaultIngredients } from '@/lib/seedData'

let nextId = Date.now()
const genId = () => String(++nextId)

function loadIngredients(): Ingredient[] {
  return storageGet<Ingredient[]>(STORAGE_KEYS.INGREDIENTS) ?? defaultIngredients
}

export const useInventoryStore = create<InventoryState>()(
  subscribeWithSelector((set, get) => ({
    ingredients: loadIngredients(),

    addIngredient: (ingredient) => {
      const newItem: Ingredient = { ...ingredient, id: genId() }
      const updated = [...get().ingredients, newItem]
      set({ ingredients: updated })
      storageSet(STORAGE_KEYS.INGREDIENTS, updated)
    },

    updateIngredient: (id, updates) => {
      const updated = get().ingredients.map((ing) =>
        ing.id === id ? { ...ing, ...updates } : ing
      )
      set({ ingredients: updated })
      storageSet(STORAGE_KEYS.INGREDIENTS, updated)
    },

    removeIngredient: (id) => {
      const updated = get().ingredients.filter((ing) => ing.id !== id)
      set({ ingredients: updated })
      storageSet(STORAGE_KEYS.INGREDIENTS, updated)
    },

    resetToDefaults: () => {
      set({ ingredients: defaultIngredients })
      storageSet(STORAGE_KEYS.INGREDIENTS, defaultIngredients)
    },
  }))
)
