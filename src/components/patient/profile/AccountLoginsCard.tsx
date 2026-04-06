import { User } from 'lucide-react'
import { Card, CardBody } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Divider } from '../../ui/Divider'
import type { Patient } from '../../../types/patient'

interface Props {
  patient: Patient
  aiInsight?: React.ReactNode
}

function AccountLoginsCard({ patient: _patient, aiInsight }: Props) {
  return (
    <Card>
      <div className="flex items-center gap-2 px-4 py-3">
        <User size={14} className="text-[var(--color-text-muted)]" />
        <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
          Username / Logins
        </span>
      </div>
      <Divider className="my-0" />
      <CardBody className="space-y-3">
        <p className="text-[13px] text-[var(--color-text-muted)]">
          No username or social logins
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" className="w-full">
            Do Not Email
          </Button>
          <Button variant="secondary" size="sm" className="w-full">
            Do Not Email
          </Button>
        </div>
        {aiInsight}
      </CardBody>
    </Card>
  )
}

export { AccountLoginsCard }
