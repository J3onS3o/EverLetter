import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getCurrentUserProfile } from '../../services/profileService';
import './Login.css';

interface LoginProps {
  onLogin: (user: { id: string; email: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        setMessage('Login successful!');
        
        // Check if user has a proper profile setup
        try {
          const profile = await getCurrentUserProfile();
          
          // Check if user needs profile setup (username is default email, ID, or missing)
          const needsProfileSetup = !profile.username || 
                                  profile.username === data.user.id || 
                                  profile.username === data.user.email ||
                                  profile.username.includes('@'); // Also check if it contains @ symbol
          
          if (needsProfileSetup) {
            navigate('/profile-setup');
          } else {
            // Call the onLogin callback which will trigger loading screen
            onLogin({
              id: data.user.id,
              email: data.user.email!
            });
          }
        } catch (profileError) {
          console.error('Error checking profile:', profileError);
          // If there's an error checking profile, redirect to profile setup to be safe
          navigate('/profile-setup');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Generate a username from email (remove special characters)
      const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: baseUsername,
            display_name: baseUsername
          },
          emailRedirectTo: `${window.location.origin}/profile-setup`
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        setMessage('Sign up successful! Please check your email for confirmation. After confirming, you will be redirected to complete your profile setup.');
        
        // For development/testing (without email confirmation), redirect to profile setup
        if (process.env.NODE_ENV === 'development') {
          setTimeout(() => {
            navigate('/profile-setup');
          }, 2000);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Try to use a demo account if available, or create one
      const demoEmail = 'demo@everletter.com';
      const demoPassword = 'demopassword123';
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (error) {
        // If demo account doesn't exist, offer sign up instead
        setError('Demo account not available. Please sign up for a regular account.');
        return;
      }

      if (data.user) {
        setMessage('Demo login successful!');
        onLogin({
          id: data.user.id,
          email: data.user.email!
        });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during demo login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">EverLetter</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="alert alert-success">
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-login"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={handleSignUp}
              className="btn btn-secondary btn-signup"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Demo login button for testing */}
        {process.env.NODE_ENV === 'development' && (
          <div className="demo-section">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="btn btn-demo"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Try Demo'}
            </button>
          </div>
        )}

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <button 
              type="button" 
              className="login-link"
              onClick={handleSignUp}
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;