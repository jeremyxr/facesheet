import type { Patient } from '../../../types/patient'
import { ContentCard } from './ContentCard'

function MedicalHistoryCard({ patient: _patient }: { patient: Patient }) {
  return (
    <ContentCard title="Medical History" hasLink>
      <div className="space-y-3">
        <div>
          <p className="font-semibold text-[var(--color-text-primary)] mb-1">Past surgeries</p>
          <ul className="list-disc list-inside space-y-0.5 text-[var(--color-text-secondary)]">
            <li>Right knee surgery</li>
            <li>Pacemaker</li>
            <li>C-section</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-[var(--color-text-primary)] mb-1">Last mammogram</p>
          <p>December 12, 2024 <span className="text-[var(--color-text-link)] cursor-pointer hover:underline">(Lab result)</span></p>
        </div>
      </div>
    </ContentCard>
  )
}

export { MedicalHistoryCard }
