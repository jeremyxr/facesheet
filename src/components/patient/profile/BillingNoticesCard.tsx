import { DollarSign } from 'lucide-react'
import { Card, CardBody } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Divider } from '../../ui/Divider'
import type { Patient } from '../../../types/patient'

interface Props {
  patient: Patient
  aiInsight?: React.ReactNode
}

function BillingNoticesCard({ patient, aiInsight }: Props) {
  const { stats } = patient
  const balance = stats.privateBalance

  return (
    <Card>
      <div className="flex items-center gap-2 px-4 py-3">
        <DollarSign size={14} className="text-[var(--color-text-muted)]" />
        <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
          Billing Notices
        </span>
      </div>
      <Divider className="my-0" />
      <CardBody className="space-y-3">
        {balance > 0 ? (
          <p className="text-[13px] text-[var(--color-text-primary)]">
            {patient.firstName} has a balance of{' '}
            <strong>${balance.toFixed(2)}</strong>
          </p>
        ) : (
          <p className="text-[13px] text-[var(--color-text-muted)]">
            {patient.firstName} has no outstanding balance.
          </p>
        )}

        {balance > 0 && (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" size="sm" className="w-full">
              Email Reminder
            </Button>
            <Button variant="secondary" size="sm" className="w-full">
              Text Reminder
            </Button>
          </div>
        )}

        <Button
          variant="primary"
          size="md"
          className="w-full"
        >
          <DollarSign size={13} />
          Receive Payment
        </Button>

        {aiInsight}
      </CardBody>
    </Card>
  )
}

export { BillingNoticesCard }
