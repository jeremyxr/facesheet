import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Tag, Zap, PenLine, Plus, Trash2, GripVertical,
  LayoutGrid, ChevronRight, ArrowLeft, X, ChevronDown,
  Type, Hash, Calendar, ToggleLeft, List, AlignLeft,
  Puzzle,
} from 'lucide-react'
import { cn } from '../lib/cn'
import { Button } from '../components/ui/Button'
import { ViewsContent } from '../components/settings/ViewsContent'
import { WidgetsShowcase } from '../components/settings/WidgetsShowcase'

// ─── Sidebar nav items ────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'labels', label: 'Labels', icon: Tag },
  { id: 'views', label: 'Views', icon: LayoutGrid },
  { id: 'custom-fields', label: 'Custom Fields', icon: PenLine },
  { id: 'widgets', label: 'Widgets', icon: Puzzle },
]

// ─── Label types & defaults ───────────────────────────────────────────

interface AutoLabel {
  id: string
  name: string
  color: string
  bg: string
  enabled: boolean
  condition: string
  description: string
}

interface ManualLabel {
  id: string
  name: string
  color: string
  bg: string
}

const DEFAULT_AUTO_LABELS: AutoLabel[] = [
  {
    id: 'active',
    name: 'Active',
    color: 'text-[var(--color-brand-primary-dark)]',
    bg: 'bg-[var(--color-brand-primary-light)]',
    enabled: true,
    condition: 'Has upcoming appointments',
    description: 'Applied when patient has at least one upcoming appointment',
  },
  {
    id: 'balance',
    name: 'Balance',
    color: 'text-[var(--color-danger)]',
    bg: 'bg-[#fde8e8]',
    enabled: true,
    condition: 'Outstanding balance > $0',
    description: 'Applied when patient has any claims or private outstanding balance',
  },
  {
    id: 'overdue',
    name: 'Overdue',
    color: 'text-[#c2590a]',
    bg: 'bg-[#fff4e6]',
    enabled: true,
    condition: 'Last visit > 6 months, no upcoming',
    description: 'Applied when last visit was over 6 months ago and no appointments booked',
  },
  {
    id: 'inactive',
    name: 'Inactive',
    color: 'text-[var(--color-text-muted)]',
    bg: 'bg-[var(--color-bg-subtle)]',
    enabled: true,
    condition: 'Last visit > 12 months',
    description: 'Applied when patient has not been seen for over 12 months',
  },
  {
    id: 'new',
    name: 'New',
    color: 'text-[#8652ff]',
    bg: 'bg-[#f0eaff]',
    enabled: true,
    condition: 'Total bookings ≤ 3',
    description: 'Applied when patient has 3 or fewer total bookings',
  },
]

const DEFAULT_MANUAL_LABELS: ManualLabel[] = [
  { id: 'vip', name: 'VIP', color: 'text-[#8652ff]', bg: 'bg-[#f0eaff]' },
  { id: 'referred', name: 'Referred', color: 'text-[#4a90e2]', bg: 'bg-[#e8f4fd]' },
]

const LABEL_COLOR_OPTIONS = [
  { color: 'text-[var(--color-brand-primary-dark)]', bg: 'bg-[var(--color-brand-primary-light)]', name: 'Teal' },
  { color: 'text-[var(--color-danger)]', bg: 'bg-[#fde8e8]', name: 'Red' },
  { color: 'text-[#c2590a]', bg: 'bg-[#fff4e6]', name: 'Orange' },
  { color: 'text-[#8652ff]', bg: 'bg-[#f0eaff]', name: 'Purple' },
  { color: 'text-[#4a90e2]', bg: 'bg-[#e8f4fd]', name: 'Blue' },
  { color: 'text-[var(--color-success)]', bg: 'bg-[#e8f0e4]', name: 'Green' },
  { color: 'text-[var(--color-text-muted)]', bg: 'bg-[var(--color-bg-subtle)]', name: 'Gray' },
]

// ─── Toggle ───────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-9 h-5 rounded-full transition-colors flex-shrink-0',
        checked ? 'bg-[var(--color-brand-primary)]' : 'bg-[var(--color-border-default)]'
      )}
    >
      <span
        className={cn(
          'absolute left-0 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-[18px]' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}

// ─── Labels content ───────────────────────────────────────────────────

function LabelsContent() {
  const [autoLabels, setAutoLabels] = useState<AutoLabel[]>(DEFAULT_AUTO_LABELS)
  const [manualLabels, setManualLabels] = useState<ManualLabel[]>(DEFAULT_MANUAL_LABELS)
  const [newLabelName, setNewLabelName] = useState('')
  const [newLabelColorIdx, setNewLabelColorIdx] = useState(3)

  function toggleAutoLabel(id: string) {
    setAutoLabels((prev) =>
      prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l))
    )
  }

  function addManualLabel() {
    if (!newLabelName.trim()) return
    const opt = LABEL_COLOR_OPTIONS[newLabelColorIdx]
    setManualLabels((prev) => [
      ...prev,
      { id: `manual-${Date.now()}`, name: newLabelName.trim(), color: opt.color, bg: opt.bg },
    ])
    setNewLabelName('')
  }

  function removeManualLabel(id: string) {
    setManualLabels((prev) => prev.filter((l) => l.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* Automatic labels */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Zap size={16} className="text-[var(--color-brand-primary)]" />
          <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)]">Automatic Labels</h2>
        </div>
        <p className="text-[12px] text-[var(--color-text-muted)] mb-4">
          These labels are applied automatically based on patient data. Toggle them on or off.
        </p>

        <div className="space-y-2">
          {autoLabels.map((label) => (
            <div
              key={label.id}
              className={cn(
                'flex items-start gap-4 bg-white rounded-[var(--radius-md)] border px-4 py-3.5 transition-colors',
                label.enabled
                  ? 'border-[var(--color-border-subtle)]'
                  : 'border-[var(--color-border-subtle)] opacity-60'
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider',
                      label.color, label.bg
                    )}
                  >
                    {label.name}
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)] bg-[var(--color-bg-subtle)] rounded px-1.5 py-0.5 font-medium">
                    {label.condition}
                  </span>
                </div>
                <p className="text-[12px] text-[var(--color-text-secondary)]">{label.description}</p>
              </div>
              <Toggle checked={label.enabled} onChange={() => toggleAutoLabel(label.id)} />
            </div>
          ))}
        </div>
      </section>

      {/* Manual labels */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <PenLine size={16} className="text-[#8652ff]" />
          <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)]">Manual Labels</h2>
        </div>
        <p className="text-[12px] text-[var(--color-text-muted)] mb-4">
          Create custom labels that can be manually applied to individual patients.
        </p>

        <div className="space-y-2 mb-4">
          {manualLabels.map((label) => (
            <div
              key={label.id}
              className="flex items-center gap-3 bg-white rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] px-4 py-3"
            >
              <GripVertical size={14} className="text-[var(--color-text-muted)] flex-shrink-0 cursor-grab" />
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider',
                  label.color, label.bg
                )}
              >
                {label.name}
              </span>
              <span className="flex-1 text-[12px] text-[var(--color-text-muted)]">Manually assigned</span>
              <button
                onClick={() => removeManualLabel(label.id)}
                className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[#fde8e8] transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {manualLabels.length === 0 && (
            <div className="text-[12px] text-[var(--color-text-muted)] bg-white border border-dashed border-[var(--color-border-subtle)] rounded-[var(--radius-md)] px-4 py-6 text-center">
              No manual labels yet. Create one below.
            </div>
          )}
        </div>

        {/* Add new label */}
        <div className="bg-white rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={13} className="text-[var(--color-text-muted)]" />
            <span className="text-[12px] font-medium text-[var(--color-text-primary)]">New label</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Label name..."
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addManualLabel() }}
              className="flex-1 px-3 py-1.5 text-[12px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:bg-white transition-colors"
            />
            <div className="flex items-center gap-1">
              {LABEL_COLOR_OPTIONS.map((opt, i) => (
                <button
                  key={opt.name}
                  onClick={() => setNewLabelColorIdx(i)}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center',
                    opt.bg,
                    i === newLabelColorIdx
                      ? 'border-[var(--color-text-primary)] scale-110'
                      : 'border-transparent hover:border-[var(--color-border-default)]'
                  )}
                >
                  <span className={cn('w-2.5 h-2.5 rounded-full', opt.bg.replace('bg-', 'bg-'), opt.color.replace('text-', 'bg-').replace('text-', ''))} />
                </button>
              ))}
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={addManualLabel}
              disabled={!newLabelName.trim()}
              className="gap-1"
            >
              <Plus size={12} />
              Add
            </Button>
          </div>
          {newLabelName.trim() && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] text-[var(--color-text-muted)]">Preview:</span>
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider',
                  LABEL_COLOR_OPTIONS[newLabelColorIdx].color,
                  LABEL_COLOR_OPTIONS[newLabelColorIdx].bg
                )}
              >
                {newLabelName.trim()}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// ─── Custom Fields content ──────────────────────────────────────────

interface CustomField {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'dropdown' | 'textarea'
  required: boolean
  options?: string[] // for dropdown type
}

const FIELD_TYPE_OPTIONS: { value: CustomField['type']; label: string; icon: typeof Type }[] = [
  { value: 'text', label: 'Text', icon: Type },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'boolean', label: 'Toggle', icon: ToggleLeft },
  { value: 'dropdown', label: 'Dropdown', icon: List },
  { value: 'textarea', label: 'Long text', icon: AlignLeft },
]

const DEFAULT_CUSTOM_FIELDS: CustomField[] = [
  { id: '1', name: 'Referral Source', type: 'dropdown', required: false, options: ['Doctor', 'Friend/Family', 'Online', 'Insurance', 'Walk-in', 'Other'] },
  { id: '2', name: 'Employer', type: 'text', required: false },
  { id: '3', name: 'Injury Date', type: 'date', required: false },
  { id: '4', name: 'WCB Claim', type: 'boolean', required: false },
  { id: '5', name: 'Internal Notes', type: 'textarea', required: false },
]

function CustomFieldsContent() {
  const [fields, setFields] = useState<CustomField[]>(DEFAULT_CUSTOM_FIELDS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newField, setNewField] = useState<{ name: string; type: CustomField['type']; required: boolean; options: string }>({
    name: '', type: 'text', required: false, options: '',
  })

  function handleAdd() {
    if (!newField.name.trim()) return
    const field: CustomField = {
      id: `cf-${Date.now()}`,
      name: newField.name.trim(),
      type: newField.type,
      required: newField.required,
      ...(newField.type === 'dropdown' && newField.options
        ? { options: newField.options.split(',').map((o) => o.trim()).filter(Boolean) }
        : {}),
    }
    setFields([...fields, field])
    setNewField({ name: '', type: 'text', required: false, options: '' })
    setShowNew(false)
  }

  function handleDelete(id: string) {
    setFields(fields.filter((f) => f.id !== id))
    if (editingId === id) setEditingId(null)
  }

  function handleUpdateField(id: string, updates: Partial<CustomField>) {
    setFields(fields.map((f) => f.id === id ? { ...f, ...updates } : f))
  }

  const fieldTypeIcon = (type: CustomField['type']) => {
    const opt = FIELD_TYPE_OPTIONS.find((o) => o.value === type)
    return opt ? opt.icon : Type
  }

  const fieldTypeLabel = (type: CustomField['type']) => {
    const opt = FIELD_TYPE_OPTIONS.find((o) => o.value === type)
    return opt ? opt.label : type
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-0.5">Custom Fields</h2>
          <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed">
            Add custom properties to patient profiles. These fields appear on every patient record.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="gap-1.5 flex-shrink-0"
          onClick={() => setShowNew(true)}
        >
          <Plus size={13} />
          Add field
        </Button>
      </div>

      {/* Add new field form */}
      {showNew && (
        <div className="border border-[var(--color-brand-primary)] rounded-[var(--radius-md)] bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-[var(--color-text-primary)]">New field</p>
            <button onClick={() => setShowNew(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1">Field name</label>
              <input
                type="text"
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
                placeholder="e.g. Referral Source"
                className="w-full px-3 py-1.5 text-[12px] bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1">Type</label>
              <div className="relative">
                <select
                  value={newField.type}
                  onChange={(e) => setNewField({ ...newField, type: e.target.value as CustomField['type'] })}
                  className="w-full appearance-none px-3 py-1.5 pr-8 text-[12px] bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
                >
                  {FIELD_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
              </div>
            </div>
          </div>
          {newField.type === 'dropdown' && (
            <div>
              <label className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1">Options (comma-separated)</label>
              <input
                type="text"
                value={newField.options}
                onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                placeholder="Option 1, Option 2, Option 3"
                className="w-full px-3 py-1.5 text-[12px] bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
              />
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-[12px] text-[var(--color-text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={newField.required}
                onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                className="rounded border-[var(--color-border-default)]"
              />
              Required field
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNew(false)}
                className="px-3 py-1.5 text-[12px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Cancel
              </button>
              <Button variant="primary" size="sm" onClick={handleAdd} disabled={!newField.name.trim()}>
                Add field
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Fields list */}
      <div className="border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] bg-white overflow-hidden divide-y divide-[var(--color-border-subtle)]">
        {fields.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-[13px] text-[var(--color-text-muted)]">No custom fields yet.</p>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Click "Add field" to create your first custom property.</p>
          </div>
        ) : (
          fields.map((field) => {
            const Icon = fieldTypeIcon(field.type)
            const isEditing = editingId === field.id

            return (
              <div key={field.id} className="group">
                <div
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 transition-colors',
                    isEditing ? 'bg-[var(--color-bg-subtle)]' : 'hover:bg-[var(--color-bg-subtle)]/50'
                  )}
                >
                  <div className="flex items-center gap-2 cursor-grab text-[var(--color-text-muted)]">
                    <GripVertical size={12} />
                  </div>
                  <div className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] flex-shrink-0">
                    <Icon size={13} className="text-[var(--color-text-muted)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[var(--color-text-primary)]">{field.name}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      {fieldTypeLabel(field.type)}
                      {field.required && <span className="ml-1.5 text-[var(--color-brand-primary)]">Required</span>}
                      {field.type === 'dropdown' && field.options && (
                        <span className="ml-1.5">&middot; {field.options.length} options</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingId(isEditing ? null : field.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white transition-colors"
                      title="Edit"
                    >
                      <PenLine size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(field.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[#fde8e8] transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Inline edit panel */}
                {isEditing && (
                  <div className="px-4 pb-3 pt-1 bg-[var(--color-bg-subtle)] space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1">Field name</label>
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => handleUpdateField(field.id, { name: e.target.value })}
                          className="w-full px-3 py-1.5 text-[12px] bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1">Type</label>
                        <div className="relative">
                          <select
                            value={field.type}
                            onChange={(e) => handleUpdateField(field.id, { type: e.target.value as CustomField['type'] })}
                            className="w-full appearance-none px-3 py-1.5 pr-8 text-[12px] bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
                          >
                            {FIELD_TYPE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    {field.type === 'dropdown' && (
                      <div>
                        <label className="block text-[11px] font-medium text-[var(--color-text-secondary)] mb-1">Options (comma-separated)</label>
                        <input
                          type="text"
                          value={field.options?.join(', ') ?? ''}
                          onChange={(e) => handleUpdateField(field.id, { options: e.target.value.split(',').map((o) => o.trim()).filter(Boolean) })}
                          className="w-full px-3 py-1.5 text-[12px] bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-[12px] text-[var(--color-text-secondary)] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                          className="rounded border-[var(--color-border-default)]"
                        />
                        Required field
                      </label>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 text-[12px] font-medium text-[var(--color-brand-primary)] hover:opacity-80 transition-opacity"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ─── Placeholder content for other sections ───────────────────────────

function PlaceholderContent({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-1">{title}</h2>
      <p className="text-[13px] text-[var(--color-text-muted)] max-w-md">{description}</p>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────

function PatientSettingsPage() {
  const { section = 'labels' } = useParams<{ section: string }>()

  function renderContent() {
    switch (section) {
      case 'labels':
        return <LabelsContent />
      case 'views':
        return <ViewsContent />
      case 'custom-fields':
        return <CustomFieldsContent />
      case 'widgets':
        return <WidgetsShowcase />
      default:
        return <PlaceholderContent title="Not Found" description="This settings section doesn't exist." />
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb header */}
      <div className="bg-white border-b border-[var(--color-border-subtle)] px-6 py-3.5 flex items-center gap-3 flex-shrink-0">
        <Link
          to="/patients"
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <nav className="flex items-center gap-1.5 text-[13px]">
          <Link
            to="/patients"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)] transition-colors"
          >
            Patients
          </Link>
          <ChevronRight size={12} className="text-[var(--color-text-muted)]" />
          <span className="font-semibold text-[var(--color-text-primary)]">Settings</span>
        </nav>
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className="flex flex-col h-full overflow-y-auto border-r border-[var(--color-border-subtle)]"
          style={{ width: '220px', minWidth: '220px', backgroundColor: '#f8f8f8' }}
        >
          <nav className="py-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = section === item.id
              return (
                <Link
                  key={item.id}
                  to={`/patients/settings/${item.id}`}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-[7px] text-[13px] transition-colors',
                    isActive
                      ? 'bg-[var(--color-brand-primary-light)] text-[var(--color-text-primary)] font-medium'
                      : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                  )}
                >
                  <Icon size={15} className={isActive ? 'text-[var(--color-brand-primary-dark)]' : 'text-[var(--color-text-muted)]'} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-h-0 overflow-y-auto bg-[var(--color-bg-app)]">
          <div className={cn('px-8 py-6', (section === 'views' || section === 'widgets') ? 'max-w-5xl' : 'max-w-3xl')}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export { PatientSettingsPage }
