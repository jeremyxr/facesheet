import { useState, useRef, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { cn } from '../../lib/cn'
import { CARD_DEFINITIONS } from '../../lib/cardRegistry'
import type { ViewCardPlacement } from '../../types/views'

interface CardPickerProps {
  currentCards: ViewCardPlacement[]
  onAdd: (cardId: string, zone: 'pinned' | 'main' | 'sidebar') => void
  /** Controls dropdown positioning and button style */
  variant?: 'default' | 'sidebar'
}

const GROUP_LABELS: Record<string, string> = {
  clinical: 'Clinical',
  administrative: 'Administrative',
  personal: 'Personal',
  notes: 'Notes',
}

function CardPicker({ currentCards, onAdd, variant = 'default' }: CardPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const activeIds = new Set(currentCards.map((c) => c.cardId))

  const available = CARD_DEFINITIONS.filter((d) => {
    if (activeIds.has(d.id)) return false
    if (!search) return true
    const q = search.toLowerCase()
    return d.label.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
  })

  const grouped = available.reduce<Record<string, typeof available>>((acc, def) => {
    ;(acc[def.group] ??= []).push(def)
    return acc
  }, {})

  const isSidebar = variant === 'sidebar'

  return (
    <div className="relative" ref={panelRef}>
      {isSidebar ? (
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-medium rounded-[var(--radius-md)] border transition-colors',
            open
              ? 'bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]'
              : 'border-dashed border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-subtle)] bg-white'
          )}
        >
          <Plus size={12} />
          Add Card
        </button>
      ) : (
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-[var(--radius-md)] border transition-colors',
            open
              ? 'bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]'
              : 'border-dashed border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-subtle)]'
          )}
        >
          <Plus size={12} />
          Add Card
        </button>
      )}

      {open && (
        <div
          className={cn(
            'absolute mt-2 bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] shadow-lg z-30 overflow-hidden',
            isSidebar
              ? 'top-0 right-full mr-2 w-56'
              : 'top-full left-0 w-72'
          )}
        >
          {/* Search */}
          <div className="p-2 border-b border-[var(--color-border-subtle)]">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cards..."
                autoFocus
                className="w-full pl-7 pr-2 py-1.5 text-[12px] bg-[var(--color-bg-subtle)] border-none rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
              />
            </div>
          </div>

          {/* Card list */}
          <div className="max-h-56 overflow-y-auto p-1">
            {available.length === 0 ? (
              <div className="px-3 py-4 text-center text-[12px] text-[var(--color-text-muted)]">
                {activeIds.size === CARD_DEFINITIONS.length ? 'All cards are already added.' : 'No matching cards.'}
              </div>
            ) : (
              Object.entries(grouped).map(([group, defs]) => (
                <div key={group}>
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {GROUP_LABELS[group] ?? group}
                  </div>
                  {defs.map((def) => (
                    <button
                      key={def.id}
                      onClick={() => {
                        onAdd(def.id, def.defaultZone)
                      }}
                      className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-subtle)] transition-colors text-left"
                    >
                      <Plus size={12} className="text-[var(--color-brand-primary)] mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[12px] font-medium text-[var(--color-text-primary)]">{def.label}</div>
                        <div className="text-[10px] text-[var(--color-text-muted)] leading-snug">{def.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { CardPicker }
