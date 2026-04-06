import { CreditCard, Check, Pencil } from 'lucide-react'
import { Card, CardBody } from '../../ui/Card'
import { IconSection } from '../../ui/IconSection'
import { Divider } from '../../ui/Divider'
import type { Patient } from '../../../types/patient'

interface Props {
  patient: Patient
  aiInsight?: React.ReactNode
}

function BillingPaymentsCard({ patient, aiInsight }: Props) {
  const { billing } = patient

  return (
    <Card>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
          Billing and Payments
        </span>
        <button className="text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-dark)] transition-colors">
          <Pencil size={13} />
        </button>
      </div>
      <Divider className="my-0" />
      <CardBody>
        <IconSection icon={<CreditCard size={14} />}>
          <div className="space-y-1.5">
            {billing.sendBillingEmails && (
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-primary)]">
                <Check size={12} className="text-[var(--color-success-dark)] flex-shrink-0" />
                Send billing and payments emails and texts
              </div>
            )}
            {billing.sendPaymentReminders && (
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-primary)]">
                <Check size={12} className="text-[var(--color-success-dark)] flex-shrink-0" />
                Send automated pay balance reminders (once insurance is processed)
              </div>
            )}
            {!billing.sendBillingEmails && !billing.sendPaymentReminders && (
              <span className="text-[13px] text-[var(--color-text-muted)]">
                No billing communications enabled
              </span>
            )}
          </div>
        </IconSection>
        {aiInsight}
      </CardBody>
    </Card>
  )
}

export { BillingPaymentsCard }
