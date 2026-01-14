/**
 * StartSection Component
 * Primary actions for getting started with Dragit
 */

import { useState, useEffect } from 'react'
import { ActionButton } from './ActionButton'
import { FolderIcon, GitBranchIcon } from './Icons'
import { useFolderOpen } from '../useFolderOpen'
import './StartSection.css'

interface StartSectionProps {
  onFolderSelected: (path: string) => void
  onCloneRepository: () => void
}

export function StartSection({
  onFolderSelected,
  onCloneRepository
}: StartSectionProps): React.JSX.Element {
  const [isCloning, setIsCloning] = useState(false)
  const { selectedPath, isLoading: isFolderLoading, openFolder } = useFolderOpen()

  // Notify parent when folder is selected
  useEffect(() => {
    if (selectedPath) {
      onFolderSelected(selectedPath)
    }
  }, [selectedPath, onFolderSelected])

  const handleCloneRepository = (): void => {
    setIsCloning(true)
    onCloneRepository()
    setIsCloning(false)
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
          onClick={openFolder}
          isLoading={isFolderLoading}
        />

        <ActionButton
          icon={<GitBranchIcon />}
          title="Clone Git Repository"
          description="Clone a repository from a remote URL"
          shortcut="Ctrl+Shift+G"
          onClick={handleCloneRepository}
          isLoading={isCloning}
        />
      </div>
    </section>
  )
}
