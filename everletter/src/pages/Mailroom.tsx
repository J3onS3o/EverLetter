import React, { useState, useEffect } from 'react';
import './Mailroom.css';
import type { Letter, ReceivedLetter } from '../../services/letterService';
import {
  getAllLetters,
  markAsRead as markAsReadService,
  getReceivedLetters,
  getSentLetters,
  getDrafts,
} from '../../services/letterService';

const Mailroom: React.FC = () => {
    const [letters, setLetters] = useState<Letter[]>([]);
    const [filteredLetters, setFilteredLetters] = useState<Letter[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'sent' | 'received' | 'drafts'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'title' | 'recipient'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
      fetchLetters();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      filterAndSortLetters();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, letters, activeTab, sortBy, sortOrder]);

    const mapReceivedToLetter = (r: ReceivedLetter): Letter => ({
      id: r.id,
      title: r.letter?.title || '(no title)',
      recipient_username: r.letter?.recipient_username || '',
      content: r.letter?.content || '',
      created_at: r.received_at,
      scheduled_date: r.letter?.scheduled_date,
      user_id: r.recipient_id,
      sender_id: r.sender_id,
      sender_name: r.sender_display_name || r.sender_username,
      is_draft: false,
      read: r.read,
      type: 'received',
      delivery_frequency: r.letter?.delivery_frequency,
      delivery_end_date: r.letter?.delivery_end_date,
      tags: r.letter?.tags
    });

    const fetchLetters = async () => {
      try {
        setLoading(true);
        let lettersData: Letter[] = [];

        switch (activeTab) {
          case 'all': {
            lettersData = await getAllLetters();
            break;
          }
          case 'received': {
            const received = await getReceivedLetters();
            lettersData = (received as unknown as ReceivedLetter[]).map(mapReceivedToLetter);
            break;
          }
          case 'sent': {
            lettersData = await getSentLetters();
            break;
          }
          case 'drafts': {
            const drafts = await getDrafts();
            lettersData = drafts.map(draft => ({ ...draft, type: 'sent' as const }));
            break;
          }
          default: {
            lettersData = await getAllLetters();
          }
        }

        setLetters(lettersData);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching letters:', err);
      } finally {
        setLoading(false);
      }
    };

    const handleTabChange = async (tab: 'all' | 'sent' | 'received' | 'drafts') => {
      setActiveTab(tab);
      setLoading(true);

      try {
        let lettersData: Letter[] = [];

        switch (tab) {
          case 'all':
            lettersData = await getAllLetters();
            break;
          case 'received': {
            const received = await getReceivedLetters();
            lettersData = (received as unknown as ReceivedLetter[]).map(mapReceivedToLetter);
            break;
          }
          case 'sent':
            lettersData = await getSentLetters();
            break;
          case 'drafts': {
            const drafts = await getDrafts();
            lettersData = drafts.map(draft => ({ ...draft, type: 'sent' as const }));
            break;
          }
        }

        setLetters(lettersData);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching letters:', err);
      } finally {
        setLoading(false);
      }
    };

    const filterAndSortLetters = () => {
      let results = letters.filter(letter => {
        const matchesSearch = 
          letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letter.recipient_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letter.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (letter.sender_name && letter.sender_name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesTab = 
          activeTab === 'all' ||
          (activeTab === 'sent' && letter.type === 'sent') ||
          (activeTab === 'received' && letter.type === 'received') ||
          (activeTab === 'drafts' && letter.is_draft);

        return matchesSearch && matchesTab;
      });

      // Sort letters
      results.sort((a, b) => {
        let aValue: string | number, bValue: string | number;

        switch (sortBy) {
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'recipient':
            aValue = a.type === 'sent' ? a.recipient_username.toLowerCase() : 
                     a.sender_name ? a.sender_name.toLowerCase() : 'unknown';
            bValue = b.type === 'sent' ? b.recipient_username.toLowerCase() : 
                     b.sender_name ? b.sender_name.toLowerCase() : 'unknown';
            break;
          case 'date':
          default:
            aValue = new Date(a.created_at).getTime();
            bValue = new Date(b.created_at).getTime();
            break;
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      setFilteredLetters(results);
    };

    const markAsRead = async (letterId: string) => {
      try {
        await markAsReadService(letterId);

        // Update local state
        setLetters(letters.map(letter => 
          letter.id === letterId ? { ...letter, read: true } : letter
        ));
      } catch (err: any) {
        console.error('Error marking as read:', err);
      }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    };

    const handleSortChange = (newSortBy: 'date' | 'title' | 'recipient') => {
      if (sortBy === newSortBy) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(newSortBy);
        setSortOrder('desc');
      }
    };

    const handleWriteLetter = () => {
      window.location.href = '/compose';
    };

    const handleRefresh = () => {
      fetchLetters();
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const getRecipientDisplayName = (letter: Letter) => {
      if (letter.type === 'sent') {
        return letter.recipient_username;
      } else {
        return letter.sender_name || 'Unknown';
      }
    };

    if (loading) {
      return (
        <div className="mailroom-container">
          <div className="loading">Loading your letters...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="mailroom-container">
          <div className="error">Error: {error}</div>
          <button onClick={handleRefresh} className="retry-button">
            Try Again
          </button>
        </div>
      );
    }

    return (
      <div className="mailroom-container">
        <header>
          <h1>Your Letters</h1>
          <p className="subtitle">Connect hearts across generations</p>
          <button onClick={handleRefresh} className="refresh-button">
            🔄 Refresh
          </button>
        </header>
      
        <div className="search-container">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search letters..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button className="write-button" onClick={handleWriteLetter}>
            <span>Write Letter</span>
            <span>✒️</span>
          </button>
        </div>

        <div className="mailroom-controls">
          <div className="tab-controls">
            <button 
              className={activeTab === 'all' ? 'active' : ''}
              onClick={() => handleTabChange('all')}
            >
              All Letters
            </button>
            <button 
              className={activeTab === 'sent' ? 'active' : ''}
              onClick={() => handleTabChange('sent')}
            >
              Sent
            </button>
            <button 
              className={activeTab === 'received' ? 'active' : ''}
              onClick={() => handleTabChange('received')}
            >
              Received
            </button>
            <button 
              className={activeTab === 'drafts' ? 'active' : ''}
              onClick={() => handleTabChange('drafts')}
            >
              Drafts
            </button>
          </div>

          <div className="sort-controls">
            <span>Sort by:</span>
            <button 
              className={sortBy === 'date' ? 'active' : ''}
              onClick={() => handleSortChange('date')}
            >
              Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={sortBy === 'title' ? 'active' : ''}
              onClick={() => handleSortChange('title')}
            >
              Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={sortBy === 'recipient' ? 'active' : ''}
              onClick={() => handleSortChange('recipient')}
            >
              {activeTab === 'sent' ? 'Recipient' : 'Sender'} 
              {sortBy === 'recipient' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      
        <div className="letters-grid">
          {filteredLetters.length === 0 ? (
            <div className="no-letters">
              {searchTerm ? 
                'No letters match your search.' : 
                activeTab === 'drafts' ? 
                  'You don\'t have any drafts yet.' :
                  activeTab === 'sent' ?
                    'You haven\'t sent any letters yet.' :
                    activeTab === 'received' ?
                      'You haven\'t received any letters yet.' :
                      'You haven\'t written or received any letters yet.'
              }
            </div>
          ) : (
            filteredLetters.map((letter) => (
              <div 
                key={letter.id} 
                className={`letter-card ${letter.type === 'received' && !letter.read ? 'unread' : ''} ${letter.is_draft ? 'draft' : ''}`}
                onClick={() => letter.type === 'received' && !letter.read && markAsRead(letter.id)}
              >
                <div className="card-header">
                  <div className="letter-type-badge">
                    {letter.type === 'sent' ? 'Sent' : 'Received'}
                    {letter.is_draft && ' • Draft'}
                  </div>
                  <h2 className="letter-title">{letter.title}</h2>
                  <div className="letter-to">
                    {letter.type === 'sent' ? `To: ${letter.recipient_username}` : `From: ${getRecipientDisplayName(letter)}`}
                  </div>
                  <div className="letter-date">{formatDate(letter.created_at)}</div>
                  {letter.type === 'received' && !letter.read && (
                    <div className="unread-indicator">New</div>
                  )}
                </div>
                <div className="card-content">
                  <p className="letter-preview">
                    {letter.content.length > 150 
                      ? `${letter.content.substring(0, 150)}...` 
                      : letter.content}
                  </p>
                  <a href={`/letter/${letter.id}`} className="read-more">
                    {letter.type === 'received' ? 'Read letter →' : 'View letter →'}
                  </a>
                  {letter.scheduled_date && new Date(letter.scheduled_date) > new Date() && (
                    <div className="scheduled-badge">
                      ⏰ Scheduled for {formatDate(letter.scheduled_date)}
                    </div>
                  )}
                  {letter.delivery_frequency && letter.delivery_frequency !== 'once' && (
                    <div className="recurring-badge">
                      🔄 Recurring: {letter.delivery_frequency}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  export default Mailroom;