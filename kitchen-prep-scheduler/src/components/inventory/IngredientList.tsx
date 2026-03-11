'use client'
// ============================================================
// components/inventory/IngredientList.tsx
// Danh sách nguyên liệu — tap để mở keypad nhập tồn kho
// ============================================================
import { useState } from 'react'
import { Plus, PackageSearch, Pencil, Trash2, ChevronRight } from 'lucide-react'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useToast } from '@/components/ui/ToastContainer'
import { Keypad } from '@/components/ui/Keypad'
import { formatAmount } from '@/lib/calculations'
import { cn } from '@/lib/utils'
import type { Ingredient } from '@/types'

// ─── Keypad Sheet ────────────────────────────────────────────
interface KeypadSheetProps {
  ingredient: Ingredient
  onClose: () => void
}

function KeypadSheet({ ingredient, onClose }: KeypadSheetProps) {
  const updateIngredient = useInventoryStore((s) => s.updateIngredient)
  const { toast } = useToast()

  // Hiển thị tồn kho theo storageUnit (vd: kg thay vì g)
  const initialDisplay =
    ingredient.conversionRate > 1
      ? String(ingredient.currentStock / ingredient.conversionRate)
      : String(ingredient.currentStock)

  const [raw, setRaw] = useState(initialDisplay === '0' ? '0' : initialDisplay)

  function handleConfirm() {
    const numVal = parseFloat(raw) || 0
    // Quy đổi về unit gốc
    const inUnit =
      ingredient.conversionRate > 1
        ? Math.round(numVal * ingredient.conversionRate)
        : numVal
    updateIngredient(ingredient.id, { currentStock: inUnit })
    toast(`Đã cập nhật ${ingredient.name}`, 'success')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end lg:justify-center lg:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl p-5 w-full lg:max-w-sm animate-slide-up">
        {/* Handle (mobile) */}
        <div className="w-10 h-1 rounded-full bg-stone-200 mx-auto mb-4 lg:hidden" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-stone-800">
              {ingredient.name}
            </h3>
            <p className="text-stone-400 text-sm">
              Nhập tồn kho theo {ingredient.storageUnit}
            </p>
          </div>
          <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2.5 py-1 rounded-full">
            {ingredient.storageUnit}
          </span>
        </div>

        <Keypad
          value={raw}
          onChange={setRaw}
          onConfirm={handleConfirm}
          allowDecimal={ingredient.conversionRate > 1}
        />
      </div>
    </div>
  )
}

// ─── Add / Edit Ingredient Modal ─────────────────────────────
interface IngredientFormProps {
  initial?: Ingredient
  onClose: () => void
}

const UNIT_OPTIONS = ['g', 'ml', 'miếng', 'cái', 'quả', 'lít', 'kg']
const STORAGE_UNIT_OPTIONS = ['g', 'kg', 'ml', 'lít', 'miếng', 'cái', 'quả']

function IngredientForm({ initial, onClose }: IngredientFormProps) {
  const addIngredient = useInventoryStore((s) => s.addIngredient)
  const updateIngredient = useInventoryStore((s) => s.updateIngredient)
  const { toast } = useToast()

  const [name, setName] = useState(initial?.name ?? '')
  const [unit, setUnit] = useState(initial?.unit ?? 'g')
  const [storageUnit, setStorageUnit] = useState(initial?.storageUnit ?? 'kg')
  const [conversionRate, setConversionRate] = useState(
    String(initial?.conversionRate ?? 1000)
  )

  function handleSubmit() {
    if (!name.trim()) return
    const data = {
      name: name.trim(),
      unit,
      storageUnit,
      conversionRate: parseFloat(conversionRate) || 1,
      currentStock: initial?.currentStock ?? 0,
    }
    if (initial) {
      updateIngredient(initial.id, data)
      toast(`Đã cập nhật ${name}`, 'success')
    } else {
      addIngredient(data)
      toast(`Đã thêm ${name}`, 'success')
    }
    onClose()
  }

  const inputCls =
    'w-full h-11 px-3 rounded-xl border border-stone-200 text-stone-800 text-sm font-medium focus:outline-none focus:border-orange-400 bg-stone-50'
  const labelCls = 'block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5'

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm animate-slide-up">
        <h3 className="font-display font-bold text-xl text-stone-800 mb-5">
          {initial ? 'Sửa nguyên liệu' : 'Thêm nguyên liệu'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>Tên nguyên liệu</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="vd: Thịt heo, Rau muống..."
              className={inputCls}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Đơn vị sơ chế</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className={inputCls}>
                {UNIT_OPTIONS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Đơn vị lưu kho</label>
              <select value={storageUnit} onChange={(e) => setStorageUnit(e.target.value)} className={inputCls}>
                {STORAGE_UNIT_OPTIONS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>
              Hệ số quy đổi (1 {storageUnit} = ? {unit})
            </label>
            <input
              type="number"
              value={conversionRate}
              onChange={(e) => setConversionRate(e.target.value)}
              className={inputCls}
              min={1}
            />
            <p className="text-xs text-stone-400 mt-1">
              vd: 1 kg = 1000 g → nhập 1000
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-stone-200 text-stone-600 font-semibold text-sm hover:bg-stone-50">
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex-1 h-11 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 disabled:opacity-40 transition-colors"
          >
            {initial ? 'Lưu thay đổi' : 'Thêm mới'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────
export function IngredientList() {
  const ingredients = useInventoryStore((s) => s.ingredients)
  const removeIngredient = useInventoryStore((s) => s.removeIngredient)
  const { toast } = useToast()

  const [keypadTarget, setKeypadTarget] = useState<Ingredient | null>(null)
  const [editTarget, setEditTarget] = useState<Ingredient | null | 'new'>('new' as any)
  const [showForm, setShowForm] = useState(false)
  const [formInitial, setFormInitial] = useState<Ingredient | undefined>()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function openAdd() {
    setFormInitial(undefined)
    setShowForm(true)
  }

  function openEdit(ing: Ingredient) {
    setFormInitial(ing)
    setShowForm(true)
  }

  function handleDelete(id: string) {
    removeIngredient(id)
    setConfirmDelete(null)
    toast('Đã xoá nguyên liệu', 'success')
  }

  if (ingredients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
          <PackageSearch className="w-8 h-8 text-orange-400" />
        </div>
        <div>
          <p className="font-display font-bold text-stone-700 text-lg">Chưa có nguyên liệu</p>
          <p className="text-stone-400 text-sm mt-1">Thêm nguyên liệu đầu tiên để bắt đầu</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 h-11 px-5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" /> Thêm nguyên liệu
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2 stagger">
        {ingredients.map((ing) => (
          <div
            key={ing.id}
            className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden animate-slide-up"
          >
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-orange-50 transition-colors"
              onClick={() => setKeypadTarget(ing)}
            >
              {/* Stock indicator */}
              <div className={cn(
                'w-2 h-12 rounded-full flex-shrink-0',
                ing.currentStock > 0 ? 'bg-green-400' : 'bg-red-400'
              )} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-800 text-[15px] leading-tight">{ing.name}</p>
                <p className="text-stone-400 text-sm mt-0.5">
                  Đơn vị: {ing.unit} · Lưu kho: {ing.storageUnit}
                </p>
              </div>

              {/* Stock value */}
              <div className="text-right flex-shrink-0">
                <p className="font-display font-bold text-xl text-stone-800 leading-none">
                  {ing.conversionRate > 1
                    ? (ing.currentStock / ing.conversionRate).toLocaleString('vi-VN', { maximumFractionDigits: 2 })
                    : ing.currentStock.toLocaleString('vi-VN')}
                </p>
                <p className="text-stone-400 text-xs mt-0.5">{ing.storageUnit}</p>
              </div>

              <ChevronRight className="w-4 h-4 text-stone-300 flex-shrink-0" />
            </div>

            {/* Actions */}
            <div className="flex border-t border-stone-100">
              <button
                onClick={() => openEdit(ing)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-stone-500 hover:text-orange-500 hover:bg-orange-50 transition-colors text-sm font-medium"
              >
                <Pencil className="w-3.5 h-3.5" /> Sửa
              </button>
              <div className="w-px bg-stone-100" />
              <button
                onClick={() => setConfirmDelete(ing.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-stone-500 hover:text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xoá
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAB Add button */}
      <button
        onClick={openAdd}
        className="fixed bottom-24 right-5 lg:bottom-8 lg:right-8 w-14 h-14 rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-200 flex items-center justify-center hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 animate-pulse-warm z-30"
        aria-label="Thêm nguyên liệu"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Keypad sheet */}
      {keypadTarget && (
        <KeypadSheet
          ingredient={keypadTarget}
          onClose={() => setKeypadTarget(null)}
        />
      )}

      {/* Add/Edit form */}
      {showForm && (
        <IngredientForm
          initial={formInitial}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs text-center animate-slide-up">
            <p className="font-semibold text-stone-800 mb-1">Xoá nguyên liệu?</p>
            <p className="text-stone-500 text-sm mb-5">Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-11 rounded-xl border border-stone-200 text-stone-600 font-semibold text-sm">Huỷ</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 h-11 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600">Xoá</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
