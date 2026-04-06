import { useState, useRef, useEffect, useMemo } from 'react'
import { Search, Columns3, Check } from 'lucide-react'
import { cn } from '../../lib/cn'

// ─── Column configuration ────────────────────────────────────────────

export interface ColumnConfig {
  id: string
  label: string
  group: string
  alwaysVisible?: boolean
  sortKey?: string
}

export const COLUMN_DEFS: ColumnConfig[] = [
  // Core
  { id: 'name', label: 'Name', group: 'Core', alwaysVisible: true, sortKey: 'name' },
  { id: 'phone', label: 'Phone', group: 'Core' },
  { id: 'dob', label: 'Date of Birth', group: 'Core', sortKey: 'dob' },

  // Activity
  { id: 'lastVisit', label: 'Last Visit', group: 'Activity', sortKey: 'lastVisit' },
  { id: 'nextAppt', label: 'Next Appt', group: 'Activity', sortKey: 'nextAppt' },
  { id: 'totalBookings', label: 'Bookings', group: 'Activity', sortKey: 'totalBookings' },
  { id: 'lastActivityDate', label: 'Last Activity', group: 'Activity', sortKey: 'lastActivityDate' },

  // Financial
  { id: 'outstanding', label: 'Outstanding', group: 'Financial', sortKey: 'balance' },

  // Demographics
  { id: 'sex', label: 'Sex', group: 'Demographics' },
  { id: 'gender', label: 'Gender', group: 'Demographics' },
  { id: 'timezone', label: 'Timezone', group: 'Demographics' },

  // Engagement
  { id: 'completedIntakeForm', label: 'Intake Form', group: 'Engagement' },
  { id: 'marketingEmailStatus', label: 'Marketing Email', group: 'Engagement' },
  { id: 'referralSource', label: 'Referral Source', group: 'Engagement' },

  // Policy
  { id: 'onlineBookingPolicy', label: 'Online Booking', group: 'Policy' },
  { id: 'onlinePaymentPolicy', label: 'Online Payment', group: 'Policy' },

  // Dates
  { id: 'createdAt', label: 'Created Date', group: 'Dates', sortKey: 'createdAt' },
]

const GROUP_ORDER = ['Core', 'Activity', 'Financial', 'Demographics', 'Engagement', 'Policy', 'Dates']

export const DEFAULT_COLUMNS: string[] = ['name', 'phone', 'dob', 'lastVisit', 'nextAppt', 'outstanding']

// ─── Component ───────────────────────────────────────────────────────

interface ColumnPickerProps {
  visible: string[]
  onChange: (cols: string[]) => void
}

export function ColumnPicker({ visible, onChange }: ColumnPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', handleClick)
      requestAnimationFrame(() => searchRef.current?.focus())
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const filtered = useMemo(() => {
    if (!search) return COLUMN_DEFS
    const q = search.toLowerCase()
    return COLUMN_DEFS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
    )
  }, [search])

  const grouped = useMemo(() => {
    const map = new Map<string, ColumnConfig[]>()
    for (const c of filtered) {
      const arr = map.get(c.group) ?? []
      arr.push(c)
      map.set(c.group, arr)
    }
    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({ group: g, columns: map.get(g)! }))
  }, [filtered])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-[var(--radius-sm)] border transition-colors',
          open
            ? 'border-[var(--color-border-focus)] bg-white text-[var(--color-text-primary)]'
            : 'border-[var(--color-border-subtle)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-border-default)]'
        )}
      >
        <Columns3 size={12} />
        Columns
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] shadow-lg z-30 flex flex-col max-h-[420px]">
          {/* Search */}
          <div className="px-3 py-2 border-b border-[var(--color-border-subtle)] flex-shrink-0">
            <div className="relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search columns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-6 pr-2 py-1 text-[12px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
              />
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 py-1">
            {grouped.length === 0 ? (
              <div className="px-3 py-4 text-[12px] text-[var(--color-text-muted)] text-center">No columns match</div>
            ) : (
              grouped.map(({ group, columns }) => (
                <div key={group}>
                  <div className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {group}
                  </div>
                  {columns.map((col) => {
                    const isOn = visible.includes(col.id)
                    return (
                      <button
                        key={col.id}
                        disabled={col.alwaysVisible}
                        onClick={() => {
                          if (col.alwaysVisible) return
                          onChange(isOn ? visible.filter((c) => c !== col.id) : [...visible, col.id])
                        }}
                        className={cn(
                          'w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-left transition-colors',
                          col.alwaysVisible
                            ? 'text-[var(--color-text-muted)] cursor-default'
                            : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] cursor-pointer'
                        )}
                      >
                        <span className={cn(
                          'w-3.5 h-3.5 rounded flex items-center justify-center border flex-shrink-0',
                          isOn
                            ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)] text-white'
                            : 'border-[var(--color-border-default)] bg-white'
                        )}>
                          {isOn && <Check size={8} />}
                        </span>
                        {col.label}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
