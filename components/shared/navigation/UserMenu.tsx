'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from '@/lib/types/navigation.types'
import { ChevronUp, Settings, LogOut, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserMenuProps {
  user: User
  collapsed?: boolean
}

export function UserMenu({ user, collapsed }: UserMenuProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-left',
            'hover:bg-slate-100 transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1',
            collapsed && 'justify-center px-0'
          )}
        >
          <Avatar className="h-7 w-7 shrink-0">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className="bg-indigo-600 text-white text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
              <ChevronUp className="h-3.5 w-3.5 text-slate-300 shrink-0" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align={collapsed ? 'end' : 'start'}
        side={collapsed ? 'right' : 'top'}
        sideOffset={8}
      >
        <DropdownMenuLabel>
          <div className="flex items-center gap-2.5 py-0.5">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-indigo-600 text-white text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
            <UserIcon className="h-4 w-4 text-slate-400" />
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
            <Settings className="h-4 w-4 text-slate-400" />
            Paramètres
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-sm text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
          <LogOut className="h-4 w-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
