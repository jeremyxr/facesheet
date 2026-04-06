import { Gift, Pencil } from 'lucide-react'
import { Card, CardBody } from '../../ui/Card'
import { IconSection } from '../../ui/IconSection'
import { Divider } from '../../ui/Divider'
import type { Patient } from '../../../types/patient'

interface Props {
  patient: Patient
  aiInsight?: React.ReactNode
}

function formatDOBLong(dob: string) {
  const date = new Date(dob + 'T00:00:00')
  const formatted = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  // Calculate months ago
  const now = new Date()
  const months =
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth())
  return { formatted, monthsAgo: months }
}

function DemographicsCard({ patient, aiInsight }: Props) {
  const { formatted, monthsAgo } = formatDOBLong(patient.dateOfBirth)
  const monthsDisplay = monthsAgo === 0 ? 'this month' : `${monthsAgo} months ago`

  return (
    <Card>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
          Birth Date
        </span>
        <button className="text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-dark)] transition-colors">
          <Pencil size={13} />
        </button>
      </div>
      <Divider className="my-0" />
      <CardBody>
        <IconSection icon={<Gift size={14} />}>
          <div className="space-y-2.5">
            <div>
              <div className="text-[11px] text-[var(--color-text-muted)] mb-0.5">Birth Date</div>
              <div className="text-[13px] text-[var(--color-text-primary)]">
                {formatted}{' '}
                <span className="text-[var(--color-text-muted)]">({monthsDisplay})</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-[var(--color-text-muted)] mb-0.5">Age</div>
              <div className="text-[13px] text-[var(--color-text-primary)]">{patient.age}</div>
            </div>

            <div>
              <div className="text-[11px] text-[var(--color-text-muted)] mb-0.5">Sex</div>
              <div className="text-[13px] text-[var(--color-text-primary)]">{patient.sex}</div>
            </div>

            {patient.gender && patient.gender !== patient.sex && (
              <div>
                <div className="text-[11px] text-[var(--color-text-muted)] mb-0.5">Gender</div>
                <div className="text-[13px] text-[var(--color-text-primary)]">{patient.gender}</div>
              </div>
            )}

            {patient.personalHealthNumber && (
              <div>
                <div className="text-[11px] text-[var(--color-text-muted)] mb-0.5">
                  Personal Health Number
                </div>
                <div className="text-[13px] text-[var(--color-text-primary)] font-mono">
                  {patient.personalHealthNumber}
                </div>
              </div>
            )}
          </div>
        </IconSection>
        {aiInsight}
      </CardBody>
    </Card>
  )
}

export { DemographicsCard }
