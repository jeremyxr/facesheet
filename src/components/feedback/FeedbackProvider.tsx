import { useState, useCallback } from 'react'
import { FeedbackContextMenu } from './FeedbackContextMenu'
import { FeedbackForm } from './FeedbackForm'
import { FeedbackExportButton } from './FeedbackExportButton'

interface FeedbackContext {
  x: number
  y: number
  elementSelector: string
  feedbackId: string | null
  screenshotDataUrl: string | null
}

function FeedbackProvider() {
  const [formContext, setFormContext] = useState<FeedbackContext | null>(null)

  const handleAddFeedback = useCallback((context: FeedbackContext) => {
    setFormContext(context)
  }, [])

  return (
    <>
      <FeedbackContextMenu onAddFeedback={handleAddFeedback} />
      {formContext && (
        <FeedbackForm context={formContext} onClose={() => setFormContext(null)} />
      )}
      <FeedbackExportButton />
    </>
  )
}

export { FeedbackProvider }
