import { NavLink, useParams } from 'react-router-dom'
import { cn } from '../../lib/cn'

const TABS = [
  { label: 'Profile', path: 'profile' },
  { label: 'Edit / Settings', path: 'settings' },
  { label: 'Chart', path: 'chart' },
  { label: 'Appointments', path: 'appointments' },
  { label: 'Billing', path: 'billing' },
  { label: 'Communications', path: 'communications' },
  { label: 'Files', path: 'files' },
  { label: 'Groups', path: 'groups' },
]

function PatientSubNav() {
  const { patientId } = useParams()

  return (
    <div className="flex items-center gap-1 px-5 py-2" data-tour-id="legacy-patient-tabs">
      {TABS.map(({ label, path }) => (
        <NavLink
          key={path}
          to={`/patients/${patientId}/${path}`}
          className={({ isActive }) =>
            cn(
              'px-3 py-1 text-[12px] font-medium rounded transition-colors whitespace-nowrap',
              isActive
                ? 'bg-[var(--color-brand-primary)] text-white'
                : 'text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-light)]'
            )
          }
        >
          {label}
        </NavLink>
      ))}
    </div>
  )
}

export { PatientSubNav }
