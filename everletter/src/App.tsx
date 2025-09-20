import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
// import './App.css'
import AuthPage from './pages/AuthPage'
import { supabase } from './supabaseClient'


function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])


  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  if (!session) {
    return <AuthPage onSignIn={() => supabase.auth.getSession().then(({ data: { session } }) => setSession(session))} />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
        <p className="mb-6 text-gray-700">You're signed in as <strong>{session.user.email}</strong></p>
        <button
          onClick={signOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

export default App