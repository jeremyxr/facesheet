import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { View, ViewCardPlacement, PatientViewOverride, ViewPermissions } from '../types/views'

const STANDARD_VIEW: View = {
  id: 'standard',
  name: 'Standard',
  description: 'Default facesheet layout with treatment plans, health info, and alerts',
  isDefault: true,
  createdAt: '2024-01-01T00:00:00Z',
  permissions: { mode: 'everyone', roles: [], staffIds: [] },
  cards: [
    { cardId: 'adjustments-pinned', zone: 'pinned', order: 0 },
    { cardId: 'stretching-pinned', zone: 'pinned', order: 1 },
    { cardId: 'treatment-plan', zone: 'main', order: 0, width: 1 },
    { cardId: 'healthcare-info', zone: 'main', order: 1, width: 1 },
    { cardId: 'medical-history', zone: 'main', order: 2, width: 1 },
    { cardId: 'medical-alerts', zone: 'sidebar', order: 0 },
    { cardId: 'other-info', zone: 'sidebar', order: 1 },
    { cardId: 'scratch-pad', zone: 'sidebar', order: 2 },
  ],
}

interface ViewsState {
  views: View[]
  activeGlobalViewId: string
  patientOverrides: PatientViewOverride[]

  addView: (view: View) => void
  updateView: (id: string, updates: Partial<Omit<View, 'id'>>) => void
  deleteView: (id: string) => void
  duplicateView: (id: string, newName: string) => View
  setGlobalView: (viewId: string) => void
  setPatientView: (patientId: number, viewId: string) => void
  clearPatientView: (patientId: number) => void
  getEffectiveViewId: (patientId: number) => string
  updateViewCards: (viewId: string, cards: ViewCardPlacement[]) => void
  updateViewPermissions: (viewId: string, permissions: ViewPermissions) => void
  createPatientView: (patientId: number, name: string, cards: ViewCardPlacement[]) => View
}

const useViewsStore = create<ViewsState>()(
  persist(
    (set, get) => ({
      views: [STANDARD_VIEW],
      activeGlobalViewId: 'standard',
      patientOverrides: [],

      addView: (view) =>
        set((state) => ({ views: [...state.views, view] })),

      updateView: (id, updates) =>
        set((state) => ({
          views: state.views.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        })),

      deleteView: (id) =>
        set((state) => ({
          views: state.views.filter((v) => v.id !== id),
          activeGlobalViewId: state.activeGlobalViewId === id ? 'standard' : state.activeGlobalViewId,
          patientOverrides: state.patientOverrides.filter((o) => o.viewId !== id),
        })),

      duplicateView: (id, newName) => {
        const source = get().views.find((v) => v.id === id)
        if (!source) throw new Error(`View ${id} not found`)
        const newView: View = {
          ...source,
          id: `view-${Date.now()}`,
          name: newName,
          isDefault: false,
          createdAt: new Date().toISOString(),
          cards: source.cards.map((c) => ({ ...c })),
        }
        set((state) => ({ views: [...state.views, newView] }))
        return newView
      },

      setGlobalView: (viewId) =>
        set({ activeGlobalViewId: viewId }),

      setPatientView: (patientId, viewId) =>
        set((state) => ({
          patientOverrides: [
            ...state.patientOverrides.filter((o) => o.patientId !== patientId),
            { patientId, viewId },
          ],
        })),

      clearPatientView: (patientId) =>
        set((state) => ({
          patientOverrides: state.patientOverrides.filter((o) => o.patientId !== patientId),
        })),

      getEffectiveViewId: (patientId) => {
        const state = get()
        const override = state.patientOverrides.find((o) => o.patientId === patientId)
        return override?.viewId ?? state.activeGlobalViewId
      },

      updateViewCards: (viewId, cards) =>
        set((state) => ({
          views: state.views.map((v) => (v.id === viewId ? { ...v, cards } : v)),
        })),

      updateViewPermissions: (viewId, permissions) =>
        set((state) => ({
          views: state.views.map((v) => (v.id === viewId ? { ...v, permissions } : v)),
        })),

      createPatientView: (patientId, name, cards) => {
        const newView: View = {
          id: `view-${Date.now()}`,
          name,
          isDefault: false,
          createdAt: new Date().toISOString(),
          cards: cards.map((c) => ({ ...c })),
        }
        set((state) => ({
          views: [...state.views, newView],
          patientOverrides: [
            ...state.patientOverrides.filter((o) => o.patientId !== patientId),
            { patientId, viewId: newView.id },
          ],
        }))
        return newView
      },
    }),
    { name: 'facesheet-views' }
  )
)

export { useViewsStore, STANDARD_VIEW }
