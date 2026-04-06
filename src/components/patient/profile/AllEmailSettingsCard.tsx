import { Settings } from 'lucide-react'
import { Card, CardBody } from '../../ui/Card'
import { IconSection } from '../../ui/IconSection'
import { Divider } from '../../ui/Divider'
import type { Patient } from '../../../types/patient'

interface Props {
  patient: Patient
  aiInsight?: React.ReactNode
}

function AllEmailSettingsCard({ patient, aiInsight }: Props) {
  const allDoNotEmail = patient.doNotEmail

  return (
    <Card>
      <div className="flex items-center gap-2 px-4 py-3">
        <Settings size={14} className="text-[var(--color-text-muted)]" />
        <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
          All Email Settings
        </span>
      </div>
      <Divider className="my-0" />
      <CardBody>
        <IconSection icon={<Settings size={14} />}>
          <span className="text-[13px] text-[var(--color-text-primary)]">
            {allDoNotEmail ? 'Do Not Email' : 'Emails Enabled'}
          </span>
        </IconSection>
        {aiInsight}
      </CardBody>
    </Card>
  )
}

export { AllEmailSettingsCard }
