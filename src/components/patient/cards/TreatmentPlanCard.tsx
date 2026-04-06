import { cn } from '../../../lib/cn'
import type { Patient } from '../../../types/patient'
import { ContentCard } from './ContentCard'

function TreatmentPlanCard({ patient }: { patient: Patient }) {
  return (
    <ContentCard title="Treatment Plan">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-[var(--color-text-primary)]">Knee and lower leg</span>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary-dark)]">
          Active
        </span>
      </div>
      <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-[var(--color-bg-subtle)] text-[11px] font-mono text-[var(--color-text-muted)] mb-3">
        #{Math.floor(patient.id * 397 % 9999)}
      </div>
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-4 h-1.5 rounded-full',
              i < 5 ? 'bg-[var(--color-brand-primary)]' : 'bg-[var(--color-border-subtle)]'
            )}
          />
        ))}
      </div>
      <p className="text-[var(--color-text-muted)] mb-3">Appointment 5 of 10</p>
      <div className="border-t border-[var(--color-border-subtle)] pt-3 mt-1">
        <p className="font-semibold text-[var(--color-text-primary)] mb-1">Goal</p>
        <p>Improve knee function and reduce pain to allow the patient to walk, climb stairs, and perform daily activities comfortably, with full range of motion and strength restored.</p>
      </div>
    </ContentCard>
  )
}

export { TreatmentPlanCard }
