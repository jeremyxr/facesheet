import { Pin } from 'lucide-react'
import type { Patient } from '../../../types/patient'

function AdjustmentsPinnedCard({ patient: _patient }: { patient: Patient }) {
  return (
    <div className="h-full bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] p-4 min-h-[120px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">Adjustments</h3>
        <Pin size={14} className="text-[var(--color-text-muted)]" />
      </div>
      <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed">
        Adjust crutch/cane use as leg strength improves. Modify activities to limit excessive stress on the healing bone.
      </p>
    </div>
  )
}

export { AdjustmentsPinnedCard }
