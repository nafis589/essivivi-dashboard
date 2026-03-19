'use client'

import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/lib/store/useSidebarStore'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
  mainNavItems,
  secondaryNavItems,
} from '@/lib/utils/constants'
import { NavGroup } from '../navigation/NavGroup'
import { UserMenu } from '../navigation/UserMenu'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  ChevronLeft,
  ChevronRight,
  X,
  Store,
} from 'lucide-react'

// Mock user data
const mockUser = {
  id: '1',
  name: 'Marie Dupont',
  email: 'marie@flowcommerce.fr',
  company: 'Boulangerie du Coin',
}

export function Sidebar() {
  const pathname = usePathname()
  const sidebarRef = useRef<HTMLElement>(null)
  const { isOpen, isMobileOpen, isMobile, toggleSidebar, closeMobileSidebar, setMobile } =
    useSidebarStore()
  const detectedMobile = useIsMobile()

  if (detectedMobile !== isMobile) {
    setMobile(detectedMobile)
  }

  useClickOutside(sidebarRef, () => {
    if (isMobileOpen) {
      closeMobileSidebar()
    }
  })

  const collapsed = !isMobile && !isOpen

  // ─── Mobile sidebar ───────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeMobileSidebar}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          ref={sidebarRef}
          className={cn(
            'fixed left-0 top-0 z-50 h-full flex flex-col',
            'bg-white border-r border-slate-200',
            'transition-transform duration-300 ease-in-out'
          )}
          style={{ width: SIDEBAR_WIDTH }}
        >
          {/* Logo */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-slate-900 text-sm tracking-tight">
                FlowCommerce
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMobileSidebar}
              className="h-7 w-7 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Company badge */}


          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
            <NavGroup items={mainNavItems} />
            <div className="h-px bg-slate-100 mx-2" />
            <NavGroup items={secondaryNavItems} />
          </div>

          {/* User */}
          <div className="border-t border-slate-100 p-2">
            <UserMenu user={mockUser} />
          </div>
        </aside>
      </>
    )
  }

  // ─── Desktop sidebar ──────────────────────────────────────────────────────
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        ref={sidebarRef}
        className={cn(
          'fixed left-0 top-0 z-30 h-full flex flex-col',
          'bg-white border-r border-slate-200',
          'transition-all duration-300 ease-in-out'
        )}
        style={{ width: isOpen ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_COLLAPSED }}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex items-center h-14 border-b border-slate-100 shrink-0',
            isOpen ? 'justify-between px-4' : 'justify-center px-0'
          )}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            {isOpen && (
              <span className="font-semibold text-slate-900 text-sm tracking-tight whitespace-nowrap">
                FlowCommerce
              </span>
            )}
          </div>
        </div>

        {/* Company badge */}


        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          <NavGroup items={mainNavItems} collapsed={collapsed} />

          <div className={cn('h-px bg-slate-100', collapsed ? 'mx-1' : 'mx-2')} />

          <NavGroup items={secondaryNavItems} collapsed={collapsed} />
        </div>

        {/* Collapse toggle (only visible when collapsed) */}
        {collapsed && (
          <div className="py-2 flex justify-center border-t border-slate-100">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* User */}
        <div className={cn('border-t border-slate-100 p-2', collapsed && 'border-t-0')}>
          <UserMenu user={mockUser} collapsed={collapsed} />
        </div>
      </aside>
    </TooltipProvider>
  )
}
