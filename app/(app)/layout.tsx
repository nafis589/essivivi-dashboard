'use client'

import { AppShell } from '@/components/shared/layout/AppShell'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Note: Authentication check would go here in a real app
  // For now, we just render the app shell

  return <AppShell>{children}</AppShell>
}
