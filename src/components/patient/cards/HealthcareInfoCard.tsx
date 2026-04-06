import type { Patient } from '../../../types/patient'
import { ContentCard } from './ContentCard'

function HealthcareInfoCard({ patient: _patient }: { patient: Patient }) {
  return (
    <ContentCard title="Healthcare Information" hasLink>
      <div className="space-y-3">
        <div>
          <p className="font-semibold text-[var(--color-text-primary)] mb-1">Vitals</p>
          <ul className="list-disc list-inside space-y-0.5 text-[var(--color-text-secondary)]">
            <li>Blood Pressure: 122/78 mmHg</li>
            <li>Heart Rate: 72 bpm</li>
            <li>Oxygen Saturation: 98% on room air</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-text-primary)] mb-1">Past Medical Conditions</p>
          <ul className="list-disc list-inside space-y-0.5 text-[var(--color-text-secondary)]">
            <li>Physical trauma: Knee injury</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-text-primary)] mb-1">Special conditions</p>
          <ul className="list-disc list-inside space-y-0.5 text-[var(--color-text-secondary)]">
            <li>Allergies: Penicillin, peanuts</li>
          </ul>
        </div>
      </div>
    </ContentCard>
  )
}

export { HealthcareInfoCard }
