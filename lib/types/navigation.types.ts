import { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string | number
}

export interface NavGroup {
  title?: string
  items: NavItem[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  company?: string
}
