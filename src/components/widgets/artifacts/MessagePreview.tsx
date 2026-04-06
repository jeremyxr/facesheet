import { cn } from '../../../lib/cn'

interface MessagePreviewProps {
  sender: string
  message: string
  date: string
  avatar?: string
  unread?: boolean
  className?: string
}

function MessagePreview({ sender, message, date, unread, className }: MessagePreviewProps) {
  return (
    <div className={cn('flex gap-3 items-start', className)}>
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0',
        unread
          ? 'bg-[var(--color-brand-primary)] text-white'
          : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]'
      )}>
        {sender.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={cn('text-[12px] truncate', unread ? 'font-semibold text-[var(--color-text-primary)]' : 'font-medium text-[var(--color-text-secondary)]')}>
            {sender}
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)] flex-shrink-0">{date}</span>
        </div>
        <p className={cn('text-[12px] leading-snug truncate', unread ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]')}>
          {message}
        </p>
      </div>
      {unread && (
        <div className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] flex-shrink-0 mt-3" />
      )}
    </div>
  )
}

export { MessagePreview }
