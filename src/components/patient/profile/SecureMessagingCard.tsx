import { MessageSquare, MoreHorizontal } from 'lucide-react'
import { Card, CardBody } from '../../ui/Card'
import { Badge } from '../../ui/Badge'
import { Divider } from '../../ui/Divider'
import type { Patient } from '../../../types/patient'

interface Props {
  patient: Patient
  aiInsight?: React.ReactNode
}

function SecureMessagingCard({ patient, aiInsight }: Props) {
  return (
    <Card>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-[var(--color-text-muted)]" />
          <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
            Secure Messaging
          </span>
          <Badge variant={patient.secureMessagingEnabled ? 'success' : 'default'}>
            {patient.secureMessagingEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
        <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
          <MoreHorizontal size={15} />
        </button>
      </div>
      <Divider className="my-0" />
      <CardBody>
        {patient.secureMessagingEnabled ? (
          <p className="text-[13px] text-[var(--color-text-muted)]">
            Patient can send and receive secure messages.
          </p>
        ) : (
          <p className="text-[13px] text-[var(--color-text-muted)]">
            Secure messaging is not enabled for this patient.
          </p>
        )}
        {aiInsight}
      </CardBody>
    </Card>
  )
}

export { SecureMessagingCard }
