import { FileText, ChevronDown } from 'lucide-react'
import { Card, CardBody } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Divider } from '../../ui/Divider'
import type { Patient } from '../../../types/patient'

interface Props {
  patient: Patient
  aiInsight?: React.ReactNode
}

function OnlineIntakeCard({ patient: _patient, aiInsight }: Props) {
  return (
    <Card>
      <div className="flex items-center gap-2 px-4 py-3">
        <FileText size={14} className="text-[var(--color-text-muted)]" />
        <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
          Online Intake Forms
        </span>
      </div>
      <Divider className="my-0" />
      <CardBody className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" className="w-full">
            <Pencil size={12} />
            Fill Out
            <ChevronDown size={11} />
          </Button>
          <Button variant="secondary" size="sm" className="w-full">
            Email
          </Button>
        </div>
        {aiInsight}
      </CardBody>
    </Card>
  )
}

// inline import fix
function Pencil({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    </svg>
  )
}

export { OnlineIntakeCard }
