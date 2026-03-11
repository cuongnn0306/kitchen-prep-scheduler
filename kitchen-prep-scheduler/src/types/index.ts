// ============================================================
// Kitchen Prep Scheduler — Central Type Definitions
// ============================================================

// ------------------------------------------------------------
// Ingredient (Nguyên liệu)
// ------------------------------------------------------------
export interface Ingredient {
  id: string
  name: string
  /** Đơn vị sơ chế, dùng trong công thức — vd: g, ml, miếng */
  unit: string
  /** Đơn vị lưu kho — vd: kg, lít */
  storageUnit: string
  /** Hệ số quy đổi: 1 storageUnit = conversionRate unit — vd: 1 kg = 1000 g */
  conversionRate: number
  /** Tồn kho hiện tại, tính theo `unit` */
  currentStock: number
}

// ------------------------------------------------------------
// Dish (Món ăn)
// ------------------------------------------------------------
export interface Dish {
  id: string
  name: string
}

// ------------------------------------------------------------
// Recipe Entry (Định mức nguyên liệu cho 1 bát)
// ------------------------------------------------------------
export interface RecipeEntry {
  dishId: string
  ingredientId: string
  /** Định mức tính theo `unit` của nguyên liệu, per bát */
  amount: number
}

// ------------------------------------------------------------
// Kitchen Capacity (Năng suất bếp cho từng nguyên liệu)
// ------------------------------------------------------------
export interface KitchenCapacity {
  ingredientId: string
  /** Số lượng xử lý được mỗi mẻ, tính theo `unit` của nguyên liệu */
  batchSize: number
  /** Thời gian mỗi mẻ (phút) */
  batchTime: number
}

// ------------------------------------------------------------
// Forecast Entry (Dự báo số bát cho 1 món trong 1 ngày)
// ------------------------------------------------------------
export interface ForecastEntry {
  dishId: string
  /** Số bát dự kiến bán */
  bowls: number
}

/** Dữ liệu dự báo theo ngày, key: "YYYY-MM-DD" */
export type DailyForecast = Record<string, ForecastEntry[]>

// ------------------------------------------------------------
// KPI Calculation (Kết quả tính toán)
// ------------------------------------------------------------

/** Kết quả cho từng nguyên liệu */
export interface IngredientKPI {
  ingredient: Ingredient
  /** Tổng lượng cần sơ chế = (dự báo × định mức) - tồn kho, tính theo `unit` */
  requiredAmount: number
  /** Tồn kho còn lại sau khi trừ (âm = cần mua thêm) */
  stockAfter: number
  /** Số mẻ cần làm (CEIL) */
  batches: number
  /** Tổng thời gian ước tính (phút) */
  totalTime: number
  /** true nếu cần mua thêm nguyên liệu */
  needsRestock: boolean
}

/** Kết quả tổng hợp toàn bộ */
export interface KPIResult {
  date: string
  items: IngredientKPI[]
  /** Tổng thời gian nếu làm tuần tự (phút) */
  totalTimeSequential: number
  /** Số nguyên liệu cần mua thêm */
  restockCount: number
  calculatedAt: string
}

// ------------------------------------------------------------
// Store slices (shape dùng trong Zustand)
// ------------------------------------------------------------

export interface InventoryState {
  ingredients: Ingredient[]
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => void
  updateIngredient: (id: string, updates: Partial<Ingredient>) => void
  removeIngredient: (id: string) => void
  resetToDefaults: () => void
}

export interface ForecastState {
  forecasts: DailyForecast
  dishes: Dish[]
  setForecast: (date: string, entries: ForecastEntry[]) => void
  updateBowls: (date: string, dishId: string, bowls: number) => void
  addDish: (dish: Omit<Dish, 'id'>) => void
  removeDish: (id: string) => void
  resetToDefaults: () => void
}

export interface RecipeState {
  recipes: RecipeEntry[]
  setRecipeEntry: (entry: RecipeEntry) => void
  removeRecipeEntry: (dishId: string, ingredientId: string) => void
  getRecipesForDish: (dishId: string) => RecipeEntry[]
  resetToDefaults: () => void
}

export interface CapacityState {
  capacities: KitchenCapacity[]
  setCapacity: (entry: KitchenCapacity) => void
  removeCapacity: (ingredientId: string) => void
  getCapacity: (ingredientId: string) => KitchenCapacity | undefined
  resetToDefaults: () => void
}

export interface KPIState {
  result: KPIResult | null
  isCalculating: boolean
  calculate: (
    date: string,
    ingredients: Ingredient[],
    forecasts: ForecastEntry[],
    recipes: RecipeEntry[],
    capacities: KitchenCapacity[]
  ) => void
  clearResult: () => void
}

// ------------------------------------------------------------
// UI helpers
// ------------------------------------------------------------

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

/** Các route trong sidebar */
export type AppRoute =
  | '/dashboard'
  | '/inventory'
  | '/forecast'
  | '/recipes'
  | '/capacity'
  | '/kpi'
