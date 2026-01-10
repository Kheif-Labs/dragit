/**
 * RecentSection Component
 * Displays recently opened projects
 */

import { useRecentProjects } from '../useRecentProjects'
import { ClockIcon } from './Icons'
import './RecentSection.css'

interface RecentSectionProps {
  onProjectSelected: (path: string) => void
}

export function RecentSection({ onProjectSelected }: RecentSectionProps): React.JSX.Element {
  const { projects, isLoading } = useRecentProjects()

  return (
    <section className="recent-section">
      <h2 className="recent-section__heading">RECENT</h2>
      <p className="recent-section__description">Pick up where you left off</p>

      <div className="recent-section__list">
        {isLoading ? (
          <div className="recent-section__loading">Loading recent projects...</div>
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <button
              key={project.path}
              className="recent-item"
              onClick={() => onProjectSelected(project.path)}
            >
              <span className="recent-item__icon">
                <ClockIcon />
              </span>
              <div className="recent-item__content">
                <span className="recent-item__name">{project.name}</span>
                <span className="recent-item__path">{project.path}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="recent-section__empty">No recent projects</div>
        )}
      </div>
    </section>
  )
}
