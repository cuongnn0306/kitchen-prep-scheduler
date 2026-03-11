// ============================================================
// stores/recipeStore.ts
// ============================================================
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { RecipeEntry, RecipeState } from '@/types'
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage'
import { defaultRecipes } from '@/lib/seedData'

export const useRecipeStore = create<RecipeState>()(
  subscribeWithSelector((set, get) => ({
    recipes: storageGet<RecipeEntry[]>(STORAGE_KEYS.RECIPES) ?? defaultRecipes,

    setRecipeEntry: (entry) => {
      const existing = get().recipes
      const idx = existing.findIndex(
        (r) => r.dishId === entry.dishId && r.ingredientId === entry.ingredientId
      )
      const updated =
        idx >= 0
          ? existing.map((r, i) => (i === idx ? entry : r))
          : [...existing, entry]
      set({ recipes: updated })
      storageSet(STORAGE_KEYS.RECIPES, updated)
    },

    removeRecipeEntry: (dishId, ingredientId) => {
      const updated = get().recipes.filter(
        (r) => !(r.dishId === dishId && r.ingredientId === ingredientId)
      )
      set({ recipes: updated })
      storageSet(STORAGE_KEYS.RECIPES, updated)
    },

    getRecipesForDish: (dishId) =>
      get().recipes.filter((r) => r.dishId === dishId),

    resetToDefaults: () => {
      set({ recipes: defaultRecipes })
      storageSet(STORAGE_KEYS.RECIPES, defaultRecipes)
    },
  }))
)
