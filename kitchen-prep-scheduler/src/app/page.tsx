// ============================================================
// app/page.tsx — Redirect root → /dashboard
// ============================================================
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/dashboard')
}
