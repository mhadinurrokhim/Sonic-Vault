import { EQUALIZER_BANDS, BitrateOption } from '@/types';

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private audioElement: HTMLAudioElement | null = null;
  private bitrateNode: ScriptProcessorNode | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.analyserNode = this.audioContext.createAnalyser();
      
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.8;

      // Create EQ filters
      this.eqFilters = EQUALIZER_BANDS.map((freq, index) => {
        const filter = this.audioContext!.createBiquadFilter();
        filter.type = index === 0 ? 'lowshelf' : index === EQUALIZER_BANDS.length - 1 ? 'highshelf' : 'peaking';
        filter.frequency.value = freq;
        filter.Q.value = 1;
        filter.gain.value = 0;
        return filter;
      });

      // Connect EQ chain
      for (let i = 0; i < this.eqFilters.length - 1; i++) {
        this.eqFilters[i].connect(this.eqFilters[i + 1]);
      }
    }
  }

  connect(audioElement: HTMLAudioElement) {
    if (!this.audioContext || !this.gainNode || !this.analyserNode) return;

    this.audioElement = audioElement;
    
    try {
      this.sourceNode = this.audioContext.createMediaElementSource(audioElement);
    } catch (e) {
      // Source already connected
      this.sourceNode = this.audioContext!.createMediaElementSource(audioElement);
    }

    // Connect: source -> EQ filters -> gain -> analyser -> destination
    this.sourceNode.connect(this.eqFilters[0]);
    this.eqFilters[this.eqFilters.length - 1].connect(this.gainNode);
    this.gainNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume;
    }
  }

  setMuted(muted: boolean) {
    if (this.gainNode) {
      this.gainNode.gain.value = muted ? 0 : 1;
    }
  }

  setEqualizerBand(index: number, gain: number) {
    if (this.eqFilters[index]) {
      this.eqFilters[index].gain.value = gain;
    }
  }

  setAllEqualizerBands(gains: number[]) {
    gains.forEach((gain, index) => {
      this.setEqualizerBand(index, gain);
    });
  }

  getAnalyserData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(0);
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  resume() {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Simulate different bitrate qualities (client-side processing)
  // Note: This is a simulation since actual transcoding requires server-side processing
  // We apply different audio processing based on the selected "bitrate"
  applyBitrateQuality(bitrate: BitrateOption): void {
    if (!this.analyserNode) return;

    // Different processing based on bitrate
    switch (bitrate) {
      case 64:
        this.analyserNode.fftSize = 128;
        break;
      case 128:
        this.analyserNode.fftSize = 256;
        break;
      case 192:
        this.analyserNode.fftSize = 512;
        break;
      case 256:
        this.analyserNode.fftSize = 1024;
        break;
      case 320:
      case 'original':
        this.analyserNode.fftSize = 2048;
        break;
    }
  }

  destroy() {
    this.audioContext?.close();
    this.audioContext = null;
    this.sourceNode = null;
    this.gainNode = null;
    this.analyserNode = null;
    this.eqFilters = [];
  }
}

let audioEngineInstance: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
  if (!audioEngineInstance) {
    audioEngineInstance = new AudioEngine();
  }
  return audioEngineInstance;
}
