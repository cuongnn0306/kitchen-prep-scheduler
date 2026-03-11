import { PageHeader } from '@/components/ui/PageHeader'
import { CapacityTable } from '@/components/capacity/CapacityTable'

export default function CapacityPage() {
  return (
    <>
      <PageHeader
        title="Năng suất bếp"
        subtitle="Cấu hình mẻ sơ chế cho từng nguyên liệu"
      />
      <CapacityTable />
    </>
  )
}
