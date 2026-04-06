import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-[var(--radius-xs)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]',
        primary:
          'bg-[var(--color-brand-primary)] text-white',
        success:
          'bg-[var(--color-success-bg)] text-[var(--color-success-dark)] border border-[var(--color-success)]',
        warning:
          'bg-[var(--color-warning-bg)] text-[#7a5800] border border-[var(--color-warning)]',
        danger:
          'bg-[var(--color-danger-bg)] text-[var(--color-danger-dark)] border border-[var(--color-danger)]',
        discovery:
          'bg-[var(--color-ai-surface)] text-[var(--color-ai-text)] border border-[var(--color-ai-border)]',
        outline:
          'border border-[var(--color-border-default)] text-[var(--color-text-secondary)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
