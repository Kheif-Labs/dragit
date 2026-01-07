/**
 * useGitLogs Hook
 * Provides git commit history functionality for the GitHistory feature
 */

import { useState, useEffect, useCallback } from 'react'
import type { GitCommit, GetCommitsResult } from '../../../../shared/features/git/git.contract'

interface UseGitLogsReturn {
  commits: GitCommit[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useGitLogs(repoPath: string): UseGitLogsReturn {
  const [commits, setCommits] = useState<GitCommit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCommits = useCallback(async () => {
    if (!repoPath) return

    setIsLoading(true)
    setError(null)

    try {
      const result: GetCommitsResult = await window.api.getCommits({
        repoPath,
        limit: 20,
      })

      if (result.success) {
        setCommits(result.commits)
      } else {
        setError(result.error ?? 'Failed to fetch commits')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [repoPath])

  useEffect(() => {
    fetchCommits()
  }, [fetchCommits])

  return {
    commits,
    isLoading,
    error,
    refresh: fetchCommits,
  }
}
