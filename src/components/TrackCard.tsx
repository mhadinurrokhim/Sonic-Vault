'use client';

import { Track } from '@/types';
import { formatTime } from '@/lib/utils';

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlay: (track: Track) => void;
  onDelete: (id: string) => void;
}

export function TrackCard({ track, isPlaying, isCurrent, onPlay, onDelete }: TrackCardProps) {
  return (
    <div 
      className={`track-card ${isCurrent ? 'current' : ''} ${isPlaying && isCurrent ? 'playing' : ''}`}
      onClick={() => onPlay(track)}
    >
      <div className="track-cover">
        {track.coverArt ? (
          <img src={track.coverArt} alt={track.title} />
        ) : (
          <div className="track-cover-placeholder">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        )}
        <div className="track-play-overlay">
          {isPlaying && isCurrent ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="playing-icon">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </div>
      </div>
      
      <div className="track-info">
        <h3 className="track-title">{track.title}</h3>
        <p className="track-artist">{track.artist}</p>
        <div className="track-meta">
          <span className="track-duration">{formatTime(track.duration)}</span>
          {track.album && <span className="track-album">{track.album}</span>}
        </div>
      </div>
      
      <button 
        className="track-delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(track.id);
        }}
        title="Delete track"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  );
}
