/**
 * GitLogList Component
 * Displays commit history for a repository
 */

import { useGitLogs } from './useGitLogs'
import './GitLogList.css'

interface GitLogListProps {
  repoPath: string
  onBack: () => void
}

export function GitLogList({ repoPath, onBack }: GitLogListProps): React.JSX.Element {
  const { commits, isLoading, error, refresh } = useGitLogs(repoPath)

  return (
    <div className="git-log-container">
      <header className="git-log-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1 className="git-log-title">Commit History</h1>
        <button className="refresh-button" onClick={refresh} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </header>

      <p className="repo-path">Repository: <code>{repoPath}</code></p>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {isLoading && commits.length === 0 ? (
        <div className="loading-state">Loading commits...</div>
      ) : (
        <ul className="commit-list">
          {commits.map((commit) => (
            <li key={commit.hash} className="commit-item">
              <div className="commit-header">
                <span className="commit-hash">{commit.hash.substring(0, 7)}</span>
                <span className="commit-date">
                  {new Date(commit.date).toLocaleDateString()}
                </span>
              </div>
              <p className="commit-message">{commit.message}</p>
              <p className="commit-author">by {commit.author}</p>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && commits.length === 0 && !error && (
        <div className="empty-state">No commits found</div>
      )}
    </div>
  )
}
