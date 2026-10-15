import { create } from 'zustand'
import type { ChildDetails, ParentDetails } from '@/types'

interface DocumentUrls {
  hospitalRecordImageUrl?: string
  motherIdImageUrl?: string
  fatherIdImageUrl?: string
}

interface BirthApplicationState {
  currentStep: number
  childDetails: Partial<ChildDetails>
  parentDetails: Partial<ParentDetails>
  documentUrls: DocumentUrls
  confirmed: boolean
  setStep: (step: number) => void
  setChildDetails: (details: Partial<ChildDetails>) => void
  setParentDetails: (details: Partial<ParentDetails>) => void
  setDocumentUrls: (urls: Partial<DocumentUrls>) => void
  setConfirmed: (value: boolean) => void
  reset: () => void
}

// Holds in-progress, multi-step form state only — never persisted to
// localStorage, cleared on submission.
export const useBirthApplicationStore = create<BirthApplicationState>((set) => ({
  currentStep: 1,
  childDetails: {},
  parentDetails: {},
  documentUrls: {},
  confirmed: false,
  setStep: (currentStep) => set({ currentStep }),
  setChildDetails: (details) => set((s) => ({ childDetails: { ...s.childDetails, ...details } })),
  setParentDetails: (details) => set((s) => ({ parentDetails: { ...s.parentDetails, ...details } })),
  setDocumentUrls: (urls) => set((s) => ({ documentUrls: { ...s.documentUrls, ...urls } })),
  setConfirmed: (confirmed) => set({ confirmed }),
  reset: () =>
    set({
      currentStep: 1,
      childDetails: {},
      parentDetails: {},
      documentUrls: {},
      confirmed: false,
    }),
}))
