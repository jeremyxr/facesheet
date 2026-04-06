import { cn } from '../../lib/cn'

interface StatTileProps {
  value: string | number
  label: string
  sublabel?: string
  linkText?: string
  onLinkClick?: () => void
  className?: string
  valueClassName?: string
}

function StatTile({ value, label, sublabel, linkText, onLinkClick, className, valueClassName }: StatTileProps) {
  return (
    <div className={cn('flex flex-col items-center text-center px-3 py-3 min-w-0', className)}>
      <div className={cn('text-2xl font-light text-[var(--color-text-primary)] leading-none mb-1', valueClassName)}>
        {value}
      </div>
      <div className="text-[11px] text-[var(--color-text-muted)] leading-tight">
        {label}
        {sublabel && <span className="block">{sublabel}</span>}
      </div>
      {linkText && (
        <button
          onClick={onLinkClick}
          className="mt-1 text-[11px] text-[var(--color-text-link)] hover:underline"
        >
          {linkText}
        </button>
      )}
    </div>
  )
}

export { StatTile }
