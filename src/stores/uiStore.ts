import { create } from 'zustand'

export type Language = 'en' | 'sn' | 'nd'

interface UiState {
  language: Language
  mobileMenuOpen: boolean
  setLanguage: (lang: Language) => void
  setMobileMenuOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  language: 'en',
  mobileMenuOpen: false,
  setLanguage: (language) => set({ language }),
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
}))
