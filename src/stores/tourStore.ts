import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useWorkshopStore } from './workshopStore'
import { TOUR_STEPS } from '../components/tour/tourSteps'

interface TourState {
  isActive: boolean
  showWelcomeModal: boolean
  currentStepIndex: number
  hasCompletedTour: boolean
  hasDismissedTour: boolean

  startTour: () => void
  dismissWelcomeModal: () => void
  nextStep: () => void
  completeTour: () => void
  dismissTour: () => void
  resetTour: () => void
}

const TOTAL_STEPS = TOUR_STEPS.length

const useTourStore = create<TourState>()(
  persist(
    (set, get) => ({
      isActive: false,
      showWelcomeModal: false,
      currentStepIndex: 0,
      hasCompletedTour: false,
      hasDismissedTour: false,

      startTour: () => {
        const workshop = useWorkshopStore.getState()
        if (workshop.patientManagementEnabled) {
          workshop.togglePatientManagement()
        }
        set({ isActive: true, showWelcomeModal: true, currentStepIndex: 0 })
      },

      dismissWelcomeModal: () => {
        set({ showWelcomeModal: false })
      },

      nextStep: () => {
        const { currentStepIndex } = get()
        if (currentStepIndex + 1 >= TOTAL_STEPS) {
          get().completeTour()
        } else {
          set({ currentStepIndex: currentStepIndex + 1 })
        }
      },

      completeTour: () => {
        set({ isActive: false, currentStepIndex: 0, hasCompletedTour: true })
      },

      dismissTour: () => {
        set({ isActive: false, currentStepIndex: 0, hasDismissedTour: true })
      },

      resetTour: () => {
        const workshop = useWorkshopStore.getState()
        if (workshop.patientManagementEnabled) {
          workshop.togglePatientManagement()
        }
        set({ isActive: true, showWelcomeModal: true, currentStepIndex: 0, hasCompletedTour: false, hasDismissedTour: false })
      },
    }),
    {
      name: 'tour-state',
      partialize: (state) => ({ hasCompletedTour: state.hasCompletedTour, hasDismissedTour: state.hasDismissedTour }),
    }
  )
)

export { useTourStore }
