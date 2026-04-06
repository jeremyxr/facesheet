import { cn } from '../../../lib/cn'
import type { Patient } from '../../../types/patient'

function OtherInfoCard({ patient }: { patient: Patient }) {
  const balance = patient.stats.claimsOutstanding + patient.stats.privateOutstanding
  return (
    <div className="bg-[#e6f5f0] border border-[#a3d9c8] rounded-[var(--radius-md)] h-full">
      <div className="px-4 py-3">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">Other info</h3>
      </div>
      <div className="px-4 pb-4 text-[12px] space-y-3">
        <div>
          <p className="font-semibold text-[var(--color-text-primary)]">Visits remaining</p>
          <p className="text-[var(--color-text-secondary)]">{patient.stats.upcomingAppointments}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-text-primary)]">Balance owing</p>
          <p className={cn('font-medium', balance > 0 ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-secondary)]')}>
            {balance > 0 ? `$${balance.toLocaleString()}.00` : '$0.00'}
          </p>
        </div>
      </div>
    </div>
  )
}

export { OtherInfoCard }
