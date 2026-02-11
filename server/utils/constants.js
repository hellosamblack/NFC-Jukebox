const DPI = 300;

const STICKER_DIMENSIONS = {
  BLEED: { inches: { w: 3.39, h: 2.24 }, pixels: { w: 1017, h: 672 } },
  TRIM: { inches: { w: 3.31, h: 2.17 }, pixels: { w: 993, h: 651 } },
  SAFE: { inches: { w: 3.15, h: 2.0 }, pixels: { w: 945, h: 600 } },
};

const GENRES = {
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

module.exports = { DPI, STICKER_DIMENSIONS, GENRES };
