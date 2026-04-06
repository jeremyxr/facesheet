import { TopNav } from './TopNav'
import { PatientSidebar } from './PatientSidebar'
import { useLocation } from 'react-router-dom'
import { useWorkshopStore } from '../../stores/workshopStore'

interface AppShellProps {
  children: React.ReactNode
}

function AppShell({ children }: AppShellProps) {
  const location = useLocation()
  const { patientManagementEnabled } = useWorkshopStore()
  const isPatientList = location.pathname === '/patients'
  const isPatientSettings = location.pathname.startsWith('/patients/settings')
  // Show the old patient list sidebar only when the new patient management is OFF
  // When ON, the PatientPage has its own internal nav sidebar
  const showPatientSidebar =
    location.pathname.startsWith('/patients') &&
    !patientManagementEnabled &&
    !isPatientSettings

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNav />
      <div
        className="flex flex-1 overflow-hidden"
        style={{ paddingTop: 'var(--nav-height)' }}
      >
        {showPatientSidebar && <PatientSidebar />}
        <main className="flex-1 overflow-y-auto bg-[var(--color-bg-app)]">
          {children}
        </main>
      </div>
    </div>
  )
}

export { AppShell }
