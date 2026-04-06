import { User, Phone, Mail, MapPin, Clock, Pencil } from 'lucide-react'
import { Card, CardBody } from '../../ui/Card'
import { IconSection } from '../../ui/IconSection'
import { Badge } from '../../ui/Badge'
import { Divider } from '../../ui/Divider'
import type { Patient } from '../../../types/patient'

interface Props {
  patient: Patient
  aiInsight?: React.ReactNode
}

const PHONE_LABELS: Record<string, string> = {
  home: 'Home',
  mobile: 'Mobile',
  work: 'Work',
  other: 'Other',
}

function ContactInfoCard({ patient, aiInsight }: Props) {
  const fullName = `${patient.firstName}${patient.preferredName ? ` "${patient.preferredName}"` : ''} ${patient.lastName}`

  return (
    <Card>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
          Contact Info
        </span>
        <button className="text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-dark)] transition-colors">
          <Pencil size={13} />
        </button>
      </div>
      <Divider className="my-0" />
      <CardBody className="space-y-3">
        {/* Name */}
        <IconSection icon={<User size={14} />}>
          <span className="text-[13px] text-[var(--color-text-primary)]">{fullName}</span>
          {patient.pronouns && (
            <span className="ml-2 text-[11px] text-[var(--color-text-muted)]">({patient.pronouns})</span>
          )}
        </IconSection>

        {/* Phones */}
        <IconSection icon={<Phone size={14} />}>
          <div className="space-y-1">
            {patient.phones.map((phone, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[13px] text-[var(--color-text-primary)]">{phone.number}</span>
                {phone.isPrimary && (
                  <Badge variant="default" className="text-[9px] py-0 px-1">Primary</Badge>
                )}
                <span className="text-[11px] text-[var(--color-text-muted)]">
                  {PHONE_LABELS[phone.type]}
                </span>
              </div>
            ))}
          </div>
        </IconSection>

        {/* Email */}
        {patient.email && (
          <IconSection icon={<Mail size={14} />}>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={`mailto:${patient.email}`}
                className="text-[13px] text-[var(--color-text-link)] hover:underline"
              >
                {patient.email}
              </a>
              {patient.doNotEmail && (
                <Badge variant="danger" className="text-[9px] py-0 px-1">Do Not Email</Badge>
              )}
              {!patient.emailVerified && !patient.doNotEmail && (
                <Badge variant="warning" className="text-[9px] py-0 px-1">Unverified</Badge>
              )}
            </div>
          </IconSection>
        )}

        {/* Address */}
        {patient.address && (
          <IconSection icon={<MapPin size={14} />}>
            <div className="text-[13px] text-[var(--color-text-primary)] leading-snug">
              <div>{patient.address.street}</div>
              <div>
                {patient.address.city} {patient.address.province} {patient.address.postalCode}
              </div>
              <div>{patient.address.country}</div>
            </div>
          </IconSection>
        )}

        {/* Time Zone */}
        <IconSection icon={<Clock size={14} />}>
          <div>
            <div className="text-[11px] text-[var(--color-text-muted)] mb-0.5">Time Zone</div>
            <div className="text-[13px] text-[var(--color-text-primary)]">{patient.timeZone}</div>
          </div>
        </IconSection>

        {aiInsight}
      </CardBody>
    </Card>
  )
}

export { ContactInfoCard }
