/**
 * useRecentProjects Hook
 * Fetches and manages recent project history
 */

import { useState, useEffect } from 'react'
import type { RecentProject } from 'src/shared/features/filesystem/fs.contract.ts'

interface UseRecentProjectsReturn {
  projects: RecentProject[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

// Mock data for development
const MOCK_PROJECTS: RecentProject[] = [
  {
    name: 'dragit',
    path: 'C:\\Users\\aydin\\Documents\\dragit',
    lastOpened: new Date().toISOString()
  },
  {
    name: 'my-react-app',
    path: 'C:\\Users\\aydin\\Projects\\my-react-app',
    lastOpened: new Date(Date.now() - 86400000).toISOString()
  },
  {
    name: 'api-server',
    path: 'C:\\Users\\aydin\\Work\\api-server',
    lastOpened: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    name: 'documentation',
    path: 'C:\\Users\\aydin\\Documents\\docs',
    lastOpened: new Date(Date.now() - 86400000 * 7).toISOString()
  }
]

export function useRecentProjects(): UseRecentProjectsReturn {
  const [projects, setProjects] = useState<RecentProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Replace with actual API call when backend is implemented
      // const result = await window.api.getRecentProjects()
      // if (result.success) {
      //   setProjects(result.projects)
      // } else {
      //   setError(result.error ?? 'Failed to fetch recent projects')
      // }

      // For now, use mock data with simulated delay
      await new Promise((resolve) => setTimeout(resolve, 300))
      setProjects(MOCK_PROJECTS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    isLoading,
    error,
    refresh: fetchProjects
  }
}
