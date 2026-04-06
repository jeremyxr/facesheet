import { useState, useRef, useEffect, useMemo } from 'react'
import { Search, ListFilter, Check, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Patient } from '../../types/patient'

// ─── Filter configuration ────────────────────────────────────────────

export type FilterType = 'multi-select' | 'text' | 'date-range'

export interface FilterFieldConfig {
  id: string
  label: string
  group: string
  type: FilterType
  options?: { value: string; label: string }[]
  test: (p: Patient, state: FilterValue) => boolean
}

export type FilterValue =
  | { type: 'multi-select'; selected: Set<string> }
  | { type: 'text'; query: string }
  | { type: 'date-range'; from?: string; to?: string }

export type FilterState = Record<string, FilterValue>

// ─── Filter definitions ──────────────────────────────────────────────

export const FILTER_FIELDS: FilterFieldConfig[] = [
  // Status
  {
    id: 'active', label: 'Active patients', group: 'Status', type: 'multi-select',
    options: [{ value: 'yes', label: 'Active' }, { value: 'no', label: 'Not active' }],
    test: (p, v) => {
      const sel = (v as { type: 'multi-select'; selected: Set<string> }).selected
      const isActive = !p.flags.isDischarged && !p.flags.isDeceased && p.stats.monthsSinceLastVisit < 12
      return sel.has(isActive ? 'yes' : 'no')
    },
  },
  {
    id: 'hasBalance', label: 'Outstanding balance', group: 'Status', type: 'multi-select',
    options: [{ value: 'yes', label: 'Has balance' }, { value: 'no', label: 'No balance' }],
    test: (p, v) => {
      const sel = (v as { type: 'multi-select'; selected: Set<string> }).selected
      const has = p.stats.claimsOutstanding + p.stats.privateOutstanding > 0
      return sel.has(has ? 'yes' : 'no')
    },
  },
  {
    id: 'needsFollowUp', label: 'Needs follow-up', group: 'Status', type: 'multi-select',
    options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
    test: (p, v) => {
      const sel = (v as { type: 'multi-select'; selected: Set<string> }).selected
      const needs = p.stats.monthsSinceLastVisit > 6 && p.stats.upcomingAppointments === 0
      return sel.has(needs ? 'yes' : 'no')
    },
  },
  {
    id: 'newPatient', label: 'New patient', group: 'Status', type: 'multi-select',
    options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
    test: (p, v) => {
      const sel = (v as { type: 'multi-select'; selected: Set<string> }).selected
      const isNew = p.stats.totalBookings <= 3
      return sel.has(isNew ? 'yes' : 'no')
    },
  },

  // Demographics
  {
    id: 'sex', label: 'Sex', group: 'Demographics', type: 'multi-select',
    options: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Other', label: 'Other' },
      { value: 'Unknown', label: 'Unknown' },
    ],
    test: (p, v) => (v as { type: 'multi-select'; selected: Set<string> }).selected.has(p.sex),
  },
  {
    id: 'gender', label: 'Gender', group: 'Demographics', type: 'multi-select',
    options: [
      { value: 'Man', label: 'Man' },
      { value: 'Woman', label: 'Woman' },
      { value: 'Non-binary', label: 'Non-binary' },
      { value: 'Other', label: 'Other' },
    ],
    test: (p, v) => (v as { type: 'multi-select'; selected: Set<string> }).selected.has(p.gender ?? ''),
  },
  {
    id: 'timezone', label: 'Timezone', group: 'Demographics', type: 'multi-select',
    options: [
      { value: 'America/Vancouver', label: 'Pacific (Vancouver)' },
      { value: 'America/Edmonton', label: 'Mountain (Edmonton)' },
      { value: 'America/Winnipeg', label: 'Central (Winnipeg)' },
      { value: 'America/Toronto', label: 'Eastern (Toronto)' },
      { value: 'America/Halifax', label: 'Atlantic (Halifax)' },
      { value: 'America/St_Johns', label: 'Newfoundland (St. John\'s)' },
    ],
    test: (p, v) => (v as { type: 'multi-select'; selected: Set<string> }).selected.has(p.timeZone),
  },

  // Engagement
  {
    id: 'completedIntakeForm', label: 'Completed intake form', group: 'Engagement', type: 'multi-select',
    options: [{ value: 'yes', label: 'Completed' }, { value: 'no', label: 'Not completed' }],
    test: (p, v) => {
      const sel = (v as { type: 'multi-select'; selected: Set<string> }).selected
      return sel.has(p.completedIntakeForm ? 'yes' : 'no')
    },
  },
  {
    id: 'marketingEmailStatus', label: 'Marketing email status', group: 'Engagement', type: 'multi-select',
    options: [
      { value: 'subscribed', label: 'Subscribed' },
      { value: 'unsubscribed', label: 'Unsubscribed' },
      { value: 'not_set', label: 'Not set' },
    ],
    test: (p, v) => (v as { type: 'multi-select'; selected: Set<string> }).selected.has(p.marketingEmailStatus),
  },
  {
    id: 'referralSource', label: 'Referral source', group: 'Engagement', type: 'multi-select',
    options: [
      { value: 'google', label: 'Google' },
      { value: 'friend', label: 'Friend' },
      { value: 'doctor', label: 'Doctor' },
      { value: 'social_media', label: 'Social media' },
      { value: 'other', label: 'Other' },
    ],
    test: (p, v) => (v as { type: 'multi-select'; selected: Set<string> }).selected.has(p.referralSource),
  },

  // Policy
  {
    id: 'onlineBookingPolicy', label: 'Online booking policy', group: 'Policy', type: 'multi-select',
    options: [{ value: 'enabled', label: 'Enabled' }, { value: 'disabled', label: 'Disabled' }],
    test: (p, v) => (v as { type: 'multi-select'; selected: Set<string> }).selected.has(p.onlineBookingPolicy),
  },
  {
    id: 'onlinePaymentPolicy', label: 'Online payment policy', group: 'Policy', type: 'multi-select',
    options: [{ value: 'enabled', label: 'Enabled' }, { value: 'disabled', label: 'Disabled' }],
    test: (p, v) => (v as { type: 'multi-select'; selected: Set<string> }).selected.has(p.onlinePaymentPolicy),
  },

  // Text search
  {
    id: 'nameSearch', label: 'Patient name', group: 'Search', type: 'text',
    test: (p, v) => {
      const q = (v as { type: 'text'; query: string }).query.toLowerCase()
      if (!q) return true
      return `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
    },
  },

  // Date ranges
  {
    id: 'createdAt', label: 'Created date', group: 'Dates', type: 'date-range',
    test: (p, v) => {
      const { from, to } = v as { type: 'date-range'; from?: string; to?: string }
      if (from && p.createdAt < from) return false
      if (to && p.createdAt > to) return false
      return true
    },
  },
  {
    id: 'lastActivityDate', label: 'Last activity date', group: 'Dates', type: 'date-range',
    test: (p, v) => {
      const { from, to } = v as { type: 'date-range'; from?: string; to?: string }
      if (from && p.lastActivityDate < from) return false
      if (to && p.lastActivityDate > to) return false
      return true
    },
  },
]

const FIELD_MAP = new Map(FILTER_FIELDS.map((f) => [f.id, f]))

export function applyFilters(patients: Patient[], state: FilterState): Patient[] {
  const activeEntries = Object.entries(state)
  if (activeEntries.length === 0) return patients
  return patients.filter((p) =>
    activeEntries.every(([id, value]) => {
      const field = FIELD_MAP.get(id)
      if (!field) return true
      return field.test(p, value)
    })
  )
}

export function countActiveFilters(state: FilterState): number {
  return Object.entries(state).filter(([, v]) => {
    if (v.type === 'multi-select') return v.selected.size > 0
    if (v.type === 'text') return v.query.length > 0
    if (v.type === 'date-range') return v.from || v.to
    return false
  }).length
}

// ─── Dropdown component ──────────────────────────────────────────────

const GROUP_ORDER = ['Status', 'Demographics', 'Engagement', 'Policy', 'Dates', 'Search']

interface FilterDropdownProps {
  filterState: FilterState
  onChange: (state: FilterState) => void
}

export function FilterDropdown({ filterState, onChange }: FilterDropdownProps) {
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
      // Auto-focus search when opening
      requestAnimationFrame(() => searchRef.current?.focus())
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const activeCount = countActiveFilters(filterState)

  const filtered = useMemo(() => {
    if (!search) return FILTER_FIELDS
    const q = search.toLowerCase()
    return FILTER_FIELDS.filter(
      (f) => f.label.toLowerCase().includes(q) || f.group.toLowerCase().includes(q)
    )
  }, [search])

  const grouped = useMemo(() => {
    const map = new Map<string, FilterFieldConfig[]>()
    for (const f of filtered) {
      const arr = map.get(f.group) ?? []
      arr.push(f)
      map.set(f.group, arr)
    }
    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({ group: g, fields: map.get(g)! }))
  }, [filtered])

  function setFieldValue(fieldId: string, value: FilterValue) {
    const next = { ...filterState, [fieldId]: value }
    // Remove if empty
    if (value.type === 'multi-select' && value.selected.size === 0) delete next[fieldId]
    if (value.type === 'text' && !value.query) delete next[fieldId]
    if (value.type === 'date-range' && !value.from && !value.to) delete next[fieldId]
    onChange(next)
  }

  function toggleOption(fieldId: string, optionValue: string) {
    const existing = filterState[fieldId] as { type: 'multi-select'; selected: Set<string> } | undefined
    const selected = new Set(existing?.selected ?? [])
    selected.has(optionValue) ? selected.delete(optionValue) : selected.add(optionValue)
    setFieldValue(fieldId, { type: 'multi-select', selected })
  }

  function clearAll() {
    onChange({})
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'relative flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] transition-colors',
          open
            ? 'text-[var(--color-brand-primary)]'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
        )}
      >
        <ListFilter size={15} />
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-white text-[9px] font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute left-0 top-full mt-1 w-72 bg-white rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] shadow-lg z-30 flex flex-col max-h-[420px]">
          {/* Search */}
          <div className="px-3 py-2 border-b border-[var(--color-border-subtle)] flex-shrink-0">
            <div className="relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search filters..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-6 pr-2 py-1 text-[12px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
              />
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 py-1">
            {grouped.length === 0 ? (
              <div className="px-3 py-4 text-[12px] text-[var(--color-text-muted)] text-center">No filters match</div>
            ) : (
              grouped.map(({ group, fields }) => (
                <div key={group}>
                  <div className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {group}
                  </div>
                  {fields.map((field) => (
                    <FilterFieldRow
                      key={field.id}
                      field={field}
                      value={filterState[field.id]}
                      onToggleOption={(opt) => toggleOption(field.id, opt)}
                      onSetValue={(v) => setFieldValue(field.id, v)}
                    />
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {activeCount > 0 && (
            <div className="px-3 py-2 border-t border-[var(--color-border-subtle)] flex-shrink-0">
              <button
                onClick={clearAll}
                className="text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Filter field row ────────────────────────────────────────────────

function FilterFieldRow({
  field,
  value,
  onToggleOption,
  onSetValue,
}: {
  field: FilterFieldConfig
  value: FilterValue | undefined
  onToggleOption: (opt: string) => void
  onSetValue: (v: FilterValue) => void
}) {
  const [expanded, setExpanded] = useState(!!value)

  // Auto-expand if value exists
  useEffect(() => {
    if (value) setExpanded(true)
  }, [value])

  const hasValue = value && (
    (value.type === 'multi-select' && value.selected.size > 0) ||
    (value.type === 'text' && value.query.length > 0) ||
    (value.type === 'date-range' && (value.from || value.to))
  )

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-left transition-colors hover:bg-[var(--color-bg-subtle)]',
          hasValue ? 'text-[var(--color-brand-primary-dark)] font-medium' : 'text-[var(--color-text-primary)]'
        )}
      >
        <span className="flex-1">{field.label}</span>
        {hasValue && (
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] flex-shrink-0" />
        )}
      </button>

      {expanded && field.type === 'multi-select' && field.options && (
        <div className="pl-5 pr-3 pb-1">
          {field.options.map((opt) => {
            const selected = value?.type === 'multi-select' && value.selected.has(opt.value)
            return (
              <button
                key={opt.value}
                onClick={() => onToggleOption(opt.value)}
                className="w-full flex items-center gap-2 px-2 py-1 text-[11px] text-left text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] rounded-[var(--radius-sm)] transition-colors"
              >
                <span className={cn(
                  'w-3.5 h-3.5 rounded flex items-center justify-center border flex-shrink-0',
                  selected
                    ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)] text-white'
                    : 'border-[var(--color-border-default)] bg-white'
                )}>
                  {selected && <Check size={8} />}
                </span>
                {opt.label}
              </button>
            )
          })}
        </div>
      )}

      {expanded && field.type === 'text' && (
        <div className="px-5 pb-2">
          <input
            type="text"
            placeholder={`Search by ${field.label.toLowerCase()}...`}
            value={(value as { type: 'text'; query: string } | undefined)?.query ?? ''}
            onChange={(e) => onSetValue({ type: 'text', query: e.target.value })}
            className="w-full px-2 py-1 text-[11px] bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
          />
        </div>
      )}

      {expanded && field.type === 'date-range' && (
        <div className="px-5 pb-2 flex items-center gap-1.5">
          <input
            type="date"
            value={(value as { type: 'date-range'; from?: string; to?: string } | undefined)?.from ?? ''}
            onChange={(e) => {
              const existing = value as { type: 'date-range'; from?: string; to?: string } | undefined
              onSetValue({ type: 'date-range', from: e.target.value || undefined, to: existing?.to })
            }}
            className="flex-1 px-1.5 py-1 text-[11px] bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
          />
          <span className="text-[10px] text-[var(--color-text-muted)]">to</span>
          <input
            type="date"
            value={(value as { type: 'date-range'; from?: string; to?: string } | undefined)?.to ?? ''}
            onChange={(e) => {
              const existing = value as { type: 'date-range'; from?: string; to?: string } | undefined
              onSetValue({ type: 'date-range', from: existing?.from, to: e.target.value || undefined })
            }}
            className="flex-1 px-1.5 py-1 text-[11px] bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
          />
        </div>
      )}
    </div>
  )
}

// ─── Active filter chips ─────────────────────────────────────────────

export function ActiveFilterChips({
  filterState,
  onChange,
}: {
  filterState: FilterState
  onChange: (state: FilterState) => void
}) {
  const entries = Object.entries(filterState).filter(([, v]) => {
    if (v.type === 'multi-select') return v.selected.size > 0
    if (v.type === 'text') return v.query.length > 0
    if (v.type === 'date-range') return v.from || v.to
    return false
  })

  if (entries.length === 0) return null

  function removeFilter(id: string) {
    const next = { ...filterState }
    delete next[id]
    onChange(next)
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {entries.map(([id, value]) => {
        const field = FIELD_MAP.get(id)
        if (!field) return null
        let label = field.label
        if (value.type === 'multi-select' && value.selected.size > 0) {
          const count = value.selected.size
          const total = field.options?.length ?? 0
          if (count < total) label = `${field.label}: ${count}`
        }
        if (value.type === 'text') label = `${field.label}: "${value.query}"`
        if (value.type === 'date-range') {
          const parts: string[] = []
          if (value.from) parts.push(`from ${value.from}`)
          if (value.to) parts.push(`to ${value.to}`)
          label = `${field.label}: ${parts.join(' ')}`
        }
        return (
          <button
            key={id}
            onClick={() => removeFilter(id)}
            className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-[var(--color-brand-primary)] text-white transition-all hover:bg-[var(--color-brand-primary-dark)]"
          >
            {label}
            <X size={10} />
          </button>
        )
      })}
      {entries.length > 1 && (
        <button
          onClick={() => onChange({})}
          className="text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] ml-0.5"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
