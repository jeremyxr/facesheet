import { cn } from '../../../lib/cn'
import type { Patient } from '../../../types/patient'

function InvoicesCard({ patient }: { patient: Patient }) {
  const balance = patient.stats.claimsOutstanding + patient.stats.privateOutstanding
  return (
    <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] h-full">
      <div className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">Invoices</h3>
      </div>
      <div className="px-4 py-3 text-[12px] space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[var(--color-text-primary)]">INV-1042</p>
            <p className="text-[var(--color-text-muted)] text-[11px]">Mar 28, 2026</p>
          </div>
          <span className={cn(
            'text-[11px] font-medium',
            balance > 0 ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'
          )}>
            ${balance > 0 ? '185.00' : '0.00'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[var(--color-text-primary)]">INV-1038</p>
            <p className="text-[var(--color-text-muted)] text-[11px]">Mar 14, 2026</p>
          </div>
          <span className="text-[11px] font-medium text-[var(--color-success)]">Paid</span>
        </div>
        <div className="pt-1 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
          <span className="text-[11px] text-[var(--color-text-muted)]">Outstanding</span>
          <span className={cn(
            'text-[11px] font-semibold',
            balance > 0 ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-primary)]'
          )}>
            ${balance.toLocaleString()}.00
          </span>
        </div>
      </div>
    </div>
  )
}

export { InvoicesCard }
