import { useState, useRef } from 'react'
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useFacesheetEditorStore } from '../../stores/facesheetEditorStore'
import { generateViewFromPrompt, clearConversationHistory } from '../../lib/claudeViewAgent'

const SUGGESTIONS = [
  'Clinical overview',
  'Show billing and insurance',
  'Minimal view',
  'Add appointments to sidebar',
  'Show everything',
]

function AiPromptBar({ patientName }: { patientName: string }) {
  const [prompt, setPrompt] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { draftCards, updateDraftCards, setEditMode, aiState, setAiState } =
    useFacesheetEditorStore()

  async function handleSubmit() {
    const trimmed = prompt.trim()
    if (!trimmed || aiState.status === 'loading') return

    setAiState({ status: 'loading', lastPrompt: trimmed, explanation: '', error: undefined })
    setEditMode(true)

    try {
      const result = await generateViewFromPrompt(trimmed, draftCards)

      if (result.cards) {
        updateDraftCards(result.cards)
        setAiState({ status: 'idle', explanation: result.explanation })
      } else {
        setAiState({ status: 'error', explanation: result.explanation, error: result.explanation })
      }
    } catch {
      setAiState({ status: 'error', error: 'Something went wrong. Please try again.' })
    }

    setPrompt('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleSuggestion(text: string) {
    setPrompt(text)
    inputRef.current?.focus()
  }

  function handleClearHistory() {
    clearConversationHistory()
    setAiState({ status: 'idle', explanation: '', lastPrompt: '', error: undefined })
  }

  const isLoading = aiState.status === 'loading'

  return (
    <div className="px-6 py-3 space-y-2">
      {/* Input */}
      <div className="relative">
        <Sparkles
          size={14}
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2',
            isLoading ? 'text-[var(--color-text-muted)] animate-pulse' : 'text-[var(--color-brand-primary)]'
          )}
        />
        <input
          ref={inputRef}
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`What would you like to know about ${patientName}?`}
          disabled={isLoading}
          className="w-full pl-9 pr-20 py-2 text-[13px] bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors disabled:opacity-60"
        />
        <button
          onClick={handleSubmit}
          disabled={!prompt.trim() || isLoading}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-[var(--radius-sm)] transition-colors',
            prompt.trim() && !isLoading
              ? 'bg-[var(--color-brand-primary)] text-white hover:opacity-90'
              : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 size={11} className="animate-spin" />
              Thinking
            </>
          ) : (
            <>
              Go
              <ArrowRight size={11} />
            </>
          )}
        </button>
      </div>

      {/* Loading shimmer */}
      {isLoading && (
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] animate-pulse"
              style={{ width: `${50 + i * 18}px`, animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      )}

      {/* Result explanation */}
      {!isLoading && aiState.explanation && aiState.status !== 'error' && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-[var(--color-brand-primary)] font-medium">
            {aiState.explanation}
          </span>
          <button
            onClick={handleClearHistory}
            className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] underline"
          >
            Clear history
          </button>
        </div>
      )}

      {/* Error state */}
      {aiState.status === 'error' && aiState.error && (
        <div className="text-[11px] text-[var(--color-danger)]">{aiState.error}</div>
      )}

      {/* Suggestion chips — show when idle with no recent result */}
      {!isLoading && !aiState.explanation && aiState.status !== 'error' && (
        <div className="flex gap-1.5 flex-wrap">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              className="px-2.5 py-1 text-[11px] text-[var(--color-text-muted)] bg-[var(--color-bg-subtle)] hover:bg-[var(--color-bg-app)] hover:text-[var(--color-text-primary)] rounded-full border border-[var(--color-border-subtle)] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { AiPromptBar }
