import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface TargetRect {
  top: number
  left: number
  width: number
  height: number
}

interface TourOverlayProps {
  targetId: string
  padding?: number
  children: (rect: TargetRect) => React.ReactNode
}

function useTargetRect(targetId: string, padding: number) {
  const [rect, setRect] = useState<TargetRect | null>(null)
  const [element, setElement] = useState<Element | null>(null)

  const measure = useCallback(() => {
    const el = document.querySelector(`[data-tour-id="${targetId}"]`)
    if (!el) {
      setRect(null)
      setElement(null)
      return
    }
    setElement(el)
    const r = el.getBoundingClientRect()
    setRect({
      top: r.top - padding,
      left: r.left - padding,
      width: r.width + padding * 2,
      height: r.height + padding * 2,
    })
  }, [targetId, padding])

  // Poll for element after mount / targetId change
  useEffect(() => {
    let frame: number
    let attempts = 0
    const maxAttempts = 120 // ~2 seconds at 60fps

    function poll() {
      const el = document.querySelector(`[data-tour-id="${targetId}"]`)
      if (el) {
        measure()
        return
      }
      attempts++
      if (attempts < maxAttempts) {
        frame = requestAnimationFrame(poll)
      }
    }

    poll()
    return () => cancelAnimationFrame(frame)
  }, [targetId, measure])

  // Reposition on scroll / resize
  useEffect(() => {
    if (!element) return

    const observer = new ResizeObserver(measure)
    observer.observe(element)

    window.addEventListener('scroll', measure, true)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('resize', measure)
    }
  }, [element, measure])

  return rect
}

function TourOverlay({ targetId, padding = 8, children }: TourOverlayProps) {
  const rect = useTargetRect(targetId, padding)

  if (!rect) return null

  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, pointerEvents: 'none' }}
    >
      {/* Spotlight cutout — box-shadow creates the dimming */}
      <div
        style={{
          position: 'fixed',
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: 8,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          transition: 'top 0.3s ease, left 0.3s ease, width 0.3s ease, height 0.3s ease',
        }}
      />
      {/* Tooltip rendered by parent via render prop */}
      {children(rect)}
    </div>,
    document.body
  )
}

export { TourOverlay, type TargetRect }
