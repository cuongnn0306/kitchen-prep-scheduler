import { PageHeader } from '@/components/ui/PageHeader'
import { IngredientList } from '@/components/inventory/IngredientList'

export default function InventoryPage() {
  return (
    <>
      <PageHeader
        title="Tồn kho"
        subtitle="Nhấn vào nguyên liệu để cập nhật số lượng"
      />
      <IngredientList />
    </>
  )
}
