const { GENRES } = require('../utils/constants');

const GENRE_KEYWORDS = {
  Rock: ['rock', 'grunge', 'garage', 'psychedelic rock', 'hard rock', 'classic rock', 'prog rock', 'stoner'],
  Pop: ['pop', 'synth-pop', 'dance pop', 'electropop', 'teen pop', 'art pop', 'bubblegum'],
  'Hip-Hop': ['hip hop', 'hip-hop', 'rap', 'trap', 'lo-fi hip hop', 'boom bap', 'drill', 'grime'],
  Electronic: ['electronic', 'edm', 'house', 'techno', 'trance', 'dubstep', 'drum and bass', 'dnb', 'idm'],
  Jazz: ['jazz', 'bebop', 'swing', 'smooth jazz', 'fusion', 'bossa nova'],
  Classical: ['classical', 'baroque', 'romantic', 'orchestral', 'opera', 'symphony', 'chamber'],
  Country: ['country', 'bluegrass', 'americana', 'honky-tonk', 'outlaw country'],
  'R&B': ['r&b', 'rnb', 'rhythm and blues', 'neo-soul', 'contemporary r&b'],
  Metal: ['metal', 'death metal', 'black metal', 'thrash', 'doom', 'heavy metal', 'metalcore', 'nu metal'],
  Folk: ['folk', 'singer-songwriter', 'acoustic', 'folk rock', 'freak folk'],
  Latin: ['latin', 'reggaeton', 'salsa', 'bachata', 'cumbia', 'merengue', 'latin pop', 'latin trap'],
  Blues: ['blues', 'delta blues', 'chicago blues', 'electric blues'],
  Reggae: ['reggae', 'ska', 'dancehall', 'dub', 'roots reggae'],
  Punk: ['punk', 'pop punk', 'post-punk', 'hardcore punk', 'emo', 'skate punk'],
  Alternative: ['alternative', 'alt-rock', 'new wave', 'post-rock', 'shoegaze', 'dream pop'],
  Indie: ['indie', 'indie rock', 'indie pop', 'indie folk', 'lo-fi'],
  Ambient: ['ambient', 'new age', 'drone', 'meditation', 'chillout', 'downtempo'],
  Funk: ['funk', 'p-funk', 'disco', 'boogie'],
  Soul: ['soul', 'motown', 'classic soul', 'neo soul', 'northern soul'],
  Gospel: ['gospel', 'christian', 'worship', 'ccm', 'hymn'],
  World: ['world', 'afrobeat', 'afropop', 'celtic', 'flamenco', 'indian classical'],
  'K-Pop': ['k-pop', 'kpop', 'korean pop', 'j-pop', 'jpop'],
  Soundtrack: ['soundtrack', 'score', 'film score', 'movie', 'game', 'ost'],
  Comedy: ['comedy', 'stand-up', 'humor', 'parody', 'funny'],
  'Spoken Word': ['spoken word', 'poetry', 'audiobook', 'podcast', 'spoken'],
};

/**
 * Detect the best matching genre from an array of Spotify genre strings.
 * Returns the genre key (e.g., "Rock", "Hip-Hop") or "Default".
 */
function detectGenre(genres) {
  if (!genres || !Array.isArray(genres) || genres.length === 0) {
    return 'Default';
  }

  const scores = {};

  for (const spotifyGenre of genres) {
    const lower = spotifyGenre.toLowerCase();

    for (const [genreKey, keywords] of Object.entries(GENRE_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lower.includes(keyword) || keyword.includes(lower)) {
          scores[genreKey] = (scores[genreKey] || 0) + 1;
          // Boost exact matches
          if (lower === keyword) {
            scores[genreKey] += 2;
          }
        }
      }
    }
  }

  if (Object.keys(scores).length === 0) {
    return 'Default';
  }

  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Get the genre configuration (color, icon, fontFamily) for a genre name.
 */
function getGenreConfig(genreName) {
  return GENRES[genreName] || GENRES.Default;
}

module.exports = { detectGenre, getGenreConfig };
