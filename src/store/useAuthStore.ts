import { create } from 'zustand'

type AuthUser = {
  id: string
  email: string
  displayName?: string
}

type AuthState = {
  user: AuthUser | null
  signOut: () => void
  // Sign-in/up will be wired to Firebase later; UI only for now
  setUserForDemo: (user: AuthUser | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  signOut: () => set({ user: null }),
  setUserForDemo: (user) => set({ user }),
}))


