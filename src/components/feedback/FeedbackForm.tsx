import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2 } from 'lucide-react'
import { useFeedbackStore } from '../../stores/feedbackStore'
import { sendFeedbackToSlack } from '../../lib/sendFeedback'

interface Props {
  context: {
    x: number
    y: number
    elementSelector: string
    feedbackId: string | null
  }
  onClose: () => void
}

function FeedbackForm({ context, onClose }: Props) {
  const { userName, setUserName, addItem, markSent, markFailed } = useFeedbackStore()
  const [name, setName] = useState(userName)
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim()) return

    setSending(true)
    if (name.trim()) setUserName(name.trim())

    const item = addItem({
      comment: comment.trim(),
      userName: name.trim() || 'Anonymous',
      route: window.location.pathname,
      elementSelector: context.elementSelector,
      feedbackId: context.feedbackId,
      coordinates: { x: context.x, y: context.y },
      viewportSize: { width: window.innerWidth, height: window.innerHeight },
    })

    const sent = await sendFeedbackToSlack(item)
    if (sent) {
      markSent(item.id)
    } else {
      markFailed(item.id)
    }

    setSending(false)
    onClose()
  }

  // Position form near click, but keep within viewport
  const formWidth = 320
  const formHeight = 260
  const x = Math.min(context.x, window.innerWidth - formWidth - 16)
  const y = Math.min(context.y, window.innerHeight - formHeight - 16)

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998] bg-black/10" onClick={onClose} />

      {/* Form */}
      <div
        className="fixed z-[9999] bg-white rounded-[var(--radius-lg)] shadow-xl border border-[var(--color-border-subtle)] w-[320px] animate-in fade-in slide-in-from-top-1 duration-150"
        style={{ left: x, top: y }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-subtle)]">
          <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)]">Add feedback</h3>
          <button
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Name field — only shown if not already set */}
          {!userName && (
            <div>
              <label className="block text-[11px] font-medium text-[var(--color-text-muted)] mb-1">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah"
                className="w-full px-3 py-1.5 text-[13px] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)]"
              />
            </div>
          )}

          {/* Comment */}
          <div>
            <label className="block text-[11px] font-medium text-[var(--color-text-muted)] mb-1">
              What's on your mind?
            </label>
            <textarea
              ref={textareaRef}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your feedback..."
              rows={3}
              className="w-full px-3 py-2 text-[13px] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)]"
            />
          </div>

          {/* Context info */}
          {context.feedbackId && (
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Re: <span className="font-medium">{context.feedbackId}</span>
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!comment.trim() || sending}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[13px] font-medium bg-[var(--color-brand-primary)] text-white rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={14} />
                Send feedback
              </>
            )}
          </button>
        </form>
      </div>
    </>
  )
}

export { FeedbackForm }
