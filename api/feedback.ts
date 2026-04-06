import type { VercelRequest, VercelResponse } from '@vercel/node'

type SlackResponse = { ok: boolean; ts?: string; upload_url?: string; file_id?: string; error?: string }

async function slackApi(method: string, token: string, body: Record<string, unknown>) {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  return res.json() as Promise<SlackResponse>
}

async function slackFormApi(method: string, token: string, params: Record<string, string>) {
  const form = new URLSearchParams(params)
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  })
  return res.json() as Promise<SlackResponse>
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.SLACK_BOT_TOKEN
  const channelId = process.env.SLACK_CHANNEL_ID
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  if (!token && !webhookUrl) {
    return res.status(500).json({ error: 'SLACK_BOT_TOKEN or SLACK_WEBHOOK_URL must be configured' })
  }

  const { comment, userName, route, timestamp, screenshotDataUrl } = req.body

  const formattedTime = new Date(timestamp).toLocaleString()
  const messageText = `*Feedback from ${userName || 'Anonymous'}*\n> ${comment}\n\n_Page:_ ${route}  |  _Time:_ ${formattedTime}`

  try {
    if (token && channelId) {
      // If we have a screenshot, upload it with the message as initial_comment
      if (screenshotDataUrl) {
        const base64Data = screenshotDataUrl.replace(/^data:image\/[^;]+;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')

        const uploadRes = await slackFormApi('files.getUploadURLExternal', token, {
          filename: `feedback-${Date.now()}.jpg`,
          length: String(buffer.length),
        })

        if (uploadRes.ok && uploadRes.upload_url && uploadRes.file_id) {
          await fetch(uploadRes.upload_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            body: buffer,
          })

          await slackApi('files.completeUploadExternal', token, {
            files: [{ id: uploadRes.file_id, title: `Screenshot from ${route}` }],
            channel_id: channelId,
            initial_comment: messageText,
          })

          return res.status(200).json({ ok: true })
        }
      }

      // No screenshot or upload failed — post text-only message
      const messageRes = await slackApi('chat.postMessage', token, {
        channel: channelId,
        text: messageText,
      })

      if (!messageRes.ok) {
        return res.status(502).json({ error: `Slack message failed: ${messageRes.error}` })
      }

      return res.status(200).json({ ok: true })
    }

    // Fallback: webhook (no screenshot support)
    const slackRes = await fetch(webhookUrl!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: messageText }),
    })

    if (!slackRes.ok) {
      return res.status(502).json({ error: 'Slack webhook failed' })
    }

    return res.status(200).json({ ok: true })
  } catch {
    return res.status(502).json({ error: 'Failed to reach Slack' })
  }
}
