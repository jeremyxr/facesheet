import type { Patient } from '../../types/patient'

interface PatientDashProps {
  patient: Patient
}

interface StatValueProps {
  value: number
  isCurrency?: boolean
}

function StatValue({ value, isCurrency }: StatValueProps) {
  if (isCurrency) {
    return (
      <div className="flex items-start justify-center leading-none">
        <sup className="text-[14px] font-light mt-1.5 mr-0.5">$</sup>
        <span className="text-[34px] font-light">{value.toLocaleString()}</span>
        <sup className="text-[14px] font-light mt-1.5">.00</sup>
      </div>
    )
  }
  return (
    <div className="text-[34px] font-light leading-none">
      {value}
    </div>
  )
}

interface StatTileProps {
  value: number
  label: string
  sublabel?: string
  isCurrency?: boolean
  valueClassName?: string
}

function StatTile({ value, label, sublabel, isCurrency, valueClassName }: StatTileProps) {
  return (
    <div className={`flex flex-col items-center text-center px-4 py-5 flex-1 min-w-0 ${valueClassName ?? ''}`}>
      <StatValue value={value} isCurrency={isCurrency} />
      <div className="mt-2 text-[12px] text-[var(--color-text-muted)] leading-snug">
        {label}
        {sublabel && <div>{sublabel}</div>}
      </div>
    </div>
  )
}

function PatientDash({ patient }: PatientDashProps) {
  const { stats } = patient

  return (
    <div className="mx-4 bg-white rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] shadow-[var(--shadow-card)]">
      <div className="flex items-stretch">
        <StatTile value={stats.totalBookings} label="Total" sublabel="Bookings" />
        <StatTile value={stats.upcomingAppointments} label="Upcoming" sublabel="Appointments" />
        <StatTile value={stats.noShows} label="No Shows" />
        <StatTile value={stats.monthsSinceLastVisit} label="Months Since" sublabel="Last Visit" />
        <StatTile value={stats.claimsOutstanding} label="Claims" sublabel="Outstanding" isCurrency />
        <StatTile value={stats.privateOutstanding} label="Private" sublabel="Outstanding" isCurrency />
        <StatTile value={stats.credit} label="Credit" isCurrency />
        <StatTile
          value={stats.privateBalance}
          label="Private Balance"
          isCurrency
          valueClassName={stats.privateBalance > 0 ? 'text-[var(--color-danger)]' : ''}
        />
      </div>
    </div>
  )
}

export { PatientDash }
