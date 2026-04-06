import { cn } from '../../../lib/cn'

interface MetricCardProps {
  value: string | number
  label: string
  sublabel?: string
  trend?: 'up' | 'down' | 'flat'
  trendValue?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

const variantStyles = {
  default: 'text-[var(--color-text-primary)]',
  success: 'text-[var(--color-success-dark)]',
  warning: 'text-[#7a5800]',
  danger: 'text-[var(--color-danger)]',
}

const trendIcons = {
  up: '\u2191',
  down: '\u2193',
  flat: '\u2192',
}

const trendColors = {
  up: 'text-[var(--color-success-dark)]',
  down: 'text-[var(--color-danger)]',
  flat: 'text-[var(--color-text-muted)]',
}

function MetricCard({ value, label, sublabel, trend, trendValue, variant = 'default', className }: MetricCardProps) {
  return (
    <div className={cn('flex flex-col items-center text-center px-3 py-3', className)}>
      <div className={cn('text-[24px] font-semibold leading-none mb-1', variantStyles[variant])}>
        {value}
      </div>
      <div className="text-[11px] text-[var(--color-text-muted)] leading-tight">
        {label}
      </div>
      {(trend || sublabel) && (
        <div className="flex items-center gap-1 mt-1">
          {trend && (
            <span className={cn('text-[11px] font-medium', trendColors[trend])}>
              {trendIcons[trend]} {trendValue}
            </span>
          )}
          {sublabel && (
            <span className="text-[10px] text-[var(--color-text-muted)]">{sublabel}</span>
          )}
        </div>
      )}
    </div>
  )
}

export { MetricCard }
