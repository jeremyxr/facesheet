import { create } from 'zustand'
import type { ViewCardPlacement } from '../types/views'

interface AiState {
  status: 'idle' | 'loading' | 'error'
  lastPrompt: string
  explanation: string
  error?: string
}

interface FacesheetEditorState {
  // Draft state
  draftCards: ViewCardPlacement[]
  baseViewId: string
  baseCards: ViewCardPlacement[]
  isEditMode: boolean
  aiState: AiState
  undoStack: ViewCardPlacement[][]

  // Actions
  initDraft: (viewId: string, cards: ViewCardPlacement[]) => void
  updateDraftCards: (cards: ViewCardPlacement[]) => void
  setEditMode: (enabled: boolean) => void
  resetDraft: () => void
  isDirty: () => boolean
  setAiState: (state: Partial<AiState>) => void
  undo: () => void
  canUndo: () => boolean
}

const useFacesheetEditorStore = create<FacesheetEditorState>()((set, get) => ({
  draftCards: [],
  baseViewId: '',
  baseCards: [],
  isEditMode: false,
  aiState: { status: 'idle', lastPrompt: '', explanation: '' },
  undoStack: [],

  initDraft: (viewId, cards) => {
    const snapshot = cards.map((c) => ({ ...c }))
    set({
      baseViewId: viewId,
      baseCards: snapshot,
      draftCards: cards.map((c) => ({ ...c })),
      undoStack: [],
    })
  },

  updateDraftCards: (cards) =>
    set((state) => ({
      draftCards: cards,
      undoStack: [...state.undoStack.slice(-9), state.draftCards.map((c) => ({ ...c }))],
    })),

  setEditMode: (enabled) => set({ isEditMode: enabled }),

  resetDraft: () => {
    const { baseCards } = get()
    set({
      draftCards: baseCards.map((c) => ({ ...c })),
      isEditMode: false,
      aiState: { status: 'idle', lastPrompt: '', explanation: '' },
      undoStack: [],
    })
  },

  isDirty: () => {
    const { draftCards, baseCards } = get()
    if (draftCards.length !== baseCards.length) return true
    return draftCards.some((d, i) => {
      const b = baseCards[i]
      return d.cardId !== b.cardId || d.zone !== b.zone || d.order !== b.order || d.width !== b.width
    })
  },

  setAiState: (partial) =>
    set((state) => ({ aiState: { ...state.aiState, ...partial } })),

  undo: () => {
    const { undoStack } = get()
    if (undoStack.length === 0) return
    const previous = undoStack[undoStack.length - 1]
    set({
      draftCards: previous,
      undoStack: undoStack.slice(0, -1),
    })
  },

  canUndo: () => get().undoStack.length > 0,
}))

export { useFacesheetEditorStore }
export type { AiState }
