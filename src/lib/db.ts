import { Track } from '@/types';

const DB_KEY = 'sonic-vault-tracks';

export async function addTrack(track: Track & { blob: Blob }): Promise<void> {
  const tracks = await getAllTracks();
  const trackWithoutBlob = { ...track };
  delete (trackWithoutBlob as Record<string, unknown>).blob;
  tracks.push(trackWithoutBlob as Track);
  localStorage.setItem(DB_KEY, JSON.stringify(tracks));
}

export async function getAllTracks(): Promise<Track[]> {
  const data = localStorage.getItem(DB_KEY);
  if (!data) return [];
  
  try {
    const tracks: Track[] = JSON.parse(data);
    // Recreate object URLs from stored data
    return tracks.map(track => {
      // We need to re-read from file if available
      return {
        ...track,
        fileUrl: track.fileUrl || URL.createObjectURL(track.originalFile),
      };
    });
  } catch {
    return [];
  }
}

export async function deleteTrack(id: string): Promise<void> {
  const tracks = await getAllTracks();
  const filtered = tracks.filter(t => t.id !== id);
  localStorage.setItem(DB_KEY, JSON.stringify(filtered));
}

export async function clearAllTracks(): Promise<void> {
  localStorage.removeItem(DB_KEY);
}
