import type { Patient } from '../../../types/patient'

function AppointmentsCard({ patient }: { patient: Patient }) {
  return (
    <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] h-full">
      <div className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">Appointments</h3>
      </div>
      <div className="px-4 py-3 text-[12px] space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[var(--color-text-primary)]">Follow-up Assessment</p>
            <p className="text-[var(--color-text-muted)] text-[11px]">Apr 3, 2026 at 10:00 AM</p>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary-dark)]">
            Upcoming
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[var(--color-text-primary)]">Therapy Session</p>
            <p className="text-[var(--color-text-muted)] text-[11px]">Apr 7, 2026 at 2:30 PM</p>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]">
            Scheduled
          </span>
        </div>
        <p className="text-[11px] text-[var(--color-text-muted)] pt-1">
          {patient.stats.upcomingAppointments} upcoming &middot; {patient.stats.totalBookings} total
        </p>
      </div>
    </div>
  )
}

export { AppointmentsCard }
