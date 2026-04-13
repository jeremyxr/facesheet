import {
  FilePlus,
  FileSearch,
  ShieldCheck,
  DollarSign,
  ClipboardList,
  CalendarPlus,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react'
import type { Patient } from '../types/patient'

export interface SuggestedAction {
  id: string
  label: string
  description: string
  icon: LucideIcon
  priority: number
  category: 'clinical' | 'billing' | 'admin'
}

type ActionRule = (patient: Patient) => SuggestedAction | null

const rules: ActionRule[] = [
  // Appointment today → create chart
  (patient) => {
    if (patient.stats.upcomingAppointments > 0) {
      return {
        id: 'create-chart',
        label: 'Create today\'s chart',
        description: `${patient.stats.upcomingAppointments} upcoming appointment${patient.stats.upcomingAppointments > 1 ? 's' : ''}`,
        icon: FilePlus,
        priority: 1,
        category: 'clinical',
      }
    }
    return null
  },

  // Has visit history → review last chart
  (patient) => {
    if (patient.stats.totalBookings > 1) {
      return {
        id: 'review-chart',
        label: 'Review last chart summary',
        description: `${patient.stats.totalBookings} previous visits`,
        icon: FileSearch,
        priority: 2,
        category: 'clinical',
      }
    }
    return null
  },

  // Has insurance + upcoming → check pre-auth
  (patient) => {
    if (patient.insurancePolicies.length > 0 && patient.stats.upcomingAppointments > 0) {
      return {
        id: 'check-preauth',
        label: 'Check pre-auth status',
        description: patient.insurancePolicies[0].provider,
        icon: ShieldCheck,
        priority: 3,
        category: 'billing',
      }
    }
    return null
  },

  // Outstanding balance
  (patient) => {
    const owing = patient.stats.privateOutstanding + patient.stats.claimsOutstanding
    if (owing > 0) {
      return {
        id: 'review-balance',
        label: `Review balance ($${owing.toFixed(2)} owing)`,
        description: `${patient.stats.claimsOutstanding > 0 ? 'Claims + ' : ''}private balance`,
        icon: DollarSign,
        priority: 4,
        category: 'billing',
      }
    }
    return null
  },

  // Intake form not completed
  (patient) => {
    if (!patient.completedIntakeForm) {
      return {
        id: 'send-intake',
        label: 'Send intake form',
        description: 'Not yet completed',
        icon: ClipboardList,
        priority: 5,
        category: 'admin',
      }
    }
    return null
  },

  // No visit in 3+ months → recall
  (patient) => {
    if (patient.stats.monthsSinceLastVisit >= 3 && patient.stats.upcomingAppointments === 0) {
      return {
        id: 'schedule-followup',
        label: 'Schedule follow-up',
        description: `${patient.stats.monthsSinceLastVisit} months since last visit`,
        icon: CalendarPlus,
        priority: 6,
        category: 'clinical',
      }
    }
    return null
  },

  // Secure messaging enabled → pre-visit message
  (patient) => {
    if (patient.secureMessagingEnabled && patient.stats.upcomingAppointments > 0) {
      return {
        id: 'send-message',
        label: 'Send pre-visit message',
        description: 'Secure messaging enabled',
        icon: MessageSquare,
        priority: 7,
        category: 'admin',
      }
    }
    return null
  },
]

export function getSuggestedActions(patient: Patient): SuggestedAction[] {
  return rules
    .map((rule) => rule(patient))
    .filter((a): a is SuggestedAction => a !== null)
    .sort((a, b) => a.priority - b.priority)
}
