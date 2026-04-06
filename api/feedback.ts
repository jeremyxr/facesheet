import type { VercelRequest, VercelResponse } from '@vercel/node'
import { put } from '@vercel/blob'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    return res.status(500).json({ error: 'SLACK_WEBHOOK_URL not configured' })
  }

  const { comment, userName, route, elementSelector, feedbackId, coordinates, timestamp, screenshotDataUrl } = req.body

  const elementContext = feedbackId
    ? `\`${feedbackId}\` (${elementSelector})`
    : elementSelector || 'unknown'

  // Upload screenshot to Vercel Blob if provided
  let screenshotUrl: string | null = null
  if (screenshotDataUrl) {
    try {
      const base64Data = screenshotDataUrl.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      const filename = `feedback-${Date.now()}.png`
      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: 'image/png',
      })
      screenshotUrl = blob.url
    } catch {
      // Continue without screenshot if upload fails
    }
  }

  const blocks: Record<string, unknown>[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `Feedback from ${userName || 'Anonymous'}`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `> ${comment}`,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `*Page:* ${route}  |  *Element:* ${elementContext}  |  *Position:* (${coordinates?.x}, ${coordinates?.y})  |  *Time:* ${new Date(timestamp).toLocaleString()}`,
        },
      ],
    },
  ]

  if (screenshotUrl) {
    blocks.push({
      type: 'image',
      image_url: screenshotUrl,
      alt_text: `Screenshot from ${route}`,
    })
  }

  blocks.push({ type: 'divider' })

  const slackPayload = { blocks }

  try {
    const slackRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload),
    })

    if (!slackRes.ok) {
      return res.status(502).json({ error: 'Slack webhook failed' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    return res.status(502).json({ error: 'Failed to reach Slack' })
  }
}
