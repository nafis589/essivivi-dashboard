import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
} from 'lucide-react'
import { NavItem } from '../types/navigation.types'

export const mainNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Point de vente', href: '/dashboard/caisse', icon: ShoppingCart },
  { label: 'Produits', href: '/dashboard/produits', icon: Package },
  { label: 'Ventes', href: '/dashboard/ventes', icon: Receipt },
  { label: 'Clients', href: '/dashboard/clients', icon: Users },
  { label: 'Rapports', href: '/dashboard/rapports', icon: BarChart3 },
]

export const secondaryNavItems: NavItem[] = [
  { label: 'Paramètres', href: '/dashboard/parametres', icon: Settings },
  { label: 'Aide', href: '/dashboard/aide', icon: HelpCircle },
]

export const SIDEBAR_WIDTH = 240
export const SIDEBAR_WIDTH_COLLAPSED = 72
export const MOBILE_BREAKPOINT = 768
export const TABLET_BREAKPOINT = 1024
