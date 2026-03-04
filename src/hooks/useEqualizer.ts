'use client';

import { useState, useCallback } from 'react';
import { EqualizerState, EQUALIZER_PRESETS, EqualizerPreset } from '@/types';

const defaultBands = [0, 0, 0, 0, 0, 0, 0, 0];

export function useEqualizer(engine: ReturnType<typeof import('@/lib/audioEngine').getAudioEngine> | null) {
  const [state, setState] = useState<EqualizerState>({
    bands: defaultBands,
    isEnabled: true,
    currentPreset: 'Flat',
  });

  const setBandGain = useCallback((index: number, gain: number) => {
    const clampedGain = Math.max(-12, Math.min(12, gain));
    setState(prev => {
      const newBands = [...prev.bands];
      newBands[index] = clampedGain;
      engine?.setEqualizerBand(index, clampedGain);
      return { ...prev, bands: newBands, currentPreset: 'Custom' };
    });
  }, [engine]);

  const setAllBands = useCallback((gains: number[]) => {
    const processed = gains.map(g => Math.max(-12, Math.min(12, g)));
    setState(prev => ({ ...prev, bands: processed }));
    engine?.setAllEqualizerBands(processed);
  }, [engine]);

  const applyPreset = useCallback((preset: EqualizerPreset) => {
    setAllBands(preset.gains);
    setState(prev => ({ 
      ...prev, 
      currentPreset: preset.name,
      bands: preset.gains 
    }));
  }, [setAllBands]);

  const reset = useCallback(() => {
    applyPreset(EQUALIZER_PRESETS[0]); // Flat
    setState(prev => ({ ...prev, currentPreset: 'Flat' }));
  }, [applyPreset]);

  const toggleEnabled = useCallback(() => {
    setState(prev => {
      const newEnabled = !prev.isEnabled;
      if (!newEnabled) {
        // Disable: set all to 0
        engine?.setAllEqualizerBands([0, 0, 0, 0, 0, 0, 0, 0]);
      } else {
        // Re-enable: restore current bands
        engine?.setAllEqualizerBands(state.bands);
      }
      return { ...prev, isEnabled: newEnabled };
    });
  }, [engine, state.bands]);

  return {
    state,
    setBandGain,
    setAllBands,
    applyPreset,
    reset,
    toggleEnabled,
    presets: EQUALIZER_PRESETS,
  };
}
