import { useEffect, useState } from 'react';
import AuthPage from './pages/AuthPage';
import LetterPage from './letters/LetterPage';
import { supabase } from './supabaseClient';
import { type Session } from '@supabase/supabase-js';
import './App.css';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!session) return <AuthPage />;

  return (
    <div>
      <header className="app-header">
        <h1>My Letter App</h1>
        <div className="user-info">
          <span>Signed in as <strong>{session.user.email}</strong></span>
          <button className="signout-btn" onClick={signOut}>Sign out</button>
        </div>
      </header>
      <LetterPage />
    </div>
  );
}

export default App;