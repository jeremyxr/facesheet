import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    return res.status(500).json({ error: 'SLACK_WEBHOOK_URL not configured' })
  }

  const { comment, userName, route, elementSelector, feedbackId, coordinates, timestamp } = req.body

  const elementContext = feedbackId
    ? `\`${feedbackId}\` (${elementSelector})`
    : elementSelector || 'unknown'

  const slackPayload = {
    blocks: [
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
      {
        type: 'divider',
      },
    ],
  }

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
