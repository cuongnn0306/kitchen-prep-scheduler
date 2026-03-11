// ============================================================
// Kitchen Prep Scheduler — localStorage Helpers
// SSR-safe: tất cả read/write đều check typeof window
// ============================================================

const PREFIX = 'kps_' // kitchen prep scheduler

// ------------------------------------------------------------
// Core helpers
// ------------------------------------------------------------

export function storageGet<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    console.warn(`[storage] Failed to read key "${key}"`)
    return null
  }
}

export function storageSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    console.warn(`[storage] Failed to write key "${key}"`)
  }
}

export function storageRemove(key: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(PREFIX + key)
}

/** Xóa tất cả keys thuộc app (prefix kps_) */
export function storageClearAll(): void {
  if (typeof window === 'undefined') return
  const keysToRemove: string[] = []
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)
    if (key?.startsWith(PREFIX)) keysToRemove.push(key)
  }
  keysToRemove.forEach((k) => window.localStorage.removeItem(k))
}

// ------------------------------------------------------------
// Typed keys — tránh typo khi dùng store
// ------------------------------------------------------------
export const STORAGE_KEYS = {
  INGREDIENTS: 'ingredients',
  DISHES: 'dishes',
  FORECASTS: 'forecasts',
  RECIPES: 'recipes',
  CAPACITIES: 'capacities',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
