import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTourStore } from '../../stores/tourStore'
import { useWorkshopStore } from '../../stores/workshopStore'
import { TOUR_STEPS } from './tourSteps'
import { TourOverlay } from './TourOverlay'
import { TourTooltip } from './TourTooltip'
import { TourWelcomeModal } from './TourWelcomeModal'

function TourProvider() {
  const { isActive, showWelcomeModal, currentStepIndex, hasCompletedTour, hasDismissedTour, startTour, nextStep, dismissTour, dismissWelcomeModal } = useTourStore()
  const navigate = useNavigate()
  const location = useLocation()

  const step = isActive ? TOUR_STEPS[currentStepIndex] : null

  // Auto-start tour for new users who haven't completed or dismissed it
  useEffect(() => {
    if (!isActive && !hasCompletedTour && !hasDismissedTour) {
      startTour()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Navigate to the old patient profile while the welcome modal is showing
  useEffect(() => {
    if (!isActive || !showWelcomeModal) return
    if (location.pathname !== '/patients/1/profile') {
      navigate('/patients/1/profile', { replace: true })
    }
  }, [isActive, showWelcomeModal, location.pathname, navigate])

  // Navigate to the current step's page (only after the welcome modal is dismissed)
  useEffect(() => {
    if (!step?.navigateTo || showWelcomeModal) return
    if (!location.pathname.startsWith(step.navigateTo)) {
      navigate(step.navigateTo, { replace: true })
    }
  }, [step, showWelcomeModal, location.pathname, navigate])

  // Watch for nav-to-settings: auto-advance when user clicks Settings
  useEffect(() => {
    if (!isActive || showWelcomeModal || step?.id !== 'nav-to-settings') return

    if (location.pathname.startsWith('/settings')) {
      // Ensure they land on the workshop section
      if (!location.pathname.startsWith('/settings/workshop')) {
        navigate('/settings/workshop', { replace: true })
      }
      nextStep()
    }
  }, [isActive, showWelcomeModal, step?.id, location.pathname, navigate, nextStep])

  // Watch for nav-to-patients: auto-advance when user clicks Patients
  useEffect(() => {
    if (!isActive || showWelcomeModal || step?.id !== 'nav-to-patients') return

    if (location.pathname === '/patients') {
      nextStep()
    }
  }, [isActive, showWelcomeModal, step?.id, location.pathname, nextStep])

  // Watch for toggle-feature: auto-advance when flag turns on
  useEffect(() => {
    if (!isActive || showWelcomeModal || step?.id !== 'toggle-feature') return

    const unsub = useWorkshopStore.subscribe((state) => {
      if (state.patientManagementEnabled) {
        setTimeout(() => nextStep(), 400)
      }
    })

    return unsub
  }, [isActive, showWelcomeModal, step?.id, nextStep])

  // Watch for click-patient: auto-advance when route changes to a patient page
  useEffect(() => {
    if (!isActive || showWelcomeModal || step?.id !== 'click-patient') return

    if (/^\/patients\/\d+\/profile/.test(location.pathname)) {
      nextStep()
    }
  }, [isActive, showWelcomeModal, step?.id, location.pathname, nextStep])

  if (!isActive) return null

  // Show welcome modal first
  if (showWelcomeModal) {
    return (
      <TourWelcomeModal
        onStart={dismissWelcomeModal}
        onSkip={dismissTour}
      />
    )
  }

  if (!step) return null

  return (
    <TourOverlay
      targetId={step.targetId}
      padding={step.spotlightPadding}
    >
      {(rect) => (
        <TourTooltip
          step={step}
          stepIndex={currentStepIndex}
          totalSteps={TOUR_STEPS.length}
          targetRect={rect}
          onNext={nextStep}
          onSkip={dismissTour}
        />
      )}
    </TourOverlay>
  )
}

export { TourProvider }
