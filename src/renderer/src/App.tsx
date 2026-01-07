/**
 * App Component
 * Root component with view switching between Welcome and GitHistory screens
 */

import { useState } from 'react'
import { WelcomeScreen } from './features/welcome'
import { GitLogList } from './features/git-history'

type AppView = 'welcome' | 'git-history'

function App(): React.JSX.Element {
  const [currentView, setCurrentView] = useState<AppView>('welcome')
  const [selectedRepoPath, setSelectedRepoPath] = useState<string | null>(null)

  const handleFolderSelected = (path: string): void => {
    setSelectedRepoPath(path)
    setCurrentView('git-history')
  }

  const handleBack = (): void => {
    setCurrentView('welcome')
    setSelectedRepoPath(null)
  }

  return (
    <>
      {currentView === 'welcome' && (
        <WelcomeScreen onFolderSelected={handleFolderSelected} />
      )}
      {currentView === 'git-history' && selectedRepoPath && (
        <GitLogList repoPath={selectedRepoPath} onBack={handleBack} />
      )}
    </>
  )
}

export default App

