import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FeedbackItem {
  id: string
  comment: string
  userName: string
  route: string
  elementSelector: string
  feedbackId: string | null
  coordinates: { x: number; y: number }
  viewportSize: { width: number; height: number }
  timestamp: string
  status: 'pending' | 'sent' | 'failed'
}

interface FeedbackState {
  items: FeedbackItem[]
  userName: string
  setUserName: (name: string) => void
  addItem: (item: Omit<FeedbackItem, 'id' | 'timestamp' | 'status'>) => FeedbackItem
  markSent: (id: string) => void
  markFailed: (id: string) => void
  getPendingItems: () => FeedbackItem[]
  exportAll: () => string
}

const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      items: [],
      userName: '',

      setUserName: (name: string) => set({ userName: name }),

      addItem: (item) => {
        const newItem: FeedbackItem = {
          ...item,
          id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: new Date().toISOString(),
          status: 'pending',
        }
        set((state) => ({ items: [...state.items, newItem] }))
        return newItem
      },

      markSent: (id: string) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, status: 'sent' as const } : i)),
        })),

      markFailed: (id: string) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, status: 'failed' as const } : i)),
        })),

      getPendingItems: () => get().items.filter((i) => i.status === 'pending'),

      exportAll: () => JSON.stringify(get().items, null, 2),
    }),
    { name: 'facesheet-feedback' }
  )
)

export { useFeedbackStore }
