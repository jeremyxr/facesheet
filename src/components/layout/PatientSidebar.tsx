import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { cn } from '../../lib/cn'
import { MOCK_PATIENTS } from '../../mocks/patients'

function PatientSidebar() {
  const { patientId } = useParams()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return MOCK_PATIENTS.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q)
    ).sort((a, b) => a.lastName.localeCompare(b.lastName))
  }, [query])

  // Group by first letter of last name
  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {}
    for (const p of filtered) {
      const letter = p.lastName[0].toUpperCase()
      if (!map[letter]) map[letter] = []
      map[letter].push(p)
    }
    return map
  }, [filtered])

  return (
    <aside
      className="flex flex-col flex-shrink-0 bg-white border-r border-[var(--color-border-subtle)] overflow-hidden"
      style={{ width: 'var(--sidebar-width)' }}
    >
      {/* Search */}
      <div className="p-3 border-b border-[var(--color-border-subtle)]">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Patient Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 text-[12px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(grouped).map(([letter, patients]) => (
          <div key={letter}>
            {patients.map((patient) => {
              const isActive = String(patient.id) === patientId
              return (
                <Link
                  key={patient.id}
                  to={`/patients/${patient.id}`}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 border-b border-[var(--color-border-subtle)] transition-colors group',
                    isActive
                      ? 'bg-[var(--color-brand-primary-light)] border-l-2 border-l-[var(--color-brand-primary)]'
                      : 'hover:bg-[var(--color-bg-subtle)]'
                  )}
                >
                  <span className={cn(
                    'text-[12px]',
                    isActive
                      ? 'text-[var(--color-text-primary)] font-semibold'
                      : 'text-[var(--color-text-primary)]'
                  )}>
                    {patient.firstName}{' '}
                    <strong className="font-semibold">{patient.lastName}</strong>
                  </span>
                  {isActive && (
                    <button
                      className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-all"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Plus size={12} />
                    </button>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* New Patient button */}
      <div className="p-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)]">
        <Link
          to="/patients/new"
          className="flex items-center gap-1.5 text-[12px] text-[var(--color-text-link)] hover:underline font-medium"
        >
          <Plus size={13} />
          New Patient
        </Link>
      </div>
    </aside>
  )
}

export { PatientSidebar }
