import { cn } from '../../../lib/cn'
import { Button } from '../../ui/Button'
import type { LucideIcon } from 'lucide-react'

interface CTAAction {
  label: string
  icon?: LucideIcon
  variant?: 'primary' | 'secondary' | 'ghost' | 'link'
  onClick?: () => void
}

interface CTAFooterProps {
  actions: CTAAction[]
  className?: string
}

function CTAFooter({ actions, className }: CTAFooterProps) {
  return (
    <div className={cn('flex items-center justify-end gap-2 px-4 py-2.5 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] rounded-b-[var(--radius-md)]', className)}>
      {actions.map((action, i) => {
        const Icon = action.icon
        return (
          <Button
            key={i}
            variant={action.variant ?? (i === 0 ? 'primary' : 'ghost')}
            size="sm"
            onClick={action.onClick}
            className="gap-1"
          >
            {Icon && <Icon size={12} />}
            {action.label}
          </Button>
        )
      })}
    </div>
  )
}

export { CTAFooter }
export type { CTAAction }
