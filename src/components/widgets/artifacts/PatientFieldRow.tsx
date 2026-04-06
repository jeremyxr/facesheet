import { cn } from '../../../lib/cn'
import type { LucideIcon } from 'lucide-react'

interface PatientFieldRowProps {
  icon?: LucideIcon
  label: string
  value: string
  className?: string
}

function PatientFieldRow({ icon: Icon, label, value, className }: PatientFieldRowProps) {
  return (
    <div className={cn('flex items-center gap-3 py-1.5', className)}>
      {Icon && (
        <div className="w-5 flex items-center justify-center flex-shrink-0">
          <Icon size={13} className="text-[var(--color-text-muted)]" />
        </div>
      )}
      <span className="text-[11px] text-[var(--color-text-muted)] w-20 flex-shrink-0">{label}</span>
      <span className="text-[12px] text-[var(--color-text-primary)] truncate">{value}</span>
    </div>
  )
}

export { PatientFieldRow }
