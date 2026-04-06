import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '../../lib/cn'

interface DropZoneProps {
  zone: 'pinned' | 'main' | 'sidebar'
  index: number
  onDrop: (zone: string, index: number) => void
  onClick?: () => void
  label?: string
}

function DropZone({ zone, index, onDrop, onClick, label }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <div
      onClick={onClick}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        onDrop(zone, index)
      }}
      className={cn(
        'border-2 border-dashed rounded-[var(--radius-md)] flex items-center justify-center gap-1.5 transition-colors',
        isDragOver
          ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary-light)]'
          : 'border-[var(--color-border-subtle)] bg-transparent hover:border-[var(--color-brand-primary)]/40 hover:bg-[var(--color-brand-primary-light)]/50',
        zone === 'pinned' ? 'h-20 min-w-[120px]' : 'h-16 col-span-1',
        onClick && 'cursor-pointer'
      )}
    >
      <Plus size={12} className={cn(
        isDragOver ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-text-muted)]'
      )} />
      <span className={cn(
        'text-[11px]',
        isDragOver ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-text-muted)]'
      )}>
        {label ?? 'Drop here'}
      </span>
    </div>
  )
}

export { DropZone }
