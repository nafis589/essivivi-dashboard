'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/lib/store/useSidebarStore'
import { useIsMobile } from '@/hooks/use-mobile'
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from '@/lib/utils/constants'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const { isOpen, isMobile, setMobile, closeMobileSidebar } = useSidebarStore()
  const detectedMobile = useIsMobile()

  useEffect(() => {
    setMobile(detectedMobile)
  }, [detectedMobile, setMobile])

  useEffect(() => {
    closeMobileSidebar()
  }, [pathname, closeMobileSidebar])

  const isActuallyMobile = detectedMobile || isMobile
  const mainMarginLeft = isActuallyMobile ? 0 : isOpen ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_COLLAPSED

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div
        className={cn(
          'min-h-screen flex flex-col',
          'transition-all duration-300 ease-in-out'
        )}
        style={{ marginLeft: mainMarginLeft }}
      >
        <Header pathname={pathname} />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
