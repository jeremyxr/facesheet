import { Pin } from 'lucide-react'
import type { Patient } from '../../../types/patient'

function StretchingPinnedCard({ patient: _patient }: { patient: Patient }) {
  return (
    <div className="h-full bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] p-4 min-h-[120px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">Stretching exercises</h3>
        <Pin size={14} className="text-[var(--color-text-muted)]" />
      </div>
      <div className="flex items-center justify-center h-16 bg-[var(--color-bg-subtle)] rounded-[var(--radius-sm)]">
        <span className="text-[11px] text-[var(--color-text-muted)]">Exercise diagram</span>
      </div>
    </div>
  )
}

export { StretchingPinnedCard }
