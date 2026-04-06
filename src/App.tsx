import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { PatientPage, PatientIndexRedirect } from './pages/PatientPage'
import { PatientListPage } from './pages/PatientListPage'
import { PatientSettingsPage } from './pages/PatientSettingsPage'
import { SettingsPage } from './pages/SettingsPage'
import { TourProvider } from './components/tour/TourProvider'
import { FeedbackProvider } from './components/feedback/FeedbackProvider'
import { useWorkshopStore } from './stores/workshopStore'

function App() {
  const { patientManagementEnabled } = useWorkshopStore()

  return (
    <BrowserRouter>
      <TourProvider />
      <FeedbackProvider />
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to={patientManagementEnabled ? '/patients' : '/patients/21/profile'} replace />} />
          <Route path="/patients" element={patientManagementEnabled ? <PatientListPage /> : <PatientIndexRedirect />} />
          <Route path="/patients/settings" element={<Navigate to="/patients/settings/labels" replace />} />
          <Route path="/patients/settings/:section" element={<PatientSettingsPage />} />
          <Route path="/patients/:patientId" element={<Navigate to="profile" replace />} />
          <Route path="/patients/:patientId/:tab" element={<PatientPage />} />
          <Route path="/settings" element={<Navigate to="/settings/workshop" replace />} />
          <Route path="/settings/:section" element={<SettingsPage />} />
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-full text-[var(--color-text-muted)] text-[14px]">
                Page not found
              </div>
            }
          />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
