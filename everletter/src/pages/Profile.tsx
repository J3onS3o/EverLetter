// pages/Profile.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getCurrentUserProfile, updateProfile } from '../../services/profileService'
import './Profile.css'

interface User {
  id: string
  email: string
}

interface ProfileProps {
  user: User
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const profile = await getCurrentUserProfile();
      setUsername(profile.username || '');
      setDisplayName(profile.display_name || '');
      setAvatarUrl(profile.avatar_url || '');
    } catch (err: any) {
      setError('Failed to load profile data');
      console.error('Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      await updateProfile({
        username: username.trim(),
        display_name: displayName.trim(),
        avatar_url: avatarUrl.trim()
      });

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    setIsLoading(true)
    setError('')
    setMessage('')
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) throw error
      
      setMessage('Password reset email sent! Check your inbox.')
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }
    
    setIsLoading(true)
    setError('')
    setMessage('')
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      
      if (error) throw error
      
      setMessage('Account deleted successfully. Redirecting...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to delete account')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-loading">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Profile Settings</h2>
        
        {error && (
          <div className="alert alert-error" style={{marginBottom: '20px'}}>
            <span>{error}</span>
          </div>
        )}
        
        {message && (
          <div className="alert alert-success" style={{marginBottom: '20px'}}>
            <span>{message}</span>
          </div>
        )}
        
        <div className="profile-section">
          <h3 className="profile-section-title">Profile Information</h3>
          <form onSubmit={handleSaveProfile} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                required
                disabled={isSaving}
              />
              <small>This is how others will find and address letters to you</small>
            </div>

            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                disabled={isSaving}
              />
              <small>How your name appears to others</small>
            </div>

            <div className="form-group">
              <label htmlFor="avatarUrl">Avatar URL</label>
              <input
                type="url"
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                disabled={isSaving}
              />
              <small>URL to your profile picture</small>
            </div>

            <button 
              type="submit" 
              className="action-btn btn-primary"
              disabled={isSaving || !username.trim()}
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        <div className="profile-section">
          <h3 className="profile-section-title">Account Information</h3>
          <div className="profile-info">
            <div className="info-item">
              <label>Email</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>User ID</label>
              <span className="user-id">{user.id}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3 className="profile-section-title">Preferences</h3>
          <div className="preference-item">
            <label>
              <input type="checkbox" defaultChecked disabled={isSaving} />
              <span>Email notifications</span>
            </label>
          </div>
          <div className="preference-item">
            <label>
              <input type="checkbox" defaultChecked disabled={isSaving} />
              <span>Letter reminders</span>
            </label>
          </div>
        </div>

        <div className="profile-section">
          <h3 className="profile-section-title">Account Actions</h3>
          <div className="profile-actions">
            <button 
              className="action-btn btn-secondary"
              onClick={handlePasswordReset}
              disabled={isLoading || isSaving}
            >
              Reset Password
            </button>
            
            <button 
              className="action-btn btn-danger"
              onClick={handleDeleteAccount}
              disabled={isLoading || isSaving}
            >
              Delete Account
            </button>
          </div>
        </div>

        <div className="profile-navigation">
          <button 
            className="action-btn btn-outline"
            onClick={() => navigate('/')}
            disabled={isLoading || isSaving}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile