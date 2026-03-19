'use client'

import { Button } from '@/components/ui/button'
import { UserMenu } from '../navigation/UserMenu'
import { useSidebarStore } from '@/lib/store/useSidebarStore'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import {
  Menu,
  PanelLeftClose,
  PanelLeft,
  Bell,
  Search,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { useState } from 'react'

// Mock user data
const mockUser = {
  id: '1',
  name: 'Marie Dupont',
  email: 'marie@flowcommerce.fr',
  company: 'Boulangerie du Coin',
}

// Page titles mapping
const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': { title: 'Tableau de bord', subtitle: 'Vue d\'ensemble de votre activité' },
  '/dashboard/caisse': { title: 'Point de vente', subtitle: 'Terminal de caisse' },
  '/dashboard/produits': { title: 'Produits', subtitle: 'Gérez votre catalogue' },
  '/dashboard/ventes': { title: 'Ventes', subtitle: 'Historique et analytics' },
  '/dashboard/clients': { title: 'Clients', subtitle: 'Base clientèle' },
  '/dashboard/rapports': { title: 'Rapports', subtitle: 'Analyses & tendances' },
  '/dashboard/parametres': { title: 'Paramètres', subtitle: 'Configuration du compte' },
  '/dashboard/aide': { title: 'Aide', subtitle: 'Documentation & support' },
}

interface HeaderProps {
  pathname: string
}

export function Header({ pathname }: HeaderProps) {
  const { isOpen, isMobile, toggleSidebar, toggleMobileSidebar } = useSidebarStore()
  const detectedMobile = useIsMobile()
  const [isOnline] = useState(true)
  const [hasNotifications] = useState(true)

  const isActuallyMobile = detectedMobile || isMobile
  const page = pageTitles[pathname] || { title: 'FlowCommerce' }

  return (
    <header className="sticky top-0 z-50 h-14 bg-white/95 backdrop-blur-sm border-b border-slate-100 flex items-center justify-between px-4 gap-4">

      {/* Left: toggle + breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={isActuallyMobile ? toggleMobileSidebar : toggleSidebar}
          className="h-8 w-8 shrink-0 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
        >
          {isActuallyMobile ? (
            <Menu className="h-4.5 w-4.5" style={{ width: '18px', height: '18px' }} />
          ) : isOpen ? (
            <PanelLeftClose className="h-4.5 w-4.5" style={{ width: '18px', height: '18px' }} />
          ) : (
            <PanelLeft className="h-4.5 w-4.5" style={{ width: '18px', height: '18px' }} />
          )}
        </Button>

        {/* Divider */}
        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* Page title */}
        <div className="hidden sm:block min-w-0">
          <h1 className="text-sm font-semibold text-slate-900 truncate">{page.title}</h1>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5 shrink-0">

        {/* Online badge */}
        <div
          className={cn(
            'hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border',
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-amber-50 text-amber-700 border-amber-100'
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              isOnline ? 'bg-emerald-500' : 'bg-amber-500'
            )}
          />
          {isOnline ? 'En ligne' : 'Hors-ligne'}
        </div>

        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
        >
          <Bell className="h-4 w-4" />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-indigo-600 rounded-full ring-1 ring-white" />
          )}
        </Button>

        {/* Divider */}
        <div className="h-4 w-px bg-slate-200 hidden md:block mx-0.5" />

        {/* User menu */}
        <div className="hidden md:block">
          <UserMenu user={mockUser} />
        </div>
      </div>
    </header>
  )
}
