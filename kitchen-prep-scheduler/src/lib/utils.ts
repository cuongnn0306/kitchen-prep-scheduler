// ============================================================
// lib/utils.ts — Utility helpers
// ============================================================
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely (shadcn/ui convention) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Tạo unique ID (dùng khi không có nanoid) */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/** Format ngày VN: "Thứ Hai, 13/05/2025" */
export function formatDateVN(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/** Format ngày ngắn: "13/05" */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

/** Lấy key ngày hôm nay: "YYYY-MM-DD" */
export function todayKey(): string {
  return new Date().toISOString().split('T')[0]
}

/** Lấy key ngày mai */
export function tomorrowKey(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}
