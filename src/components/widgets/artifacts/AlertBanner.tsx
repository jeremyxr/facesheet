import { cn } from '../../../lib/cn'
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react'

interface AlertBannerProps {
  message: string
  variant?: 'warning' | 'danger' | 'info' | 'success'
  className?: string
}

const styles = {
  warning: {
    bg: 'bg-[var(--color-warning-bg)]',
    border: 'border-[var(--color-warning)]',
    text: 'text-[#7a5800]',
    Icon: AlertTriangle,
  },
  danger: {
    bg: 'bg-[var(--color-danger-bg)]',
    border: 'border-[var(--color-danger)]',
    text: 'text-[var(--color-danger-dark)]',
    Icon: AlertTriangle,
  },
  info: {
    bg: 'bg-[var(--color-info-bg)]',
    border: 'border-[var(--color-info)]',
    text: 'text-[var(--color-info)]',
    Icon: Info,
  },
  success: {
    bg: 'bg-[var(--color-success-bg)]',
    border: 'border-[var(--color-success)]',
    text: 'text-[var(--color-success-dark)]',
    Icon: CheckCircle2,
  },
}

function AlertBanner({ message, variant = 'warning', className }: AlertBannerProps) {
  const s = styles[variant]
  return (
    <div className={cn('flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] border text-[12px]', s.bg, s.border, s.text, className)}>
      <s.Icon size={14} className="flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}

export { AlertBanner }
