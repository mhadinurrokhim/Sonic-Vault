'use client';

import { useState, useRef } from 'react';
import { Track, PlayerState } from '@/types';
import { formatTime } from '@/lib/utils';
import { BitrateSelector } from './BitrateSelector';

interface PlayerProps {
  state: PlayerState;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onBitrateChange: (bitrate: PlayerState['bitrate']) => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffleToggle: () => void;
  onRepeatToggle: () => void;
  onEqualizerClick: () => void;
}

export function Player({
  state,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onBitrateChange,
  onPrevious,
  onNext,
  onShuffleToggle,
  onRepeatToggle,
  onEqualizerClick,
}: PlayerProps) {
  const [seekTime, setSeekTime] = useState<number | null>(null);

  const { currentTrack, isPlaying, currentTime, duration, volume, isMuted, bitrate, shuffle, repeat } = state;

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const volumePercent = Math.round((isMuted ? 0 : volume) * 100);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setSeekTime(newTime);
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    const newTime = parseFloat((e.target as HTMLInputElement).value);
    onSeek(newTime);
    setSeekTime(null);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    onVolumeChange(newVolume);
  };

  return (
    <div className="player">
      <div className="player-track-info">
        {currentTrack ? (
          <>
            <div className="player-cover">
              {currentTrack.coverArt ? (
                <img src={currentTrack.coverArt} alt={currentTrack.title} />
              ) : (
                <div className="player-cover-placeholder">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="player-track-details">
              <h4 className="player-title">{currentTrack.title}</h4>
              <p className="player-artist">{currentTrack.artist}</p>
            </div>
          </>
        ) : (
          <div className="player-no-track">
            <span>No track selected</span>
          </div>
        )}
      </div>

      <div className="player-controls">
        <div className="player-buttons">
          <button 
            className={`player-btn small ${shuffle ? 'active' : ''}`}
            onClick={onShuffleToggle}
            title="Shuffle"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
            </svg>
          </button>
          
          <button 
            className="player-btn small"
            onClick={onPrevious}
            title="Previous"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          
          <button 
            className="player-btn play-btn"
            onClick={onTogglePlay}
            disabled={!currentTrack}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          
          <button 
            className="player-btn small"
            onClick={onNext}
            title="Next"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
          
          <button 
            className={`player-btn small ${repeat !== 'off' ? 'active' : ''}`}
            onClick={onRepeatToggle}
            title={`Repeat: ${repeat}`}
          >
            {repeat === 'one' ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
              </svg>
            )}
          </button>
        </div>

        <div className="player-progress">
          <span className="time-display">{formatTime(currentTime)}</span>
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <div className="seek-popup">
              {seekTime !== null ? formatTime(seekTime) : formatTime(currentTime)}
            </div>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={seekTime !== null ? seekTime : currentTime}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
              onTouchEnd={handleSeekMouseUp}
              className="progress-slider"
            />
          </div>
          <span className="time-display">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-extras">
        <button 
          className="player-btn equalizer-btn"
          onClick={onEqualizerClick}
          title="Equalizer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
          </svg>
        </button>

        <BitrateSelector value={bitrate} onChange={onBitrateChange} />

        <div className="volume-control">
          <button 
            className="player-btn small"
            onClick={onToggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : volume < 0.5 ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>
          
          <div className="volume-slider-container">
            <div className="volume-bar">
              <div 
                className="volume-fill" 
                style={{ width: `${volumePercent}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volumePercent}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
            <span className="volume-value">{volumePercent}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
