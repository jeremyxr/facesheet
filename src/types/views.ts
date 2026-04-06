export interface CardDefinition {
  id: string
  label: string
  description: string
  group: 'clinical' | 'administrative' | 'personal' | 'notes'
  keywords: string[]
  defaultZone: 'pinned' | 'main' | 'sidebar'
  defaultWidth: 1 | 2 | 3
}

export interface ViewCardPlacement {
  cardId: string
  zone: 'pinned' | 'main' | 'sidebar'
  order: number
  width?: 1 | 2 | 3
}

export interface ViewPermissions {
  mode: 'everyone' | 'custom'
  roles: string[]
  staffIds: number[]
}

export interface View {
  id: string
  name: string
  description?: string
  cards: ViewCardPlacement[]
  isDefault?: boolean
  createdAt: string
  permissions?: ViewPermissions
}

export interface PatientViewOverride {
  patientId: number
  viewId: string
}
