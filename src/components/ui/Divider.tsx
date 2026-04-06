import { cn } from '../../lib/cn'

function Divider({ className }: { className?: string }) {
  return (
    <hr className={cn('border-t border-[var(--color-border-subtle)] my-3', className)} />
  )
}

export { Divider }
