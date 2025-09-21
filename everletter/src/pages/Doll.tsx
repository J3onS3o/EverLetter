import { useState } from 'react'
import './Doll.css'

const AutoMemoryDoll = () => {
  const [selectedTone, setSelectedTone] = useState('neutral')
  const [isRecording, setIsRecording] = useState(false)
  const [userMessage, setUserMessage] = useState('')
  const [generatedLetter, setGeneratedLetter] = useState('')

  const tones = [
    { id: 'love', label: 'Love', emoji: '💖' },
    { id: 'polite', label: 'Polite', emoji: '🙏' },
    { id: 'neutral', label: 'Neutral', emoji: '😐' },
    { id: 'friendly', label: 'Friendly', emoji: '😊' },
    { id: 'formal', label: 'Formal', emoji: '🎩' },
    { id: 'angry', label: 'Angry', emoji: '😠' },
    { id: 'grateful', label: 'Grateful', emoji: '🙌' },
    { id: 'sad', label: 'Sad', emoji: '😢' }
  ]

  const handleRecord = () => {
    setIsRecording(true)
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false)
      setUserMessage("I've been thinking about you a lot lately and wanted to express how much our time together means to me.")
    }, 3000)
  }

  const generateLetter = () => {
    // Simulate API call to Gemini
    const sampleLetters = {
      love: "My dearest, every moment without you feels like an eternity. My heart aches with the sweetness of your memory, and I find myself counting the moments until we're together again.",
      polite: "Dear respected one, I hope this letter finds you in good health and spirits. I wanted to take a moment to express my sincerest thoughts and appreciation for your presence in my life.",
      neutral: "Hello, I'm writing to share some thoughts that have been on my mind. I wanted to communicate some feelings and reflections I've had recently.",
      friendly: "Hey there! I've been thinking about you and wanted to drop a line. Remember that time we laughed until we cried? Good times!",
      formal: "To whom it may concern, I am writing to formally express my sentiments regarding our recent interactions and to document my thoughts for the record.",
      angry: "I cannot adequately express my frustration and disappointment. The recent events have left me questioning everything I thought we understood about each other.",
      grateful: "I find myself overwhelmed with gratitude when I think of you. Your kindness has touched me deeply, and I wanted to express my sincere appreciation.",
      sad: "My heart feels heavy as I write these words. The distance between us seems to grow each day, and I find myself longing for what once was."
    }
    
    setGeneratedLetter(sampleLetters[selectedTone as keyof typeof sampleLetters])
  }

  return (
    <div className="amd-container">
      <h2 className="amd-title">Auto Memory Doll Service</h2>
      <p className="amd-subtitle">Express your sentiments through beautifully crafted letters</p>

      {/* Tone Selection */}
      <div className="tone-section">
        <h3 className="section-title">Select Tone</h3>
        <div className="tone-grid">
          {tones.map(tone => (
            <button
              key={tone.id}
              className={`tone-btn ${selectedTone === tone.id ? 'tone-btn-active' : ''}`}
              onClick={() => setSelectedTone(tone.id)}
            >
              <span className="tone-emoji">{tone.emoji}</span>
              <span className="tone-label">{tone.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Recording */}
      <div className="recording-section">
        <h3 className="section-title">Record Your Message</h3>
        <div className="recording-box">
          {isRecording ? (
            <div className="recording-status">
              <div className="recording-pulse"></div>
              <p>Recording... Speak now</p>
            </div>
          ) : userMessage ? (
            <div className="message-preview">
              <p>"{userMessage}"</p>
            </div>
          ) : (
            <p className="recording-prompt">Press the button below to record your thoughts</p>
          )}
        </div>
        <button 
          className={`record-btn ${isRecording ? 'recording' : ''}`}
          onClick={handleRecord}
          disabled={isRecording}
        >
          {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
        </button>
      </div>

      {/* Generate Letter */}
      {userMessage && (
        <div className="generate-section">
          <button className="generate-btn" onClick={generateLetter}>
            ✨ Generate Letter
          </button>
        </div>
      )}

      {/* Generated Letter */}
      {generatedLetter && (
        <div className="letter-section">
          <h3 className="section-title">Your Generated Letter</h3>
          <div className="generated-letter">
            <p>{generatedLetter}</p>
          </div>
          <div className="letter-actions">
            <button className="action-btn">📝 Edit</button>
            <button className="action-btn">💾 Save to Drafts</button>
            <button className="action-btn">📤 Send</button>
          </div>
        </div>
      )}

      {/* Information Panel */}
      <div className="info-panel">
        <h4>About Auto Memory Dolls</h4>
        <p>In the spirit of Violet Evergarden, our service helps you express your deepest emotions through beautifully crafted letters. Just speak your heart, choose your tone, and we'll handle the words.</p>
      </div>
    </div>
  )
}

export default AutoMemoryDoll