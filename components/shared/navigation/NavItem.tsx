'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NavItem as NavItemType } from '@/lib/types/navigation.types'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface NavItemProps {
  href: string
  icon: NavItemType['icon']
  label: string
  badge?: string | number
  collapsed?: boolean
}

export function NavItem({
  href,
  icon: Icon,
  label,
  badge,
  collapsed,
}: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  const content = (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 rounded-xl text-sm transition-all duration-150',
        'px-2.5 py-2',
        isActive
          ? 'bg-indigo-50 text-indigo-700 font-medium'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        collapsed && 'justify-center px-0 w-9 h-9 mx-auto'
      )}
    >
      <Icon
        className={cn(
          'shrink-0 transition-colors',
          isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
        )}
        style={{ width: '16px', height: '16px' }}
      />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {badge != null && (
            <span
              className={cn(
                'text-[11px] font-medium px-1.5 py-0.5 rounded-md',
                isActive
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 text-slate-500'
              )}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={12} className="text-xs font-medium">
          {label}
          {badge != null && (
            <span className="ml-1.5 bg-indigo-100 text-indigo-700 text-[11px] px-1.5 py-0.5 rounded-md">
              {badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}
