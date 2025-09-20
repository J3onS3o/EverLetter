import { useState } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Letters from './pages/Letters'
import Mailroom from './pages/Mailroom'
import Keepsakes from './pages/Keepsakes'
import Events from './pages/Events'
import './App.css'

export type Page = 'home' | 'letters' | 'mailroom' | 'keepsakes' | 'events'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <Home />
      case 'letters': return <Letters />
      case 'mailroom': return <Mailroom />
      case 'keepsakes': return <Keepsakes />
      case 'events': return <Events />
      default: return <Home />
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        {renderPage()}
      </main>
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default App