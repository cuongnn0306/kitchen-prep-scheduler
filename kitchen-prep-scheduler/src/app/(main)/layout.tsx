// ============================================================
// app/(main)/layout.tsx — Shell layout: Sidebar + Content
// Wrap tất cả các page thực sự (dashboard, inventory, v.v.)
// ============================================================
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { ToastContainer } from '@/components/ui/ToastContainer'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh bg-amber-50">
      {/* Sidebar — desktop only (lg+) */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Page content */}
        <div className="flex-1 p-4 lg:p-6 max-w-4xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Bottom nav — mobile only */}
      <BottomNav />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  )
}
