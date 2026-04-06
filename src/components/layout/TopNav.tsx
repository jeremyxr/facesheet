import { Link, useLocation } from 'react-router-dom'
import {
  MessageSquare,
  HelpCircle,
  ChevronDown,
} from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { cn } from '../../lib/cn'
import { MOCK_CURRENT_STAFF } from '../../mocks/patients'

const NAV_ITEMS = [
  { label: 'Day', href: '/day' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Patients', href: '/patients' },
  { label: 'Staff', href: '/staff' },
  { label: 'Billing', href: '/billing' },
  { label: 'Reports', href: '/reports' },
  { label: 'Settings', href: '/settings' },
]

function TopNav() {
  const location = useLocation()
  const staff = MOCK_CURRENT_STAFF
  const staffName = `${staff.title ? staff.title + ' ' : ''}${staff.firstName} ${staff.lastName}`

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center h-[52px] px-4"
      style={{ backgroundColor: 'var(--color-nav-bg)' }}
      data-feedback-id="top-nav"
    >
      {/* Left — Primary Nav */}
      <nav className="flex items-center gap-0.5 flex-1">
        {NAV_ITEMS.map(({ label, href }) => {
          const isActive = location.pathname.startsWith(href)
          return (
            <Link
              key={href}
              to={href}
              {...(label === 'Settings' ? { 'data-tour-id': 'topnav-settings' } : label === 'Patients' ? { 'data-tour-id': 'topnav-patients' } : {})}
              className={cn(
                'px-4 h-[52px] flex items-center text-[13px] font-semibold transition-colors',
                isActive
                  ? 'bg-[rgba(0,0,0,0.15)] text-white'
                  : 'text-[rgba(255,255,255,0.85)] hover:text-white hover:bg-[rgba(0,0,0,0.10)]'
              )}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Center — Brand */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
          <span className="text-white font-bold text-[12px] italic">Jane</span>
        </div>
        <span className="text-white font-semibold text-[14px]">
          Demo Clinic
        </span>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        <button className="flex items-center gap-1.5 text-[rgba(255,255,255,0.85)] hover:text-white transition-colors text-[13px]">
          <MessageSquare size={15} />
          <span>Messages</span>
        </button>

        <button className="flex items-center gap-1 text-[rgba(255,255,255,0.85)] hover:text-white transition-colors text-[13px]">
          <HelpCircle size={14} />
          <span>Need Help ?</span>
        </button>

        <button className="flex items-center gap-2 pl-3 border-l border-[rgba(255,255,255,0.25)] text-[rgba(255,255,255,0.90)] hover:text-white transition-colors">
          <Avatar name={staffName} size="sm" />
          <span className="text-[13px] font-medium">{staffName}</span>
          <ChevronDown size={12} className="text-[rgba(255,255,255,0.60)]" />
        </button>
      </div>
    </header>
  )
}

export { TopNav }
