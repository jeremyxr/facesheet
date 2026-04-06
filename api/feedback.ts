import type { VercelRequest, VercelResponse } from '@vercel/node'

async function slackApi(method: string, token: string, body: Record<string, unknown>) {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  return res.json() as Promise<{ ok: boolean; ts?: string; upload_url?: string; file_id?: string; error?: string }>
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.SLACK_BOT_TOKEN
  const channelId = process.env.SLACK_CHANNEL_ID
  if (!token || !channelId) {
    return res.status(500).json({ error: 'SLACK_BOT_TOKEN or SLACK_CHANNEL_ID not configured' })
  }

  const { comment, userName, route, elementSelector, feedbackId, coordinates, timestamp, screenshotDataUrl } = req.body

  const elementContext = feedbackId
    ? `\`${feedbackId}\` (${elementSelector})`
    : elementSelector || 'unknown'

  const blocks = [
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
    { type: 'divider' },
  ]

  try {
    // Post the feedback message
    const messageRes = await slackApi('chat.postMessage', token, {
      channel: channelId,
      blocks,
    })

    if (!messageRes.ok) {
      return res.status(502).json({ error: `Slack message failed: ${messageRes.error}` })
    }

    // Upload screenshot as a thread reply if provided
    const debugInfo: Record<string, unknown> = {
      hasScreenshot: !!screenshotDataUrl,
      screenshotLength: screenshotDataUrl?.length ?? 0,
    }

    if (screenshotDataUrl && messageRes.ts) {
      const base64Data = screenshotDataUrl.replace(/^data:image\/[^;]+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      debugInfo.bufferSize = buffer.length

      // Step 1: Get an upload URL from Slack
      const uploadRes = await slackApi('files.getUploadURLExternal', token, {
        filename: `feedback-${Date.now()}.jpg`,
        length: buffer.length,
      })
      debugInfo.uploadRes = { ok: uploadRes.ok, error: uploadRes.error }

      if (uploadRes.ok && uploadRes.upload_url && uploadRes.file_id) {
        // Step 2: Upload the file bytes
        const fileUploadRes = await fetch(uploadRes.upload_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/octet-stream' },
          body: buffer,
        })
        debugInfo.fileUploadStatus = fileUploadRes.status

        // Step 3: Complete the upload and share in the thread
        const completeRes = await slackApi('files.completeUploadExternal', token, {
          files: [{ id: uploadRes.file_id, title: `Screenshot from ${route}` }],
          channel_id: channelId,
          thread_ts: messageRes.ts,
        })
        debugInfo.completeRes = { ok: completeRes.ok, error: completeRes.error }
      }
    }

    return res.status(200).json({ ok: true, debug: debugInfo })
  } catch {
    return res.status(502).json({ error: 'Failed to reach Slack' })
  }
}
