// ============================================================
// Kitchen Prep Scheduler — KPI Calculation Engine
// ============================================================
import type {
  Ingredient,
  ForecastEntry,
  RecipeEntry,
  KitchenCapacity,
  IngredientKPI,
  KPIResult,
} from '@/types'

// ------------------------------------------------------------
// Helper: tổng lượng cần dùng cho 1 nguyên liệu (tính theo `unit`)
// Duyệt tất cả các món, cộng dồn: số bát × định mức
// ------------------------------------------------------------
function calcTotalRequired(
  ingredientId: string,
  forecasts: ForecastEntry[],
  recipes: RecipeEntry[]
): number {
  return forecasts.reduce((sum, forecast) => {
    const recipe = recipes.find(
      (r) => r.dishId === forecast.dishId && r.ingredientId === ingredientId
    )
    if (!recipe) return sum
    return sum + forecast.bowls * recipe.amount
  }, 0)
}

// ------------------------------------------------------------
// Core: tính KPI cho 1 nguyên liệu
// ------------------------------------------------------------
function calcIngredientKPI(
  ingredient: Ingredient,
  totalRequired: number,
  capacity: KitchenCapacity | undefined
): IngredientKPI {
  // Tồn kho sau khi dùng — âm nghĩa là thiếu (cần mua thêm)
  const stockAfter = ingredient.currentStock - totalRequired

  // Lượng thực sự cần sơ chế = phần vượt quá tồn kho (hoặc 0 nếu đủ)
  const requiredAmount = Math.max(0, totalRequired - ingredient.currentStock)

  let batches = 0
  let totalTime = 0

  if (capacity && requiredAmount > 0) {
    // Số mẻ = làm tròn lên (luôn đủ số lượng)
    batches = Math.ceil(requiredAmount / capacity.batchSize)
    totalTime = batches * capacity.batchTime
  }

  return {
    ingredient,
    requiredAmount,
    stockAfter,
    batches,
    totalTime,
    needsRestock: stockAfter < 0,
  }
}

// ------------------------------------------------------------
// Main: tính toàn bộ KPI cho ngày đã chọn
// ------------------------------------------------------------
export function calculateKPI(
  date: string,
  ingredients: Ingredient[],
  forecasts: ForecastEntry[],
  recipes: RecipeEntry[],
  capacities: KitchenCapacity[]
): KPIResult {
  // Không có dự báo → trả về kết quả rỗng
  if (forecasts.length === 0) {
    return {
      date,
      items: [],
      totalTimeSequential: 0,
      restockCount: 0,
      calculatedAt: new Date().toISOString(),
    }
  }

  const items: IngredientKPI[] = ingredients.map((ingredient) => {
    const totalRequired = calcTotalRequired(ingredient.id, forecasts, recipes)
    const capacity = capacities.find((c) => c.ingredientId === ingredient.id)
    return calcIngredientKPI(ingredient, totalRequired, capacity)
  })

  // Chỉ hiển thị nguyên liệu có liên quan (có trong công thức hoặc cần mua thêm)
  const relevantItems = items.filter((item) => {
    const isUsed = recipes.some((r) => r.ingredientId === item.ingredient.id)
    return isUsed || item.needsRestock
  })

  // Tổng thời gian tuần tự (làm lần lượt từng nguyên liệu)
  const totalTimeSequential = relevantItems.reduce(
    (sum, item) => sum + item.totalTime,
    0
  )

  const restockCount = relevantItems.filter((item) => item.needsRestock).length

  return {
    date,
    items: relevantItems,
    totalTimeSequential,
    restockCount,
    calculatedAt: new Date().toISOString(),
  }
}

// ------------------------------------------------------------
// Utility: format số lượng với đơn vị (tự động quy đổi nếu > threshold)
// Vd: 1500g → "1.5 kg", 800g → "800 g"
// ------------------------------------------------------------
export function formatAmount(amount: number, ingredient: Ingredient): string {
  if (ingredient.conversionRate > 1 && amount >= ingredient.conversionRate) {
    const converted = amount / ingredient.conversionRate
    // Làm tròn 2 chữ số thập phân nếu cần
    const formatted = Number.isInteger(converted)
      ? converted.toString()
      : converted.toFixed(2)
    return `${formatted} ${ingredient.storageUnit}`
  }
  return `${amount} ${ingredient.unit}`
}

// ------------------------------------------------------------
// Utility: format thời gian phút → "X giờ Y phút" nếu >= 60
// ------------------------------------------------------------
export function formatTime(minutes: number): string {
  if (minutes === 0) return '—'
  if (minutes < 60) return `${minutes} phút`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins === 0 ? `${hours} giờ` : `${hours} giờ ${mins} phút`
}

// ------------------------------------------------------------
// Utility: tính % tồn kho so với lượng cần dùng (dùng cho progress bar)
// ------------------------------------------------------------
export function stockCoveragePercent(
  currentStock: number,
  totalRequired: number
): number {
  if (totalRequired === 0) return 100
  return Math.min(100, Math.round((currentStock / totalRequired) * 100))
}
