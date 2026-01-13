import { create } from 'zustand'

type UIState = {
  isMobileNavOpen: boolean
  openMobileNav: () => void
  closeMobileNav: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileNavOpen: false,
  openMobileNav: () => set({ isMobileNavOpen: true }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
}))


