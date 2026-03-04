'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Track, PlayerState, BitrateOption } from '@/types';
import { getAudioEngine } from '@/lib/audioEngine';

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  bitrate: 'original',
  shuffle: false,
  repeat: 'off',
  queue: [],
  queueIndex: -1,
};

// Create refs outside component to avoid recreation
const loadTrackRef = { current: null as ((track: Track) => void) | null };
const seekRef = { current: null as ((time: number) => void) | null };
const handleTrackEndRef = { current: null as (() => void) | null };

export function useAudioPlayer() {
  const [state, setState] = useState<PlayerState>(initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const engineRef = useRef<ReturnType<typeof getAudioEngine> | null>(null);
  const isInitialized = useRef(false);

  const loadTrack = useCallback((track: Track) => {
    if (!audioRef.current) return;
    
    audioRef.current.src = track.fileUrl;
    audioRef.current.load();
    setState(prev => ({ 
      ...prev, 
      currentTrack: track, 
      currentTime: 0,
      duration: track.duration || 0 
    }));

    // Connect to audio engine if not already connected
    if (engineRef.current && audioRef.current) {
      try {
        engineRef.current.connect(audioRef.current);
      } catch {
        // Already connected
      }
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  const handleTrackEnd = useCallback(() => {
    setState(prev => {
      if (prev.repeat === 'one') {
        audioRef.current?.play();
        return prev;
      }

      const nextIndex = prev.queueIndex + 1;
      if (nextIndex < prev.queue.length) {
        const nextTrack = prev.queue[nextIndex];
        if (loadTrackRef.current) {
          loadTrackRef.current(nextTrack);
        }
        return { ...prev, queueIndex: nextIndex, currentTrack: nextTrack };
      }

      if (prev.repeat === 'all' && prev.queue.length > 0) {
        const nextTrack = prev.queue[0];
        if (loadTrackRef.current) {
          loadTrackRef.current(nextTrack);
        }
        return { ...prev, queueIndex: 0, currentTrack: nextTrack };
      }

      return { ...prev, isPlaying: false };
    });
  }, []);

  // Update refs after callbacks are defined
  useEffect(() => {
    loadTrackRef.current = loadTrack;
    seekRef.current = seek;
    handleTrackEndRef.current = handleTrackEnd;
  }, [loadTrack, seek, handleTrackEnd]);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    audioRef.current = new Audio();
    engineRef.current = getAudioEngine();

    const audio = audioRef.current;

    audio.addEventListener('timeupdate', () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    });

    audio.addEventListener('loadedmetadata', () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    });

    audio.addEventListener('ended', () => {
      if (handleTrackEndRef.current) {
        handleTrackEndRef.current();
      }
    });

    audio.addEventListener('play', () => {
      setState(prev => ({ ...prev, isPlaying: true }));
      engineRef.current?.resume();
    });

    audio.addEventListener('pause', () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const playTrack = useCallback((track: Track, queue?: Track[]) => {
    const newQueue = queue || [track];
    const index = queue ? newQueue.findIndex(t => t.id === track.id) : 0;
    
    loadTrack(track);
    setState(prev => ({ 
      ...prev, 
      queue: newQueue,
      queueIndex: index 
    }));
    audioRef.current?.play();
  }, [loadTrack]);

  const play = useCallback(() => {
    audioRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      engineRef.current?.setVolume(volume);
      setState(prev => ({ ...prev, volume, isMuted: volume === 0 }));
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !state.isMuted;
      audioRef.current.muted = newMuted;
      engineRef.current?.setMuted(newMuted);
      setState(prev => ({ ...prev, isMuted: newMuted }));
    }
  }, [state.isMuted]);

  const setBitrate = useCallback((bitrate: BitrateOption) => {
    engineRef.current?.applyBitrateQuality(bitrate);
    setState(prev => ({ ...prev, bitrate }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      shuffle: !prev.shuffle,
      queue: !prev.shuffle ? [...prev.queue].sort(() => Math.random() - 0.5) : prev.queue
    }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState(prev => {
      const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
      const currentIndex = modes.indexOf(prev.repeat);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      return { ...prev, repeat: nextMode };
    });
  }, []);

  const playNext = useCallback(() => {
    setState(prev => {
      if (prev.queue.length === 0) return prev;
      
      let nextIndex: number;
      if (prev.shuffle) {
        nextIndex = Math.floor(Math.random() * prev.queue.length);
      } else {
        nextIndex = (prev.queueIndex + 1) % prev.queue.length;
      }
      
      const nextTrack = prev.queue[nextIndex];
      loadTrack(nextTrack);
      audioRef.current?.play();
      
      return { ...prev, queueIndex: nextIndex, currentTrack: nextTrack };
    });
  }, [loadTrack]);

  const playPrevious = useCallback(() => {
    setState(prev => {
      if (prev.queue.length === 0) return prev;
      
      // If more than 3 seconds in, restart track
      if (prev.currentTime > 3) {
        if (seekRef.current) {
          seekRef.current(0);
        }
        return prev;
      }
      
      const nextIndex = prev.queueIndex <= 0 ? prev.queue.length - 1 : prev.queueIndex - 1;
      const nextTrack = prev.queue[nextIndex];
      loadTrack(nextTrack);
      audioRef.current?.play();
      
      return { ...prev, queueIndex: nextIndex, currentTrack: nextTrack };
    });
  }, [loadTrack]);

  return {
    state,
    playTrack,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setBitrate,
    toggleShuffle,
    toggleRepeat,
    playNext,
    playPrevious,
    engine: engineRef,
  };
}
