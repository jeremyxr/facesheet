import { useState, type ComponentType } from 'react'
import { GripVertical, X, Columns2, Square } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Patient } from '../../types/patient'

interface EditableCardProps {
  cardId: string
  zone: 'pinned' | 'main' | 'sidebar'
  width?: 1 | 2 | 3
  index: number
  patient: Patient
  Component: ComponentType<{ patient: Patient }>
  onRemove: (cardId: string) => void
  onToggleWidth: (cardId: string) => void
  onDragStart: (cardId: string, zone: string, index: number) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (cardId: string, zone: string, index: number) => void
}

function EditableCard({
  cardId,
  zone,
  width,
  index,
  patient,
  Component,
  onRemove,
  onToggleWidth,
  onDragStart,
  onDragOver,
  onDrop,
}: EditableCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', cardId)
        setIsDragging(true)
        onDragStart(cardId, zone, index)
      }}
      onDragEnd={() => setIsDragging(false)}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setIsDragOver(true)
        onDragOver(e)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        onDrop(cardId, zone, index)
      }}
      className={cn(
        'relative group cursor-grab active:cursor-grabbing transition-all h-full rounded-[var(--radius-md)]',
        isDragging && 'opacity-40',
        isDragOver && 'ring-2 ring-[var(--color-brand-primary)] ring-offset-1'
      )}
    >
      {/* Hover border overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none rounded-[var(--radius-md)] border-2 border-transparent group-hover:border-[var(--color-brand-primary)]/40 transition-colors" />

      {/* Controls bar — top-right inside the card, appears on hover */}
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
        <div className="flex items-center gap-0.5 p-0.5 rounded-[var(--radius-sm)] bg-white/95 backdrop-blur-sm border border-[var(--color-border-subtle)] shadow-sm">
          {/* Drag handle */}
          <div className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] cursor-grab active:cursor-grabbing transition-colors" title="Drag to reorder">
            <GripVertical size={13} />
          </div>

          {/* Width toggle — only for main zone */}
          {zone === 'main' && (
            <button
              onClick={() => onToggleWidth(cardId)}
              className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors"
              title={width === 2 ? 'Make half width' : 'Make full width'}
            >
              {width === 2 ? <Square size={12} /> : <Columns2 size={12} />}
            </button>
          )}

          {/* Divider */}
          <div className="w-px h-4 bg-[var(--color-border-subtle)] mx-0.5" />

          {/* Remove button */}
          <button
            onClick={() => onRemove(cardId)}
            className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-red-50 transition-colors"
            title="Remove card"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Actual card content */}
      <div className="pointer-events-none select-none h-full">
        <Component patient={patient} />
      </div>
    </div>
  )
}

export { EditableCard }
