import type { Patient } from '../../../types/patient'

function MedicalAlertsCard({ patient: _patient }: { patient: Patient }) {
  return (
    <div className="bg-[#fef3e6] border border-[#f5c97a] rounded-[var(--radius-md)] h-full">
      <div className="px-4 py-3">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">Medical alerts</h3>
      </div>
      <div className="px-4 pb-4 text-[12px] space-y-3">
        <div>
          <p className="font-semibold text-[var(--color-text-primary)]">Allergies</p>
          <p className="text-[var(--color-text-secondary)]">Penicillin, peanuts</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-text-primary)]">Special considerations</p>
          <p className="text-[var(--color-text-secondary)]">Pregnancy</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-text-primary)]">Medical equipment</p>
          <p className="text-[var(--color-text-secondary)]">Prosthetics</p>
        </div>
      </div>
    </div>
  )
}

export { MedicalAlertsCard }
