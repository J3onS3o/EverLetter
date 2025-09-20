import type { Page } from '../App'

interface NavigationProps {
  currentPage: Page
  setCurrentPage: (page: Page) => void
}

const Navigation = ({ currentPage, setCurrentPage }: NavigationProps) => {
  const navItems = [
    { id: 'home' as Page, label: 'Home', icon: '🏠' },
    { id: 'letters' as Page, label: 'Letters', icon: '✉️' },
    { id: 'mailroom' as Page, label: 'Mailroom', icon: '📬' },
    { id: 'keepsakes' as Page, label: 'Keepsakes', icon: '🎁' },
    { id: 'events' as Page, label: 'Events', icon: '📅' }
  ]

  return (
    <nav className="navigation">
      <div className="navigation-inner">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`nav-item ${currentPage === item.id ? 'nav-item-active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default Navigation