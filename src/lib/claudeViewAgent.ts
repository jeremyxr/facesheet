import { CARD_DEFINITIONS } from './cardRegistry'
import { matchViewFromPrompt } from './viewAiMatcher'
import type { ViewCardPlacement } from '../types/views'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ViewAgentResult {
  cards: ViewCardPlacement[] | null
  explanation: string
}

const SYSTEM_PROMPT = `You are a facesheet layout assistant for a clinical management app. You help practitioners arrange information cards on a patient facesheet page.

## Available Cards
${JSON.stringify(
  CARD_DEFINITIONS.map((c) => ({
    id: c.id,
    label: c.label,
    description: c.description,
    group: c.group,
    defaultZone: c.defaultZone,
  })),
  null,
  2
)}

## Layout Zones
- "pinned": Horizontal row at the top. For quick-reference items. Usually 1-2 cards max.
- "main": Two-column grid. Primary content area. Cards can have width 1 (half) or 2 (full width).
- "sidebar": Narrow right column. For alerts, notes, supplementary info.

## Instructions
The user will describe how they want to change the facesheet layout. Return ONLY a valid JSON object (no markdown fences) with this exact schema:
{
  "cards": [
    { "cardId": "<card-id>", "zone": "pinned" | "main" | "sidebar", "order": <number>, "width": 1 | 2 }
  ],
  "explanation": "<one sentence describing what changed>"
}

Rules:
- Only use cardId values from the Available Cards list above.
- Order numbers must be sequential within each zone, starting at 0.
- Width only matters for "main" zone cards (1 = half width, 2 = full width). For pinned/sidebar cards, always use width 1.
- If the user asks to remove a card, exclude it from the output.
- If the user asks to add a card, include it with appropriate zone placement.
- If the user asks to rearrange, change the order/zone accordingly.
- Always return the COMPLETE layout (all cards that should be visible), not just the changes.
- If you cannot understand the request, return { "cards": null, "explanation": "I wasn't sure what you meant. Try something like 'show me a clinical view' or 'add invoices to the sidebar'." }.`

const conversationHistory: Message[] = []
const MAX_HISTORY = 6 // 3 turns (user + assistant pairs)

function buildMessages(prompt: string, currentCards: ViewCardPlacement[]): Message[] {
  const userMessage = `Current layout:\n${JSON.stringify(currentCards, null, 2)}\n\nRequest: ${prompt}`

  // Keep last N messages for context
  const history = conversationHistory.slice(-MAX_HISTORY)

  return [...history, { role: 'user' as const, content: userMessage }]
}

function validateCards(cards: unknown[]): ViewCardPlacement[] | null {
  const validIds = new Set(CARD_DEFINITIONS.map((d) => d.id))
  const validZones = new Set(['pinned', 'main', 'sidebar'])

  if (!Array.isArray(cards)) return null

  const validated: ViewCardPlacement[] = []
  for (const card of cards) {
    if (
      typeof card !== 'object' ||
      card === null ||
      !('cardId' in card) ||
      !('zone' in card) ||
      !('order' in card)
    )
      continue

    const c = card as { cardId: string; zone: string; order: number; width?: number }
    if (!validIds.has(c.cardId)) continue
    if (!validZones.has(c.zone)) continue

    validated.push({
      cardId: c.cardId,
      zone: c.zone as 'pinned' | 'main' | 'sidebar',
      order: typeof c.order === 'number' ? c.order : validated.length,
      width: c.zone === 'main' ? (c.width === 2 ? 2 : 1) : 1,
    })
  }

  return validated.length > 0 ? validated : null
}

export async function generateViewFromPrompt(
  prompt: string,
  currentCards: ViewCardPlacement[]
): Promise<ViewAgentResult> {
  // Check if API key is available by trying the proxy
  try {
    const messages = buildMessages(prompt, currentCards)

    const response = await fetch('/api/claude/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      }),
    })

    if (!response.ok) {
      // If proxy fails (no API key, etc.), fall back to local matcher
      console.warn('Claude API unavailable, falling back to local matcher')
      return fallbackToLocal(prompt)
    }

    const data = await response.json()
    const text = data.content?.[0]?.text ?? ''

    // Parse JSON from response (handle potential markdown fences)
    const jsonStr = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(jsonStr) as { cards: unknown[] | null; explanation: string }

    if (!parsed.cards) {
      return { cards: null, explanation: parsed.explanation || "I couldn't understand that request." }
    }

    const validatedCards = validateCards(parsed.cards)

    // Update conversation history
    conversationHistory.push(
      { role: 'user', content: prompt },
      { role: 'assistant', content: text }
    )
    // Trim history
    while (conversationHistory.length > MAX_HISTORY) {
      conversationHistory.shift()
    }

    return {
      cards: validatedCards,
      explanation: parsed.explanation || 'Layout updated.',
    }
  } catch (err) {
    console.warn('Claude API error, falling back to local matcher:', err)
    return fallbackToLocal(prompt)
  }
}

function fallbackToLocal(prompt: string): ViewAgentResult {
  const result = matchViewFromPrompt(prompt)
  if (result.confidence === 'none') {
    return { cards: null, explanation: "I couldn't match that to any layout. Try being more specific." }
  }
  return {
    cards: result.cards,
    explanation: result.matchedPreset
      ? `Matched preset: ${result.matchedPreset}`
      : `Matched ${result.cards.length} cards from your description.`,
  }
}

export function clearConversationHistory() {
  conversationHistory.length = 0
}
