import { Tag } from 'lucide-react'
import { Card, CardBody } from '../../ui/Card'
import { Divider } from '../../ui/Divider'
import type { Patient } from '../../../types/patient'

interface Props {
  patient: Patient
  aiInsight?: React.ReactNode
}

function DefaultAdjustmentsCard({ patient: _patient, aiInsight }: Props) {
  return (
    <Card>
      <div className="flex items-center gap-2 px-4 py-3">
        <Tag size={14} className="text-[var(--color-text-muted)]" />
        <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
          Default Adjustments
        </span>
      </div>
      <Divider className="my-0" />
      <CardBody>
        <p className="text-[13px] text-[var(--color-text-muted)]">
          No default adjustments set.
        </p>
        {aiInsight}
      </CardBody>
    </Card>
  )
}

export { DefaultAdjustmentsCard }
