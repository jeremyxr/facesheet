import { Link, useLocation } from 'react-router-dom'
import { Search } from 'lucide-react'
import { cn } from '../../lib/cn'

const STANDALONE_ITEMS = [
  { label: 'Dashboard', href: '/settings/dashboard' },
  { label: 'Account Recommendations', href: '/settings/account-recommendations', badge: { text: '2', style: 'dark' } },
  { label: 'Jane Payments', href: '/settings/jane-payments' },
  { label: 'Address Book', href: '/settings/address-book' },
]

const SETTINGS_ITEMS = [
  { label: 'Clinic Info', href: '/settings/clinic-info' },
  { label: 'Locations', href: '/settings/locations' },
  { label: 'Security', href: '/settings/security' },
  { label: 'Branding', href: '/settings/branding' },
  { label: 'Emails', href: '/settings/emails' },
  { label: 'Mass Welcome Email', href: '/settings/mass-welcome-email' },
  { label: 'Online Booking', href: '/settings/online-booking' },
  { label: 'Reminders & Notifications', href: '/settings/reminders-notifications' },
  { label: 'Schedule Settings', href: '/settings/schedule-settings' },
  { label: 'Forms & Surveys', href: '/settings/forms-surveys' },
  { label: 'Integrations', href: '/settings/integrations' },
  { label: 'Workshop', href: '/settings/workshop' },
  { label: 'Language', href: '/settings/language' },
  { label: 'Messaging', href: '/settings/messaging', badge: { text: 'BETA', style: 'beta' } },
  { label: 'Staff Permissions', href: '/settings/staff-permissions' },
  { label: 'Dashboard Permissions', href: '/settings/dashboard-permissions' },
  { label: 'Supervision', href: '/settings/supervision' },
  { label: 'Wait Lists', href: '/settings/wait-lists' },
]

type BadgeStyle = 'dark' | 'beta'

interface NavItemProps {
  label: string
  href: string
  badge?: { text: string; style: BadgeStyle }
  isActive: boolean
}

function NavItem({ label, href, badge, isActive }: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center justify-between px-4 py-[7px] text-[13px] transition-colors',
        isActive
          ? 'bg-[var(--color-brand-primary-light)] text-[var(--color-text-primary)]'
          : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
      )}
    >
      <span>{label}</span>
      {badge && (
        <span
          className={cn(
            'inline-flex items-center px-[6px] py-[1px] rounded-full text-[11px] font-medium',
            badge.style === 'dark'
              ? 'bg-[#555] text-white'
              : 'bg-[#00b0c0] text-white'
          )}
        >
          {badge.text}
        </span>
      )}
    </Link>
  )
}

function SettingsSidebar() {
  const location = useLocation()

  return (
    <aside
      className="flex flex-col h-full overflow-y-auto border-r border-[var(--color-border-subtle)]"
      style={{ width: '220px', minWidth: '220px', backgroundColor: '#f8f8f8' }}
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <h2 className="text-[20px] font-light text-[var(--color-text-primary)] mb-3">
          Preferences
        </h2>
        {/* Search */}
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            type="text"
            placeholder="Settings Search..."
            className="w-full pl-8 pr-3 py-[6px] text-[12px] bg-white border border-[var(--color-border-default)] rounded-[var(--radius-sm)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)]"
          />
        </div>
      </div>

      {/* Standalone items */}
      <nav className="pb-2">
        {STANDALONE_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            isActive={location.pathname === item.href}
          />
        ))}
      </nav>

      {/* Settings section */}
      <div className="border-t border-[var(--color-border-subtle)] pt-2">
        <div className="px-4 py-[5px] text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          Settings
        </div>
        <nav>
          {SETTINGS_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={location.pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </aside>
  )
}

export { SettingsSidebar }
