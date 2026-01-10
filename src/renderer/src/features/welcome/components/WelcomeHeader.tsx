/**
 * WelcomeHeader Component
 * Left-aligned branding header with logo and text side-by-side
 */

import iconPath from '../../../../../../resources/icon.png'
import './WelcomeHeader.css'

export function WelcomeHeader(): React.JSX.Element {
  return (
    <header className="welcome-header">
      <div className="welcome-header__logo">
        <img src={iconPath} alt="Dragit Logo" width="56" height="56" />
      </div>
      <div className="welcome-header__text">
        <h1 className="welcome-header__title">Dragit</h1>
        <p className="welcome-header__subtitle">Git visualization, redefined</p>
      </div>
    </header>
  )
}
