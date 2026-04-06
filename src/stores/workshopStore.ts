import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WorkshopState {
  patientManagementEnabled: boolean
  togglePatientManagement: () => void
}

const useWorkshopStore = create<WorkshopState>()(
  persist(
    (set) => ({
      patientManagementEnabled: false,
      togglePatientManagement: () =>
        set((state) => ({ patientManagementEnabled: !state.patientManagementEnabled })),
    }),
    { name: 'workshop-settings' }
  )
)

export { useWorkshopStore }
