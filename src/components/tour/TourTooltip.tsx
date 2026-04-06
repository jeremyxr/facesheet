import type { TourStep } from './tourSteps'
import type { TargetRect } from './TourOverlay'

interface TourTooltipProps {
  step: TourStep
  stepIndex: number
  totalSteps: number
  targetRect: TargetRect
  onNext: () => void
  onSkip: () => void
}

const TOOLTIP_WIDTH = 320
const TOOLTIP_GAP = 12
const VIEWPORT_MARGIN = 16

function calcPosition(
  placement: TourStep['placement'],
  rect: TargetRect
): { top: number; left: number; arrowSide: 'top' | 'bottom' | 'left' | 'right' } {
  let top = 0
  let left = 0
  let arrowSide: 'top' | 'bottom' | 'left' | 'right' = 'top'

  switch (placement) {
    case 'bottom':
      top = rect.top + rect.height + TOOLTIP_GAP
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2
      arrowSide = 'top'
      break
    case 'top':
      top = rect.top - TOOLTIP_GAP
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2
      arrowSide = 'bottom'
      break
    case 'right':
      top = rect.top + rect.height / 2
      left = rect.left + rect.width + TOOLTIP_GAP
      arrowSide = 'left'
      break
    case 'left':
      top = rect.top + rect.height / 2
      left = rect.left - TOOLTIP_WIDTH - TOOLTIP_GAP
      arrowSide = 'right'
      break
  }

  // Clamp horizontal
  if (left < VIEWPORT_MARGIN) left = VIEWPORT_MARGIN
  if (left + TOOLTIP_WIDTH > window.innerWidth - VIEWPORT_MARGIN) {
    left = window.innerWidth - VIEWPORT_MARGIN - TOOLTIP_WIDTH
  }

  // Clamp vertical
  if (top < VIEWPORT_MARGIN) top = VIEWPORT_MARGIN

  return { top, left, arrowSide }
}

function Arrow({ side }: { side: 'top' | 'bottom' | 'left' | 'right' }) {
  const base = 'absolute w-3 h-3 bg-white rotate-45 border-[var(--color-border-subtle)]'

  switch (side) {
    case 'top':
      return (
        <div
          className={`${base} border-t border-l`}
          style={{ top: -6, left: '50%', marginLeft: -6 }}
        />
      )
    case 'bottom':
      return (
        <div
          className={`${base} border-b border-r`}
          style={{ bottom: -6, left: '50%', marginLeft: -6 }}
        />
      )
    case 'left':
      return (
        <div
          className={`${base} border-l border-b`}
          style={{ left: -6, top: 20 }}
        />
      )
    case 'right':
      return (
        <div
          className={`${base} border-r border-t`}
          style={{ right: -6, top: 20 }}
        />
      )
  }
}

function TourTooltip({ step, stepIndex, totalSteps, targetRect, onNext, onSkip }: TourTooltipProps) {
  const { top, left, arrowSide } = calcPosition(step.placement, targetRect)
  const isAction = step.type === 'action'
  const buttonLabel = step.buttonLabel ?? 'Next'

  return (
    <div
      style={{
        position: 'fixed',
        top,
        left,
        width: TOOLTIP_WIDTH,
        zIndex: 1001,
        pointerEvents: 'auto',
        transition: 'top 0.3s ease, left 0.3s ease',
      }}
    >
      <div className="relative bg-white rounded-lg shadow-xl border border-[var(--color-border-subtle)] p-4">
        <Arrow side={arrowSide} />

        <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
          Step {stepIndex + 1} of {totalSteps}
        </p>

        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-1">
          {step.title}
        </h3>

        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed mb-4">
          {step.description}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={onSkip}
            className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Skip tour
          </button>

          {!isAction && (
            <button
              onClick={onNext}
              className="px-4 py-1.5 text-[12px] font-medium bg-[var(--color-brand-primary)] text-white rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
            >
              {buttonLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export { TourTooltip }
