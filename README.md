# NFC-Jukebox

Generate print-ready NFC card stickers with album art, genre-coded icons, and stylish typography. Browse Spotify and YouTube Music, customize each sticker, and export as high-resolution PNGs or vector-text PDFs sized for credit-card NFC cards.

![NFC Jukebox UI](https://github.com/user-attachments/assets/53fa4461-ff26-4d1e-ad43-86608d54e88f)

## Features

- **Search & Browse** — Search Spotify albums/playlists and YouTube Music from one interface
- **Sticker Editor** — Live canvas preview with editable title, subtitle, genre, and image source (album art, artist photo, or custom URL)
- **Genre Auto-Detection** — Automatically detects genre from Spotify artist metadata and applies color-coded icons with genre-appropriate typefaces
- **Print-Ready Output** — Stickers sized to MOO rectangular vinyl sticker specs:
  - Bleed: 3.39″ × 2.24″ (1017 × 672 px @ 300 DPI)
  - Trim: 3.31″ × 2.17″
  - Safe: 3.15″ × 2.0″
- **Visual Styling** — Vignetting, bottom gradient overlay, and modern typography
- **Export Options**:
  - **PNG ZIP** — Individual high-res PNG files in a ZIP archive
  - **PDF** — Multi-page PDF with vector text for crisp printing
  - **JSON Config** — Save/load project state including all sticker configurations
- **Project Management** — Save your project to disk and resume later by loading the JSON backup

## Quick Start

### Prerequisites

- Node.js 18+
- A [Spotify Developer](https://developer.spotify.com/dashboard) account (for Client ID and Secret)

### Installation

```bash
# Clone the repo
git clone https://github.com/hellosamblack/NFC-Jukebox.git
cd NFC-Jukebox

# Install all dependencies
cd server && npm install
cd ../client && npm install
cd ..
```

### Running

Start both the server and client:

```bash
# Terminal 1 — Backend (port 3001)
cd server && node index.js

# Terminal 2 — Frontend (port 5173)
cd client && npx vite
```

Then open [http://localhost:5173](http://localhost:5173).

### Connecting Spotify

1. Click the **⚙️** settings button in the top-right
2. Enter your Spotify **Client ID** and **Client Secret**
3. Click **Connect**

YouTube Music search works with mock data out of the box. To enable real YouTube search, set `YOUTUBE_API_KEY` in `server/.env`.

## Project Structure

```
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── SearchBar.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── StickerEditor.jsx
│   │   │   ├── StickerPreview.jsx   # Canvas-based live preview
│   │   │   ├── MyStickersList.jsx
│   │   │   ├── ExportView.jsx
│   │   │   ├── GenreIcon.jsx
│   │   │   └── SettingsModal.jsx
│   │   ├── hooks/
│   │   │   └── useProject.jsx       # Project state management (context + reducer)
│   │   ├── services/
│   │   │   └── api.js               # API client
│   │   └── utils/
│   │       ├── constants.js
│   │       └── genres.js            # Genre configs + client-side detection
│   └── vite.config.js
│
├── server/                  # Express backend
│   ├── index.js
│   ├── routes/
│   │   ├── spotify.js       # Spotify Web API integration
│   │   ├── youtube.js       # YouTube search (API + mock fallback)
│   │   └── export.js        # PNG/PDF/ZIP export endpoints
│   ├── services/
│   │   ├── renderService.js # Sharp-based image rendering with SVG overlays
│   │   └── genreService.js  # Genre detection from Spotify metadata
│   └── utils/
│       └── constants.js     # Sticker dimensions, genre color/font configs
│
└── package.json             # Root scripts
```

## Genre System

26 genres are supported, each with a unique color, emoji icon, and font:

| Genre | Color | Icon | Font |
|-------|-------|------|------|
| Rock | Red | 🎸 | Oswald |
| Pop | Pink | 🎤 | Poppins |
| Hip-Hop | Orange | 🎧 | Bebas Neue |
| Electronic | Cyan | 🎛️ | Orbitron |
| Jazz | Indigo | 🎷 | Playfair Display |
| Classical | Brown | 🎻 | Cormorant Garamond |
| Metal | Dark | 🤘 | Anton |
| *...and 19 more* | | | |

## Export Specs

The stickers are designed for [MOO Rectangular Vinyl Stickers](https://www.moo.com/us/stickers/rectangular/vinyl-stickers):

- **Bleed Area**: 3.39″ × 2.24″ — background extends to fill
- **Trim Line**: 3.31″ × 2.17″ — cutting target
- **Safe Area**: 3.15″ × 2.0″ — text and logos stay inside
- **Resolution**: 300 DPI minimum
- **PDF**: Vector text for crisp printing (compatible with print services)

## License

MIT