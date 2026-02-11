export const GENRES = {
  Rock: { color: '#E53935', icon: '🎸', fontFamily: 'Oswald' },
  Pop: { color: '#E91E63', icon: '🎤', fontFamily: 'Poppins' },
  'Hip-Hop': { color: '#FF6F00', icon: '🎧', fontFamily: 'Bebas Neue' },
  Electronic: { color: '#00BCD4', icon: '🎛️', fontFamily: 'Orbitron' },
  Jazz: { color: '#5C6BC0', icon: '🎷', fontFamily: 'Playfair Display' },
  Classical: { color: '#8D6E63', icon: '🎻', fontFamily: 'Cormorant Garamond' },
  Country: { color: '#F9A825', icon: '🤠', fontFamily: 'Bitter' },
  'R&B': { color: '#AB47BC', icon: '🎵', fontFamily: 'Raleway' },
  Metal: { color: '#212121', icon: '🤘', fontFamily: 'Anton' },
  Folk: { color: '#66BB6A', icon: '🪕', fontFamily: 'Lora' },
  Latin: { color: '#FF7043', icon: '💃', fontFamily: 'Nunito' },
  Blues: { color: '#1565C0', icon: '🎺', fontFamily: 'Merriweather' },
  Reggae: { color: '#2E7D32', icon: '🌴', fontFamily: 'Josefin Sans' },
  Punk: { color: '#F44336', icon: '⚡', fontFamily: 'Rubik' },
  Alternative: { color: '#7E57C2', icon: '🔮', fontFamily: 'Montserrat' },
  Indie: { color: '#26A69A', icon: '🌙', fontFamily: 'Work Sans' },
  Ambient: { color: '#90CAF9', icon: '🌊', fontFamily: 'Quicksand' },
  Funk: { color: '#FF9800', icon: '🕺', fontFamily: 'Righteous' },
  Soul: { color: '#CE93D8', icon: '✨', fontFamily: 'DM Serif Display' },
  Gospel: { color: '#FFD54F', icon: '🙏', fontFamily: 'Libre Baskerville' },
  World: { color: '#4DB6AC', icon: '🌍', fontFamily: 'Noto Sans' },
  'K-Pop': { color: '#F06292', icon: '💖', fontFamily: 'Black Han Sans' },
  Soundtrack: { color: '#78909C', icon: '🎬', fontFamily: 'Cinzel' },
  Comedy: { color: '#FDD835', icon: '😂', fontFamily: 'Cabin' },
  'Spoken Word': { color: '#A1887F', icon: '📖', fontFamily: 'EB Garamond' },
  Default: { color: '#607D8B', icon: '🎵', fontFamily: 'Inter' },
};

export const GENRE_NAMES = Object.keys(GENRES);

const GENRE_KEYWORDS = {
  Rock: ['rock', 'grunge', 'garage', 'psychedelic', 'hard rock', 'classic rock'],
  Pop: ['pop', 'synth-pop', 'dance pop', 'electropop', 'teen pop'],
  'Hip-Hop': ['hip hop', 'hip-hop', 'rap', 'trap', 'drill', 'grime'],
  Electronic: ['electronic', 'edm', 'house', 'techno', 'trance', 'dubstep'],
  Jazz: ['jazz', 'bebop', 'swing', 'smooth jazz', 'bossa nova'],
  Classical: ['classical', 'baroque', 'orchestral', 'opera', 'symphony'],
  Country: ['country', 'bluegrass', 'americana'],
  'R&B': ['r&b', 'rnb', 'rhythm and blues'],
  Metal: ['metal', 'death metal', 'black metal', 'thrash', 'doom', 'metalcore'],
  Folk: ['folk', 'singer-songwriter', 'acoustic'],
  Latin: ['latin', 'reggaeton', 'salsa', 'bachata', 'cumbia'],
  Blues: ['blues', 'delta blues', 'chicago blues'],
  Reggae: ['reggae', 'ska', 'dancehall', 'dub'],
  Punk: ['punk', 'pop punk', 'post-punk', 'emo'],
  Alternative: ['alternative', 'alt-rock', 'new wave', 'shoegaze'],
  Indie: ['indie', 'indie rock', 'indie pop', 'lo-fi'],
  Ambient: ['ambient', 'new age', 'chillout', 'downtempo'],
  Funk: ['funk', 'disco', 'boogie'],
  Soul: ['soul', 'motown', 'neo soul'],
  Gospel: ['gospel', 'christian', 'worship'],
  World: ['world', 'afrobeat', 'celtic', 'flamenco'],
  'K-Pop': ['k-pop', 'kpop', 'korean pop', 'j-pop'],
  Soundtrack: ['soundtrack', 'score', 'film score', 'ost'],
  Comedy: ['comedy', 'stand-up', 'humor'],
  'Spoken Word': ['spoken word', 'poetry', 'audiobook'],
};

export function detectGenreClient(spotifyGenres) {
  if (!spotifyGenres || !Array.isArray(spotifyGenres) || spotifyGenres.length === 0) {
    return 'Default';
  }
  const scores = {};
  for (const g of spotifyGenres) {
    const lower = g.toLowerCase();
    for (const [key, keywords] of Object.entries(GENRE_KEYWORDS)) {
      for (const kw of keywords) {
        if (lower.includes(kw) || kw.includes(lower)) {
          scores[key] = (scores[key] || 0) + 1;
          if (lower === kw) scores[key] += 2;
        }
      }
    }
  }
  if (Object.keys(scores).length === 0) return 'Default';
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}
