import { createPortal } from 'react-dom'
import { LayoutDashboard, Layers, List } from 'lucide-react'

interface TourWelcomeModalProps {
  onStart: () => void
  onSkip: () => void
}

function TourWelcomeModal({ onStart, onSkip }: TourWelcomeModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-[1100] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div className="relative z-10 w-[520px] bg-white rounded-[var(--radius-lg,12px)] shadow-2xl overflow-hidden">
        {/* Hero header */}
        <div
          className="px-8 pt-8 pb-6"
          style={{ background: 'linear-gradient(135deg, var(--color-brand-primary), #00796b)' }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70 mb-2">
            Preview
          </p>
          <h1 className="text-[22px] font-semibold text-white leading-snug mb-2">
            A new way to know your patients
          </h1>
          <p className="text-[14px] text-white/85 leading-relaxed">
            We're building a redesigned patient management experience that helps
            you quickly understand your patient's story and state of care — all
            in one place.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="px-8 py-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-primary-light)] flex items-center justify-center flex-shrink-0">
              <LayoutDashboard size={16} className="text-[var(--color-brand-primary)]" />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)]">
                The Facesheet
              </h3>
              <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed">
                A consolidated, configurable patient view. See demographics,
                allergies, vitals, goals, and care history without switching tabs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-primary-light)] flex items-center justify-center flex-shrink-0">
              <Layers size={16} className="text-[var(--color-brand-primary)]" />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)]">
                Configurable Views & Cards
              </h3>
              <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed">
                Customize what you see — surface the context that matters for your
                discipline and your patients. Rearrange, add, or remove cards.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-primary-light)] flex items-center justify-center flex-shrink-0">
              <List size={16} className="text-[var(--color-brand-primary)]" />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)]">
                New Patient List & Navigation
              </h3>
              <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed">
                A refreshed patient list with search, filters, and at-a-glance status
                — plus streamlined navigation to get you where you need to go.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-bg-subtle)]">
          <button
            onClick={onSkip}
            className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Skip tour
          </button>
          <button
            onClick={onStart}
            className="px-5 py-2 text-[13px] font-medium bg-[var(--color-brand-primary)] text-white rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
          >
            Take the tour
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export { TourWelcomeModal }
