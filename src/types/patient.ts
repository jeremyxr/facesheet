export interface PhoneNumber {
  type: 'home' | 'mobile' | 'work' | 'other'
  number: string
  isPrimary?: boolean
}

export interface Address {
  street: string
  city: string
  province: string
  postalCode: string
  country: string
}

export interface InsurancePolicy {
  id: string
  provider: string
  policyNumber: string
  isPrimary: boolean
}

export type MarketingEmailStatus = 'subscribed' | 'unsubscribed' | 'not_set'
export type ReferralSource = 'google' | 'friend' | 'doctor' | 'social_media' | 'other'
export type OnlinePolicy = 'enabled' | 'disabled'

export interface Patient {
  id: number
  firstName: string
  lastName: string
  preferredName?: string
  pronouns?: string
  dateOfBirth: string
  age: number
  sex: 'Male' | 'Female' | 'Other' | 'Unknown'
  gender?: string
  personalHealthNumber?: string
  phones: PhoneNumber[]
  email?: string
  emailVerified?: boolean
  doNotEmail?: boolean
  address?: Address
  timeZone: string
  stats: PatientStats
  billing: PatientBilling
  flags: PatientFlags
  insurancePolicies: InsurancePolicy[]
  secureMessagingEnabled: boolean
  marketingEmailsOptedIn: boolean
  completedIntakeForm: boolean
  marketingEmailStatus: MarketingEmailStatus
  createdAt: string
  lastActivityDate: string
  referralSource: ReferralSource
  onlineBookingPolicy: OnlinePolicy
  onlinePaymentPolicy: OnlinePolicy
  metadata?: Record<string, unknown>
  aiInsight?: unknown
}

export interface PatientStats {
  totalBookings: number
  upcomingAppointments: number
  noShows: number
  monthsSinceLastVisit: number
  claimsOutstanding: number
  privateOutstanding: number
  credit: number
  privateBalance: number
}

export interface PatientBilling {
  sendBillingEmails: boolean
  sendPaymentReminders: boolean
  paymentMethodOnFile: boolean
}

export interface PatientFlags {
  isDeceased: boolean
  isDischarged: boolean
  isStaffProfile: boolean
  isTestPatient: boolean
}

export interface Staff {
  id: number
  firstName: string
  lastName: string
  title?: string
  avatarUrl?: string
}
