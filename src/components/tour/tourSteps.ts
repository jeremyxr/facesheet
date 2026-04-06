export type TourStepType = 'action' | 'info'

export interface TourStep {
  id: string
  type: TourStepType
  targetId: string
  title: string
  description: string
  placement: 'top' | 'bottom' | 'left' | 'right'
  navigateTo?: string
  spotlightPadding?: number
  buttonLabel?: string
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'nav-to-settings',
    type: 'action',
    targetId: 'topnav-settings',
    title: 'Head to Settings',
    description:
      "Click on Settings in the navigation bar to visit the Workshop — this is where you can enable new features.",
    placement: 'bottom',
    spotlightPadding: 4,
  },
  {
    id: 'toggle-feature',
    type: 'action',
    targetId: 'workshop-toggle',
    title: 'Turn on Patient Management',
    description:
      'Click the toggle to enable the redesigned patient management experience. This unlocks the new patient list, navigation, and facesheet.',
    placement: 'bottom',
    spotlightPadding: 12,
  },
  {
    id: 'nav-to-patients',
    type: 'action',
    targetId: 'topnav-patients',
    title: 'Go to Patients',
    description:
      "Great! Patient management is now on. Click on Patients in the navigation to see your new patient list.",
    placement: 'bottom',
    spotlightPadding: 4,
  },
  {
    id: 'patient-list-intro',
    type: 'info',
    targetId: 'patient-list-header',
    title: 'Your new Patient List',
    description:
      "This is your refreshed patient list. Search, filter, and sort your patients, and see at-a-glance stats like active patients, upcoming appointments, and outstanding balances.",
    placement: 'bottom',
    spotlightPadding: 8,
  },
  {
    id: 'click-patient',
    type: 'action',
    targetId: 'patient-row-first',
    title: 'Open a patient',
    description:
      "Click on a patient row to open their record and see the new layout.",
    placement: 'bottom',
    spotlightPadding: 4,
  },
  {
    id: 'side-nav-intro',
    type: 'info',
    targetId: 'patient-nav',
    title: 'New sidebar navigation',
    description:
      'This is your new side navigation. Facesheet, charts, billing, messages — everything for this patient is one click away.',
    placement: 'right',
    spotlightPadding: 0,
  },
  {
    id: 'facesheet-intro',
    type: 'info',
    targetId: 'facesheet-content',
    title: 'Meet the Facesheet',
    description:
      'This is the Facesheet — a customizable overview of your patient. Cards show key context like allergies, vitals, treatment plans, and more — all in one place.',
    placement: 'left',
    spotlightPadding: 0,
  },
  {
    id: 'views-intro',
    type: 'info',
    targetId: 'view-switcher',
    title: 'What are Views?',
    description:
      'Views control what cards are shown and how they are laid out. Think of them like templates — you can have different views for different disciplines, workflows, or patients.',
    placement: 'bottom',
    spotlightPadding: 8,
  },
  {
    id: 'views-switch',
    type: 'info',
    targetId: 'view-switcher',
    title: 'Switch between Views',
    description:
      'Click this dropdown to switch between views. Each view shows a different set of cards tailored to a specific need — like a clinical overview, billing summary, or minimal view.',
    placement: 'bottom',
    spotlightPadding: 8,
  },
  {
    id: 'edit-mode-intro',
    type: 'info',
    targetId: 'edit-mode-toggle',
    title: 'Edit your layout',
    description:
      'Click the pencil icon to enter edit mode. From there you can drag cards to reorder them, resize them, add new ones, or remove what you don\'t need.',
    placement: 'bottom',
    spotlightPadding: 8,
    buttonLabel: 'Finish',
  },
]
