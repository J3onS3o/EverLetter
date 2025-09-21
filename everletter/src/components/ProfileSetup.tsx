import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getCurrentUserProfile, updateProfile } from '../../services/profileService';
import './ProfileSetup.css';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const profile = await getCurrentUserProfile();
      if (profile.username && profile.username !== profile.id) {
        // User already has a proper username, redirect to mailroom
        navigate('/mailroom');
      } else {
        // User needs to set up profile
        setDisplayName(profile.display_name || '');
        setUsername(profile.username || '');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      await updateProfile({
        username: username.trim(),
        display_name: displayName.trim() || username.trim()
      });

      navigate('/mailroom');
    } catch (error: any) {
      setError(error.message);
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="profile-setup-loading">Loading...</div>;
  }

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <h1>Complete Your Profile</h1>
        <p>Please set up your username before using the letter system.</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />
            <small>Letters, numbers, and underscores only</small>
          </div>

          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How should we display your name?"
            />
          </div>

          <button 
            type="submit" 
            className="save-button"
            disabled={isSaving || !username.trim()}
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;