/**
 * useFolderOpen Hook
 * Provides folder selection functionality for the Welcome feature
 */

import { useState, useCallback } from 'react'
import type { OpenFolderResult } from '../../../../shared/features/filesystem/fs.contract'

interface UseFolderOpenReturn {
  selectedPath: string | null
  isLoading: boolean
  error: string | null
  openFolder: () => Promise<void>
}

export function useFolderOpen(): UseFolderOpenReturn {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openFolder = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result: OpenFolderResult = await window.api.openFolderDialog()
      
      if (result.success && result.path) {
        setSelectedPath(result.path)
      } else if (result.canceled) {
        // User canceled, no action needed
      } else {
        setError('Failed to select folder')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    selectedPath,
    isLoading,
    error,
    openFolder,
  }
}
