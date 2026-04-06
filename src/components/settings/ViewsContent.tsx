import { useState, useRef, useEffect } from 'react'
import {
  Plus, Trash2, Copy, Check, X, ChevronDown,
  Search, Globe, UserCircle, Columns2, Square, RotateCcw,
  Lock, Users,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { MOCK_PATIENTS, MOCK_ROLES, MOCK_STAFF } from '../../mocks/patients'
import { useViewsStore, STANDARD_VIEW } from '../../stores/viewsStore'
import { CARD_DEFINITIONS, getCardDefinition } from '../../lib/cardRegistry'
import { matchViewFromPrompt, PRESET_TEMPLATES } from '../../lib/viewAiMatcher'
import type { ViewCardPlacement, ViewPermissions } from '../../types/views'

// ─── AI Builder ──────────────────────────────────────────────────────

function AiBuilder({ onApply }: { onApply: (cards: ViewCardPlacement[]) => void }) {
  const [prompt, setPrompt] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [resultChips, setResultChips] = useState<string[]>([])
  const [matchedPreset, setMatchedPreset] = useState<string | null>(null)
  const [noMatch, setNoMatch] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSubmit() {
    if (!prompt.trim() || isThinking) return
    const result = matchViewFromPrompt(prompt)

    setIsThinking(true)
    setResultChips([])
    setMatchedPreset(null)
    setNoMatch(false)

    // Fake "thinking" delay
    setTimeout(() => {
      setIsThinking(false)
      if (result.confidence === 'none') {
        setNoMatch(true)
      } else {
        setMatchedPreset(result.matchedPreset)
        setResultChips(result.cards.map((c) => getCardDefinition(c.cardId)?.label ?? c.cardId))
        onApply(result.cards)
      }
    }, 1200)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleChange(value: string) {
    setPrompt(value)
    setNoMatch(false)
    setResultChips([])
    setMatchedPreset(null)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.trim().length >= 3) {
      debounceRef.current = setTimeout(() => {
        // Auto-suggest on pause
      }, 800)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Describe your ideal layout, e.g. "clinical overview with treatment plans and alerts"'
          className="w-full pl-3.5 pr-24 py-2.5 text-[13px] bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors"
        />
        <button
          onClick={handleSubmit}
          disabled={!prompt.trim() || isThinking}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-[11px] font-medium rounded-[var(--radius-sm)] transition-colors',
            prompt.trim() && !isThinking
              ? 'bg-[var(--color-brand-primary)] text-white hover:opacity-90'
              : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]'
          )}
        >
          {isThinking ? 'Thinking...' : 'Generate'}
        </button>
      </div>

      {/* Thinking shimmer */}
      {isThinking && (
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-7 rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] animate-pulse"
              style={{ width: `${60 + i * 20}px`, animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      )}

      {/* Result chips */}
      {resultChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {matchedPreset && (
            <span className="text-[11px] text-[var(--color-brand-primary)] font-medium bg-[var(--color-brand-primary-light)] px-2 py-0.5 rounded-[var(--radius-sm)]">
              {matchedPreset}
            </span>
          )}
          <span className="text-[11px] text-[var(--color-text-muted)]">Added:</span>
          {resultChips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] rounded-[var(--radius-sm)] animate-fadeIn"
            >
              {chip}
              <Check size={10} className="text-[var(--color-success)]" />
            </span>
          ))}
        </div>
      )}

      {/* No match message */}
      {noMatch && (
        <p className="text-[12px] text-[var(--color-text-muted)]">
          Couldn't find matching cards. Try describing what clinical information you need, or browse the card catalog below.
        </p>
      )}

      {/* Preset suggestions */}
      {!prompt && !isThinking && resultChips.length === 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-[11px] text-[var(--color-text-muted)]">Try:</span>
          {PRESET_TEMPLATES.slice(0, 4).map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setPrompt(preset.aliases[0])
                setTimeout(() => {
                  const result = matchViewFromPrompt(preset.aliases[0])
                  setIsThinking(true)
                  setTimeout(() => {
                    setIsThinking(false)
                    setMatchedPreset(result.matchedPreset)
                    setResultChips(result.cards.map((c) => getCardDefinition(c.cardId)?.label ?? c.cardId))
                    onApply(result.cards)
                  }, 1200)
                }, 50)
              }}
              className="px-2 py-0.5 text-[11px] text-[var(--color-brand-primary)] bg-[var(--color-brand-primary-light)] rounded-[var(--radius-sm)] hover:opacity-80 transition-opacity"
            >
              {preset.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Scope Toggle (Global / Local) ──────────────────────────────────

function ScopeToggle({
  scope,
  onToggle,
  selectedPatientId,
  onSelectPatient,
  onClearOverride,
}: {
  scope: 'global' | 'local'
  onToggle: (scope: 'global' | 'local') => void
  selectedPatientId: number | null
  onSelectPatient: (id: number | null) => void
  onClearOverride: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center bg-[var(--color-bg-subtle)] rounded-[var(--radius-md)] p-0.5">
        <button
          onClick={() => onToggle('global')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-[var(--radius-sm)] transition-colors',
            scope === 'global'
              ? 'bg-white text-[var(--color-text-primary)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
          )}
        >
          <Globe size={11} />
          All Patients
        </button>
        <button
          onClick={() => onToggle('local')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-[var(--radius-sm)] transition-colors',
            scope === 'local'
              ? 'bg-white text-[var(--color-text-primary)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
          )}
        >
          <UserCircle size={11} />
          This Patient
        </button>
      </div>

      {scope === 'local' && (
        <>
          <PatientSelector
            selectedPatientId={selectedPatientId}
            onSelect={onSelectPatient}
          />
          {selectedPatientId && (
            <button
              onClick={onClearOverride}
              className="text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] whitespace-nowrap transition-colors"
            >
              Clear
            </button>
          )}
        </>
      )}
    </div>
  )
}

// ─── Patient Selector ───────────────────────────────────────────────

function PatientSelector({
  selectedPatientId,
  onSelect,
}: {
  selectedPatientId: number | null
  onSelect: (patientId: number | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedPatient = selectedPatientId
    ? MOCK_PATIENTS.find((p) => p.id === selectedPatientId)
    : null

  const filtered = MOCK_PATIENTS
    .filter((p) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        String(p.id).includes(q)
      )
    })
    .slice(0, 20)

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 text-[12px] bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] hover:bg-[var(--color-bg-subtle)] transition-colors min-w-[180px]"
      >
        <UserCircle size={13} className="text-[var(--color-text-muted)] flex-shrink-0" />
        <span className={cn(
          'flex-1 text-left truncate',
          selectedPatient ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'
        )}>
          {selectedPatient
            ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
            : 'Select a patient...'}
        </span>
        <ChevronDown size={12} className="text-[var(--color-text-muted)] flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] shadow-lg z-20 overflow-hidden">
          <div className="p-2 border-b border-[var(--color-border-subtle)]">
            <div className="relative">
              <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patients..."
                className="w-full pl-6 pr-2 py-1 text-[11px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:bg-white transition-colors"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelect(p.id)
                  setOpen(false)
                  setSearch('')
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors',
                  selectedPatientId === p.id ? 'bg-[var(--color-brand-primary-light)]' : 'hover:bg-[var(--color-bg-subtle)]'
                )}
              >
                <div className="w-5 h-5 rounded-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] flex items-center justify-center flex-shrink-0">
                  <UserCircle size={12} className="text-[var(--color-text-muted)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-[var(--color-text-primary)] truncate">
                    {p.firstName} {p.lastName}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">#{p.id}</p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-[11px] text-[var(--color-text-muted)]">No patients found</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Facesheet Preview Shell ─────────────────────────────────────────

function PreviewCard({
  cardId,
  width,
  onRemove,
  onToggleWidth,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  cardId: string
  width: 1 | 2
  onRemove: () => void
  onToggleWidth: () => void
  onDragStart: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}) {
  const def = getCardDefinition(cardId)
  if (!def) return null

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        'relative bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md group flex items-center justify-center text-center',
        width === 2 ? 'col-span-2 h-16' : 'h-24'
      )}
    >
      {/* Width toggle — between card label area, visible on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleWidth() }}
        className="absolute top-1.5 left-1.5 w-5 h-5 flex items-center justify-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-light)] transition-colors opacity-0 group-hover:opacity-100"
        title={width === 2 ? 'Single column' : 'Double column'}
      >
        {width === 2 ? <Square size={10} /> : <Columns2 size={10} />}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[#fde8e8] transition-colors opacity-0 group-hover:opacity-100"
      >
        <X size={10} />
      </button>
      <p className="text-[11px] font-medium text-[var(--color-text-primary)]">{def.label}</p>
    </div>
  )
}

// ─── Add Card Popover ────────────────────────────────────────────────

function AddCardPopover({
  activeCardIds,
  onToggleCard,
  onClose,
}: {
  activeCardIds: Set<string>
  onToggleCard: (cardId: string) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const groups = ['clinical', 'administrative', 'personal', 'notes'] as const
  const groupLabels: Record<string, string> = {
    clinical: 'Clinical',
    administrative: 'Administrative',
    personal: 'Personal',
    notes: 'Notes',
  }

  const filtered = CARD_DEFINITIONS.filter((d) =>
    !search || d.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      ref={popoverRef}
      className="absolute top-10 right-3 w-56 bg-white rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] shadow-lg z-10 overflow-hidden"
    >
      <div className="p-2 border-b border-[var(--color-border-subtle)]">
        <div className="relative">
          <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards..."
            className="w-full pl-6 pr-2 py-1 text-[11px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:bg-white transition-colors"
            autoFocus
          />
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto py-1">
        {groups.map((group) => {
          const groupCards = filtered.filter((d) => d.group === group)
          if (groupCards.length === 0) return null
          return (
            <div key={group}>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-3 pt-2 pb-1">
                {groupLabels[group]}
              </p>
              {groupCards.map((def) => {
                const isActive = activeCardIds.has(def.id)
                return (
                  <button
                    key={def.id}
                    onClick={() => onToggleCard(def.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors',
                      isActive ? 'bg-[var(--color-brand-primary-light)]' : 'hover:bg-[var(--color-bg-subtle)]'
                    )}
                  >
                    <div className={cn(
                      'w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0',
                      isActive
                        ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)]'
                        : 'border-[var(--color-border-default)]'
                    )}>
                      {isActive && <Check size={8} className="text-white" />}
                    </div>
                    <span className="text-[11px] text-[var(--color-text-primary)]">{def.label}</span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FacesheetPreview({
  cards,
  onUpdateCards,
  activeCardIds,
  onToggleCard,
}: {
  cards: ViewCardPlacement[]
  onUpdateCards: (cards: ViewCardPlacement[]) => void
  activeCardIds: Set<string>
  onToggleCard: (cardId: string) => void
}) {
  const [dragInfo, setDragInfo] = useState<{ cardId: string; zone: string; index: number } | null>(null)
  const [showAddPopover, setShowAddPopover] = useState(false)

  const pinnedCards = cards.filter((c) => c.zone === 'pinned').sort((a, b) => a.order - b.order)
  const mainCards = cards.filter((c) => c.zone === 'main').sort((a, b) => a.order - b.order)
  const sidebarCards = cards.filter((c) => c.zone === 'sidebar').sort((a, b) => a.order - b.order)

  function handleRemoveCard(cardId: string) {
    onUpdateCards(cards.filter((c) => c.cardId !== cardId))
  }

  function handleToggleWidth(cardId: string) {
    onUpdateCards(cards.map((c) =>
      c.cardId === cardId ? { ...c, width: (c.width ?? 1) === 2 ? 1 : 2 } : c
    ))
  }

  function handleDragStart(cardId: string, zone: string, index: number) {
    return (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', cardId)
      setDragInfo({ cardId, zone, index })
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDropOnCard(targetCardId: string, targetZone: string, targetIndex: number) {
    return (e: React.DragEvent) => {
      e.preventDefault()
      if (!dragInfo) return

      const { cardId: sourceCardId } = dragInfo

      if (sourceCardId === targetCardId) {
        setDragInfo(null)
        return
      }

      const newCards = cards.filter((c) => c.cardId !== sourceCardId)
      const sourceCard = cards.find((c) => c.cardId === sourceCardId)
      if (!sourceCard) return

      const movedCard: ViewCardPlacement = {
        ...sourceCard,
        zone: targetZone as ViewCardPlacement['zone'],
        order: targetIndex,
      }

      const zoneCards = newCards.filter((c) => c.zone === targetZone)
      const otherCards = newCards.filter((c) => c.zone !== targetZone)

      zoneCards.splice(targetIndex, 0, movedCard)
      zoneCards.forEach((c, i) => { c.order = i })

      onUpdateCards([...otherCards, ...zoneCards])
      setDragInfo(null)
    }
  }

  function handleDropOnZone(zone: string) {
    return (e: React.DragEvent) => {
      e.preventDefault()
      if (!dragInfo) return

      const { cardId: sourceCardId } = dragInfo
      const newCards = cards.filter((c) => c.cardId !== sourceCardId)
      const sourceCard = cards.find((c) => c.cardId === sourceCardId)
      if (!sourceCard) return

      const zoneCards = newCards.filter((c) => c.zone === zone)
      const otherCards = newCards.filter((c) => c.zone !== zone)

      const movedCard: ViewCardPlacement = {
        ...sourceCard,
        zone: zone as ViewCardPlacement['zone'],
        order: zoneCards.length,
      }
      zoneCards.push(movedCard)
      zoneCards.forEach((c, i) => { c.order = i })

      onUpdateCards([...otherCards, ...zoneCards])
      setDragInfo(null)
    }
  }

  function renderCard(card: ViewCardPlacement, zone: string, index: number) {
    return (
      <PreviewCard
        key={card.cardId}
        cardId={card.cardId}
        width={((card.width ?? 1) >= 2 ? 2 : 1) as 1 | 2}
        onRemove={() => handleRemoveCard(card.cardId)}
        onToggleWidth={() => handleToggleWidth(card.cardId)}
        onDragStart={handleDragStart(card.cardId, zone, index)}
        onDragOver={handleDragOver}
        onDrop={handleDropOnCard(card.cardId, zone, index)}
      />
    )
  }

  function renderEmptyZone(zone: string, cols?: number) {
    return (
      <div
        onDragOver={handleDragOver}
        onDrop={handleDropOnZone(zone)}
        className={cn(
          'border border-dashed border-[var(--color-border-default)] rounded-[var(--radius-md)] h-16 flex items-center justify-center text-[11px] text-[var(--color-text-muted)]',
          cols === 2 ? 'col-span-2' : ''
        )}
      >
        Drop cards here
      </div>
    )
  }

  const allCards = [...pinnedCards, ...mainCards, ...sidebarCards]

  return (
    <div className="bg-[var(--color-bg-subtle)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <p className="text-[11px] font-semibold text-[var(--color-text-primary)]">
          Layout Preview
          <span className="ml-2 font-normal text-[var(--color-text-muted)]">{allCards.length} card{allCards.length !== 1 ? 's' : ''}</span>
        </p>
        <div className="relative">
          <button
            onClick={() => setShowAddPopover(!showAddPopover)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)] hover:border-[var(--color-brand-primary)] transition-colors shadow-sm"
            title="Add card"
          >
            <Plus size={14} />
          </button>
          {showAddPopover && (
            <AddCardPopover
              activeCardIds={activeCardIds}
              onToggleCard={onToggleCard}
              onClose={() => setShowAddPopover(false)}
            />
          )}
        </div>
      </div>

      {/* Card grid */}
      <div className="p-4">
        {allCards.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-[13px] text-[var(--color-text-muted)]">No cards in this view yet.</p>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Use the AI builder above or click + to add cards.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {pinnedCards.length > 0 && (
              <>
                <p className="col-span-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Pinned</p>
                {pinnedCards.map((card, i) => renderCard(card, 'pinned', i))}
              </>
            )}
            {(mainCards.length > 0 || sidebarCards.length > 0) && (
              <>
                <p className="col-span-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mt-1">Content</p>
                {mainCards.map((card, i) => renderCard(card, 'main', i))}
                {sidebarCards.map((card, i) => renderCard(card, 'sidebar', i))}
              </>
            )}
            {mainCards.length === 0 && sidebarCards.length === 0 && pinnedCards.length === 0 && renderEmptyZone('main', 2)}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Permissions Section ────────────────────────────────────────────

function PermissionsSection({
  permissions,
  onUpdate,
}: {
  permissions: ViewPermissions
  onUpdate: (p: ViewPermissions) => void
}) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [showStaffDropdown, setShowStaffDropdown] = useState(false)
  const [staffSearch, setStaffSearch] = useState('')
  const roleRef = useRef<HTMLDivElement>(null)
  const staffRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setShowRoleDropdown(false)
      if (staffRef.current && !staffRef.current.contains(e.target as Node)) setShowStaffDropdown(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function setMode(mode: 'everyone' | 'custom') {
    if (mode === 'everyone') {
      onUpdate({ mode: 'everyone', roles: [], staffIds: [] })
    } else {
      onUpdate({ ...permissions, mode: 'custom' })
    }
  }

  function toggleRole(role: string) {
    const roles = permissions.roles.includes(role)
      ? permissions.roles.filter((r) => r !== role)
      : [...permissions.roles, role]
    onUpdate({ ...permissions, roles })
  }

  function toggleStaff(staffId: number) {
    const staffIds = permissions.staffIds.includes(staffId)
      ? permissions.staffIds.filter((id) => id !== staffId)
      : [...permissions.staffIds, staffId]
    onUpdate({ ...permissions, staffIds })
  }

  function removeRole(role: string) {
    onUpdate({ ...permissions, roles: permissions.roles.filter((r) => r !== role) })
  }

  function removeStaff(staffId: number) {
    onUpdate({ ...permissions, staffIds: permissions.staffIds.filter((id) => id !== staffId) })
  }

  const filteredStaff = MOCK_STAFF.filter((s) => {
    if (!staffSearch) return true
    const name = `${s.title ?? ''} ${s.firstName} ${s.lastName}`.toLowerCase()
    return name.includes(staffSearch.toLowerCase())
  })

  const totalAccess = permissions.mode === 'everyone'
    ? MOCK_STAFF.length
    : new Set([
        ...permissions.staffIds,
        ...MOCK_STAFF.filter((s) => permissions.roles.includes(s.role)).map((s) => s.id),
      ]).size

  return (
    <div className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Lock size={12} className="text-[var(--color-text-muted)]" />
          <span className="text-[12px] font-medium text-[var(--color-text-primary)]">Permissions</span>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center bg-[var(--color-bg-subtle)] rounded-[var(--radius-md)] p-0.5">
          <button
            onClick={() => setMode('everyone')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-[var(--radius-sm)] transition-colors',
              permissions.mode === 'everyone'
                ? 'bg-white text-[var(--color-text-primary)] shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            )}
          >
            <Users size={10} />
            Everyone
          </button>
          <button
            onClick={() => setMode('custom')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-[var(--radius-sm)] transition-colors',
              permissions.mode === 'custom'
                ? 'bg-white text-[var(--color-text-primary)] shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            )}
          >
            <Lock size={10} />
            Custom
          </button>
        </div>
      </div>

      {permissions.mode === 'custom' && (
        <div className="space-y-3 mt-3">
          {/* Roles */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">Roles</span>
              <div className="relative" ref={roleRef}>
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center gap-1 text-[11px] text-[var(--color-text-link)] hover:opacity-80 transition-opacity"
                >
                  <Plus size={10} />
                  Add role
                </button>
                {showRoleDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] z-20 py-1">
                    {MOCK_ROLES.filter((r) => r !== 'All Staff').map((role) => {
                      const isSelected = permissions.roles.includes(role)
                      return (
                        <button
                          key={role}
                          onClick={() => toggleRole(role)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-left hover:bg-[var(--color-bg-subtle)] transition-colors"
                        >
                          <div className={cn(
                            'w-3.5 h-3.5 rounded-sm border flex items-center justify-center flex-shrink-0',
                            isSelected
                              ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)]'
                              : 'border-[var(--color-border-default)]'
                          )}>
                            {isSelected && <Check size={9} className="text-white" />}
                          </div>
                          <span className={cn(isSelected ? 'text-[var(--color-text-primary)] font-medium' : 'text-[var(--color-text-secondary)]')}>
                            {role}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {permissions.roles.length === 0 && (
                <span className="text-[11px] text-[var(--color-text-muted)] italic">No roles selected</span>
              )}
              {permissions.roles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] text-[11px] font-medium bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary-dark)]"
                >
                  {role}
                  <button onClick={() => removeRole(role)} className="hover:opacity-60 transition-opacity">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Staff */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">Individual Staff</span>
              <div className="relative" ref={staffRef}>
                <button
                  onClick={() => { setShowStaffDropdown(!showStaffDropdown); setStaffSearch('') }}
                  className="flex items-center gap-1 text-[11px] text-[var(--color-text-link)] hover:opacity-80 transition-opacity"
                >
                  <Plus size={10} />
                  Add staff
                </button>
                {showStaffDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] z-20">
                    <div className="p-2 border-b border-[var(--color-border-subtle)]">
                      <div className="relative">
                        <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                        <input
                          type="text"
                          value={staffSearch}
                          onChange={(e) => setStaffSearch(e.target.value)}
                          placeholder="Search staff..."
                          className="w-full pl-7 pr-2 py-1 text-[11px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)]"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="py-1 max-h-40 overflow-y-auto">
                      {filteredStaff.map((staff) => {
                        const isSelected = permissions.staffIds.includes(staff.id)
                        const name = `${staff.title ? staff.title + ' ' : ''}${staff.firstName} ${staff.lastName}`
                        return (
                          <button
                            key={staff.id}
                            onClick={() => toggleStaff(staff.id)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-left hover:bg-[var(--color-bg-subtle)] transition-colors"
                          >
                            <div className={cn(
                              'w-3.5 h-3.5 rounded-sm border flex items-center justify-center flex-shrink-0',
                              isSelected
                                ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)]'
                                : 'border-[var(--color-border-default)]'
                            )}>
                              {isSelected && <Check size={9} className="text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={cn('truncate', isSelected ? 'text-[var(--color-text-primary)] font-medium' : 'text-[var(--color-text-secondary)]')}>
                                {name}
                              </span>
                            </div>
                            <span className="text-[10px] text-[var(--color-text-muted)] flex-shrink-0">{staff.role}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {permissions.staffIds.length === 0 && (
                <span className="text-[11px] text-[var(--color-text-muted)] italic">No individual staff selected</span>
              )}
              {permissions.staffIds.map((id) => {
                const staff = MOCK_STAFF.find((s) => s.id === id)
                if (!staff) return null
                const initials = `${staff.firstName[0]}${staff.lastName[0]}`
                const name = `${staff.title ? staff.title + ' ' : ''}${staff.firstName} ${staff.lastName}`
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-sm)] text-[11px] font-medium bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]"
                  >
                    <span className="w-4 h-4 rounded-full bg-[var(--color-brand-primary)] text-white text-[8px] font-semibold flex items-center justify-center flex-shrink-0">
                      {initials}
                    </span>
                    {name}
                    <button onClick={() => removeStaff(id)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                      <X size={10} />
                    </button>
                  </span>
                )
              })}
            </div>
          </div>

          {/* Summary */}
          <p className="text-[11px] text-[var(--color-text-muted)]">
            {totalAccess === 0 ? 'No one' : `${totalAccess} staff member${totalAccess !== 1 ? 's' : ''}`} can access this view
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Main ViewsContent ───────────────────────────────────────────────

function ViewsContent() {
  const { views, activeGlobalViewId, setGlobalView, addView, updateViewCards, deleteView, duplicateView, setPatientView, clearPatientView, getEffectiveViewId, updateViewPermissions } = useViewsStore()
  const [editingViewId, setEditingViewId] = useState(activeGlobalViewId)
  const [scope, setScope] = useState<'global' | 'local'>('global')
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [showRenameInput, setShowRenameInput] = useState(false)
  const [newViewName, setNewViewName] = useState('')

  const editingView = views.find((v) => v.id === editingViewId) ?? views[0]
  const activeCardIds = new Set(editingView.cards.map((c) => c.cardId))

  function handleSelectView(id: string) {
    setEditingViewId(id)
    if (scope === 'global') {
      setGlobalView(id)
    } else if (selectedPatientId) {
      setPatientView(selectedPatientId, id)
    }
  }

  function handleSelectPatient(patientId: number | null) {
    setSelectedPatientId(patientId)
    if (patientId) {
      const effectiveViewId = getEffectiveViewId(patientId)
      setEditingViewId(effectiveViewId)
    } else {
      setEditingViewId(activeGlobalViewId)
    }
  }

  function handleNewView() {
    setShowRenameInput(true)
    setNewViewName('')
  }

  function handleCreateView() {
    if (!newViewName.trim()) return
    const newView = {
      id: `view-${Date.now()}`,
      name: newViewName.trim(),
      cards: [] as ViewCardPlacement[],
      createdAt: new Date().toISOString(),
    }
    addView(newView)
    setEditingViewId(newView.id)
    setShowRenameInput(false)
    setNewViewName('')
  }

  function handleUpdateCards(cards: ViewCardPlacement[]) {
    updateViewCards(editingView.id, cards)
    // Ensure patient override is set when editing in local scope
    if (scope === 'local' && selectedPatientId) {
      setPatientView(selectedPatientId, editingView.id)
    }
  }

  function handleAiApply(cards: ViewCardPlacement[]) {
    updateViewCards(editingView.id, cards)
    if (scope === 'local' && selectedPatientId) {
      setPatientView(selectedPatientId, editingView.id)
    }
  }

  function handleToggleCard(cardId: string) {
    if (activeCardIds.has(cardId)) {
      handleUpdateCards(editingView.cards.filter((c) => c.cardId !== cardId))
    } else {
      const def = getCardDefinition(cardId)
      if (!def) return
      const zone = def.defaultZone
      const zoneCards = editingView.cards.filter((c) => c.zone === zone)
      const newCard: ViewCardPlacement = {
        cardId,
        zone,
        order: zoneCards.length,
        width: def.defaultWidth,
      }
      handleUpdateCards([...editingView.cards, newCard])
    }
  }

  function handleDuplicateView() {
    const newView = duplicateView(editingView.id, `${editingView.name} (copy)`)
    setEditingViewId(newView.id)
  }

  function handleDeleteView() {
    if (editingView.isDefault) return
    deleteView(editingView.id)
    setEditingViewId(views[0].id)
  }

  function handleResetView() {
    handleUpdateCards(STANDARD_VIEW.cards.map((c) => ({ ...c })))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-0.5">Views</h2>
        <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed">
          Customize which cards appear on the facesheet and how they're arranged.
        </p>
      </div>

      {/* Main card container */}
      <div className="border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] bg-white overflow-hidden">

        {/* Toolbar: view tabs + scope + actions */}
        <div className="px-4 py-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)]/40">
          <div className="flex items-center justify-between gap-3">
            {/* View tabs */}
            <div className="flex items-center gap-1.5">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => handleSelectView(view.id)}
                  className={cn(
                    'px-3 py-1.5 text-[12px] font-medium rounded-[var(--radius-sm)] transition-colors',
                    editingViewId === view.id
                      ? 'bg-[var(--color-brand-primary)] text-white'
                      : 'text-[var(--color-text-secondary)] hover:bg-white hover:text-[var(--color-text-primary)]'
                  )}
                >
                  {view.name}
                </button>
              ))}
              <button
                onClick={handleNewView}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-[var(--radius-sm)] hover:bg-white transition-colors"
              >
                <Plus size={11} />
                New
              </button>
            </div>

            {/* Scope + actions */}
            <div className="flex items-center gap-1.5">
              <ScopeToggle
                scope={scope}
                onToggle={setScope}
                selectedPatientId={selectedPatientId}
                onSelectPatient={handleSelectPatient}
                onClearOverride={() => {
                  if (selectedPatientId) {
                    clearPatientView(selectedPatientId)
                    setEditingViewId(activeGlobalViewId)
                  }
                }}
              />
              <div className="w-px h-5 bg-[var(--color-border-subtle)] mx-1" />
              <button
                onClick={handleResetView}
                className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white transition-colors"
                title="Reset to default"
              >
                <RotateCcw size={12} />
              </button>
              {!editingView.isDefault && (
                <>
                  <button
                    onClick={handleDuplicateView}
                    className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white transition-colors"
                    title="Duplicate view"
                  >
                    <Copy size={12} />
                  </button>
                  <button
                    onClick={handleDeleteView}
                    className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[#fde8e8] transition-colors"
                    title="Delete view"
                  >
                    <Trash2 size={12} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* New view name input */}
        {showRenameInput && (
          <div className="px-4 py-3 border-b border-[var(--color-border-subtle)] flex items-center gap-2">
            <input
              type="text"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateView() }}
              placeholder="View name..."
              className="flex-1 px-3 py-1.5 text-[12px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:bg-white transition-colors"
              autoFocus
            />
            <button
              onClick={handleCreateView}
              disabled={!newViewName.trim()}
              className="px-3 py-1.5 text-[12px] font-medium bg-[var(--color-brand-primary)] text-white rounded-[var(--radius-sm)] hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              Create
            </button>
            <button
              onClick={() => setShowRenameInput(false)}
              className="px-3 py-1.5 text-[12px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* AI builder input */}
        <div className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
          <AiBuilder onApply={handleAiApply} />
        </div>

        {/* Permissions */}
        <PermissionsSection
          permissions={editingView.permissions ?? { mode: 'everyone', roles: [], staffIds: [] }}
          onUpdate={(p) => updateViewPermissions(editingView.id, p)}
        />

        {/* Layout preview */}
        <FacesheetPreview
          cards={editingView.cards}
          onUpdateCards={handleUpdateCards}
          activeCardIds={activeCardIds}
          onToggleCard={handleToggleCard}
        />
      </div>
    </div>
  )
}

export { ViewsContent }
