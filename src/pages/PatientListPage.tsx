import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Plus, ChevronUp, ChevronDown, ChevronsUpDown,
  CalendarPlus, MessageSquare, Phone, X,
  Users, CalendarClock, DollarSign, AlertCircle,
  Rows3, Rows4, Check, Settings, UserPlus, Link2,
} from 'lucide-react'
import { cn } from '../lib/cn'
import { MOCK_PATIENTS } from '../mocks/patients'
import { Button } from '../components/ui/Button'
import type { Patient } from '../types/patient'
import { FilterDropdown, ActiveFilterChips, applyFilters } from '../components/patient/FilterDropdown'
import type { FilterState } from '../components/patient/FilterDropdown'
import { ColumnPicker, COLUMN_DEFS, DEFAULT_COLUMNS } from '../components/patient/ColumnPicker'

// ─── Types ────────────────────────────────────────────────────────────

type SortDir = 'asc' | 'desc'
type Density = 'compact' | 'comfortable'
type StatusTag = { label: string; color: string; bg: string }

// Card filter IDs map to FilterState entries
type CardFilterId = 'active' | 'seenThisMonth' | 'hasUpcoming' | 'hasBalance' | 'needsFollowUp'

// ─── Helpers ──────────────────────────────────────────────────────────

function formatPhone(p: Patient) {
  const primary = p.phones.find((ph) => ph.isPrimary) ?? p.phones[0]
  return primary?.number ?? '—'
}

function formatBalance(p: Patient) {
  const total = p.stats.claimsOutstanding + p.stats.privateOutstanding
  if (total === 0) return null
  return `$${total.toLocaleString()}`
}

function getBalance(p: Patient) {
  return p.stats.claimsOutstanding + p.stats.privateOutstanding
}

function formatDob(dob: string) {
  const [year, month, day] = dob.split('-')
  return `${month}/${day}/${year}`
}

function formatIsoDate(iso: string) {
  const [y, m, d] = iso.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function formatLastVisit(months: number) {
  if (months === 0) return 'This month'
  if (months === 1) return '1 mo ago'
  return `${months} mo ago`
}

function getNextApptDate(p: Patient): string | null {
  if (p.stats.upcomingAppointments === 0) return null
  const dayOffset = ((p.id * 7) % 45) + 1
  const base = new Date(2026, 3, 1)
  base.setDate(base.getDate() + dayOffset)
  return base.toISOString().split('T')[0]
}

function getStatuses(p: Patient): StatusTag[] {
  const tags: StatusTag[] = []
  if (p.stats.totalBookings <= 3)
    tags.push({ label: 'New', color: 'text-[#8652ff]', bg: 'bg-[#f0eaff]' })
  if (p.stats.monthsSinceLastVisit >= 12)
    tags.push({ label: 'Inactive', color: 'text-[var(--color-text-muted)]', bg: 'bg-[var(--color-bg-subtle)]' })
  else if (p.stats.monthsSinceLastVisit > 6 && p.stats.upcomingAppointments === 0)
    tags.push({ label: 'Overdue', color: 'text-[#c2590a]', bg: 'bg-[#fff4e6]' })
  if (p.stats.claimsOutstanding + p.stats.privateOutstanding > 0)
    tags.push({ label: 'Balance', color: 'text-[var(--color-danger)]', bg: 'bg-[#fde8e8]' })
  if (p.stats.upcomingAppointments > 0)
    tags.push({ label: 'Active', color: 'text-[var(--color-brand-primary-dark)]', bg: 'bg-[var(--color-brand-primary-light)]' })
  return tags
}

// Map card filter IDs to FilterState entries
const CARD_FILTER_MAP: Record<CardFilterId, (current: FilterState) => FilterState> = {
  active: (cur) => cur.active ? ({} as FilterState) : { active: { type: 'multi-select', selected: new Set(['yes']) } },
  seenThisMonth: (cur) => {
    if (cur.lastActivityDate) return {} as FilterState
    return { lastActivityDate: { type: 'date-range', from: '2026-03-01', to: '2026-03-31' } }
  },
  hasUpcoming: (cur) => {
    if (cur.active?.type === 'multi-select' && cur.active.selected.has('yes') && Object.keys(cur).length === 1) return {} as FilterState
    return { active: { type: 'multi-select', selected: new Set(['yes']) } }
  },
  hasBalance: (cur) => cur.hasBalance ? ({} as FilterState) : { hasBalance: { type: 'multi-select', selected: new Set(['yes']) } },
  needsFollowUp: (cur) => cur.needsFollowUp ? ({} as FilterState) : { needsFollowUp: { type: 'multi-select', selected: new Set(['yes']) } },
}

function formatReferralSource(source: string) {
  const map: Record<string, string> = { google: 'Google', friend: 'Friend', doctor: 'Doctor', social_media: 'Social media', other: 'Other' }
  return map[source] ?? source
}

function formatMarketingStatus(status: string) {
  const map: Record<string, string> = { subscribed: 'Subscribed', unsubscribed: 'Unsubscribed', not_set: 'Not set' }
  return map[status] ?? status
}

function formatPolicy(policy: string) {
  return policy === 'enabled' ? 'Enabled' : 'Disabled'
}

// ─── Sort icon ────────────────────────────────────────────────────────

function SortIcon({ column, sortKey, sortDir }: { column: string; sortKey: string; sortDir: SortDir }) {
  if (column !== sortKey) return <ChevronsUpDown size={12} className="text-[var(--color-text-muted)] opacity-40" />
  return sortDir === 'asc'
    ? <ChevronUp size={12} className="text-[var(--color-brand-primary)]" />
    : <ChevronDown size={12} className="text-[var(--color-brand-primary)]" />
}

// ─── New menu dropdown ───────────────────────────────────────────────

function NewMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const items = [
    { label: 'New patient', icon: UserPlus },
    { label: 'New group', icon: Users },
    { label: 'New relationship', icon: Link2 },
  ]

  return (
    <div ref={menuRef} className="relative">
      <Button
        variant="primary"
        size="md"
        className="flex-shrink-0 gap-1.5"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setOpen(!open)}
      >
        <Plus size={14} />
        New
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] shadow-lg z-30 overflow-hidden py-1">
          {items.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors text-left"
            >
              <Icon size={14} className="text-[var(--color-text-muted)]" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────

function PatientListPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [filterState, setFilterState] = useState<FilterState>({})
  const [density, setDensity] = useState<Density>('comfortable')
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_COLUMNS)

  // ─── Computed data ────────────────────────────────────────────────

  const allPatients = MOCK_PATIENTS

  const summaryStats = useMemo(() => {
    const active = allPatients.filter((p) => !p.flags.isDischarged && !p.flags.isDeceased && p.stats.monthsSinceLastVisit < 12).length
    const seenThisMonth = allPatients.filter((p) => p.stats.monthsSinceLastVisit === 0).length
    const upcomingAppts = allPatients.reduce((sum, p) => sum + p.stats.upcomingAppointments, 0)
    const totalOutstanding = allPatients.reduce((sum, p) => sum + getBalance(p), 0)
    const outstandingCount = allPatients.filter((p) => getBalance(p) > 0).length
    const needsFollowUp = allPatients.filter(
      (p) => p.stats.monthsSinceLastVisit > 6 && p.stats.upcomingAppointments === 0
    ).length
    return { active, seenThisMonth, upcomingAppts, totalOutstanding, outstandingCount, needsFollowUp }
  }, [allPatients])

  const filtered = useMemo(() => {
    let result = allPatients
    // Text search
    if (query) {
      const q = query.toLowerCase()
      result = result.filter((p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.phones.some((ph) => ph.number.includes(q))
      )
    }
    // Apply filter state
    result = applyFilters(result, filterState)
    return result
  }, [query, filterState, allPatients])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'name':
          cmp = `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`)
          break
        case 'dob':
          cmp = a.dateOfBirth.localeCompare(b.dateOfBirth)
          break
        case 'lastVisit':
          cmp = a.stats.monthsSinceLastVisit - b.stats.monthsSinceLastVisit
          break
        case 'balance':
          cmp = getBalance(a) - getBalance(b)
          break
        case 'nextAppt': {
          const aDate = getNextApptDate(a) ?? 'z'
          const bDate = getNextApptDate(b) ?? 'z'
          cmp = aDate.localeCompare(bDate)
          break
        }
        case 'totalBookings':
          cmp = a.stats.totalBookings - b.stats.totalBookings
          break
        case 'createdAt':
          cmp = a.createdAt.localeCompare(b.createdAt)
          break
        case 'lastActivityDate':
          cmp = a.lastActivityDate.localeCompare(b.lastActivityDate)
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  // ─── Handlers ─────────────────────────────────────────────────────

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function handleCardClick(cardId: CardFilterId) {
    setFilterState((prev) => CARD_FILTER_MAP[cardId](prev))
  }

  function toggleNewPatientQuickFilter() {
    setFilterState((prev) => {
      if (prev.newPatient) {
        const next = { ...prev }
        delete next.newPatient
        return next
      }
      return { ...prev, newPatient: { type: 'multi-select', selected: new Set(['yes']) } }
    })
  }

  function toggleAll() {
    if (selected.size === sorted.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(sorted.map((p) => p.id)))
    }
  }

  function toggleOne(id: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const allSelected = sorted.length > 0 && selected.size === sorted.length
  const someSelected = selected.size > 0 && !allSelected
  const isCompact = density === 'compact'

  const activeColumns = COLUMN_DEFS.filter((c) => visibleColumns.includes(c.id))
  const colCount = activeColumns.length + 1
  const isVisible = (col: string) => visibleColumns.includes(col)

  const thBase = cn(
    'text-left font-semibold uppercase tracking-wide text-[var(--color-text-muted)] whitespace-nowrap select-none',
    isCompact ? 'px-3 py-2 text-[10px]' : 'px-4 py-3 text-[11px]'
  )
  const sortableTh = cn(thBase, 'cursor-pointer hover:text-[var(--color-text-primary)]')
  const tdBase = isCompact ? 'px-3 py-1.5' : 'px-4 py-3'
  const cellText = (muted?: boolean) => cn(
    muted ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-primary)]',
    isCompact ? 'text-[11px]' : 'text-[13px]'
  )

  // Check if a card is "active" based on filterState
  function isCardActive(cardId: CardFilterId): boolean {
    if (cardId === 'active') return !!filterState.active
    if (cardId === 'seenThisMonth') return !!filterState.lastActivityDate
    if (cardId === 'hasUpcoming') return !!filterState.active && Object.keys(filterState).length === 1
    if (cardId === 'hasBalance') return !!filterState.hasBalance
    if (cardId === 'needsFollowUp') return !!filterState.needsFollowUp
    return false
  }

  return (
    <div className="flex flex-col h-full">
      {/* ─── Summary stat cards ──────────────────────────────────── */}
      <div className="bg-[var(--color-bg-subtle)] border-b border-[var(--color-border-subtle)] pl-4 pr-6 pt-5 pb-4 flex-shrink-0" data-tour-id="patient-list-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[20px] font-semibold text-[var(--color-text-primary)]">Patients</h1>
          <div className="flex items-center gap-2">
            <NewMenu />
            <button
              onClick={() => navigate('/patients/settings')}
              className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] bg-white text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)] transition-colors"
              title="Patient settings"
            >
              <Settings size={15} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {([
            { cardId: 'active' as CardFilterId, value: summaryStats.active.toLocaleString(), label: 'Active patients', iconBg: 'bg-[var(--color-brand-primary-light)]', Icon: Users, iconColor: 'text-[var(--color-brand-primary-dark)]' },
            { cardId: 'seenThisMonth' as CardFilterId, value: summaryStats.seenThisMonth.toLocaleString(), label: 'Seen this month', iconBg: 'bg-[#e8f0e4]', Icon: Check, iconColor: 'text-[var(--color-success)]' },
            { cardId: 'hasUpcoming' as CardFilterId, value: summaryStats.upcomingAppts.toLocaleString(), label: 'Upcoming appts', iconBg: 'bg-[#e8f4fd]', Icon: CalendarClock, iconColor: 'text-[#4a90e2]' },
            { cardId: 'hasBalance' as CardFilterId, value: `$${summaryStats.totalOutstanding.toLocaleString()}`, label: `${summaryStats.outstandingCount.toLocaleString()} outstanding`, iconBg: 'bg-[#fde8e8]', Icon: DollarSign, iconColor: 'text-[var(--color-danger)]' },
            { cardId: 'needsFollowUp' as CardFilterId, value: summaryStats.needsFollowUp.toLocaleString(), label: 'Need follow-up', iconBg: 'bg-[#fff4e6]', Icon: AlertCircle, iconColor: 'text-[#c2590a]' },
          ]).map((card) => {
            const active = isCardActive(card.cardId)
            return (
              <button
                key={card.cardId}
                onClick={() => handleCardClick(card.cardId)}
                className={cn(
                  'flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 border text-left transition-all cursor-pointer',
                  active
                    ? 'bg-white border-[var(--color-brand-primary)] ring-1 ring-[var(--color-brand-primary)]'
                    : 'bg-white border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)]'
                )}
              >
                <div className={cn('w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0', card.iconBg)}>
                  <card.Icon size={16} className={card.iconColor} />
                </div>
                <div>
                  <div className="text-[18px] font-semibold text-[var(--color-text-primary)] leading-tight">{card.value}</div>
                  <div className="text-[11px] text-[var(--color-text-muted)]">{card.label}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Toolbar: search + filters + density + columns ───────── */}
      <div className="bg-white border-b border-[var(--color-border-subtle)] pl-4 pr-6 py-2.5 flex items-center gap-2 flex-shrink-0 flex-wrap">
        {/* Search */}
        <div className="relative w-56">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search patients..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 text-[12px] bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
          />
        </div>

        {/* Filter dropdown */}
        <FilterDropdown filterState={filterState} onChange={setFilterState} />

        {/* Quick filter */}
        <button
          onClick={toggleNewPatientQuickFilter}
          className={cn(
            'px-2.5 py-1 text-[11px] font-medium rounded-full border transition-colors',
            filterState.newPatient
              ? 'bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]'
              : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)]'
          )}
        >
          New patients
        </button>

        {/* Active filter chips */}
        <ActiveFilterChips filterState={filterState} onChange={setFilterState} />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Density toggle */}
        <div className="flex items-center border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] overflow-hidden">
          <button
            onClick={() => setDensity('compact')}
            className={cn(
              'p-1.5 transition-colors',
              isCompact
                ? 'bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            )}
            title="Compact"
          >
            <Rows4 size={14} />
          </button>
          <button
            onClick={() => setDensity('comfortable')}
            className={cn(
              'p-1.5 transition-colors',
              !isCompact
                ? 'bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            )}
            title="Comfortable"
          >
            <Rows3 size={14} />
          </button>
        </div>

        {/* Column picker */}
        <ColumnPicker visible={visibleColumns} onChange={setVisibleColumns} />
      </div>

      {/* ─── Table ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border-subtle)]">
            <tr>
              <th className={cn('pl-4 pr-1 w-10 text-left', isCompact ? 'py-2' : 'py-3')}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected }}
                  onChange={toggleAll}
                  className="rounded border-[var(--color-border-default)] accent-[var(--color-brand-primary)] cursor-pointer"
                />
              </th>
              {activeColumns.map((col) =>
                col.sortKey ? (
                  <th
                    key={col.id}
                    className={sortableTh}
                    onClick={() => handleSort(col.sortKey!)}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      <SortIcon column={col.sortKey} sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                ) : (
                  <th key={col.id} className={thBase}>{col.label}</th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="px-4 py-16 text-center text-[13px] text-[var(--color-text-muted)]">
                  No patients match your filters
                </td>
              </tr>
            ) : (
              sorted.map((patient, rowIndex) => {
                const isSelected = selected.has(patient.id)
                const balance = formatBalance(patient)
                const statuses = getStatuses(patient)
                const nextDate = getNextApptDate(patient)
                return (
                  <tr
                    key={patient.id}
                    {...(rowIndex === 0 ? { 'data-tour-id': 'patient-row-first' } : {})}
                    onClick={() => navigate(`/patients/${patient.id}/profile`)}
                    className={cn(
                      'cursor-pointer transition-colors group',
                      isSelected
                        ? 'bg-[color-mix(in_srgb,var(--color-brand-primary-light)_60%,white)]'
                        : 'bg-white hover:bg-[var(--color-bg-subtle)]'
                    )}
                  >
                    {/* Checkbox */}
                    <td
                      className={cn('pl-4 pr-1 w-10', isCompact ? 'py-1.5' : 'py-3')}
                      onClick={(e) => { e.stopPropagation(); toggleOne(patient.id) }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(patient.id)}
                        className="rounded border-[var(--color-border-default)] accent-[var(--color-brand-primary)] cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>

                    {/* Name */}
                    {isVisible('name') && (
                      <td className={tdBase}>
                        <div className="flex items-center gap-2.5">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                'font-semibold text-[var(--color-text-primary)] truncate',
                                isCompact ? 'text-[13px]' : 'text-[15px]'
                              )}>
                                {patient.firstName} {patient.lastName}
                              </span>
                              {statuses.map((s) => (
                                <span
                                  key={s.label}
                                  className={cn(
                                    'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider flex-shrink-0',
                                    s.color, s.bg
                                  )}
                                >
                                  {s.label}
                                </span>
                              ))}
                            </div>
                            {!isCompact && (
                              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                                {patient.pronouns && <span>{patient.pronouns}</span>}
                                <span>{patient.age} yrs</span>
                                {patient.personalHealthNumber && (
                                  <>
                                    <span className="text-[var(--color-border-default)]">·</span>
                                    <span>PHN {patient.personalHealthNumber}</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="ml-auto flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation() }}
                              className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary-dark)] hover:bg-[var(--color-brand-primary-light)] transition-colors"
                              title="Book appointment"
                            >
                              <CalendarPlus size={14} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation() }}
                              className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary-dark)] hover:bg-[var(--color-brand-primary-light)] transition-colors"
                              title="Send message"
                            >
                              <MessageSquare size={14} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation() }}
                              className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary-dark)] hover:bg-[var(--color-brand-primary-light)] transition-colors"
                              title="Call"
                            >
                              <Phone size={14} />
                            </button>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Phone */}
                    {isVisible('phone') && (
                      <td className={tdBase}>
                        <span className={cellText()}>{formatPhone(patient)}</span>
                      </td>
                    )}

                    {/* Date of Birth */}
                    {isVisible('dob') && (
                      <td className={tdBase}>
                        <span className={cellText()}>{formatDob(patient.dateOfBirth)}</span>
                      </td>
                    )}

                    {/* Last visit */}
                    {isVisible('lastVisit') && (
                      <td className={tdBase}>
                        <span className={cellText()}>{formatLastVisit(patient.stats.monthsSinceLastVisit)}</span>
                      </td>
                    )}

                    {/* Next appointment */}
                    {isVisible('nextAppt') && (
                      <td className={tdBase}>
                        <span className={cellText(!nextDate)}>{nextDate ? formatIsoDate(nextDate) : '—'}</span>
                      </td>
                    )}

                    {/* Total bookings */}
                    {isVisible('totalBookings') && (
                      <td className={tdBase}>
                        <span className={cn(cellText(), 'tabular-nums')}>{patient.stats.totalBookings}</span>
                      </td>
                    )}

                    {/* Last activity */}
                    {isVisible('lastActivityDate') && (
                      <td className={tdBase}>
                        <span className={cellText()}>{formatIsoDate(patient.lastActivityDate)}</span>
                      </td>
                    )}

                    {/* Outstanding balance */}
                    {isVisible('outstanding') && (
                      <td className={tdBase}>
                        {balance ? (
                          <span className={cn('font-medium text-[var(--color-danger)]', isCompact ? 'text-[11px]' : 'text-[13px]')}>
                            {balance}
                          </span>
                        ) : (
                          <span className={cellText(true)}>—</span>
                        )}
                      </td>
                    )}

                    {/* Sex */}
                    {isVisible('sex') && (
                      <td className={tdBase}>
                        <span className={cellText()}>{patient.sex}</span>
                      </td>
                    )}

                    {/* Gender */}
                    {isVisible('gender') && (
                      <td className={tdBase}>
                        <span className={cellText(!patient.gender)}>{patient.gender ?? '—'}</span>
                      </td>
                    )}

                    {/* Timezone */}
                    {isVisible('timezone') && (
                      <td className={tdBase}>
                        <span className={cn(cellText(), 'truncate max-w-[140px] block')} title={patient.timeZone}>
                          {patient.timeZone.replace('America/', '')}
                        </span>
                      </td>
                    )}

                    {/* Completed intake form */}
                    {isVisible('completedIntakeForm') && (
                      <td className={tdBase}>
                        <span className={cn(
                          isCompact ? 'text-[11px]' : 'text-[13px]',
                          patient.completedIntakeForm ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'
                        )}>
                          {patient.completedIntakeForm ? 'Yes' : 'No'}
                        </span>
                      </td>
                    )}

                    {/* Marketing email status */}
                    {isVisible('marketingEmailStatus') && (
                      <td className={tdBase}>
                        <span className={cn(
                          'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium',
                          patient.marketingEmailStatus === 'subscribed' ? 'text-[var(--color-success)] bg-[#e8f0e4]' :
                          patient.marketingEmailStatus === 'unsubscribed' ? 'text-[var(--color-danger)] bg-[#fde8e8]' :
                          'text-[var(--color-text-muted)] bg-[var(--color-bg-subtle)]'
                        )}>
                          {formatMarketingStatus(patient.marketingEmailStatus)}
                        </span>
                      </td>
                    )}

                    {/* Referral source */}
                    {isVisible('referralSource') && (
                      <td className={tdBase}>
                        <span className={cellText()}>{formatReferralSource(patient.referralSource)}</span>
                      </td>
                    )}

                    {/* Online booking policy */}
                    {isVisible('onlineBookingPolicy') && (
                      <td className={tdBase}>
                        <span className={cn(
                          isCompact ? 'text-[11px]' : 'text-[13px]',
                          patient.onlineBookingPolicy === 'enabled' ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'
                        )}>
                          {formatPolicy(patient.onlineBookingPolicy)}
                        </span>
                      </td>
                    )}

                    {/* Online payment policy */}
                    {isVisible('onlinePaymentPolicy') && (
                      <td className={tdBase}>
                        <span className={cn(
                          isCompact ? 'text-[11px]' : 'text-[13px]',
                          patient.onlinePaymentPolicy === 'enabled' ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'
                        )}>
                          {formatPolicy(patient.onlinePaymentPolicy)}
                        </span>
                      </td>
                    )}

                    {/* Created date */}
                    {isVisible('createdAt') && (
                      <td className={tdBase}>
                        <span className={cellText()}>{formatIsoDate(patient.createdAt)}</span>
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Sticky selection toolbar ────────────────────────────── */}
      {selected.size > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-[var(--color-text-primary)] text-white rounded-[var(--radius-lg)] shadow-xl px-5 py-2.5 animate-slideUp">
          <span className="text-[12px] font-semibold tabular-nums">
            {selected.size.toLocaleString()} selected
          </span>
          <div className="w-px h-5 bg-white/20" />
          <button
            onClick={(e) => { e.stopPropagation() }}
            className="flex items-center gap-1.5 text-[12px] font-medium hover:text-[var(--color-brand-primary-light)] transition-colors"
          >
            <MessageSquare size={13} />
            Message
          </button>
          <button
            onClick={(e) => { e.stopPropagation() }}
            className="flex items-center gap-1.5 text-[12px] font-medium hover:text-[var(--color-brand-primary-light)] transition-colors"
          >
            <CalendarPlus size={13} />
            Book
          </button>
          <div className="w-px h-5 bg-white/20" />
          <button
            onClick={() => setSelected(new Set())}
            className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

export { PatientListPage }
