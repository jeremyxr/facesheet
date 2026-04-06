import { useParams } from 'react-router-dom'
import { SettingsSidebar } from '../components/settings/SettingsSidebar'
import { WorkshopContent } from '../components/settings/WorkshopContent'

function SettingsPage() {
  const { section } = useParams<{ section: string }>()

  function renderContent() {
    switch (section) {
      case 'workshop':
        return <WorkshopContent />
      default:
        return (
          <div className="flex items-center justify-center h-full text-[var(--color-text-muted)] text-[14px]">
            Coming soon
          </div>
        )
    }
  }

  return (
    <div className="flex h-full">
      <SettingsSidebar />
      <main className="flex-1 overflow-y-auto bg-[var(--color-bg-app)]">
        {renderContent()}
      </main>
    </div>
  )
}

export { SettingsPage }
