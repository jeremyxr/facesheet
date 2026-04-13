import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { getSuggestedActions, type SuggestedAction } from '../../lib/suggestedActions'
import type { Patient } from '../../types/patient'

const MAX_VISIBLE = 3

function ActionChip({ action, onClick }: { action: SuggestedAction; onClick: () => void }) {
  const Icon = action.icon

  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-white text-left transition-all hover:border-[var(--color-brand-primary)]/40 hover:shadow-sm active:scale-[0.99]"
    >
      <div className="w-8 h-8 rounded-full bg-[var(--color-brand-primary-light)] flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-[var(--color-brand-primary-dark)]" />
      </div>
      <div className="min-w-0">
        <span className="text-[13px] font-medium text-[var(--color-text-primary)] block leading-snug">{action.label}</span>
        <span className="text-[11px] text-[var(--color-text-muted)] block mt-0.5">{action.description}</span>
      </div>
      <ChevronRight size={14} className="flex-shrink-0 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-60 transition-opacity ml-1" />
    </button>
  )
}

function SuggestiveActions({ patient }: { patient: Patient }) {
  const [expanded, setExpanded] = useState(false)
  const actions = getSuggestedActions(patient)

  if (actions.length === 0) return null

  const visible = expanded ? actions : actions.slice(0, MAX_VISIBLE)
  const overflowCount = actions.length - MAX_VISIBLE

  return (
    <div className="px-6 pt-1 pb-3" data-feedback-id="suggestive-actions">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Suggested
        </span>
        <div className="flex-1 h-px bg-[var(--color-border-subtle)]" />
      </div>
      <div className="flex items-center gap-2.5 flex-wrap">
        {visible.map((action) => (
          <ActionChip key={action.id} action={action} onClick={() => {}} />
        ))}
        {!expanded && overflowCount > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="px-2.5 py-2 text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            +{overflowCount} more
          </button>
        )}
        {expanded && overflowCount > 0 && (
          <button
            onClick={() => setExpanded(false)}
            className="px-2.5 py-2 text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  )
}

export { SuggestiveActions }
