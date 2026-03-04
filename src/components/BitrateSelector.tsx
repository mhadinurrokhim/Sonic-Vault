'use client';

import { BitrateOption, BITRATE_OPTIONS } from '@/types';

interface BitrateSelectorProps {
  value: BitrateOption;
  onChange: (bitrate: BitrateOption) => void;
}

export function BitrateSelector({ value, onChange }: BitrateSelectorProps) {
  return (
    <div className="bitrate-selector">
      <label className="bitrate-label">Quality</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value as BitrateOption)}
        className="bitrate-select"
      >
        {BITRATE_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
