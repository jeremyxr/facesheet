import { useState, useEffect, useRef } from 'react'
import { MessageSquarePlus } from 'lucide-react'
import html2canvas from 'html2canvas-pro'

interface ContextMenuState {
  visible: boolean
  x: number
  y: number
  targetSelector: string
  feedbackId: string | null
}

interface Props {
  onAddFeedback: (context: {
    x: number
    y: number
    elementSelector: string
    feedbackId: string | null
    screenshotDataUrl: string | null
  }) => void
}

function getSelector(el: HTMLElement): string {
  const parts: string[] = []
  let current: HTMLElement | null = el
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase()
    if (current.id) {
      selector += `#${current.id}`
      parts.unshift(selector)
      break
    }
    if (current.className && typeof current.className === 'string') {
      const classes = current.className.trim().split(/\s+/).slice(0, 2).join('.')
      if (classes) selector += `.${classes}`
    }
    parts.unshift(selector)
    current = current.parentElement
  }
  return parts.join(' > ')
}

function findFeedbackId(el: HTMLElement): string | null {
  let current: HTMLElement | null = el
  while (current) {
    const id = current.getAttribute('data-feedback-id')
    if (id) return id
    current = current.parentElement
  }
  return null
}

function FeedbackContextMenu({ onAddFeedback }: Props) {
  const [menu, setMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    targetSelector: '',
    feedbackId: null,
  })
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleContextMenu(e: MouseEvent) {
      // Allow native menu with Shift key
      if (e.shiftKey) return

      e.preventDefault()
      const target = e.target as HTMLElement
      setMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        targetSelector: getSelector(target),
        feedbackId: findFeedbackId(target),
      })
    }

    function handleClick() {
      setMenu((prev) => ({ ...prev, visible: false }))
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenu((prev) => ({ ...prev, visible: false }))
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (!menu.visible) return null

  // Keep menu within viewport
  const menuWidth = 200
  const menuHeight = 44
  const x = Math.min(menu.x, window.innerWidth - menuWidth - 8)
  const y = Math.min(menu.y, window.innerHeight - menuHeight - 8)

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] bg-white rounded-[var(--radius-md)] shadow-lg border border-[var(--color-border-subtle)] py-1 min-w-[180px] animate-in fade-in duration-100"
      style={{ left: x, top: y }}
    >
      <button
        className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors text-left"
        onMouseDown={async (e) => {
          e.stopPropagation()
          setMenu((prev) => ({ ...prev, visible: false }))

          // Capture screenshot before the feedback form overlay renders
          let screenshotDataUrl: string | null = null
          try {
            const canvas = await html2canvas(document.body, {
              useCORS: true,
              scale: window.devicePixelRatio > 1 ? 0.5 : 1,
              logging: false,
            })
            screenshotDataUrl = canvas.toDataURL('image/jpeg', 0.7)
          } catch (err) {
            console.warn('Screenshot capture failed:', err)
          }

          onAddFeedback({
            x: menu.x,
            y: menu.y,
            elementSelector: menu.targetSelector,
            feedbackId: menu.feedbackId,
            screenshotDataUrl,
          })
        }}
      >
        <MessageSquarePlus size={14} className="text-[var(--color-brand-primary)]" />
        Add feedback
      </button>
    </div>
  )
}

export { FeedbackContextMenu }
