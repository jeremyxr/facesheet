import type { Patient } from '../../../types/patient'

function ScratchPadCard({ patient: _patient }: { patient: Patient }) {
  return (
    <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] h-full">
      <div className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">Scratch pad</h3>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">Visible to only you</p>
      </div>
      <div className="px-4 py-3 text-[12px] text-[var(--color-text-secondary)] leading-relaxed space-y-2">
        <p>• Considering referring for orthopaedic consult if no progress by next visit.</p>
        <p>• Discussed importance of compliance with home exercises but seems disengaged — find alternative ways to increase adherence.</p>
      </div>
    </div>
  )
}

export { ScratchPadCard }
