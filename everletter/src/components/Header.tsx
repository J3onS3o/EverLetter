// components/Header.tsx
import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

interface User {
  id: string
  email: string
}

interface HeaderProps {
  user: User
  onLogout: () => void
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-titles">
          <h1 className="header-title">EverLetter</h1>
          <p className="header-subtitle">Cherish your memories</p>
        </div>
        
        <div className="header-buttons">
          {/* Keep existing header buttons if you want them */}
          <button className="header-btn">
            <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          
          <button className="header-btn">
            <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Profile menu */}
          <div className="profile-menu" ref={profileMenuRef}>
            <button 
              className="profile-button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <span className="profile-avatar">
                {user.email.charAt(0).toUpperCase()}
              </span>
              <span className="profile-name">{user.email}</span>
            </button>
            
            {isProfileMenuOpen && (
              <div className="profile-dropdown">
                <Link 
                  to="/profile" 
                  className="dropdown-item"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  👤 Profile Settings
                </Link>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item"
                  onClick={onLogout}
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header