// src/components/Loading.tsx
import React, { useEffect, useState } from 'react';
import './Loading.css';

const Loading: React.FC = () => {
  const [loadingText, setLoadingText] = useState('Loading your memories');

  useEffect(() => {
    const texts = ['Loading your memories', 'Preparing your letters', 'Organizing keepsakes'];
    let index = 0;
    
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      
      <div className="loading-content">
        <div className="logo">
          <div className="logo-inner">
            <div className="logo-icon">
                <img src="src/assets/brooch.png" alt="EverLetter Logo" className="logo-image" />
            </div>
          </div>
        </div>
        
        <h1>EverLetter</h1>
        <img src="src/assets/everletter.png" alt="EverLetter Decorative" className="loading-decorative" />
        
        <div className="progress-container">
          <div className="progress-bar"></div>
        </div>
        
        <p className="loading-text">{loadingText}...</p>
      </div>
    </div>
  );
};

export default Loading;