'use client'

import { NavGroup as NavGroupType } from '@/lib/types/navigation.types'
import { NavItem } from './NavItem'
import { cn } from '@/lib/utils'

interface NavGroupProps {
  title?: string
  items: NavGroupType['items']
  collapsed?: boolean
}

export function NavGroup({ title, items, collapsed }: NavGroupProps) {
  return (
    <div className="space-y-1">
      {title && !collapsed && (
        <h3 className="px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {items.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
          badge={item.badge}
          collapsed={collapsed}
        />
      ))}
    </div>
  )
}
