import { cn } from '../../../lib/cn'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercent?: boolean
  color?: string
  className?: string
}

function ProgressBar({ value, max = 100, label, showPercent = true, color = 'var(--color-brand-primary)', className }: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100)

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-[11px] text-[var(--color-text-secondary)]">{label}</span>}
          {showPercent && <span className="text-[11px] font-medium text-[var(--color-text-primary)]">{pct}%</span>}
        </div>
      )}
      <div className="h-2 rounded-full bg-[var(--color-bg-subtle)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export { ProgressBar }
