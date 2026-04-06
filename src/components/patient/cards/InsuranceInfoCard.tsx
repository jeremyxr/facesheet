import type { Patient } from '../../../types/patient'

function InsuranceInfoCard({ patient: _patient }: { patient: Patient }) {
  return (
    <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] h-full">
      <div className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">Insurance Info</h3>
      </div>
      <div className="px-4 py-3 text-[12px] space-y-3">
        <div>
          <p className="font-semibold text-[var(--color-text-primary)]">Primary</p>
          <p className="text-[var(--color-text-secondary)]">Blue Cross Blue Shield</p>
          <p className="text-[var(--color-text-muted)] text-[11px]">Policy #BCB-4829173</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-text-primary)]">Authorization</p>
          <p className="text-[var(--color-text-secondary)]">12 visits approved (8 remaining)</p>
          <p className="text-[var(--color-text-muted)] text-[11px]">Expires Jun 30, 2026</p>
        </div>
      </div>
    </div>
  )
}

export { InsuranceInfoCard }
