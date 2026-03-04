'use client';

import { useState, useEffect, useCallback } from 'react';
import { Track } from '@/types';
import { addTrack, getAllTracks, deleteTrack as deleteFromDb } from '@/lib/db';
import { generateId, extractMetadata, isValidAudioFile } from '@/lib/utils';

export function useLibrary() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);

  // Load tracks from IndexedDB on mount
  useEffect(() => {
    async function loadTracks() {
      try {
        const loadedTracks = await getAllTracks();
        setTracks(loadedTracks);
      } catch (err) {
        console.error('Error loading tracks:', err);
        setError('Failed to load tracks');
      } finally {
        setIsLoading(false);
      }
    }
    loadTracks();
  }, []);

  const uploadTrack = useCallback(async (file: File): Promise<Track | null> => {
    // Validate file
    if (!isValidAudioFile(file)) {
      setError(`Invalid file format: ${file.name}. Supported: MP3, WAV, FLAC, OGG, M4A`);
      return null;
    }

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setError(`File too large: ${file.name}. Maximum size: 50MB`);
      return null;
    }

    const tempId = generateId();
    setUploadProgress(prev => ({ ...prev, [tempId]: 0 }));

    try {
      // Simulate progress
      setUploadProgress(prev => ({ ...prev, [tempId]: 30 }));

      // Extract metadata
      const metadata = await extractMetadata(file);
      setUploadProgress(prev => ({ ...prev, [tempId]: 60 }));

      // Create track object
      const track: Track = {
        id: tempId,
        title: metadata.title,
        artist: metadata.artist,
        album: metadata.album,
        duration: metadata.duration,
        coverArt: metadata.coverArt,
        fileUrl: URL.createObjectURL(file),
        originalFile: file,
        dateAdded: Date.now(),
      };

      setUploadProgress(prev => ({ ...prev, [tempId]: 90 }));

      // Save to IndexedDB
      await addTrack({ ...track, blob: new Blob([file], { type: file.type }) });
      
      setUploadProgress(prev => ({ ...prev, [tempId]: 100 }));

      // Add to state
      setTracks(prev => [...prev, track]);

      // Clean up progress after a delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[tempId];
          return newProgress;
        });
      }, 1000);

      return track;
    } catch (err) {
      console.error('Error uploading track:', err);
      setError(`Failed to upload: ${file.name}`);
      return null;
    }
  }, []);

  const uploadMultipleTracks = useCallback(async (files: FileList | File[]): Promise<Track[]> => {
    const uploadedTracks: Track[] = [];
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const track = await uploadTrack(file);
      if (track) {
        uploadedTracks.push(track);
      }
    }

    return uploadedTracks;
  }, [uploadTrack]);

  const deleteTrack = useCallback(async (id: string) => {
    try {
      await deleteFromDb(id);
      setTracks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting track:', err);
      setError('Failed to delete track');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tracks,
    isLoading,
    uploadProgress,
    error,
    uploadTrack,
    uploadMultipleTracks,
    deleteTrack,
    clearError,
  };
}
