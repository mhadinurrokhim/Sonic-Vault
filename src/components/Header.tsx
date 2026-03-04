'use client';

import { useState } from 'react';

interface HeaderProps {
  trackCount: number;
  onUploadClick: () => void;
}

export function Header({ trackCount, onUploadClick }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">♫</span>
          <span className="logo-text">Sonic Vault</span>
        </div>
        
        <nav className="nav">
          <button className="nav-btn active">Library</button>
          <button className="nav-btn">Playlists</button>
          <button className="nav-btn">Settings</button>
        </nav>

        <div className="header-actions">
          <div className={`search-box ${isSearchFocused ? 'focused' : ''}`}>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search tracks..." 
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
          
          <button className="upload-btn" onClick={onUploadClick}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>Upload</span>
          </button>
        </div>
      </div>
      
      <div className="header-stats">
        <span>{trackCount} {trackCount === 1 ? 'track' : 'tracks'}</span>
      </div>
    </header>
  );
}
