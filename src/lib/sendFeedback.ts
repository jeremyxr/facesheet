import type { FeedbackItem } from '../stores/feedbackStore'

export async function sendFeedbackToSlack(
  item: FeedbackItem,
  screenshotDataUrl: string | null
): Promise<boolean> {
  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, screenshotDataUrl }),
    })
    return res.ok
  } catch {
    return false
  }
}
