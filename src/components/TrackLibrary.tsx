'use client';

import { useState } from 'react';
import { Track } from '@/types';
import { TrackCard } from './TrackCard';

interface TrackLibraryProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlay: (track: Track) => void;
  onDelete: (id: string) => void;
  onUploadClick: () => void;
  uploadProgress: { [key: string]: number };
}

type SortOption = 'title' | 'artist' | 'dateAdded' | 'duration';

export function TrackLibrary({ 
  tracks, 
  currentTrack, 
  isPlaying, 
  onPlay, 
  onDelete,
  onUploadClick,
  uploadProgress 
}: TrackLibraryProps) {
  const [sortBy, setSortBy] = useState<SortOption>('dateAdded');
  const [sortAsc, setSortAsc] = useState(false);

  const sortedTracks = [...tracks].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'artist':
        comparison = a.artist.localeCompare(b.artist);
        break;
      case 'dateAdded':
        comparison = a.dateAdded - b.dateAdded;
        break;
      case 'duration':
        comparison = a.duration - b.duration;
        break;
    }
    return sortAsc ? comparison : -comparison;
  });

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(option);
      setSortAsc(true);
    }
  };

  if (tracks.length === 0) {
    return (
      <div className="empty-library">
        <div className="empty-library-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <h2>Your library is empty</h2>
        <p>Upload your favorite music to get started</p>
        <button className="upload-cta-btn" onClick={onUploadClick}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Upload Music
        </button>
      </div>
    );
  }

  return (
    <div className="track-library">
      <div className="library-header">
        <h2>Your Music</h2>
        <div className="sort-controls">
          <span className="sort-label">Sort by:</span>
          <button 
            className={`sort-btn ${sortBy === 'title' ? 'active' : ''}`}
            onClick={() => handleSort('title')}
          >
            Title {sortBy === 'title' && (sortAsc ? '↑' : '↓')}
          </button>
          <button 
            className={`sort-btn ${sortBy === 'artist' ? 'active' : ''}`}
            onClick={() => handleSort('artist')}
          >
            Artist {sortBy === 'artist' && (sortAsc ? '↑' : '↓')}
          </button>
          <button 
            className={`sort-btn ${sortBy === 'dateAdded' ? 'active' : ''}`}
            onClick={() => handleSort('dateAdded')}
          >
            Date {sortBy === 'dateAdded' && (sortAsc ? '↑' : '↓')}
          </button>
          <button 
            className={`sort-btn ${sortBy === 'duration' ? 'active' : ''}`}
            onClick={() => handleSort('duration')}
          >
            Duration {sortBy === 'duration' && (sortAsc ? '↑' : '↓')}
          </button>
        </div>
      </div>

      <div className="track-grid">
        {sortedTracks.map(track => (
          <TrackCard
            key={track.id}
            track={track}
            isPlaying={isPlaying}
            isCurrent={currentTrack?.id === track.id}
            onPlay={onPlay}
            onDelete={onDelete}
          />
        ))}
      </div>

      {Object.keys(uploadProgress).length > 0 && (
        <div className="upload-progress-indicator">
          {Object.entries(uploadProgress).map(([id, progress]) => (
            <div key={id} className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
