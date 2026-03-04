'use client';

import { EQUALIZER_BANDS, EqualizerPreset } from '@/types';
import { Visualizer } from './Visualizer';

interface EqualizerProps {
  bands: number[];
  isEnabled: boolean;
  currentPreset: string;
  presets: EqualizerPreset[];
  getAnalyserData: () => Uint8Array;
  isPlaying: boolean;
  onBandChange: (index: number, gain: number) => void;
  onPresetSelect: (preset: EqualizerPreset) => void;
  onReset: () => void;
  onToggle: () => void;
  onClose: () => void;
}

export function Equalizer({
  bands,
  isEnabled,
  currentPreset,
  presets,
  getAnalyserData,
  isPlaying,
  onBandChange,
  onPresetSelect,
  onReset,
  onToggle,
  onClose,
}: EqualizerProps) {
  return (
    <div className="equalizer-panel">
      <div className="eq-header">
        <h3>Equalizer</h3>
        <button className="eq-close-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="eq-visualizer-section">
        <Visualizer getAnalyserData={getAnalyserData} isPlaying={isPlaying} />
      </div>

      <div className="eq-controls">
        <button 
          className={`eq-toggle-btn ${isEnabled ? 'active' : ''}`}
          onClick={onToggle}
        >
          {isEnabled ? 'EQ On' : 'EQ Off'}
        </button>
        
        <button className="eq-reset-btn" onClick={onReset}>
          Reset
        </button>
      </div>

      <div className="eq-presets">
        <span className="preset-label">Presets:</span>
        <div className="preset-buttons">
          {presets.map(preset => (
            <button
              key={preset.name}
              className={`preset-btn ${currentPreset === preset.name ? 'active' : ''}`}
              onClick={() => onPresetSelect(preset)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="eq-bands">
        {EQUALIZER_BANDS.map((freq, index) => (
          <div key={freq} className="eq-band">
            <div className="eq-slider-container">
              <input
                type="range"
                min="-12"
                max="12"
                value={bands[index]}
                onChange={(e) => onBandChange(index, Number(e.target.value))}
                className="eq-slider"
              />
              <div 
                className="eq-slider-fill"
                style={{ 
                  height: `${((bands[index] + 12) / 24) * 100}%`,
                  bottom: 0 
                }} 
              />
            </div>
            <span className="eq-band-value">{bands[index] > 0 ? '+' : ''}{bands[index]}</span>
            <span className="eq-band-freq">
              {freq >= 1000 ? `${freq / 1000}k` : freq}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
