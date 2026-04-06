import { cn } from '../../lib/cn'

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-[var(--color-bg-card)] rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] shadow-[var(--shadow-card)]',
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-subtle)]',
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-[var(--font-size-sm)] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide',
        className
      )}
      {...props}
    />
  )
}

function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-4', className)} {...props} />
  )
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-4 py-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] rounded-b-[var(--radius-sm)]',
        className
      )}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardBody, CardFooter }
