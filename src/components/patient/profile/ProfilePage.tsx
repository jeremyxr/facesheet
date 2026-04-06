import { ContactInfoCard } from './ContactInfoCard'
import { DemographicsCard } from './DemographicsCard'
import { BillingPaymentsCard } from './BillingPaymentsCard'
import { MarketingEmailsCard } from './MarketingEmailsCard'
import { AllEmailSettingsCard } from './AllEmailSettingsCard'
import { BillingNoticesCard } from './BillingNoticesCard'
import { SecureMessagingCard } from './SecureMessagingCard'
import { AppointmentsCard } from './AppointmentsCard'
import { AccountLoginsCard } from './AccountLoginsCard'
import { OnlineIntakeCard } from './OnlineIntakeCard'
import { SurveysCard } from './SurveysCard'
import { DefaultAdjustmentsCard } from './DefaultAdjustmentsCard'
import type { Patient } from '../../../types/patient'

interface Props {
  patient: Patient
}

function ProfilePage({ patient }: Props) {
  return (
    <div className="px-4 pt-4 pb-4 grid grid-cols-2 gap-4 items-start">
      {/* Left column */}
      <div className="space-y-4">
        <ContactInfoCard patient={patient} />
        <DemographicsCard patient={patient} />
        <BillingPaymentsCard patient={patient} />
        <MarketingEmailsCard patient={patient} />
        <AllEmailSettingsCard patient={patient} />
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <BillingNoticesCard patient={patient} />
        <SecureMessagingCard patient={patient} />
        <AppointmentsCard patient={patient} />
        <AccountLoginsCard patient={patient} />
        <OnlineIntakeCard patient={patient} />
        <SurveysCard patient={patient} />
        <DefaultAdjustmentsCard patient={patient} />
      </div>
    </div>
  )
}

export { ProfilePage }
