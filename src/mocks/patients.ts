import type { Patient, MarketingEmailStatus, ReferralSource, OnlinePolicy } from '../types/patient'

// ─── Seed data for deterministic generation ──────────────────────────

const FIRST_NAMES_F = [
  'Ann', 'Anna', 'Celina', 'Kylie', 'Glenda', 'Megan', 'Pamela', 'Patsy', 'Leona', 'Melissa',
  'Sarah', 'Emily', 'Jessica', 'Ashley', 'Amanda', 'Stephanie', 'Nicole', 'Elizabeth', 'Heather', 'Michelle',
  'Laura', 'Jennifer', 'Rachel', 'Christina', 'Rebecca', 'Samantha', 'Katherine', 'Danielle', 'Brittany', 'Natalie',
  'Victoria', 'Alexis', 'Lauren', 'Andrea', 'Maria', 'Diana', 'Crystal', 'Amber', 'Tiffany', 'Sandra',
  'Monica', 'Vanessa', 'Teresa', 'Carmen', 'Rosa', 'Gloria', 'Wendy', 'Deborah', 'Karen', 'Lisa',
]

const FIRST_NAMES_M = [
  'Randall', 'Gabe', 'Jackson', 'Dan', 'Edward', 'Ben', 'Dylan', 'Brett', 'Jeffrey', 'Juan',
  'Mike', 'Steve', 'David', 'James', 'Robert', 'William', 'Richard', 'Thomas', 'Charles', 'Daniel',
  'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin',
  'Brian', 'George', 'Timothy', 'Ronald', 'Jason', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric',
  'Jonathan', 'Larry', 'Justin', 'Scott', 'Brandon', 'Raymond', 'Greg', 'Samuel', 'Patrick', 'Frank',
]

const LAST_NAMES = [
  'Allen', 'Arnold', 'Bates', 'Campbell', 'Castro', 'Clark', 'Craig', 'Dunn', 'Ellis', 'Ford',
  'Garrett', 'George', 'Gonzalez', 'Gordon', 'Green', 'Hale', 'Harper', 'Henry', 'James', 'Jennings',
  'Jensen', 'Knight', 'Lawrence', 'Martin', 'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris',
  'Robinson', 'Lewis', 'Walker', 'Hall', 'Young', 'King', 'Wright', 'Scott', 'Adams', 'Baker',
  'Nelson', 'Hill', 'Moore', 'Mitchell', 'Roberts', 'Carter', 'Phillips', 'Evans', 'Turner', 'Torres',
  'Parker', 'Collins', 'Edwards', 'Stewart', 'Morris', 'Murphy', 'Rivera', 'Cook', 'Rogers', 'Morgan',
  'Peterson', 'Cooper', 'Reed', 'Bailey', 'Bell', 'Gomez', 'Kelly', 'Howard', 'Ward', 'Cox',
  'Diaz', 'Richardson', 'Wood', 'Watson', 'Brooks', 'Bennett', 'Gray', 'Ramirez', 'Sanders', 'Price',
]

const PRONOUNS_F = ['she/her', 'she/they', undefined]
const PRONOUNS_M = ['he/him', 'he/they', undefined]
const PRONOUNS_NB = ['they/them', 'ze/zir']

const SEXES: Patient['sex'][] = ['Male', 'Female', 'Other', 'Unknown']
const GENDER_MAP: Record<string, string[]> = {
  Male: ['Man', 'Man', 'Man', 'Non-binary'],
  Female: ['Woman', 'Woman', 'Woman', 'Non-binary'],
  Other: ['Non-binary', 'Other'],
  Unknown: ['Other', 'Non-binary'],
}

const MARKETING_STATUSES: MarketingEmailStatus[] = ['subscribed', 'unsubscribed', 'not_set']
const REFERRAL_SOURCES: ReferralSource[] = ['google', 'friend', 'doctor', 'social_media', 'other']
const TIMEZONES = ['America/Vancouver', 'America/Toronto', 'America/Edmonton', 'America/Halifax', 'America/Winnipeg', 'America/St_Johns']

const PHONE_PREFIXES = ['555', '604', '778', '250', '416', '647', '905', '613', '514', '403', '780', '306']

// ─── Deterministic pseudo-random (mulberry32) ────────────────────────

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

// ─── Generator ───────────────────────────────────────────────────────

function generatePatients(count: number): Patient[] {
  const rand = mulberry32(42)
  const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]
  const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min

  const patients: Patient[] = []
  const usedNames = new Set<string>()

  for (let i = 1; i <= count; i++) {
    // Sex distribution: ~48% F, ~48% M, ~3% Other, ~1% Unknown
    const sexRoll = rand()
    const sex: Patient['sex'] = sexRoll < 0.48 ? 'Female' : sexRoll < 0.96 ? 'Male' : sexRoll < 0.99 ? 'Other' : 'Unknown'

    const firstName = sex === 'Female' ? pick(FIRST_NAMES_F) : sex === 'Male' ? pick(FIRST_NAMES_M) : pick([...FIRST_NAMES_F, ...FIRST_NAMES_M])
    const lastName = pick(LAST_NAMES)

    // Ensure unique-ish names (skip exact duplicates)
    const fullName = `${firstName} ${lastName}`
    if (usedNames.has(fullName) && rand() > 0.1) {
      // Retry once with different last name
      const altLast = LAST_NAMES[(LAST_NAMES.indexOf(lastName) + randInt(1, 40)) % LAST_NAMES.length]
      usedNames.add(`${firstName} ${altLast}`)
    } else {
      usedNames.add(fullName)
    }

    const gender = pick(GENDER_MAP[sex])
    const pronouns = gender === 'Man' ? pick(PRONOUNS_M) : gender === 'Woman' ? pick(PRONOUNS_F) : pick(PRONOUNS_NB)

    // Age 2–95, skewed toward 25–65
    const ageRoll = rand()
    const age = ageRoll < 0.05 ? randInt(2, 17) : ageRoll < 0.85 ? randInt(18, 65) : randInt(66, 95)

    const birthYear = 2026 - age
    const birthMonth = randInt(1, 12)
    const birthDay = randInt(1, 28)
    const dateOfBirth = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`

    // Stats
    const totalBookings = rand() < 0.15 ? randInt(0, 3) : rand() < 0.5 ? randInt(4, 30) : randInt(31, 200)
    const monthsSinceLastVisit = rand() < 0.2 ? 0 : rand() < 0.6 ? randInt(1, 6) : rand() < 0.85 ? randInt(7, 11) : randInt(12, 36)
    const upcomingAppointments = rand() < 0.4 ? 0 : randInt(1, 4)
    const noShows = rand() < 0.7 ? 0 : randInt(1, Math.max(1, Math.floor(totalBookings * 0.1)))
    const claimsOutstanding = rand() < 0.6 ? 0 : randInt(1, 20) * 30
    const privateOutstanding = rand() < 0.7 ? 0 : randInt(1, 10) * 25
    const credit = rand() < 0.85 ? 0 : randInt(1, 8) * 25
    const privateBalance = privateOutstanding

    // Phone
    const phonePrefix = pick(PHONE_PREFIXES)
    const phoneMid = String(randInt(100, 999))
    const phoneSuf = String(randInt(1000, 9999))
    const phoneType = pick(['mobile', 'home', 'work'] as const)

    // PHN (some patients have it)
    const hasPhn = rand() < 0.6
    const phn = hasPhn ? `${randInt(1, 9)}${String(randInt(100000000, 999999999))}${String.fromCharCode(65 + randInt(0, 25))}` : undefined

    // Email
    const hasEmail = rand() < 0.9
    const email = hasEmail ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randInt(1, 99)}@example.com` : undefined

    // Created date: spread across 2020–2026
    const createdYear = randInt(2020, 2025)
    const createdMonth = randInt(1, 12)
    const createdDay = randInt(1, 28)
    const createdAt = `${createdYear}-${String(createdMonth).padStart(2, '0')}-${String(createdDay).padStart(2, '0')}`

    // Last activity date
    const lastActivity = new Date(2026, 2, 31)
    lastActivity.setMonth(lastActivity.getMonth() - monthsSinceLastVisit)
    lastActivity.setDate(lastActivity.getDate() - randInt(0, 15))
    const lastActivityDate = lastActivity.toISOString().split('T')[0]

    const patient: Patient = {
      id: i,
      firstName: usedNames.has(fullName) ? firstName : firstName,
      lastName: usedNames.size > 0 ? (usedNames.has(fullName) && rand() > 0.1 ? LAST_NAMES[(LAST_NAMES.indexOf(lastName) + 1) % LAST_NAMES.length] : lastName) : lastName,
      preferredName: rand() < 0.1 ? pick(['Alex', 'Sam', 'Chris', 'Pat', 'Jo', 'Ash', 'Nic', 'Frankie']) : undefined,
      pronouns,
      dateOfBirth,
      age,
      sex,
      gender,
      personalHealthNumber: phn,
      phones: [{ type: phoneType, number: `(${phonePrefix}) ${phoneMid}-${phoneSuf}`, isPrimary: true }],
      email,
      emailVerified: hasEmail ? rand() < 0.7 : undefined,
      doNotEmail: rand() < 0.05,
      address: rand() < 0.7 ? {
        street: `${randInt(100, 9999)} ${pick(['Main', 'Oak', 'Elm', 'Cedar', 'Maple', 'King', 'Queen', 'Broadway', 'Granville', 'Robson'])} ${pick(['St', 'Ave', 'Rd', 'Dr', 'Blvd', 'Cres'])}`,
        city: pick(['Vancouver', 'Toronto', 'Calgary', 'Edmonton', 'Ottawa', 'Montreal', 'Halifax', 'Winnipeg', 'Victoria', 'Kelowna']),
        province: pick(['BC', 'ON', 'AB', 'QC', 'NS', 'MB', 'SK', 'NB', 'NL', 'PE']),
        postalCode: `${String.fromCharCode(65 + randInt(0, 25))}${randInt(1, 9)}${String.fromCharCode(65 + randInt(0, 25))} ${randInt(1, 9)}${String.fromCharCode(65 + randInt(0, 25))}${randInt(1, 9)}`,
        country: 'CA',
      } : undefined,
      timeZone: pick(TIMEZONES),
      stats: {
        totalBookings,
        upcomingAppointments,
        noShows,
        monthsSinceLastVisit,
        claimsOutstanding,
        privateOutstanding,
        credit,
        privateBalance,
      },
      billing: {
        sendBillingEmails: rand() < 0.75,
        sendPaymentReminders: rand() < 0.6,
        paymentMethodOnFile: rand() < 0.35,
      },
      flags: {
        isDeceased: rand() < 0.005,
        isDischarged: rand() < 0.03,
        isStaffProfile: rand() < 0.01,
        isTestPatient: rand() < 0.005,
      },
      insurancePolicies: [],
      secureMessagingEnabled: rand() < 0.5,
      marketingEmailsOptedIn: rand() < 0.4,
      completedIntakeForm: rand() < 0.75,
      marketingEmailStatus: pick(MARKETING_STATUSES),
      createdAt,
      lastActivityDate,
      referralSource: pick(REFERRAL_SOURCES),
      onlineBookingPolicy: (rand() < 0.85 ? 'enabled' : 'disabled') as OnlinePolicy,
      onlinePaymentPolicy: (rand() < 0.8 ? 'enabled' : 'disabled') as OnlinePolicy,
    }

    patients.push(patient)
  }

  return patients
}

export const MOCK_PATIENTS: Patient[] = generatePatients(1200)

export const MOCK_CURRENT_STAFF = {
  id: 1,
  firstName: 'Marcus',
  lastName: 'Gregory',
  title: 'Dr.',
  clinicName: 'Demo Clinic',
}

// ─── Mock staff & roles for permissions ─────────────────────────────

export interface StaffMember {
  id: number
  firstName: string
  lastName: string
  title?: string
  role: string
}

export const MOCK_ROLES = [
  'All Staff',
  'Chiropractors',
  'Physiotherapists',
  'Massage Therapists',
  'Front Desk',
  'Billing',
] as const

export const MOCK_STAFF: StaffMember[] = [
  { id: 1, firstName: 'Marcus', lastName: 'Gregory', title: 'Dr.', role: 'Chiropractors' },
  { id: 2, firstName: 'Sarah', lastName: 'Chen', role: 'Physiotherapists' },
  { id: 3, firstName: 'Emily', lastName: 'Martinez', role: 'Front Desk' },
  { id: 4, firstName: 'David', lastName: 'Kim', title: 'Dr.', role: 'Chiropractors' },
  { id: 5, firstName: 'Lisa', lastName: 'Patel', role: 'Massage Therapists' },
  { id: 6, firstName: 'Mike', lastName: 'Johnson', role: 'Billing' },
  { id: 7, firstName: 'Rachel', lastName: 'Wong', role: 'Physiotherapists' },
  { id: 8, firstName: 'Amanda', lastName: 'Taylor', role: 'Front Desk' },
]
