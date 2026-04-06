import { Download } from 'lucide-react'
import { useFeedbackStore } from '../../stores/feedbackStore'

function FeedbackExportButton() {
  const { items, exportAll } = useFeedbackStore()

  if (items.length === 0) return null

  function handleExport() {
    const json = exportAll()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `facesheet-feedback-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const pendingCount = items.filter((i) => i.status === 'pending' || i.status === 'failed').length

  return (
    <button
      onClick={handleExport}
      className="fixed bottom-4 left-4 z-[9990] flex items-center gap-2 px-3 py-2 text-[12px] font-medium bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] shadow-md hover:shadow-lg transition-shadow text-[var(--color-text-secondary)]"
      title="Export all feedback as JSON"
    >
      <Download size={13} />
      {items.length} feedback{items.length !== 1 ? 's' : ''}
      {pendingCount > 0 && (
        <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full">
          {pendingCount}
        </span>
      )}
    </button>
  )
}

export { FeedbackExportButton }
