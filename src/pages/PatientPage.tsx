import { useEffect, useState } from 'react'
import { Navigate, useParams, NavLink, useNavigate } from 'react-router-dom'
import {
  User, FileText, Stethoscope, Heart, ClipboardList, FolderOpen,
  FlaskConical, CalendarDays, MessageSquare, Dumbbell, DollarSign,
  Settings, ArrowRight, ArrowLeft, UserCircle,
  Pencil, X, Undo2,
} from 'lucide-react'
import { cn } from '../lib/cn'
import { MOCK_PATIENTS } from '../mocks/patients'
import { Button } from '../components/ui/Button'
import { useWorkshopStore } from '../stores/workshopStore'
import { useViewsStore } from '../stores/viewsStore'
import { useFacesheetEditorStore } from '../stores/facesheetEditorStore'
import { CARD_COMPONENTS } from '../lib/cardRegistry'
import { PatientHeader } from '../components/patient/PatientHeader'
import { ProfilePage } from '../components/patient/profile/ProfilePage'
import { AiPromptBar } from '../components/facesheet/AiPromptBar'
import { EditableCard } from '../components/facesheet/EditableCard'
import { DropZone } from '../components/facesheet/DropZone'
import { CardPicker } from '../components/facesheet/CardPicker'
import { SavePrompt } from '../components/facesheet/SavePrompt'
import { SuggestiveActions } from '../components/facesheet/SuggestiveActions'
import { ViewSwitcher } from '../components/facesheet/ViewSwitcher'
import type { Patient } from '../types/patient'
import type { ViewCardPlacement } from '../types/views'

// ─── Facesheet nav items ─────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Facesheet', path: 'profile', icon: User },
  { label: 'Patient information', path: 'info', icon: FileText },
  { label: 'Medical information', path: 'medical', icon: Stethoscope },
  { label: 'Treatments', path: 'treatments', icon: Heart },
  { label: 'Charts', path: 'chart', icon: ClipboardList },
  { label: 'Files', path: 'files', icon: FolderOpen },
  { label: 'Lab results', path: 'labs', icon: FlaskConical },
  { label: 'Appointments', path: 'appointments', icon: CalendarDays },
  { label: 'Messages', path: 'communications', icon: MessageSquare },
  { label: 'HEP', path: 'hep', icon: Dumbbell },
  { label: 'Billing', path: 'billing', icon: DollarSign },
  { label: 'Settings', path: 'settings', icon: Settings },
]

// ─── Patient sidebar nav ─────────────────────────────────────────────

function PatientNav({ patientId }: { patientId: string }) {
  const navigate = useNavigate()
  const firstItem = NAV_ITEMS[0]
  const restItems = NAV_ITEMS.slice(1)

  return (
    <nav className="w-44 flex-shrink-0 border-r border-[var(--color-border-subtle)] bg-white overflow-y-auto" data-tour-id="patient-nav">
      {/* Top section: back button + Facesheet, aligned to header height */}
      <div className="flex flex-col border-b border-[var(--color-border-subtle)]" style={{ height: '89px' }}>
        <div className="flex-1 flex items-center">
          <button
            onClick={() => navigate('/patients')}
            className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)] border-l-2 border-l-transparent transition-colors w-full"
          >
            <ArrowLeft size={15} className="flex-shrink-0" />
            All Patients
          </button>
        </div>
        <NavLink
          to={`/patients/${patientId}/${firstItem.path}`}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 px-4 py-2 text-[13px] transition-colors',
              isActive
                ? 'bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary-dark)] font-medium border-l-2 border-l-[var(--color-brand-primary)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)] border-l-2 border-l-transparent'
            )
          }
        >
          <firstItem.icon size={15} className="flex-shrink-0" />
          {firstItem.label}
        </NavLink>
      </div>

      {/* Remaining nav items */}
      <div className="py-2">
        {restItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={`/patients/${patientId}/${path}`}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-4 py-2 text-[13px] transition-colors',
                isActive
                  ? 'bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary-dark)] font-medium border-l-2 border-l-[var(--color-brand-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)] border-l-2 border-l-transparent'
              )
            }
          >
            <Icon size={15} className="flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

// ─── Edit toggle button ─────────────────────────────────────────────

function EditToggleButton({ onEnterEdit }: { onEnterEdit?: () => void }) {
  const { isEditMode, setEditMode } = useFacesheetEditorStore()

  return (
    <button
      onClick={() => {
        if (!isEditMode && onEnterEdit) onEnterEdit()
        setEditMode(!isEditMode)
      }}
      data-tour-id="edit-mode-toggle"
      className={cn(
        'w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] border transition-colors',
        isEditMode
          ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)] text-white'
          : 'border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
      )}
      title={isEditMode ? 'Exit edit mode' : 'Edit layout'}
    >
      {isEditMode ? <X size={14} /> : <Pencil size={14} />}
    </button>
  )
}

// ─── Patient header ──────────────────────────────────────────────────

function PatientProfileHeader({ patient, viewControls, onEnterEdit }: { patient: Patient; viewControls?: React.ReactNode; onEnterEdit?: () => void }) {
  const fullName = `${patient.firstName} ${patient.lastName}`
  const isActive = !patient.flags.isDischarged && !patient.flags.isDeceased && patient.stats.monthsSinceLastVisit < 12

  return (
    <div className="bg-white border-b border-[var(--color-border-subtle)]" data-feedback-id="patient-header">
      <div className="px-6 py-4 flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-[var(--color-bg-subtle)] border-2 border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-text-muted)] flex-shrink-0">
          <UserCircle size={32} strokeWidth={1.2} />
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[20px] font-semibold text-[var(--color-text-primary)] leading-tight">
              {fullName}
            </h1>
            <span className="text-[13px] text-[var(--color-text-muted)]">#{patient.id}</span>

            {/* Badges */}
            {isActive && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary-dark)]">
                Active
              </span>
            )}
            {patient.flags.isDeceased && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#fde8e8] text-[var(--color-danger)]">
                Deceased
              </span>
            )}
            {patient.flags.isDischarged && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#fff4e6] text-[#c2590a]">
                Discharged
              </span>
            )}
            {patient.stats.totalBookings <= 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#f0eaff] text-[#8652ff]">
                New
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[13px] text-[var(--color-text-muted)]">
            {patient.sex}, {patient.age} years
          </p>
        </div>

        {/* View controls */}
        {viewControls}

        {/* +New button */}
        <Button variant="primary" size="md" className="gap-1.5">
          + New
        </Button>

        {/* Edit mode toggle */}
        <EditToggleButton onEnterEdit={onEnterEdit} />
      </div>
    </div>
  )
}

// ─── Edit mode toolbar ──────────────────────────────────────────────

function EditModeToolbar({ onSave }: { onSave: () => void }) {
  const { isEditMode, isDirty, undo, canUndo, setEditMode } = useFacesheetEditorStore()

  // Keyboard shortcuts
  useEffect(() => {
    if (!isEditMode) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setEditMode(false)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        undo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditMode, undo, setEditMode])

  if (!isEditMode) return null

  const dirty = isDirty()

  return (
    <div className="mx-6 mb-3 flex items-center gap-2 px-3 py-2 bg-[var(--color-brand-primary-light)] border border-[var(--color-brand-primary)]/20 rounded-[var(--radius-md)]">
      <Pencil size={13} className="text-[var(--color-brand-primary)]" />
      <span className="text-[12px] font-medium text-[var(--color-brand-primary-dark)]">
        Editing layout
      </span>
      {dirty && (
        <span className="text-[11px] text-[var(--color-brand-primary)] ml-1">
          — unsaved changes
        </span>
      )}
      <div className="flex-1" />
      {canUndo() && (
        <button
          onClick={undo}
          className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          title="Undo (Cmd+Z)"
        >
          <Undo2 size={12} />
          Undo
        </button>
      )}
      {dirty && (
        <button
          onClick={onSave}
          className="px-3 py-1 text-[11px] font-medium bg-[var(--color-brand-primary)] text-white rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
        >
          Save
        </button>
      )}
    </div>
  )
}

// AiPromptBar imported from ../components/facesheet/AiPromptBar

// ─── Drag-drop helpers ──────────────────────────────────────────────

interface DragInfo {
  cardId: string
  zone: string
  index: number
}

function reorderCards(
  cards: ViewCardPlacement[],
  dragCardId: string,
  targetZone: string,
  targetIndex: number
): ViewCardPlacement[] {
  const updated = cards.filter((c) => c.cardId !== dragCardId)
  const dragCard = cards.find((c) => c.cardId === dragCardId)
  if (!dragCard) return cards

  const movedCard: ViewCardPlacement = {
    ...dragCard,
    zone: targetZone as 'pinned' | 'main' | 'sidebar',
    order: targetIndex,
  }

  // Insert at target position among same-zone cards
  const zoneCards = updated.filter((c) => c.zone === targetZone)
  const otherCards = updated.filter((c) => c.zone !== targetZone)

  zoneCards.splice(targetIndex, 0, movedCard)

  // Re-index all zones
  const result: ViewCardPlacement[] = []
  const zones = ['pinned', 'main', 'sidebar'] as const
  for (const z of zones) {
    const inZone = z === targetZone ? zoneCards : otherCards.filter((c) => c.zone === z)
    inZone.forEach((c, i) => result.push({ ...c, order: i }))
  }

  return result
}

// ─── Dynamic card rendering zones ────────────────────────────────────

function PinnedZone({
  cards,
  patient,
  isEditMode,
  dragInfo,
  allDraftCards,
  onDragStart,
  onDragOver,
  onDropOnCard,
  onDropOnZone,
  onRemove,
  onToggleWidth,
  onAddCard,
}: {
  cards: ViewCardPlacement[]
  patient: Patient
  isEditMode: boolean
  dragInfo: DragInfo | null
  allDraftCards: ViewCardPlacement[]
  onDragStart: (cardId: string, zone: string, index: number) => void
  onDragOver: (e: React.DragEvent) => void
  onDropOnCard: (cardId: string, zone: string, index: number) => void
  onDropOnZone: (zone: string, index: number) => void
  onRemove: (cardId: string) => void
  onToggleWidth: (cardId: string) => void
  onAddCard: (cardId: string, zone: 'pinned' | 'main' | 'sidebar') => void
}) {
  if (cards.length === 0 && !isEditMode) return null

  return (
    <div className="px-6 pb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)]">Pinned items</h2>
        {!isEditMode && (
          <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
            <ArrowRight size={16} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 items-stretch">
        {cards.map((placement, idx) => {
          const Component = CARD_COMPONENTS[placement.cardId]
          if (!Component) return null

          if (isEditMode) {
            return (
              <EditableCard
                key={placement.cardId}
                cardId={placement.cardId}
                zone="pinned"
                index={idx}
                patient={patient}
                Component={Component}
                onRemove={onRemove}
                onToggleWidth={onToggleWidth}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDropOnCard}
              />
            )
          }

          return <div key={placement.cardId} className="[&>div]:h-full" data-feedback-id={`card:${placement.cardId}`}><Component patient={patient} /></div>
        })}
        {isEditMode && (
          <>
            {dragInfo && (
              <DropZone zone="pinned" index={cards.length} onDrop={onDropOnZone} label="Drop in pinned" />
            )}
            <CardPicker currentCards={allDraftCards} onAdd={onAddCard} />
          </>
        )}
      </div>
    </div>
  )
}

// ─── Facesheet page (main content) ──────────────────────────────────

function FacesheetContent({ patient }: { patient: Patient }) {
  const { views, getEffectiveViewId, updateViewCards, createPatientView, setGlobalView, patientOverrides } = useViewsStore()
  const { isEditMode, draftCards, initDraft, updateDraftCards, resetDraft, setEditMode, isDirty } = useFacesheetEditorStore()
  const viewId = getEffectiveViewId(patient.id)
  const view = views.find((v) => v.id === viewId) ?? views[0]

  const [dragInfo, setDragInfo] = useState<DragInfo | null>(null)
  const [showSavePrompt, setShowSavePrompt] = useState(false)

  const hasPatientOverride = patientOverrides.some((o) => o.patientId === patient.id)

  // Initialize draft when view changes
  useEffect(() => {
    initDraft(view.id, view.cards)
  }, [view.id, view.cards, initDraft])

  // Save handlers
  function handleSaveForPatient() {
    const patientName = `${patient.firstName} ${patient.lastName}`
    createPatientView(patient.id, `${view.name} (${patientName})`, draftCards)
    setShowSavePrompt(false)
    setEditMode(false)
  }

  function handleSaveForEveryone() {
    updateViewCards(view.id, draftCards)
    setShowSavePrompt(false)
    setEditMode(false)
  }

  function handleDiscard() {
    resetDraft()
    setShowSavePrompt(false)
  }

  // Warn on browser close with unsaved changes
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isEditMode && isDirty()) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isEditMode, isDirty])

  function handleSelectView(newViewId: string) {
    if (isEditMode && isDirty()) {
      // Could prompt, but for now just discard
      resetDraft()
    }
    setGlobalView(newViewId)
  }

  function handleNewView() {
    const newView = useViewsStore.getState().duplicateView(view.id, `${view.name} Copy`)
    setGlobalView(newView.id)
  }

  const activeCards = isEditMode ? draftCards : view.cards

  const pinnedCards = activeCards
    .filter((c) => c.zone === 'pinned')
    .sort((a, b) => a.order - b.order)

  const mainCards = activeCards
    .filter((c) => c.zone === 'main')
    .sort((a, b) => a.order - b.order)

  const sidebarCards = activeCards
    .filter((c) => c.zone === 'sidebar')
    .sort((a, b) => a.order - b.order)

  // Drag-drop handlers
  function handleDragStart(cardId: string, zone: string, index: number) {
    setDragInfo({ cardId, zone, index })
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDropOnCard(_targetCardId: string, targetZone: string, targetIndex: number) {
    if (!dragInfo) return
    const updated = reorderCards(draftCards, dragInfo.cardId, targetZone, targetIndex)
    updateDraftCards(updated)
    setDragInfo(null)
  }

  function handleDropOnZone(zone: string, index: number) {
    if (!dragInfo) return
    const updated = reorderCards(draftCards, dragInfo.cardId, zone, index)
    updateDraftCards(updated)
    setDragInfo(null)
  }

  function handleRemoveCard(cardId: string) {
    const result: ViewCardPlacement[] = []
    const zones = ['pinned', 'main', 'sidebar'] as const
    for (const z of zones) {
      draftCards
        .filter((c) => c.zone === z && c.cardId !== cardId)
        .forEach((c, i) => result.push({ ...c, order: i }))
    }
    updateDraftCards(result)
  }

  function handleToggleWidth(cardId: string) {
    const updated = draftCards.map((c) =>
      c.cardId === cardId ? { ...c, width: (c.width === 2 ? 1 : 2) as 1 | 2 } : c
    )
    updateDraftCards(updated)
  }

  function handleAddCard(cardId: string, zone: 'pinned' | 'main' | 'sidebar') {
    const zoneCards = draftCards.filter((c) => c.zone === zone)
    const newCard: ViewCardPlacement = {
      cardId,
      zone,
      order: zoneCards.length,
      width: 1,
    }
    updateDraftCards([...draftCards, newCard])
  }

  function handleEnterEdit() {
    // Re-snapshot the current view cards into the draft so we always start clean
    initDraft(view.id, view.cards)
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-bg-app)] relative" data-tour-id="facesheet-content">
      {/* Edit mode overlay border — sticky to viewport, always visible */}
      {isEditMode && (
        <div className="sticky top-0 left-0 right-0 h-0 z-30 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[100vh] border-[3px] shadow-[0_0_0_4px_rgba(0,0,0,0.05),inset_0_0_20px_rgba(0,150,136,0.08)]" style={{ borderColor: 'var(--color-brand-primary)' }} />
        </div>
      )}
      <PatientProfileHeader
        patient={patient}
        onEnterEdit={handleEnterEdit}
        viewControls={
          <ViewSwitcher
            activeViewId={view.id}
            patientId={patient.id}
            hasPatientOverride={hasPatientOverride}
            onSelectView={handleSelectView}
            onNewView={handleNewView}
          />
        }
      />
      {/* Full-width layout: left content + right sidebar flush to top */}
      <div className="flex gap-0">
        {/* Left: AI bar, toolbar, pinned, main cards */}
        <div className="flex-1 min-w-0">
          <AiPromptBar patientName={`${patient.firstName} ${patient.lastName}`} />
          {!isEditMode && <SuggestiveActions patient={patient} />}
          <EditModeToolbar onSave={() => setShowSavePrompt(true)} />
          <PinnedZone
            cards={pinnedCards}
            patient={patient}
            isEditMode={isEditMode}
            dragInfo={dragInfo}
            allDraftCards={draftCards}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDropOnCard={handleDropOnCard}
            onDropOnZone={handleDropOnZone}
            onRemove={handleRemoveCard}
            onToggleWidth={handleToggleWidth}
            onAddCard={handleAddCard}
          />

          {/* Main content cards - 2 column, equal height rows */}
          <div className="px-6 pb-6 grid grid-cols-2 gap-4 items-stretch">
            {mainCards.map((placement, idx) => {
              const Component = CARD_COMPONENTS[placement.cardId]
              if (!Component) return null
              const wide = (placement.width ?? 1) >= 2

              if (isEditMode) {
                return (
                  <div key={placement.cardId} className={cn(wide ? 'col-span-2' : '', '[&>div]:h-full')}>
                    <EditableCard
                      cardId={placement.cardId}
                      zone="main"
                      width={placement.width}
                      index={idx}
                      patient={patient}
                      Component={Component}
                      onRemove={handleRemoveCard}
                      onToggleWidth={handleToggleWidth}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDropOnCard}
                    />
                  </div>
                )
              }

              return (
                <div key={placement.cardId} className={cn(wide ? 'col-span-2' : '', '[&>div]:h-full')} data-feedback-id={`card:${placement.cardId}`}>
                  <Component patient={patient} />
                </div>
              )
            })}
            {isEditMode && dragInfo && (
              <DropZone zone="main" index={mainCards.length} onDrop={handleDropOnZone} label="Drop in main" />
            )}
          </div>
        </div>

        {/* Right sidebar — flush to top of content area */}
        {(sidebarCards.length > 0 || isEditMode) && (
          <div className="w-64 flex-shrink-0 bg-[var(--color-bg-app)] border-l border-[var(--color-border-subtle)] p-4 space-y-3 sticky top-0 self-start max-h-screen overflow-visible [&>div]:h-auto">
            {sidebarCards.map((placement, idx) => {
              const Component = CARD_COMPONENTS[placement.cardId]
              if (!Component) return null

              if (isEditMode) {
                return (
                  <EditableCard
                    key={placement.cardId}
                    cardId={placement.cardId}
                    zone="sidebar"
                    index={idx}
                    patient={patient}
                    Component={Component}
                    onRemove={handleRemoveCard}
                    onToggleWidth={handleToggleWidth}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDropOnCard}
                  />
                )
              }

              return <div key={placement.cardId} data-feedback-id={`card:${placement.cardId}`}><Component patient={patient} /></div>
            })}
            {isEditMode && dragInfo && (
              <DropZone zone="sidebar" index={sidebarCards.length} onDrop={handleDropOnZone} label="Drop in sidebar" />
            )}
            {isEditMode && (
              <CardPicker currentCards={draftCards} onAdd={(cardId) => handleAddCard(cardId, 'sidebar')} variant="sidebar" />
            )}
          </div>
        )}
      </div>

      {/* Save prompt dialog */}
      <SavePrompt
        open={showSavePrompt}
        onClose={() => setShowSavePrompt(false)}
        patientName={`${patient.firstName} ${patient.lastName}`}
        viewName={view.name}
        onSaveForPatient={handleSaveForPatient}
        onSaveForEveryone={handleSaveForEveryone}
        onDiscard={handleDiscard}
      />
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────

function PatientPage() {
  const { patientId, tab } = useParams()
  const { patientManagementEnabled } = useWorkshopStore()
  const patient = MOCK_PATIENTS.find((p) => String(p.id) === patientId)

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-text-muted)] text-[14px]">
        Patient not found.
      </div>
    )
  }

  // Legacy layout: old header + tabs + profile cards
  if (!patientManagementEnabled) {
    return (
      <div>
        <PatientHeader patient={patient} />
        <ProfilePage patient={patient} />
      </div>
    )
  }

  // New facesheet layout: left nav + header + content
  return (
    <div className="flex h-full">
      <PatientNav patientId={patientId!} />
      {(!tab || tab === 'profile') ? (
        <FacesheetContent patient={patient} />
      ) : (
        <div className="flex-1 overflow-y-auto bg-[var(--color-bg-app)]">
          <PatientProfileHeader patient={patient} />
          <div className="px-6 py-8 text-center text-[var(--color-text-muted)] text-[14px]">
            {NAV_ITEMS.find((n) => n.path === tab)?.label ?? tab} — coming soon
          </div>
        </div>
      )}
    </div>
  )
}

function PatientIndexRedirect() {
  return <Navigate to="/patients/1/profile" replace />
}

export { PatientPage, PatientIndexRedirect }
