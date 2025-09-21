import { useState, type FormEvent } from 'react';
import { supabase } from '../supabaseClient';
import { type Database } from '../database.types';
import './AuthPage.css';

// Define types based on your database schema
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

export default function AuthPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);

  const handleAuth = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (isLoginMode) {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Signed in successfully!');
      } else {
        // Sign up with username in metadata
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            }
          }
        });
        
        if (error) throw error;
        
        // Create profile using the proper type
        if (data.user) {
          const profileData: ProfileInsert = {
            id: data.user.id,
            username: username,
            email: email,
          };

          // Use insert with onConflict for upsert functionality
          const { error: profileError } = await supabase
            .from('profiles')
            .insert(profileData)
            .select()
            .onConflict('id')
            .merge({ 
              username: username, 
              email: email,
              updated_at: new Date().toISOString()
            });
          
          if (profileError) {
            console.error('Error creating profile:', profileError);
            // Don't throw error - the user was created successfully
          }
        }
        
        setMessage('Check your email for the confirmation link!');
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = (): void => {
    setIsLoginMode(!isLoginMode);
    setMessage('');
    setUsername('');
  };

  const handleSocialLogin = async (provider: 'google' | 'github'): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('An unexpected error occurred during social login');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLoginMode ? 'Login' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {isLoginMode 
            ? 'Welcome back! Please sign in to continue' 
            : 'Create an account to get started'
          }
        </p>

        <form className="auth-form" onSubmit={handleAuth}>
          {!isLoginMode && (
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                className="auth-input"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={20}
              />
            </div>
          )}
          
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="auth-input"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          <button 
            className="auth-button" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        {isLoginMode && (
          <div className="social-login">
            <p className="divider">Or continue with</p>
            <div className="social-buttons">
              <button 
                className="social-btn google"
                onClick={() => handleSocialLogin('google')}
                type="button"
              >
                Google
              </button>
              <button 
                className="social-btn github"
                onClick={() => handleSocialLogin('github')}
                type="button"
              >
                GitHub
              </button>
            </div>
          </div>
        )}

        <p className="auth-toggle" onClick={toggleAuthMode}>
          {isLoginMode 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Sign in"
          }
        </p>

        {message && (
          <div className={`auth-message ${message.includes('successfully') || message.includes('Check your email') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
