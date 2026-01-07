/**
 * WelcomeScreen Component
 * Entry screen with folder selection functionality
 */

import { useFolderOpen } from './useFolderOpen'
import './WelcomeScreen.css'

interface WelcomeScreenProps {
  onFolderSelected: (path: string) => void
}

export function WelcomeScreen({ onFolderSelected }: WelcomeScreenProps): React.JSX.Element {
  const { selectedPath, isLoading, error, openFolder } = useFolderOpen()

  const handleOpenFolder = async (): Promise<void> => {
    await openFolder()
  }

  // Notify parent when folder is selected
  if (selectedPath) {
    onFolderSelected(selectedPath)
  }

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to Dragit</h1>
        <p className="welcome-subtitle">
          Select a Git repository to get started
        </p>

        <button
          className="open-folder-button"
          onClick={handleOpenFolder}
          disabled={isLoading}
        >
          {isLoading ? 'Opening...' : 'Open Folder'}
        </button>

        {error && (
          <p className="error-message">{error}</p>
        )}

        {selectedPath && (
          <p className="selected-path">
            Selected: <code>{selectedPath}</code>
          </p>
        )}
      </div>
    </div>
  )
}
