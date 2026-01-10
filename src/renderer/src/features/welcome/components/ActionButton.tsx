/**
 * ActionButton Component
 * Large desktop-style action button for welcome page
 */

import './ActionButton.css'

interface ActionButtonProps {
  icon: React.ReactNode
  title: string
  description: string
  shortcut: string
  onClick: () => void
  isLoading?: boolean
}

export function ActionButton({
  icon,
  title,
  description,
  shortcut,
  onClick,
  isLoading = false
}: ActionButtonProps): React.JSX.Element {
  return (
    <button className="action-button" onClick={onClick} disabled={isLoading}>
      <div className="action-button__icon">{icon}</div>

      <div className="action-button__content">
        <div className="action-button__header">
          <span className="action-button__title">{title}</span>
          <kbd className="action-button__shortcut">{shortcut}</kbd>
        </div>
        <p className="action-button__description">{description}</p>
      </div>
    </button>
  )
}
