/**
 * StartSection Component
 * Primary actions for getting started with Dragit
 */

import { useState } from 'react'
import { ActionButton } from './ActionButton'
import { FolderIcon, GitBranchIcon } from './icons'
import './StartSection.css'

interface StartSectionProps {
  onFolderSelected: (path: string) => void
  onCloneRepository: () => void
}

export function StartSection({
  onFolderSelected,
  onCloneRepository
}: StartSectionProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleOpenFolder = async (): Promise<void> => {
    setIsLoading('folder')
    try {
      const result = await window.api.openFolderDialog()
      if (result.success && result.path) {
        onFolderSelected(result.path)
      }
    } finally {
      setIsLoading(null)
    }
  }

  const handleCloneRepository = (): void => {
    setIsLoading('clone')
    onCloneRepository()
    setIsLoading(null)
  }

  return (
    <section className="start-section">
      <h2 className="start-section__heading">START</h2>
      <p className="start-section__description">Open a folder or repository to begin</p>

      <div className="start-section__actions">
        <ActionButton
          icon={<FolderIcon />}
          title="Open Folder"
          description="Browse to a local Git repository"
          shortcut="Ctrl+O"
          onClick={handleOpenFolder}
          isLoading={isLoading === 'folder'}
        />

        <ActionButton
          icon={<GitBranchIcon />}
          title="Clone Git Repository"
          description="Clone a repository from a remote URL"
          shortcut="Ctrl+Shift+G"
          onClick={handleCloneRepository}
          isLoading={isLoading === 'clone'}
        />
      </div>
    </section>
  )
}
