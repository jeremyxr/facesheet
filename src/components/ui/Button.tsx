import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { forwardRef } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-dark)] active:bg-[var(--color-brand-primary-dark)]',
        secondary:
          'bg-white text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-bg-subtle)] active:bg-[var(--color-bg-hover)]',
        ghost:
          'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]',
        danger:
          'bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger-dark)]',
        link:
          'bg-transparent text-[var(--color-text-link)] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-7 px-3 text-[11px] rounded-[var(--radius-sm)]',
        md: 'h-8 px-4 text-[12px] rounded-[var(--radius-sm)]',
        lg: 'h-10 px-5 text-[13px] rounded-[var(--radius-md)]',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
