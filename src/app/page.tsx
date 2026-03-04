'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useEqualizer } from '@/hooks/useEqualizer';
import { useLibrary } from '@/hooks/useLibrary';
import { Header } from '@/components/Header';
import { TrackLibrary } from '@/components/TrackLibrary';
import { Player } from '@/components/Player';
import { Equalizer } from '@/components/Equalizer';
import { UploadZone } from '@/components/UploadZone';
import { Track } from '@/types';

export default function Home() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);

  const player = useAudioPlayer();
  const library = useLibrary();
  const equalizer = useEqualizer(player.engine?.current || null);

  // Handle upload
  const handleUpload = useCallback(async (files: FileList) => {
    await library.uploadMultipleTracks(files);
    setShowUploadModal(false);
  }, [library]);

  // Handle track play
  const handlePlayTrack = useCallback((track: Track) => {
    player.playTrack(track, library.tracks);
  }, [player, library.tracks]);

  // Handle delete
  const handleDeleteTrack = useCallback((id: string) => {
    library.deleteTrack(id);
  }, [library]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (library.error) {
      const timer = setTimeout(() => {
        library.clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [library.error, library.clearError]);

  // Apply initial volume
  useEffect(() => {
    if (player.engine.current) {
      player.engine.current.setVolume(player.state.volume);
    }
  }, [player.engine.current, player.state.volume]);

  return (
    <div className="app">
      <Header 
        trackCount={library.tracks.length}
        onUploadClick={() => setShowUploadModal(true)}
      />

      <main className="main-content">
        <TrackLibrary
          tracks={library.tracks}
          currentTrack={player.state.currentTrack}
          isPlaying={player.state.isPlaying}
          onPlay={handlePlayTrack}
          onDelete={handleDeleteTrack}
          onUploadClick={() => setShowUploadModal(true)}
          uploadProgress={library.uploadProgress}
        />
      </main>

      <Player
        state={player.state}
        onTogglePlay={player.togglePlay}
        onSeek={player.seek}
        onVolumeChange={player.setVolume}
        onToggleMute={player.toggleMute}
        onBitrateChange={player.setBitrate}
        onPrevious={player.playPrevious}
        onNext={player.playNext}
        onShuffleToggle={player.toggleShuffle}
        onRepeatToggle={player.toggleRepeat}
        onEqualizerClick={() => setShowEqualizer(true)}
      />

      {showEqualizer && (
        <Equalizer
          bands={equalizer.state.bands}
          isEnabled={equalizer.state.isEnabled}
          currentPreset={equalizer.state.currentPreset}
          presets={equalizer.presets}
          getAnalyserData={() => player.engine.current?.getAnalyserData() || new Uint8Array(0)}
          isPlaying={player.state.isPlaying}
          onBandChange={equalizer.setBandGain}
          onPresetSelect={equalizer.applyPreset}
          onReset={equalizer.reset}
          onToggle={equalizer.toggleEnabled}
          onClose={() => setShowEqualizer(false)}
        />
      )}

      {showUploadModal && (
        <div 
          className="upload-zone-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowUploadModal(false);
          }}
        >
          <UploadZone 
            onUpload={handleUpload}
            isUploading={Object.keys(library.uploadProgress).length > 0}
          />
        </div>
      )}

      {library.error && (
        <div className="error-toast">
          {library.error}
        </div>
      )}
    </div>
  );
}
