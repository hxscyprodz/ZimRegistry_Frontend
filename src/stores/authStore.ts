import { create } from 'zustand'
import type { Citizen } from '@/types'

interface AuthState {
  citizen: Citizen | null
  isAuthenticated: boolean
  hasHydrated: boolean
  setCitizen: (citizen: Citizen | null) => void
  setHydrated: (value: boolean) => void
  clear: () => void
}

// Session identity only — never persisted to localStorage, never holds a
// password or token. The real access token/session lives in an httpOnly
// cookie managed by the backend; this store just mirrors "who is logged in"
// for the UI.
export const useAuthStore = create<AuthState>((set) => ({
  citizen: null,
  isAuthenticated: false,
  hasHydrated: false,
  setCitizen: (citizen) => set({ citizen, isAuthenticated: !!citizen }),
  setHydrated: (value) => set({ hasHydrated: value }),
  clear: () => set({ citizen: null, isAuthenticated: false }),
}))
