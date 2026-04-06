import { cn } from '../../lib/cn'

interface IconSectionProps {
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
  iconClassName?: string
}

function IconSection({ icon, children, className, iconClassName }: IconSectionProps) {
  return (
    <div className={cn('flex gap-3', className)}>
      <div className={cn('flex-shrink-0 w-5 flex items-start justify-center pt-0.5 text-[var(--color-text-muted)]', iconClassName)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}

export { IconSection }
