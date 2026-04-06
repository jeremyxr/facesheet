import type { FeedbackItem } from '../stores/feedbackStore'

export async function sendFeedbackToSlack(item: FeedbackItem): Promise<boolean> {
  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    return res.ok
  } catch {
    return false
  }
}
