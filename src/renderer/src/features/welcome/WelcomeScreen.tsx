/**
 * WelcomeScreen Component
 * Professional desktop-wide welcome page for Dragit
 */

import { StartSection } from './components/StartSection'
import { RecentSection } from './components/RecentSection'
import { WelcomeHeader } from './components/WelcomeHeader'
import './WelcomeScreen.css'

interface WelcomeScreenProps {
  onFolderSelected: (path: string) => void
  onCloneRepository: () => void
}

export function WelcomeScreen({
  onFolderSelected,
  onCloneRepository
}: WelcomeScreenProps): React.JSX.Element {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-column welcome-column--left">
          <WelcomeHeader />
          <StartSection
            onFolderSelected={onFolderSelected}
            onCloneRepository={onCloneRepository}
          />
        </div>

        <div className="welcome-column welcome-column--right">
          <RecentSection onProjectSelected={onFolderSelected} />
        </div>
      </div>
    </div>
  )
}
