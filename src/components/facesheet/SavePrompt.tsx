import { useEffect, useRef } from 'react'
import { X, Globe, UserCircle } from 'lucide-react'

interface SavePromptProps {
  open: boolean
  onClose: () => void
  patientName: string
  viewName: string
  onSaveForPatient: () => void
  onSaveForEveryone: () => void
  onDiscard: () => void
}

function SavePrompt({
  open,
  onClose,
  patientName,
  viewName,
  onSaveForPatient,
  onSaveForEveryone,
  onDiscard,
}: SavePromptProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    function handleClickOutside(e: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 animate-fadeIn" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative z-50 w-[420px] bg-white rounded-[var(--radius-lg,12px)] shadow-xl animate-fadeIn"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
            Save Layout Changes
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          <p className="text-[13px] text-[var(--color-text-secondary)]">
            How would you like to save these changes?
          </p>

          {/* Option: Save for patient */}
          <button
            onClick={onSaveForPatient}
            className="w-full flex items-start gap-3 p-3 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-light)] transition-colors text-left"
          >
            <UserCircle size={18} className="text-[var(--color-brand-primary)] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-[13px] font-medium text-[var(--color-text-primary)]">
                Save for {patientName} only
              </div>
              <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                Creates a custom layout just for this patient. Other patients keep the current view.
              </div>
            </div>
          </button>

          {/* Option: Save for everyone */}
          <button
            onClick={onSaveForEveryone}
            className="w-full flex items-start gap-3 p-3 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-light)] transition-colors text-left"
          >
            <Globe size={18} className="text-[var(--color-text-secondary)] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-[13px] font-medium text-[var(--color-text-primary)]">
                Save to "{viewName}" for everyone
              </div>
              <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                Updates the shared view. All patients using this view will see the new layout.
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--color-border-subtle)] flex justify-end">
          <button
            onClick={onDiscard}
            className="px-3 py-1.5 text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Discard changes
          </button>
        </div>
      </div>
    </div>
  )
}

export { SavePrompt }
