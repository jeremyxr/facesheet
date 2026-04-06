import { CARD_DEFINITIONS } from './cardRegistry'
import type { ViewCardPlacement } from '../types/views'

interface PresetTemplate {
  name: string
  aliases: string[]
  cards: ViewCardPlacement[]
}

const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    name: 'Clinical Overview',
    aliases: ['clinical', 'clinical overview', 'clinical view', 'medical overview', 'clinical focus'],
    cards: [
      { cardId: 'treatment-plan', zone: 'main', order: 0, width: 1 },
      { cardId: 'healthcare-info', zone: 'main', order: 1, width: 1 },
      { cardId: 'medical-history', zone: 'main', order: 2, width: 1 },
      { cardId: 'medical-alerts', zone: 'sidebar', order: 0 },
      { cardId: 'scratch-pad', zone: 'sidebar', order: 1 },
    ],
  },
  {
    name: 'Billing & Financial',
    aliases: ['billing', 'financial', 'billing overview', 'money', 'payments', 'balance'],
    cards: [
      { cardId: 'other-info', zone: 'main', order: 0, width: 1 },
      { cardId: 'treatment-plan', zone: 'main', order: 1, width: 1 },
      { cardId: 'scratch-pad', zone: 'sidebar', order: 0 },
    ],
  },
  {
    name: 'Quick Glance',
    aliases: ['quick', 'quick glance', 'summary', 'overview', 'brief', 'snapshot', 'at a glance'],
    cards: [
      { cardId: 'adjustments-pinned', zone: 'pinned', order: 0 },
      { cardId: 'treatment-plan', zone: 'main', order: 0, width: 1 },
      { cardId: 'medical-alerts', zone: 'sidebar', order: 0 },
      { cardId: 'other-info', zone: 'sidebar', order: 1 },
    ],
  },
  {
    name: 'Minimal',
    aliases: ['minimal', 'simple', 'basic', 'clean', 'lite', 'light'],
    cards: [
      { cardId: 'treatment-plan', zone: 'main', order: 0, width: 1 },
      { cardId: 'medical-alerts', zone: 'sidebar', order: 0 },
    ],
  },
  {
    name: 'Everything',
    aliases: ['everything', 'all', 'full', 'complete', 'all cards', 'show everything', 'show all'],
    cards: [
      { cardId: 'adjustments-pinned', zone: 'pinned', order: 0 },
      { cardId: 'stretching-pinned', zone: 'pinned', order: 1 },
      { cardId: 'treatment-plan', zone: 'main', order: 0, width: 1 },
      { cardId: 'healthcare-info', zone: 'main', order: 1, width: 1 },
      { cardId: 'medical-history', zone: 'main', order: 2, width: 1 },
      { cardId: 'medical-alerts', zone: 'sidebar', order: 0 },
      { cardId: 'other-info', zone: 'sidebar', order: 1 },
      { cardId: 'scratch-pad', zone: 'sidebar', order: 2 },
    ],
  },
]

export interface MatchResult {
  cards: ViewCardPlacement[]
  matchedPreset: string | null
  confidence: 'high' | 'medium' | 'low' | 'none'
}

export function matchViewFromPrompt(input: string): MatchResult {
  const normalized = input.toLowerCase().trim()
  if (!normalized) return { cards: [], matchedPreset: null, confidence: 'none' }

  const tokens = normalized.split(/\s+/)

  // Check for preset template match first
  for (const preset of PRESET_TEMPLATES) {
    for (const alias of preset.aliases) {
      const aliasTokens = alias.split(/\s+/)
      const matchCount = aliasTokens.filter((at) => tokens.includes(at)).length
      if (matchCount >= aliasTokens.length || (aliasTokens.length === 1 && matchCount === 1)) {
        return {
          cards: preset.cards.map((c) => ({ ...c })),
          matchedPreset: preset.name,
          confidence: 'high',
        }
      }
    }
  }

  // Keyword-based card matching
  const cardScores: { cardId: string; score: number }[] = []
  for (const def of CARD_DEFINITIONS) {
    let score = 0
    for (const token of tokens) {
      for (const keyword of def.keywords) {
        if (keyword.includes(token) || token.includes(keyword)) {
          score++
        }
      }
      // Also match against the card label
      if (def.label.toLowerCase().includes(token)) {
        score += 2
      }
    }
    if (score > 0) {
      cardScores.push({ cardId: def.id, score })
    }
  }

  if (cardScores.length === 0) {
    return { cards: [], matchedPreset: null, confidence: 'none' }
  }

  // Sort by score descending and build placements
  cardScores.sort((a, b) => b.score - a.score)

  const cards: ViewCardPlacement[] = []
  let mainOrder = 0
  let sidebarOrder = 0
  let pinnedOrder = 0

  for (const { cardId } of cardScores) {
    const def = CARD_DEFINITIONS.find((d) => d.id === cardId)!
    const zone = def.defaultZone
    let order: number
    if (zone === 'main') order = mainOrder++
    else if (zone === 'sidebar') order = sidebarOrder++
    else order = pinnedOrder++

    cards.push({ cardId, zone, order, width: def.defaultWidth })
  }

  const confidence = cardScores.length >= 3 ? 'high' : cardScores.length >= 2 ? 'medium' : 'low'

  return { cards, matchedPreset: null, confidence }
}

export { PRESET_TEMPLATES }
