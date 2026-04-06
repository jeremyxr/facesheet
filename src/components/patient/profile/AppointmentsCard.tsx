import { CalendarDays } from 'lucide-react'
import { Card, CardBody } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Divider } from '../../ui/Divider'
import type { Patient } from '../../../types/patient'

interface Props {
  patient: Patient
  aiInsight?: React.ReactNode
}

function AppointmentsCard({ patient, aiInsight }: Props) {
  const upcoming = patient.stats.upcomingAppointments

  return (
    <Card>
      <div className="flex items-center gap-2 px-4 py-3">
        <CalendarDays size={14} className="text-[var(--color-text-muted)]" />
        <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
          Appointments
        </span>
      </div>
      <Divider className="my-0" />
      <CardBody className="space-y-3">
        {upcoming === 0 ? (
          <p className="text-[13px] text-[var(--color-text-primary)]">
            {patient.firstName} has no upcoming appointments.{' '}
            <button className="text-[var(--color-text-link)] hover:underline">
              Add a Return Visit Reminder
            </button>
          </p>
        ) : (
          <p className="text-[13px] text-[var(--color-text-primary)]">
            {patient.firstName} has{' '}
            <strong>{upcoming}</strong> upcoming appointment{upcoming !== 1 ? 's' : ''}.
          </p>
        )}

        <div className="grid grid-cols-3 gap-2">
          <Button variant="secondary" size="sm" className="w-full">
            → View All
          </Button>
          <Button variant="secondary" size="sm" className="w-full">
            Do Not Email
          </Button>
          <Button variant="secondary" size="sm" className="w-full">
            Print
          </Button>
        </div>

        {aiInsight}
      </CardBody>
    </Card>
  )
}

export { AppointmentsCard }
