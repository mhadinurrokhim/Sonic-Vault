# Music Website Specification

## Project Overview

**Project Name:** Sonic Vault  
**Type:** Web Application (Music Player & Library)  
**Core Functionality:** A music library where users can upload their music, listen with quality controls, and enjoy a visual equalizer  
**Target Users:** Music enthusiasts who want a personal, elegant music streaming experience

---

## UI/UX Specification

### Layout Structure

**Page Sections:**
1. **Header** - Logo, navigation, theme toggle
2. **Main Content Area** - Library view with uploaded tracks
3. **Player Panel** - Fixed bottom player with controls
4. **Equalizer Modal** - Slide-up equalizer with visualizer

**Responsive Breakpoints:**
- Mobile: < 640px (stacked layout, simplified controls)
- Tablet: 640px - 1024px (2-column library)
- Desktop: > 1024px (3-column library, full features)

### Visual Design

**Color Palette:**
- Background Primary: `#0D0D0D` (deep black)
- Background Secondary: `#1A1A1A` (card backgrounds)
- Background Tertiary: `#252525` (elevated elements)
- Accent Primary: `#C9A227` (gold - main accent)
- Accent Secondary: `#8B6914` (dark gold)
- Text Primary: `#F5F5F5` (off-white)
- Text Secondary: `#A0A0A0` (muted gray)
- Text Tertiary: `#666666` (subtle)
- Equalizer Gradient: `#C9A227` → `#FF6B35` → `#E63946` (gold to orange to red)
- Success: `#4CAF50`
- Error: `#E63946`

**Typography:**
- Headings: `Playfair Display`, serif (weights: 400, 600, 700)
- Body: `Inter`, sans-serif (weights: 300, 400, 500, 600)
- Mono/Technical: `JetBrains Mono` (for time displays)
- Logo: `Playfair Display`, 700 weight

**Font Sizes:**
- H1: 3rem (48px)
- H2: 2rem (32px)
- H3: 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)
- Caption: 0.75rem (12px)

**Spacing System:**
- Base unit: 4px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

**Visual Effects:**
- Card shadows: `0 4px 20px rgba(0, 0, 0, 0.4)`
- Hover lift: `translateY(-4px)` with shadow increase
- Glassmorphism on player: `backdrop-filter: blur(20px)` with `rgba(26, 26, 26, 0.9)`
- Equalizer glow: `box-shadow: 0 0 30px rgba(201, 162, 39, 0.3)`

### Components

**1. Track Card**
- Album art thumbnail (120x120px)
- Track title (truncate with ellipsis)
- Artist name
- Duration
- Hover: slight scale (1.02), shadow increase
- States: default, hover, playing (gold border glow), selected

**2. Audio Player**
- Album art (64x64px)
- Track info (title, artist)
- Progress bar (seekable, shows time)
- Play/Pause button (large, prominent)
- Previous/Next buttons
- Volume slider with mute toggle
- Bitrate selector dropdown
- Equalizer toggle button
- Repeat/Shuffle toggles

**3. Equalizer Panel**
- 8-band equalizer (60Hz, 170Hz, 310Hz, 600Hz, 1kHz, 3kHz, 6kHz, 12kHz)
- Vertical sliders for each band (-12dB to +12dB)
- Real-time frequency visualizer (bar graph)
- Preset buttons (Flat, Rock, Jazz, Classical, Bass Boost, Vocal)
- Reset button

**4. Upload Zone**
- Drag-and-drop area with dashed border
- File input fallback
- Supported formats: MP3, WAV, FLAC, OGG, M4A
- Upload progress indicator
- File validation feedback

**5. Bitrate Selector**
- Dropdown with options: 64kbps, 128kbps, 192kbps, 256kbps, 320kbps, Original
- Visual indicator of current quality
- Tooltip explaining quality levels

---

## Functionality Specification

### Core Features

**1. Music Upload**
- Drag-and-drop file upload
- Click to browse files
- Accept audio files: .mp3, .wav, .flac, .ogg, .m4a
- Extract metadata (title, artist, album, duration) from files
- Store files in local state (IndexedDB for persistence)
- Display upload progress
- Validate file types with error messages

**2. Audio Playback**
- Play/Pause functionality
- Seek through track via progress bar
- Previous/Next track navigation
- Volume control (0-100%)
- Mute toggle
- Auto-advance to next track
- Shuffle mode (randomize queue)
- Repeat modes: off, repeat all, repeat one

**3. Bitrate Quality Control**
- Simulated bitrate selection (client-side processing)
- Options: 64, 128, 192, 256, 320 kbps, Original
- Uses Web Audio API for quality simulation
- Smooth transition between qualities

**4. Equalizer**
- 8-band graphic equalizer using Web Audio API
- Frequency bands: 60Hz, 170Hz, 310Hz, 600Hz, 1kHz, 3kHz, 6kHz, 12kHz
- Gain range: -12dB to +12dB per band
- Real-time frequency visualizer (canvas-based)
- Presets: Flat, Rock, Jazz, Classical, Bass Boost, Vocal
- Custom preset save option
- Reset to flat

**5. Library Management**
- Display all uploaded tracks in grid
- Sort by: Title, Artist, Date Added, Duration
- Search/filter tracks
- Delete tracks from library
- Track queue management

### User Interactions

- **Click track** → Start playing
- **Double-click track** → Play and expand player
- **Drag files** → Upload zone activates
- **Click equalizer button** → Modal slides up with animation
- **Drag equalizer sliders** → Real-time audio change
- **Click preset** → Apply equalizer settings instantly

### Data Handling

- **Storage:** IndexedDB for track persistence
- **Audio Processing:** Web Audio API
- **State Management:** React useState/useReducer

### Edge Cases

- Handle unsupported file formats gracefully
- Handle very large audio files (show warning > 50MB)
- Handle playback errors (corrupted files)
- Handle empty library state
- Handle browser without Web Audio API support

---

## Acceptance Criteria

### Visual Checkpoints

- [ ] Dark theme with gold accents renders correctly
- [ ] Typography uses Playfair Display for headings, Inter for body
- [ ] Cards have proper shadows and hover effects
- [ ] Player panel has glassmorphism effect
- [ ] Equalizer visualizer animates smoothly
- [ ] All transitions are smooth (300ms ease)
- [ ] Responsive layout works on mobile/tablet/desktop

### Functional Checkpoints

- [ ] Can upload audio files via drag-drop and click
- [ ] Uploaded tracks appear in library
- [ ] Can play/pause tracks
- [ ] Can seek through tracks
- [ ] Can adjust volume
- [ ] Bitrate selector changes audio quality
- [ ] Equalizer sliders affect audio in real-time
- [ ] Equalizer presets apply correctly
- [ ] Visualizer displays frequency data
- [ ] Can delete tracks from library
- [ ] Data persists after page refresh

### Technical Checkpoints

- [ ] No console errors on load
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] All components render without crash
- [ ] Web Audio API initializes correctly

---

## Technical Implementation Notes

### Dependencies to Add

- `wavesurfer.js` - For audio visualization and waveform
- `music-metadata` - For extracting audio metadata
- `idb` - For IndexedDB wrapper

### File Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Header.tsx
│   ├── TrackCard.tsx
│   ├── TrackLibrary.tsx
│   ├── Player.tsx
│   ├── Equalizer.tsx
│   ├── Visualizer.tsx
│   ├── UploadZone.tsx
│   └── BitrateSelector.tsx
├── hooks/
│   ├── useAudioPlayer.ts
│   ├── useEqualizer.ts
│   └── useLibrary.ts
├── lib/
│   ├── audioEngine.ts
│   ├── db.ts
│   └── utils.ts
└── types/
    └── index.ts
```
