// ============================================================
// Kitchen Prep Scheduler — Default Seed Data
// ============================================================
import type {
  Ingredient,
  Dish,
  RecipeEntry,
  KitchenCapacity,
  ForecastEntry,
  DailyForecast,
} from '@/types'

// ------------------------------------------------------------
// Nguyên liệu mặc định
// ------------------------------------------------------------
export const defaultIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Thịt bò',
    unit: 'g',
    storageUnit: 'kg',
    conversionRate: 1000,
    currentStock: 2000, // 2 kg tồn kho
  },
  {
    id: '2',
    name: 'Đậu phụ',
    unit: 'miếng',
    storageUnit: 'miếng',
    conversionRate: 1,
    currentStock: 50,
  },
  {
    id: '3',
    name: 'Nước dùng',
    unit: 'ml',
    storageUnit: 'lít',
    conversionRate: 1000,
    currentStock: 15000, // 15 lít
  },
  {
    id: '4',
    name: 'Bún tươi',
    unit: 'g',
    storageUnit: 'kg',
    conversionRate: 1000,
    currentStock: 3000, // 3 kg
  },
]

// ------------------------------------------------------------
// Món ăn mặc định
// ------------------------------------------------------------
export const defaultDishes: Dish[] = [
  { id: '1', name: 'Bún Riêu' },
  { id: '2', name: 'Bún Ốc' },
]

// ------------------------------------------------------------
// Công thức mặc định (gram/ml per bát)
// ------------------------------------------------------------
export const defaultRecipes: RecipeEntry[] = [
  // Bún Riêu
  { dishId: '1', ingredientId: '1', amount: 150 }, // 150g thịt bò
  { dishId: '1', ingredientId: '3', amount: 400 }, // 400ml nước dùng
  { dishId: '1', ingredientId: '4', amount: 200 }, // 200g bún tươi
  // Bún Ốc
  { dishId: '2', ingredientId: '3', amount: 500 }, // 500ml nước dùng
  { dishId: '2', ingredientId: '4', amount: 200 }, // 200g bún tươi
]

// ------------------------------------------------------------
// Năng suất bếp mặc định
// ------------------------------------------------------------
export const defaultCapacity: KitchenCapacity[] = [
  { ingredientId: '1', batchSize: 500, batchTime: 15 },    // 500g/mẻ, 15 phút
  { ingredientId: '2', batchSize: 25, batchTime: 12 },     // 25 miếng/mẻ, 12 phút
  { ingredientId: '3', batchSize: 10000, batchTime: 30 },  // 10 lít/mẻ, 30 phút
  { ingredientId: '4', batchSize: 2000, batchTime: 5 },    // 2 kg/mẻ, 5 phút (trụng bún)
]

// ------------------------------------------------------------
// Dự báo mặc định (ngày hôm nay)
// ------------------------------------------------------------
export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0] // "YYYY-MM-DD"
}

export function getDefaultForecastEntries(): ForecastEntry[] {
  return [
    { dishId: '1', bowls: 40 }, // 40 bát Bún Riêu
    { dishId: '2', bowls: 30 }, // 30 bát Bún Ốc
  ]
}

export function getDefaultDailyForecast(): DailyForecast {
  return {
    [getTodayKey()]: getDefaultForecastEntries(),
  }
}

// ------------------------------------------------------------
// Seed bundle — dùng khi reset toàn bộ app
// ------------------------------------------------------------
export const SEED_DATA = {
  ingredients: defaultIngredients,
  dishes: defaultDishes,
  recipes: defaultRecipes,
  capacities: defaultCapacity,
  forecasts: getDefaultDailyForecast(),
} as const
