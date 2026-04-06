import type { ComponentType } from 'react'
import type { CardDefinition } from '../types/views'
import type { Patient } from '../types/patient'
import { TreatmentPlanCard } from '../components/patient/cards/TreatmentPlanCard'
import { HealthcareInfoCard } from '../components/patient/cards/HealthcareInfoCard'
import { MedicalHistoryCard } from '../components/patient/cards/MedicalHistoryCard'
import { MedicalAlertsCard } from '../components/patient/cards/MedicalAlertsCard'
import { OtherInfoCard } from '../components/patient/cards/OtherInfoCard'
import { ScratchPadCard } from '../components/patient/cards/ScratchPadCard'
import { AdjustmentsPinnedCard } from '../components/patient/cards/AdjustmentsPinnedCard'
import { StretchingPinnedCard } from '../components/patient/cards/StretchingPinnedCard'
import { RecentMessagesCard } from '../components/patient/cards/RecentMessagesCard'
import { AppointmentsCard } from '../components/patient/cards/AppointmentsCard'
import { InvoicesCard } from '../components/patient/cards/InvoicesCard'
import { InsuranceInfoCard } from '../components/patient/cards/InsuranceInfoCard'

export const CARD_DEFINITIONS: CardDefinition[] = [
  {
    id: 'treatment-plan',
    label: 'Treatment Plan',
    description: 'Active treatment plans, goals, and progress tracking',
    group: 'clinical',
    keywords: ['treatment', 'plan', 'goal', 'therapy', 'progress', 'rehab', 'rehabilitation'],
    defaultZone: 'main',
    defaultWidth: 1,
  },
  {
    id: 'healthcare-info',
    label: 'Healthcare Information',
    description: 'Vitals, past medical conditions, and special conditions',
    group: 'clinical',
    keywords: ['vitals', 'blood', 'pressure', 'heart', 'conditions', 'health', 'medical', 'healthcare', 'oxygen'],
    defaultZone: 'main',
    defaultWidth: 1,
  },
  {
    id: 'medical-history',
    label: 'Medical History',
    description: 'Past surgeries, procedures, and diagnostic history',
    group: 'clinical',
    keywords: ['history', 'surgery', 'surgeries', 'past', 'previous', 'mammogram', 'procedure', 'diagnostic'],
    defaultZone: 'main',
    defaultWidth: 1,
  },
  {
    id: 'medical-alerts',
    label: 'Medical Alerts',
    description: 'Allergies, safety warnings, and special considerations',
    group: 'clinical',
    keywords: ['alert', 'alerts', 'allergy', 'allergies', 'warning', 'safety', 'caution', 'equipment', 'pregnancy'],
    defaultZone: 'sidebar',
    defaultWidth: 1,
  },
  {
    id: 'other-info',
    label: 'Other Info',
    description: 'Visit counts, balance owing, and financial summary',
    group: 'administrative',
    keywords: ['balance', 'visits', 'remaining', 'billing', 'financial', 'owing', 'payment', 'money'],
    defaultZone: 'sidebar',
    defaultWidth: 1,
  },
  {
    id: 'scratch-pad',
    label: 'Scratch Pad',
    description: 'Private notes visible only to you',
    group: 'notes',
    keywords: ['notes', 'scratch', 'personal', 'memo', 'private', 'pad', 'jot', 'reminder'],
    defaultZone: 'sidebar',
    defaultWidth: 1,
  },
  {
    id: 'adjustments-pinned',
    label: 'Adjustments',
    description: 'Pinned adjustment notes and modifications',
    group: 'clinical',
    keywords: ['adjustments', 'adjust', 'modify', 'crutch', 'cane', 'mobility', 'activity'],
    defaultZone: 'pinned',
    defaultWidth: 1,
  },
  {
    id: 'stretching-pinned',
    label: 'Stretching Exercises',
    description: 'Pinned exercise programs and diagrams',
    group: 'clinical',
    keywords: ['stretching', 'exercise', 'exercises', 'stretch', 'diagram', 'program', 'HEP', 'home'],
    defaultZone: 'pinned',
    defaultWidth: 1,
  },
  {
    id: 'recent-messages',
    label: 'Recent Messages',
    description: 'Latest patient communications and message history',
    group: 'administrative',
    keywords: ['messages', 'message', 'communication', 'email', 'sms', 'text', 'chat', 'sent', 'inbox'],
    defaultZone: 'main',
    defaultWidth: 1,
  },
  {
    id: 'appointments',
    label: 'Appointments',
    description: 'Upcoming and past appointment schedule',
    group: 'administrative',
    keywords: ['appointment', 'appointments', 'schedule', 'booking', 'visit', 'calendar', 'upcoming', 'session'],
    defaultZone: 'main',
    defaultWidth: 1,
  },
  {
    id: 'invoices',
    label: 'Invoices',
    description: 'Billing invoices and payment status',
    group: 'administrative',
    keywords: ['invoice', 'invoices', 'bill', 'billing', 'payment', 'charge', 'receipt', 'outstanding'],
    defaultZone: 'main',
    defaultWidth: 1,
  },
  {
    id: 'insurance-info',
    label: 'Insurance Info',
    description: 'Insurance coverage, policy details, and authorizations',
    group: 'administrative',
    keywords: ['insurance', 'policy', 'coverage', 'authorization', 'auth', 'carrier', 'payer', 'claim'],
    defaultZone: 'main',
    defaultWidth: 1,
  },
]

export const CARD_COMPONENTS: Record<string, ComponentType<{ patient: Patient }>> = {
  'treatment-plan': TreatmentPlanCard,
  'healthcare-info': HealthcareInfoCard,
  'medical-history': MedicalHistoryCard,
  'medical-alerts': MedicalAlertsCard,
  'other-info': OtherInfoCard,
  'scratch-pad': ScratchPadCard,
  'adjustments-pinned': AdjustmentsPinnedCard,
  'stretching-pinned': StretchingPinnedCard,
  'recent-messages': RecentMessagesCard,
  'appointments': AppointmentsCard,
  'invoices': InvoicesCard,
  'insurance-info': InsuranceInfoCard,
}

export function getCardDefinition(cardId: string): CardDefinition | undefined {
  return CARD_DEFINITIONS.find((d) => d.id === cardId)
}
