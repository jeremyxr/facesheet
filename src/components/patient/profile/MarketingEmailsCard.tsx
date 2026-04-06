import { Megaphone } from 'lucide-react'
import { Card, CardBody } from '../../ui/Card'
import { IconSection } from '../../ui/IconSection'
import { Divider } from '../../ui/Divider'
import type { Patient } from '../../../types/patient'

interface Props {
  patient: Patient
  aiInsight?: React.ReactNode
}

function MarketingEmailsCard({ patient, aiInsight }: Props) {
  return (
    <Card>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
          Marketing Emails
        </span>
      </div>
      <Divider className="my-0" />
      <CardBody>
        <IconSection icon={<Megaphone size={14} />}>
          <span className="text-[13px] text-[var(--color-text-primary)]">
            {patient.marketingEmailsOptedIn ? 'Opted In' : 'Opted Out'}
          </span>
        </IconSection>
        {aiInsight}
      </CardBody>
    </Card>
  )
}

export { MarketingEmailsCard }
