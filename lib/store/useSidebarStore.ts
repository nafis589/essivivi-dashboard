import { create } from 'zustand'

interface SidebarState {
  isOpen: boolean
  isMobileOpen: boolean
  isMobile: boolean
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  setMobile: (isMobile: boolean) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  isMobileOpen: false,
  isMobile: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleMobileSidebar: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  closeMobileSidebar: () => set({ isMobileOpen: false }),
  setMobile: (isMobile) => set({ isMobile }),
}))
