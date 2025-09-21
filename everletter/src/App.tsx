import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '..//lib/supabase'
import Loading from './components/Loading'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Login from './pages/Login'
import Letters from './pages/Letters'
import Mailroom from './pages/Mailroom'
import Keepsakes from './pages/Keepsakes'
import Doll from './pages/Doll'
import Profile from './pages/Profile'
import './App.css'

interface User {
  id: string
  email: string
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        // First, check for existing session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!
          })
          // Show loading screen for 2 seconds before showing home page
          setTimeout(() => {
            setIsLoading(false)
          }, 2000)
        } else {
          // No user session, go directly to login
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        setIsLoading(false)
      } finally {
        setAuthChecked(true)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!
          })
          // Show loading screen when user signs in
          setIsLoading(true)
          setTimeout(() => {
            setIsLoading(false)
          }, 2000)
        } else {
          setUser(null)
          setIsLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    // Show loading screen after successful login
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Show loading screen while checking auth or during transition
  if (isLoading || !authChecked) {
    return <Loading />
  }

  return (
    <div className="App">
      <Router>
        {user ? (
          // Authenticated user layout - shows after loading screen
          <div className="app-container">
            <Header user={user} onLogout={handleLogout} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/letters" element={<Letters />} />
                <Route path="/mailroom" element={<Mailroom />} />
                <Route path="/keepsakes" element={<Keepsakes />} />
                <Route path="/doll" element={<Doll />} />
                <Route path="/profile" element={<Profile user={user} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Navigation />
          </div>
        ) : (
          // Unauthenticated user - show login screen directly
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </Router>
    </div>
  )
}

export default App