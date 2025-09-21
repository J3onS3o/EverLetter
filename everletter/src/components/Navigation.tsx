import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()
  
  const navItems = [
    { label: 'Home', icon: '🏠', path: '/' },
    { label: 'Letters', icon: '✉️', path: '/letters' },
    { label: 'Mailroom', icon: '📬', path: '/mailroom' },
    { label: 'Keepsakes', icon: '🎁', path: '/keepsakes' },
    { label: 'AMD', icon: '👩‍💼', path: '/doll' }
  ]

  return (
    <nav className="bottom-nav-wrapper">
      <div className="bottom-nav-container">
        <div className="nav-container">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-btn ${location.pathname === item.path ? 'nav-btn-active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation