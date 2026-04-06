import type { Patient } from '../../../types/patient'

function RecentMessagesCard({ patient: _patient }: { patient: Patient }) {
  return (
    <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] h-full">
      <div className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">Recent Messages</h3>
      </div>
      <div className="px-4 py-3 text-[12px] space-y-2.5">
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] mt-1.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[var(--color-text-primary)]">Appointment reminder sent</p>
            <p className="text-[var(--color-text-muted)] text-[11px]">2 days ago</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-border-default)] mt-1.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[var(--color-text-primary)]">HEP instructions shared</p>
            <p className="text-[var(--color-text-muted)] text-[11px]">5 days ago</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-border-default)] mt-1.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[var(--color-text-primary)]">Invoice #1042 sent</p>
            <p className="text-[var(--color-text-muted)] text-[11px]">1 week ago</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { RecentMessagesCard }
