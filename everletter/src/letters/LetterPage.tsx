import { useState, useEffect, type FormEvent } from 'react';
import { supabase } from '../supabaseClient';
import { type Database } from '../database.types';
import './LetterPage.css';

// Define types based on your database schema
type Letter = Database['public']['Tables']['letters']['Row'];
type LetterInsert = Database['public']['Tables']['letters']['Insert'];

export default function LetterPage() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [view, setView] = useState<'editor' | 'list' | 'detail'>('editor');
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  // Fetch letters from Supabase
  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLetters(data || []);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching letters:', error.message);
        setMessage('Error loading letters');
      } else {
        console.error('Unknown error fetching letters');
        setMessage('Unknown error loading letters');
      }
    }
  };

  const handleSaveLetter = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setMessage('Please add both title and content');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to save letters');
      }

      const letterData: LetterInsert = {
        title: title.trim(),
        content: content.trim(),
        user_id: user.id
      };

      const { error } = await supabase
        .from('letters')
        .insert([letterData]);

      if (error) throw error;

      setMessage('Letter saved successfully!');
      setTitle('');
      setContent('');
      fetchLetters();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error saving letter:', error.message);
        setMessage(error.message);
      } else {
        console.error('Unknown error saving letter');
        setMessage('An unknown error occurred while saving');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of your LetterPage component

  const handleDeleteLetter = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this letter?')) return;

    try {
      const { error } = await supabase
        .from('letters')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage('Letter deleted successfully');
      fetchLetters(); // Refresh the list
      
      // If we were viewing the deleted letter, go back to list
      if (view === 'detail' && selectedLetter?.id === id) {
        setView('list');
        setSelectedLetter(null);
      }
    } catch (error) {
      // Type guard for error
      if (error instanceof Error) {
        console.error('Error deleting letter:', error.message);
        setMessage('Error deleting letter');
      } else {
        console.error('Unknown error deleting letter');
        setMessage('An unknown error occurred while deleting');
      }
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="letter-container">
      <div className="letter-header">
        <h1>My Letters</h1>
        <div className="view-toggles">
          <button 
            className={view === 'editor' ? 'active' : ''}
            onClick={() => setView('editor')}
          >
            Write
          </button>
          <button 
            className={view === 'list' ? 'active' : ''}
            onClick={() => { setView('list'); setSelectedLetter(null); }}
          >
            My Letters
          </button>
        </div>
      </div>

      {message && (
        <div className={`letter-message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {view === 'editor' && (
        <div className="editor-container">
          <form onSubmit={handleSaveLetter} className="letter-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Letter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="title-input"
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <textarea
                placeholder="Write your letter here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="content-textarea"
                disabled={isLoading}
                rows={12}
              />
            </div>
            
            <button 
              type="submit" 
              className="save-button"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Letter'}
            </button>
          </form>
        </div>
      )}

      {view === 'list' && !selectedLetter && (
        <div className="letters-list">
          {letters.length === 0 ? (
            <div className="empty-state">
              <h3>No letters yet</h3>
              <p>Click on "Write" to create your first letter</p>
            </div>
          ) : (
            <div className="letters-grid">
              {letters.map(letter => (
                <div key={letter.id} className="letter-card">
                  <h3 className="letter-title">{letter.title}</h3>
                  <p className="letter-preview">
                    {letter.content.length > 150 
                      ? `${letter.content.substring(0, 150)}...` 
                      : letter.content
                    }
                  </p>
                  <div className="letter-meta">
                    <span className="letter-date">{formatDate(letter.created_at)}</span>
                    <div className="letter-actions">
                      <button 
                        onClick={() => { setSelectedLetter(letter); setView('detail'); }}
                        className="action-btn view"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleDeleteLetter(letter.id)}
                        className="action-btn delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'detail' && selectedLetter && (
        <div className="letter-detail">
          <div className="detail-header">
            <button 
              onClick={() => { setSelectedLetter(null); setView('list'); }}
              className="back-button"
            >
              ← Back to List
            </button>
            <h2>{selectedLetter.title}</h2>
            <span className="detail-date">{formatDate(selectedLetter.created_at)}</span>
          </div>
          
          <div className="detail-content">
            {selectedLetter.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          <div className="detail-actions">
            <button 
              onClick={() => handleDeleteLetter(selectedLetter.id)}
              className="delete-button"
            >
              Delete Letter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}