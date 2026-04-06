import { ClipboardList, Plus } from 'lucide-react'
import { Card, CardBody } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Divider } from '../../ui/Divider'
import type { Patient } from '../../../types/patient'

interface Props {
  patient: Patient
  aiInsight?: React.ReactNode
}

function SurveysCard({ patient: _patient, aiInsight }: Props) {
  return (
    <Card>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <ClipboardList size={14} className="text-[var(--color-text-muted)]" />
          <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
            Surveys
          </span>
        </div>
        <Button variant="secondary" size="sm">
          <Plus size={12} />
          Set Up
        </Button>
      </div>
      <Divider className="my-0" />
      <div className="px-4 py-2 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border-subtle)]">
        <div className="grid grid-cols-4 gap-2 text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
          <span>Survey</span>
          <span>Status</span>
          <span>History</span>
          <span>Action</span>
        </div>
      </div>
      <CardBody>
        <p className="text-[13px] text-[var(--color-text-muted)] text-center py-2">
          No surveys
        </p>
        {aiInsight}
      </CardBody>
    </Card>
  )
}

export { SurveysCard }
