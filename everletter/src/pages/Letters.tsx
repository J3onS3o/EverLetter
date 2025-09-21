import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Letters.css';

import { createLetter, searchUsers } from '../../services/letterService';
import type { Profile } from '../../services/letterService';

const Letters: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');
  const [endDate, setEndDate] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [isDraft, setIsDraft] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleRecipientSearch = async (username: string) => {
    setRecipient(username);
    if (username.length > 2) {
      setIsSearching(true);
      try {
        const results = await searchUsers(username);
        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleRecipientSelect = (user: Profile) => {
    setRecipient(user.username);
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      setMessage({ type: 'error', text: 'Please fill in title and content' });
      return;
    }

    if (!isDraft && !recipient) {
      setMessage({ type: 'error', text: 'Please select a recipient to send the letter' });
      return;
    }

    try {
      setIsSaving(true);
      
      const letterData = {
        title,
        content,
        recipient_username: recipient,
        is_draft: isDraft,
        scheduled_date: isScheduled && scheduledDate ? scheduledDate : undefined,
        delivery_frequency: isScheduled ? frequency : undefined,
        delivery_end_date: isScheduled && endDate ? endDate : undefined
      };

      await createLetter(letterData);

      setMessage({ type: 'success', text: isDraft ? 'Draft saved successfully!' : 'Letter sent successfully!' });
      
      // Reset form
      setTitle('');
      setRecipient('');
      setContent('');
      setScheduledDate('');
      setEndDate('');
      setIsScheduled(false);
      setIsDraft(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
      console.error('Error saving letter:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendNow = async () => {
    if (!title || !content || !recipient) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    try {
      setIsSaving(true);
      
      const letterData = {
        title,
        content,
        recipient_username: recipient,
        is_draft: false,
        scheduled_date: isScheduled && scheduledDate ? scheduledDate : undefined,
        delivery_frequency: isScheduled ? frequency : undefined,
        delivery_end_date: isScheduled && endDate ? endDate : undefined
      };

      await createLetter(letterData);

      setMessage({ type: 'success', text: 'Letter sent successfully!' });
      
      // Reset form
      setTitle('');
      setRecipient('');
      setContent('');
      setScheduledDate('');
      setEndDate('');
      setIsScheduled(false);
      setIsDraft(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
      console.error('Error sending letter:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToMailroom = () => {
    navigate('/mailroom');
  };

  return (
    <div className="letter-write-container">
      <header>
        <h1>Write a Letter</h1>
        <p className="subtitle">Share your thoughts and connect with loved ones</p>
      </header>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="letter-form">
        <div className="form-group">
          <label htmlFor="title">Letter Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., To My Dear Grandchild"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="recipient">Recipient Username {!isDraft && '*'}</label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => handleRecipientSearch(e.target.value)}
            placeholder="Search for username..."
            required={!isDraft}
          />
          {isSearching && <div className="search-loading">Searching...</div>}
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(user => (
                <div
                  key={user.id}
                  className="search-result-item"
                  onClick={() => handleRecipientSelect(user)}
                >
                  {user.username} {user.display_name && `(${user.display_name})`}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="content">Your Letter *</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your letter here..."
            rows={10}
            required
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={isScheduled}
              onChange={(e) => setIsScheduled(e.target.checked)}
            />
            Schedule this letter for later delivery
          </label>
        </div>

        {isScheduled && (
          <div className="scheduling-options">
            <div className="form-group">
              <label htmlFor="scheduledDate">Delivery Date & Time</label>
              <input
                type="datetime-local"
                id="scheduledDate"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="frequency">Frequency</label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as 'once' | 'daily' | 'weekly' | 'monthly')}
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {frequency !== 'once' && (
              <div className="form-group">
                <label htmlFor="endDate">End Date (optional)</label>
                <input
                  type="datetime-local"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={!isDraft}
              onChange={(e) => setIsDraft(!e.target.checked)}
            />
            Send immediately
          </label>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={handleBackToMailroom}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="save-button"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : isDraft ? 'Save Draft' : 'Send Letter'}
          </button>
          {isDraft && (
            <button 
              type="button" 
              className="send-button"
              onClick={handleSendNow}
              disabled={isSaving || !recipient}
            >
              {isSaving ? 'Sending...' : 'Send Now'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Letters;