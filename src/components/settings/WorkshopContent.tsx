import { Card, CardBody } from '../ui/Card'
import { Toggle } from '../ui/Toggle'
import { Button } from '../ui/Button'
import { Play, RotateCcw } from 'lucide-react'
import { useWorkshopStore } from '../../stores/workshopStore'
import { useTourStore } from '../../stores/tourStore'

function WorkshopContent() {
  const { patientManagementEnabled, togglePatientManagement } = useWorkshopStore()
  const { startTour, resetTour, hasCompletedTour } = useTourStore()

  return (
    <div className="p-8 max-w-[800px]">
      <h1 className="text-[24px] font-light text-[var(--color-text-primary)] mb-4">
        Workshop
      </h1>
      <p className="text-[13px] text-[var(--color-text-primary)] leading-relaxed mb-3">
        Welcome to <strong>Jane's Workshop</strong>; a place where we work aloud, let you try out
        features and updates in progress, and capture your feedback. All features are secure and
        ready to use with real patient data. While fully functional, these features may evolve,
        improve, or pivot based on your feedback.
      </p>
      <p className="text-[13px] text-[var(--color-text-primary)] mb-6">
        You can create detailed{' '}
        <a
          href="#"
          className="text-[var(--color-text-link)] hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          feedback and requests here
        </a>
        . Jump in!
      </p>
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="primary"
          size="md"
          className="gap-1.5"
          onClick={hasCompletedTour ? resetTour : startTour}
        >
          {hasCompletedTour ? <RotateCcw size={14} /> : <Play size={14} />}
          {hasCompletedTour ? 'Restart tour' : 'Take the tour'}
        </Button>
        <span className="text-[12px] text-[var(--color-text-muted)]">
          Get a guided walkthrough of the new patient management features
        </span>
      </div>
      <hr className="border-[var(--color-border-subtle)] mb-6" />

      {/* Feature toggles */}
      <Card>
        <CardBody>
          <div className="flex items-start justify-between gap-4" data-tour-id="workshop-toggle">
            <div className="flex-1">
              <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1">
                Patient management
              </h3>
              <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed">
                Try the redesigned patient management experience. This includes a refreshed patient
                list, streamlined navigation, and an updated profile layout — all built to help you
                find and manage patient information faster.
              </p>
            </div>
            <Toggle
              checked={patientManagementEnabled}
              onChange={togglePatientManagement}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export { WorkshopContent }
