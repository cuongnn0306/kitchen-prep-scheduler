import { PageHeader } from '@/components/ui/PageHeader'
import { ResultsTable } from '@/components/kpi/ResultsTable'

export default function KPIPage() {
  return (
    <>
      <PageHeader
        title="Kết quả & Lịch trình"
        subtitle="Tính toán lượng cần chuẩn bị và thời gian sơ chế"
      />
      <ResultsTable />
    </>
  )
}
