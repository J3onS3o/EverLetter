import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Loading from './components/Loading'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Letters from './pages/Letters'
import Mailroom from './pages/Mailroom'
import Keepsakes from './pages/Keepsakes'
import Doll from './pages/Doll'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading process (fetching data, initializing app, etc.)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {isLoading ? (
        <Loading />
      ) : (
        <Router>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/letters" element={<Letters />} />
                <Route path="/mailroom" element={<Mailroom />} />
                <Route path="/keepsakes" element={<Keepsakes />} />
                <Route path="/doll" element={<Doll />} />
              </Routes>
            </main>
            <Navigation />
          </div>
        </Router>
      )}
    </div>
  )
}

export default App