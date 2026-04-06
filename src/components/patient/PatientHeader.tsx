import { MessageSquare } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { PatientSubNav } from './PatientSubNav'
import { PatientDash } from './PatientDash'
import type { Patient } from '../../types/patient'

interface PatientHeaderProps {
  patient: Patient
}

function formatDOB(dob: string, age: number) {
  const date = new Date(dob + 'T00:00:00')
  const formatted = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  return `${formatted} (${age} years old)`
}

function PatientHeader({ patient }: PatientHeaderProps) {
  const fullName = `${patient.firstName} ${patient.lastName}`

  return (
    <div>
      {/* Name / meta row — on app background (gray) */}
      <div className="px-6 pt-5 pb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[32px] font-light text-[var(--color-text-primary)] leading-none">
              {fullName}
            </h1>
            {patient.flags.isDeceased && <Badge variant="danger">Deceased</Badge>}
            {patient.flags.isDischarged && <Badge variant="warning">Discharged</Badge>}
            {patient.flags.isStaffProfile && <Badge variant="default">Staff Profile</Badge>}
            {patient.flags.isTestPatient && <Badge variant="default">Test Patient</Badge>}
          </div>
          <p className="mt-2 text-[13px] text-[var(--color-text-secondary)]">
            DOB: {formatDOB(patient.dateOfBirth, patient.age)}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[13px] font-semibold text-[var(--color-text-secondary)]">
            Patient # <strong>{patient.id}</strong>
          </span>
          <Button variant="secondary" size="md">
            <MessageSquare size={13} />
            Send Message
          </Button>
        </div>
      </div>

      {/* Tab strip */}
      <PatientSubNav />

      {/* Stats bar */}
      <PatientDash patient={patient} />
    </div>
  )
}

export { PatientHeader }
