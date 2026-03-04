export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverArt?: string;
  fileUrl: string;
  originalFile: File;
  bitrate?: number;
  dateAdded: number;
}

export interface EqualizerPreset {
  name: string;
  gains: number[];
}

export type BitrateOption = 64 | 128 | 192 | 256 | 320 | 'original';

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  bitrate: BitrateOption;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  queue: Track[];
  queueIndex: number;
}

export interface EqualizerState {
  bands: number[];
  isEnabled: boolean;
  currentPreset: string;
}

export const EQUALIZER_BANDS = [60, 170, 310, 600, 1000, 3000, 6000, 12000];

export const EQUALIZER_PRESETS: EqualizerPreset[] = [
  { name: 'Flat', gains: [0, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Rock', gains: [4, 3, 2, 0, -1, 2, 3, 4] },
  { name: 'Jazz', gains: [3, 2, 1, 2, -2, -1, 0, 1] },
  { name: 'Classical', gains: [4, 3, 2, 1, -1, 0, 2, 3] },
  { name: 'Bass Boost', gains: [6, 5, 4, 2, 0, 0, 0, 0] },
  { name: 'Vocal', gains: [-2, -1, 0, 3, 4, 3, 1, 0] },
];

export const BITRATE_OPTIONS: { value: BitrateOption; label: string }[] = [
  { value: 64, label: '64 kbps (Low)' },
  { value: 128, label: '128 kbps (Standard)' },
  { value: 192, label: '192 kbps (Good)' },
  { value: 256, label: '256 kbps (High)' },
  { value: 320, label: '320 kbps (Best)' },
  { value: 'original', label: 'Original Quality' },
];
