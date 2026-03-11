import { PageHeader } from '@/components/ui/PageHeader'
import { ForecastTable } from '@/components/forecast/ForecastTable'

export default function ForecastPage() {
  return (
    <>
      <PageHeader
        title="Dự báo doanh số"
        subtitle="Nhập số bát dự kiến bán ngày mai"
      />
      <ForecastTable />
    </>
  )
}
