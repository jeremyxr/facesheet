import { useState } from 'react'
import {
  MessageSquare, Reply, Calendar, DollarSign, Send,
  Phone, Mail, TrendingUp, ClipboardList, Plus,
  Target, ArrowRight, Bell, Clock, Activity,
  BarChart3, User,
  FileText, Shield, Stethoscope, ChevronDown, ChevronRight,
  ExternalLink, MousePointerClick,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { Card, CardHeader, CardTitle, CardBody } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { MetricCard } from '../widgets/artifacts/MetricCard'
import { MiniBarChart } from '../widgets/artifacts/MiniBarChart'
import { MiniLineChart } from '../widgets/artifacts/MiniLineChart'
import { MessagePreview } from '../widgets/artifacts/MessagePreview'
import { AlertBanner } from '../widgets/artifacts/AlertBanner'
import { PatientFieldRow } from '../widgets/artifacts/PatientFieldRow'
import { CTAFooter } from '../widgets/artifacts/CTAFooter'
import { ProgressBar } from '../widgets/artifacts/ProgressBar'
import { StatTile } from '../ui/StatTile'

// ─── Building Blocks Section ────────────────────────────────────────

interface ArtifactExample {
  name: string
  description: string
  preview: React.ReactNode
}

interface ArtifactCategory {
  id: string
  label: string
  icon: React.ElementType
  color: string
  description: string
  artifacts: ArtifactExample[]
}

const ARTIFACT_CATEGORIES: ArtifactCategory[] = [
  {
    id: 'data',
    label: 'Data & Metrics',
    icon: BarChart3,
    color: 'var(--color-brand-primary)',
    description: 'Numeric values, trends, and visual data representations',
    artifacts: [
      {
        name: 'Metric Card',
        description: 'A single key metric with optional trend indicator',
        preview: (
          <div className="flex gap-4">
            <MetricCard value="24" label="Total visits" trend="up" trendValue="12%" />
            <MetricCard value="$485" label="Outstanding" variant="danger" />
            <MetricCard value="68%" label="Progress" variant="success" trend="up" trendValue="8%" />
          </div>
        ),
      },
      {
        name: 'Stat Tile',
        description: 'Compact stat with optional link action',
        preview: (
          <div className="flex gap-4">
            <StatTile value={12} label="Upcoming" sublabel="appointments" />
            <StatTile value="3.5" label="Avg visits" sublabel="per month" linkText="View details" />
          </div>
        ),
      },
      {
        name: 'Bar Chart',
        description: 'Mini bar chart for comparing values over time or categories',
        preview: (
          <MiniBarChart data={[
            { label: 'Oct', value: 3 },
            { label: 'Nov', value: 5 },
            { label: 'Dec', value: 2 },
            { label: 'Jan', value: 4 },
            { label: 'Feb', value: 6 },
            { label: 'Mar', value: 4 },
          ]} />
        ),
      },
      {
        name: 'Line Chart',
        description: 'Mini line/area chart for showing trends over time',
        preview: (
          <div className="space-y-3">
            <MiniLineChart data={[
              { label: 'W1', value: 8 },
              { label: 'W2', value: 7 },
              { label: 'W3', value: 5 },
              { label: 'W4', value: 6 },
              { label: 'W5', value: 4 },
              { label: 'W6', value: 3 },
            ]} lineColor="var(--color-success)" fillColor="var(--color-success)" />
          </div>
        ),
      },
      {
        name: 'Progress Bar',
        description: 'Visual progress indicator with label and percentage',
        preview: (
          <div className="space-y-3 max-w-sm">
            <ProgressBar value={80} label="Pain reduction" color="var(--color-success)" />
            <ProgressBar value={60} label="Range of motion" color="var(--color-brand-primary)" />
            <ProgressBar value={30} label="Strength" color="var(--color-brand-tertiary)" />
          </div>
        ),
      },
    ],
  },
  {
    id: 'patient',
    label: 'Patient Information',
    icon: User,
    color: 'var(--color-info)',
    description: 'Patient demographics, contact details, and profile data',
    artifacts: [
      {
        name: 'Field Row',
        description: 'Icon + label + value for displaying patient properties',
        preview: (
          <div className="space-y-1 max-w-sm">
            <PatientFieldRow icon={Phone} label="Mobile" value="(604) 555-0142" />
            <PatientFieldRow icon={Mail} label="Email" value="sarah.chen@email.com" />
            <PatientFieldRow icon={Calendar} label="DOB" value="March 14, 1988" />
            <PatientFieldRow icon={Clock} label="Last visit" value="March 28, 2026" />
          </div>
        ),
      },
      {
        name: 'Message Preview',
        description: 'Compact message with sender avatar, snippet, and timestamp',
        preview: (
          <div className="space-y-3 max-w-md">
            <MessagePreview
              sender="Sarah Chen"
              message="Hi, I wanted to follow up about my last appointment..."
              date="2h ago"
              unread
            />
            <MessagePreview
              sender="Marcus Johnson"
              message="Thank you for the referral letter."
              date="Yesterday"
            />
          </div>
        ),
      },
      {
        name: 'Badge',
        description: 'Status labels for categorization and tagging',
        preview: (
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Active</Badge>
            <Badge variant="success">Completed</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="danger">Overdue</Badge>
            <Badge variant="discovery">AI</Badge>
            <Badge variant="outline">Custom</Badge>
          </div>
        ),
      },
    ],
  },
  {
    id: 'alerts',
    label: 'Alerts & Notifications',
    icon: Shield,
    color: '#c2590a',
    description: 'Warnings, status banners, and system notifications',
    artifacts: [
      {
        name: 'Alert Banner',
        description: 'Contextual alert with icon and semantic color',
        preview: (
          <div className="space-y-2 max-w-md">
            <AlertBanner message="Allergy: Penicillin — Severe reaction" variant="danger" />
            <AlertBanner message="Invoice #4821 is 30+ days overdue" variant="warning" />
            <AlertBanner message="Insurance authorization expires Apr 15" variant="info" />
            <AlertBanner message="HEP compliance on track this week" variant="success" />
          </div>
        ),
      },
    ],
  },
  {
    id: 'actions',
    label: 'Calls to Action',
    icon: MousePointerClick,
    color: 'var(--color-text-secondary)',
    description: 'Buttons, links, and interactive elements that drive user action',
    artifacts: [
      {
        name: 'CTA Footer',
        description: 'Card footer with one or more action buttons, anchored to bottom-right',
        preview: (
          <div className="max-w-md border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] overflow-hidden">
            <div className="px-4 py-3 text-[12px] text-[var(--color-text-muted)]">Card content above...</div>
            <CTAFooter actions={[
              { label: 'Send reminder', icon: Send, variant: 'primary' },
              { label: 'View all', variant: 'ghost' },
            ]} />
          </div>
        ),
      },
      {
        name: 'Button Variants',
        description: 'Primary, secondary, ghost, danger, and link styles',
        preview: (
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm">Primary</Button>
            <Button variant="secondary" size="sm">Secondary</Button>
            <Button variant="ghost" size="sm">Ghost</Button>
            <Button variant="danger" size="sm">Danger</Button>
            <Button variant="link" size="sm">Link</Button>
          </div>
        ),
      },
      {
        name: 'Contextual Actions',
        description: 'Icon buttons for inline card actions',
        preview: (
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors">
              <ExternalLink size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors">
              <Reply size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors">
              <Plus size={14} />
            </button>
            <span className="text-[11px] text-[var(--color-text-muted)] ml-2">Open, reply, add — placed in card headers or inline</span>
          </div>
        ),
      },
    ],
  },
  {
    id: 'layout',
    label: 'Structure & Layout',
    icon: FileText,
    color: 'var(--color-brand-tertiary)',
    description: 'Card shells, headers, dividers, and compositional patterns',
    artifacts: [
      {
        name: 'Card Shell',
        description: 'Base container with header, body, and footer zones',
        preview: (
          <div className="max-w-xs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5">
                  <Stethoscope size={13} className="text-[var(--color-brand-primary)]" />
                  Card Title
                </CardTitle>
                <Badge variant="default">Status</Badge>
              </CardHeader>
              <CardBody className="text-[12px] text-[var(--color-text-muted)]">
                Body content — metrics, fields, charts, lists, or any combination of artifacts.
              </CardBody>
              <CTAFooter actions={[{ label: 'Action', variant: 'ghost' }]} />
            </Card>
          </div>
        ),
      },
      {
        name: 'List Pattern',
        description: 'Divided list of items with icon, content, and trailing element',
        preview: (
          <div className="max-w-sm border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] overflow-hidden bg-white divide-y divide-[var(--color-border-subtle)]">
            {[
              { icon: Calendar, text: 'Physiotherapy', sub: '10:00 AM · Dr. Patel' },
              { icon: ClipboardList, text: 'Follow-up', sub: '2:30 PM · Dr. Patel' },
              { icon: Activity, text: 'Assessment', sub: '11:00 AM · Dr. Wong' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                <div className="w-6 h-6 rounded-full bg-[var(--color-bg-subtle)] flex items-center justify-center flex-shrink-0">
                  <item.icon size={12} className="text-[var(--color-brand-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-[var(--color-text-primary)]">{item.text}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">{item.sub}</p>
                </div>
                <ArrowRight size={12} className="text-[var(--color-text-muted)]" />
              </div>
            ))}
          </div>
        ),
      },
    ],
  },
]

// ─── Widget Anatomy Diagram ─────────────────────────────────────────
// Card is centered at a fixed width. Annotations use SVG lines drawn
// from the card edges out to label positions on each side.

function WidgetAnatomyDiagram() {
  // Annotation config: y = px from top of card where the line connects
  const leftAnnotations = [
    { label: 'Card Header', sublabel: 'Title + icon', y: 16 },
    { label: 'Metrics', sublabel: 'Key numbers with trends', y: 98 },
    { label: 'Bar Chart', sublabel: 'Visual data over time', y: 211 },
  ]
  const rightAnnotations = [
    { label: 'Status Badge', sublabel: 'Context or timeframe', y: 16 },
    { label: 'Dividers', sublabel: 'Metric separation', y: 98 },
    { label: 'Call to Action', sublabel: 'Bottom-right action', y: 310 },
  ]

  return (
    <div className="py-8 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border-subtle)]">
      {/* 3-column grid: left labels | card | right labels */}
      <div className="grid items-start gap-0 mx-auto" style={{ gridTemplateColumns: '1fr 380px 1fr', maxWidth: 820 }}>

        {/* Left annotations column */}
        <div className="relative" style={{ height: 345 }}>
          {leftAnnotations.map((a, i) => (
            <div
              key={i}
              className="absolute right-0 flex items-center gap-0"
              style={{ top: a.y }}
            >
              <div className="text-right pr-2.5">
                <p className="text-[11px] font-semibold text-[var(--color-text-primary)] leading-tight whitespace-nowrap">{a.label}</p>
                <p className="text-[10px] text-[var(--color-text-muted)] leading-tight whitespace-nowrap">{a.sublabel}</p>
              </div>
              <div className="h-px bg-[var(--color-border-default)]" style={{ width: 32 }} />
              <div className="w-[7px] h-[7px] rounded-full border-[1.5px] border-[var(--color-text-muted)] bg-white flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5">
                <TrendingUp size={13} className="text-[var(--color-brand-primary)]" />
                Visit Trends
              </CardTitle>
              <Badge variant="default">Last 6 months</Badge>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex items-center justify-around">
                <MetricCard value={24} label="Total visits" trend="up" trendValue="12%" />
                <div className="w-px h-10 bg-[var(--color-border-subtle)]" />
                <MetricCard value={4} label="Per month avg" />
                <div className="w-px h-10 bg-[var(--color-border-subtle)]" />
                <MetricCard value={0} label="No-shows" variant="success" />
              </div>
              <MiniBarChart
                data={[
                  { label: 'Oct', value: 3 },
                  { label: 'Nov', value: 5 },
                  { label: 'Dec', value: 2 },
                  { label: 'Jan', value: 4 },
                  { label: 'Feb', value: 6 },
                  { label: 'Mar', value: 4 },
                ]}
              />
            </CardBody>
            <CTAFooter actions={[
              { label: 'View appointments', icon: Calendar, variant: 'ghost' },
            ]} />
          </Card>
        </div>

        {/* Right annotations column */}
        <div className="relative" style={{ height: 345 }}>
          {rightAnnotations.map((a, i) => (
            <div
              key={i}
              className="absolute left-0 flex items-center gap-0"
              style={{ top: a.y }}
            >
              <div className="w-[7px] h-[7px] rounded-full border-[1.5px] border-[var(--color-text-muted)] bg-white flex-shrink-0" />
              <div className="h-px bg-[var(--color-border-default)]" style={{ width: 32 }} />
              <div className="text-left pl-2.5">
                <p className="text-[11px] font-semibold text-[var(--color-text-primary)] leading-tight whitespace-nowrap">{a.label}</p>
                <p className="text-[10px] text-[var(--color-text-muted)] leading-tight whitespace-nowrap">{a.sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Building Blocks Section ────────────────────────────────────────

function BuildingBlocksSection() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('data')

  function toggleCategory(id: string) {
    setExpandedCategory(expandedCategory === id ? null : id)
  }

  return (
    <div className="bg-white rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--color-border-subtle)]">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-0.5">Building Blocks</h3>
        <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed">
          Every widget is composed from these atomic artifacts. Click a category to explore the available building blocks.
        </p>
      </div>

      {/* Anatomy diagram */}
      <WidgetAnatomyDiagram />

      <div className="divide-y divide-[var(--color-border-subtle)]">
        {ARTIFACT_CATEGORIES.map((cat) => {
          const isExpanded = expandedCategory === cat.id
          const Icon = cat.icon
          return (
            <div key={cat.id}>
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors',
                  isExpanded ? 'bg-[var(--color-bg-subtle)]' : 'hover:bg-[var(--color-bg-subtle)]/50'
                )}
              >
                <div
                  className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `color-mix(in srgb, ${cat.color} 15%, white)` }}
                >
                  <Icon size={14} style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--color-text-primary)]">{cat.label}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">{cat.description}</p>
                </div>
                <span className="text-[11px] text-[var(--color-text-muted)] mr-1">{cat.artifacts.length} artifact{cat.artifacts.length !== 1 ? 's' : ''}</span>
                {isExpanded
                  ? <ChevronDown size={14} className="text-[var(--color-text-muted)] flex-shrink-0" />
                  : <ChevronRight size={14} className="text-[var(--color-text-muted)] flex-shrink-0" />
                }
              </button>

              {/* Expanded artifacts */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 bg-[var(--color-bg-subtle)] space-y-4">
                  {cat.artifacts.map((artifact, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] overflow-hidden"
                    >
                      <div className="px-4 py-2.5 border-b border-[var(--color-border-subtle)]">
                        <p className="text-[12px] font-semibold text-[var(--color-text-primary)]">{artifact.name}</p>
                        <p className="text-[11px] text-[var(--color-text-muted)]">{artifact.description}</p>
                      </div>
                      <div className="px-4 py-4">
                        {artifact.preview}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Widget Frame ───────────────────────────────────────────────────

function WidgetFrame({ size = '1:1', artifacts, children }: {
  size?: '1:1' | '2:1'
  artifacts: string[]
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col',
        size === '2:1' && 'col-span-2'
      )}
      style={{ aspectRatio: size === '2:1' ? '2 / 1' : '1 / 1' }}
    >
      <WidgetLabel artifacts={artifacts} />
      <div className="flex-1 min-h-0 [&>div]:h-full [&>div]:flex [&>div]:flex-col">
        {children}
      </div>
    </div>
  )
}

// ─── Example Widget: Patient Messaging ──────────────────────────────

function MessagingWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <MessageSquare size={13} className="text-[var(--color-brand-primary)]" />
          Patient Messaging
        </CardTitle>
        <Badge variant="primary" className="text-[9px]">2 new</Badge>
      </CardHeader>
      <CardBody className="space-y-3 pb-0 flex-1 min-h-0 overflow-y-auto">
        <MessagePreview
          sender="Sarah Chen"
          message="Hi, I wanted to follow up about my last appointment and the exercises you recommended..."
          date="2h ago"
          unread
        />
        <div className="border-t border-[var(--color-border-subtle)]" />
        <MessagePreview
          sender="Marcus Johnson"
          message="Thank you for the referral letter. I've forwarded it to my insurance."
          date="Yesterday"
        />
        <div className="border-t border-[var(--color-border-subtle)]" />
        <MessagePreview
          sender="Li Wei"
          message="Can I reschedule my Thursday appointment to next week?"
          date="2 days ago"
        />
      </CardBody>
      <CTAFooter actions={[
        { label: 'Reply', icon: Reply, variant: 'primary' },
        { label: 'View all', variant: 'ghost' },
      ]} />
    </Card>
  )
}

// ─── Example Widget: Visit Trends ───────────────────────────────────

function VisitTrendsWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <TrendingUp size={13} className="text-[var(--color-brand-primary)]" />
          Visit Trends
        </CardTitle>
        <Badge variant="default">Last 6 months</Badge>
      </CardHeader>
      <CardBody className="space-y-3 flex-1 min-h-0">
        <div className="flex items-center justify-around">
          <MetricCard value={24} label="Total visits" trend="up" trendValue="12%" />
          <div className="w-px h-10 bg-[var(--color-border-subtle)]" />
          <MetricCard value={4} label="Per month avg" />
          <div className="w-px h-10 bg-[var(--color-border-subtle)]" />
          <MetricCard value={0} label="No-shows" variant="success" />
        </div>
        <MiniBarChart data={[
          { label: 'Oct', value: 3 },
          { label: 'Nov', value: 5 },
          { label: 'Dec', value: 2 },
          { label: 'Jan', value: 4 },
          { label: 'Feb', value: 6 },
          { label: 'Mar', value: 4 },
        ]} />
      </CardBody>
      <CTAFooter actions={[
        { label: 'View appointments', icon: Calendar, variant: 'ghost' },
      ]} />
    </Card>
  )
}

// ─── Example Widget: Outstanding Balance ────────────────────────────

function BalanceWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <DollarSign size={13} className="text-[var(--color-danger)]" />
          Outstanding Balance
        </CardTitle>
      </CardHeader>
      <CardBody className="space-y-3 flex-1 min-h-0">
        <div className="flex items-center justify-around">
          <MetricCard value="$485.00" label="Total owing" variant="danger" />
          <div className="w-px h-10 bg-[var(--color-border-subtle)]" />
          <MetricCard value="$285.00" label="Insurance" />
          <div className="w-px h-10 bg-[var(--color-border-subtle)]" />
          <MetricCard value="$200.00" label="Private pay" />
        </div>
        <AlertBanner message="Invoice #4821 is 30+ days overdue" variant="warning" />
        <MiniLineChart
          data={[
            { label: 'Oct', value: 120 },
            { label: 'Nov', value: 200 },
            { label: 'Dec', value: 340 },
            { label: 'Jan', value: 280 },
            { label: 'Feb', value: 400 },
            { label: 'Mar', value: 485 },
          ]}
          lineColor="var(--color-danger)"
          fillColor="var(--color-danger)"
        />
        <p className="text-[11px] text-[var(--color-text-muted)] text-center">Balance trend</p>
      </CardBody>
      <CTAFooter actions={[
        { label: 'Send reminder', icon: Send, variant: 'primary' },
        { label: 'View invoices', variant: 'ghost' },
      ]} />
    </Card>
  )
}

// ─── Example Widget: Treatment Progress (wide 2:1) ──────────────────

function TreatmentProgressWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Target size={13} className="text-[var(--color-brand-tertiary)]" />
          Treatment Progress
        </CardTitle>
        <Badge variant="discovery">Active plan</Badge>
      </CardHeader>
      <CardBody className="flex-1 min-h-0">
        <div className="grid grid-cols-2 gap-6 h-full">
          <div className="space-y-4">
            <div className="flex items-center justify-around">
              <MetricCard value="68%" label="Overall progress" variant="success" />
              <div className="w-px h-10 bg-[var(--color-border-subtle)]" />
              <MetricCard value="8/12" label="Sessions completed" />
            </div>
            <div className="space-y-3">
              <ProgressBar value={80} label="Pain reduction" color="var(--color-success)" />
              <ProgressBar value={60} label="Range of motion" color="var(--color-brand-primary)" />
              <ProgressBar value={45} label="Strength" color="var(--color-brand-tertiary)" />
            </div>
          </div>
          <div className="flex flex-col">
            <MiniLineChart
              data={[
                { label: 'W1', value: 8 },
                { label: 'W2', value: 7 },
                { label: 'W3', value: 6 },
                { label: 'W4', value: 5 },
                { label: 'W5', value: 4 },
                { label: 'W6', value: 3 },
              ]}
              height={100}
              lineColor="var(--color-success)"
              fillColor="var(--color-success)"
            />
            <p className="text-[11px] text-[var(--color-text-muted)] text-center mt-2">Pain score trend (lower is better)</p>
            <div className="mt-auto pt-3">
              <AlertBanner message="On track — next milestone: session 10" variant="success" />
            </div>
          </div>
        </div>
      </CardBody>
      <CTAFooter actions={[
        { label: 'Update goals', icon: ClipboardList, variant: 'ghost' },
        { label: 'View plan', variant: 'ghost' },
      ]} />
    </Card>
  )
}

// ─── Example Widget: Quick Contact ──────────────────────────────────

function QuickContactWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Phone size={13} className="text-[var(--color-brand-primary)]" />
          Quick Contact
        </CardTitle>
      </CardHeader>
      <CardBody className="space-y-1 flex-1 min-h-0 flex flex-col justify-center">
        <PatientFieldRow icon={Phone} label="Mobile" value="(604) 555-0142" />
        <PatientFieldRow icon={Phone} label="Home" value="(604) 555-0198" />
        <PatientFieldRow icon={Mail} label="Email" value="sarah.chen@email.com" />
        <PatientFieldRow icon={Clock} label="Preferred" value="Weekdays after 3pm" />
        <PatientFieldRow icon={Calendar} label="DOB" value="March 14, 1988" />
        <PatientFieldRow icon={Activity} label="Last visit" value="March 28, 2026" />
      </CardBody>
      <CTAFooter actions={[
        { label: 'Call', icon: Phone, variant: 'primary' },
        { label: 'Email', icon: Mail, variant: 'secondary' },
      ]} />
    </Card>
  )
}

// ─── Example Widget: Upcoming Appointments ──────────────────────────

function UpcomingAppointmentsWidget() {
  const appointments = [
    { date: 'Apr 2', time: '10:00 AM', type: 'Physiotherapy', provider: 'Dr. Patel' },
    { date: 'Apr 9', time: '2:30 PM', type: 'Follow-up', provider: 'Dr. Patel' },
    { date: 'Apr 16', time: '11:00 AM', type: 'Assessment', provider: 'Dr. Wong' },
    { date: 'Apr 23', time: '9:00 AM', type: 'Physiotherapy', provider: 'Dr. Patel' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Calendar size={13} className="text-[var(--color-brand-primary)]" />
          Upcoming Appointments
        </CardTitle>
        <Badge variant="success">{appointments.length} booked</Badge>
      </CardHeader>
      <CardBody className="pb-0 flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-center mb-3">
          <MetricCard value="2" label="Days until next" sublabel="Apr 2 at 10:00 AM" />
        </div>
        <div className="divide-y divide-[var(--color-border-subtle)] flex-1 min-h-0 overflow-y-auto">
          {appointments.map((apt, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <div className="w-10 text-center flex-shrink-0">
                <div className="text-[13px] font-semibold text-[var(--color-text-primary)] leading-none">{apt.date.split(' ')[1]}</div>
                <div className="text-[10px] text-[var(--color-text-muted)] uppercase">{apt.date.split(' ')[0]}</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-[var(--color-text-primary)]">{apt.type}</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">{apt.time} &middot; {apt.provider}</p>
              </div>
              <ArrowRight size={12} className="text-[var(--color-text-muted)]" />
            </div>
          ))}
        </div>
      </CardBody>
      <CTAFooter actions={[
        { label: 'Book new', icon: Plus, variant: 'primary' },
        { label: 'View all', variant: 'ghost' },
      ]} />
    </Card>
  )
}

// ─── Example Widget: Alerts Summary ─────────────────────────────────

function AlertsSummaryWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Bell size={13} className="text-[#c2590a]" />
          Alerts &amp; Reminders
        </CardTitle>
        <Badge variant="warning">4 active</Badge>
      </CardHeader>
      <CardBody className="space-y-2 flex-1 min-h-0 flex flex-col justify-center">
        <AlertBanner message="Allergy: Penicillin — Severe reaction" variant="danger" />
        <AlertBanner message="Missing intake form — last requested Feb 15" variant="warning" />
        <AlertBanner message="Insurance authorization expires Apr 15" variant="info" />
        <AlertBanner message="HEP compliance on track this week" variant="success" />
      </CardBody>
      <CTAFooter actions={[
        { label: 'Manage alerts', variant: 'ghost' },
      ]} />
    </Card>
  )
}

// ─── Example Widget: Activity Feed ──────────────────────────────────

function ActivityFeedWidget() {
  const events = [
    { icon: Calendar, text: 'Appointment completed — Physiotherapy with Dr. Patel', time: 'Today, 10:00 AM', color: 'text-[var(--color-brand-primary)]' },
    { icon: DollarSign, text: 'Payment received — $85.00 via credit card', time: 'Today, 10:15 AM', color: 'text-[var(--color-success-dark)]' },
    { icon: ClipboardList, text: 'Chart note added by Dr. Patel', time: 'Today, 10:30 AM', color: 'text-[var(--color-brand-tertiary)]' },
    { icon: MessageSquare, text: 'Secure message sent — exercise instructions', time: 'Today, 10:45 AM', color: 'text-[var(--color-info)]' },
    { icon: Mail, text: 'Appointment reminder email sent', time: 'Yesterday, 4:00 PM', color: 'text-[var(--color-text-muted)]' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Activity size={13} className="text-[var(--color-brand-primary)]" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardBody className="pb-0 flex-1 min-h-0 overflow-y-auto">
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {events.map((evt, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5">
              <div className="w-6 h-6 rounded-full bg-[var(--color-bg-subtle)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <evt.icon size={12} className={evt.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-[var(--color-text-primary)] leading-snug">{evt.text}</p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{evt.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
      <CTAFooter actions={[
        { label: 'View full history', variant: 'ghost' },
      ]} />
    </Card>
  )
}

// ─── Showcase Layout ────────────────────────────────────────────────

function WidgetsShowcase() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-1">Widget Gallery</h2>
        <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
          Widgets are composable cards that combine different artifacts — metrics, charts, patient data, alerts, and calls to action — into focused, actionable views.
        </p>
      </div>

      {/* Interactive Building Blocks */}
      <BuildingBlocksSection />

      {/* Example Widgets heading */}
      <div>
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-0.5">Example Widgets</h3>
        <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed">
          Each widget below demonstrates a different combination of building blocks composed into a card.
        </p>
      </div>

      {/* Widget grid */}
      <div className="grid grid-cols-2 gap-5">
        <WidgetFrame artifacts={['Message', 'CTA']}>
          <MessagingWidget />
        </WidgetFrame>
        <WidgetFrame artifacts={['Metric', 'Chart', 'CTA']}>
          <VisitTrendsWidget />
        </WidgetFrame>
        <WidgetFrame artifacts={['Metric', 'Alert', 'Chart', 'CTA']}>
          <BalanceWidget />
        </WidgetFrame>
        <WidgetFrame artifacts={['Patient Field', 'CTA']}>
          <QuickContactWidget />
        </WidgetFrame>
        <WidgetFrame size="2:1" artifacts={['Metric', 'Progress', 'Chart', 'Alert', 'CTA']}>
          <TreatmentProgressWidget />
        </WidgetFrame>
        <WidgetFrame artifacts={['Metric', 'List', 'CTA']}>
          <UpcomingAppointmentsWidget />
        </WidgetFrame>
        <WidgetFrame artifacts={['Alert', 'CTA']}>
          <AlertsSummaryWidget />
        </WidgetFrame>
        <WidgetFrame size="2:1" artifacts={['List', 'CTA']}>
          <ActivityFeedWidget />
        </WidgetFrame>
      </div>
    </div>
  )
}

// ─── Helper: label showing which artifacts a widget uses ────────────

const ARTIFACT_COLORS: Record<string, string> = {
  Metric: 'bg-[var(--color-brand-primary)]',
  Chart: 'bg-[var(--color-brand-tertiary)]',
  'Patient Field': 'bg-[var(--color-info)]',
  Alert: 'bg-[#c2590a]',
  Message: 'bg-[var(--color-success)]',
  CTA: 'bg-[var(--color-text-secondary)]',
  List: 'bg-[var(--color-brand-secondary)]',
  Progress: 'bg-[var(--color-danger)]',
}

function WidgetLabel({ artifacts }: { artifacts: string[] }) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      {artifacts.map((a) => (
        <span key={a} className="inline-flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
          <span className={`w-1.5 h-1.5 rounded-full ${ARTIFACT_COLORS[a] ?? 'bg-gray-400'}`} />
          {a}
        </span>
      ))}
    </div>
  )
}

export { WidgetsShowcase }
