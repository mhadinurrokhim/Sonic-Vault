export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export async function extractMetadata(file: File): Promise<{
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverArt?: string;
}> {
  // Simple metadata extraction without external library
  // We'll use the file name as title and extract what we can
  const title = file.name.replace(/\.[^/.]+$/, '');
  
  // Try to get duration from the file
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    
    audio.addEventListener('loadedmetadata', () => {
      resolve({
        title,
        artist: 'Unknown Artist',
        duration: audio.duration || 0,
      });
    });
    
    audio.addEventListener('error', () => {
      resolve({
        title,
        artist: 'Unknown Artist',
        duration: 0,
      });
    });
    
    // Timeout fallback
    setTimeout(() => {
      resolve({
        title,
        artist: 'Unknown Artist',
        duration: 0,
      });
    }, 3000);
  });
}

export const SUPPORTED_FORMATS = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'];
export const SUPPORTED_EXTENSIONS = ['.mp3', '.wav', '.flac', '.ogg', '.m4a'];

export function isValidAudioFile(file: File): boolean {
  return SUPPORTED_FORMATS.includes(file.type) || 
         SUPPORTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));
}
