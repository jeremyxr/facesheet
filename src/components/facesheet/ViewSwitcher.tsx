import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Plus, Eye } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useViewsStore } from '../../stores/viewsStore'
import { useFacesheetEditorStore } from '../../stores/facesheetEditorStore'

interface ViewSwitcherProps {
  activeViewId: string
  patientId: number
  hasPatientOverride: boolean
  onSelectView: (viewId: string) => void
  onNewView: () => void
}

function ViewSwitcher({ activeViewId, patientId, hasPatientOverride, onSelectView, onNewView }: ViewSwitcherProps) {
  const { views, updateView } = useViewsStore()
  const { isEditMode } = useFacesheetEditorStore()
  const activeView = views.find((v) => v.id === activeViewId)
  const [open, setOpen] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(activeView?.name ?? '')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync name value when active view changes
  useEffect(() => {
    setNameValue(activeView?.name ?? '')
  }, [activeView?.name])

  // Focus input when entering name edit
  useEffect(() => {
    if (editingName && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingName])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handleNameCommit() {
    const trimmed = nameValue.trim()
    if (trimmed && trimmed !== activeView?.name) {
      updateView(activeViewId, { name: trimmed })
    } else {
      setNameValue(activeView?.name ?? '')
    }
    setEditingName(false)
  }

  // In edit mode, show an editable name field
  if (isEditMode) {
    return (
      <div className="relative" ref={ref}>
        {editingName ? (
          <input
            ref={inputRef}
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={handleNameCommit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNameCommit()
              if (e.key === 'Escape') {
                setNameValue(activeView?.name ?? '')
                setEditingName(false)
              }
            }}
            className="px-2.5 py-1.5 text-[12px] font-medium rounded-[var(--radius-sm)] border border-[var(--color-brand-primary)] text-[var(--color-text-primary)] bg-white outline-none ring-2 ring-[var(--color-brand-primary)]/20 w-40"
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium rounded-[var(--radius-sm)] border border-dashed border-[var(--color-brand-primary)]/50 text-[var(--color-brand-primary-dark)] bg-[var(--color-brand-primary-light)] hover:bg-[var(--color-brand-primary)]/15 transition-colors"
            title="Click to rename view"
          >
            <Eye size={13} />
            {activeView?.name ?? 'View'}
            {hasPatientOverride && (
              <span className="text-[9px] uppercase tracking-wider text-[var(--color-brand-primary)] font-semibold">
                Custom
              </span>
            )}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        data-tour-id="view-switcher"
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors"
      >
        <Eye size={13} className="text-[var(--color-text-muted)]" />
        {activeView?.name ?? 'View'}
        {hasPatientOverride && (
          <span className="text-[9px] uppercase tracking-wider text-[var(--color-brand-primary)] font-semibold">
            Custom
          </span>
        )}
        <ChevronDown size={12} className="text-[var(--color-text-muted)]" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 min-w-[180px] bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] shadow-lg p-1 z-50">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => {
                onSelectView(view.id)
                setOpen(false)
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 text-[12px] rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-subtle)] transition-colors text-left"
            >
              <span className="w-4 flex items-center justify-center">
                {view.id === activeViewId && <Check size={12} className="text-[var(--color-brand-primary)]" />}
              </span>
              <span className={cn(
                'flex-1',
                view.id === activeViewId ? 'font-medium text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
              )}>
                {view.name}
              </span>
              {view.isDefault && (
                <span className="text-[9px] uppercase tracking-wider text-[var(--color-text-muted)]">Default</span>
              )}
            </button>
          ))}

          <div className="h-px bg-[var(--color-border-subtle)] my-1" />

          <button
            onClick={() => {
              onNewView()
              setOpen(false)
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 text-[12px] rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-subtle)] transition-colors text-left text-[var(--color-text-muted)]"
          >
            <span className="w-4 flex items-center justify-center">
              <Plus size={12} />
            </span>
            New View
          </button>
        </div>
      )}
    </div>
  )
}

export { ViewSwitcher }
