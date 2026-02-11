const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const router = express.Router();

/**
 * POST /auth
 * Accept clientId and clientSecret, return access token.
 */
router.post('/auth', async (req, res) => {
  try {
    const { clientId, clientSecret } = req.body;

    if (!clientId || !clientSecret) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Both clientId and clientSecret are required. Get them at https://developer.spotify.com/dashboard',
      });
    }

    const spotifyApi = new SpotifyWebApi({ clientId, clientSecret });
    const data = await spotifyApi.clientCredentialsGrant();

    res.json({
      accessToken: data.body.access_token,
      expiresIn: data.body.expires_in,
    });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({
      error: 'Authentication failed',
      message: err.message || 'Could not authenticate with Spotify. Check your credentials.',
    });
  }
});

/**
 * Helper: create an authenticated SpotifyWebApi instance from the request header.
 */
function getAuthenticatedApi(req) {
  const token = req.headers.access_token || req.headers['access-token'];
  if (!token) {
    return null;
  }
  const api = new SpotifyWebApi();
  api.setAccessToken(token);
  return api;
}

/**
 * Simplify Spotify image arrays.
 */
function simplifyImages(images) {
  if (!images) return [];
  return images.map((img) => ({ url: img.url, width: img.width, height: img.height }));
}

/**
 * GET /search?q=query&type=album,playlist&offset=0&limit=20
 */
router.get('/search', async (req, res) => {
  try {
    const api = getAuthenticatedApi(req);
    if (!api) {
      return res.status(401).json({ error: 'Missing access_token header' });
    }

    const { q, type = 'album,playlist', offset = 0, limit = 20 } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const types = type.split(',').map((t) => t.trim());
    const data = await api.search(q, types, { offset: Number(offset), limit: Number(limit) });

    const results = [];

    if (data.body.albums && data.body.albums.items) {
      for (const album of data.body.albums.items) {
        results.push({
          id: album.id,
          name: album.name,
          type: 'album',
          images: simplifyImages(album.images),
          artists: album.artists.map((a) => a.name).join(', '),
          artistIds: album.artists.map((a) => a.id),
          releaseDate: album.release_date,
          uri: album.uri,
        });
      }
    }

    if (data.body.playlists && data.body.playlists.items) {
      for (const playlist of data.body.playlists.items) {
        if (!playlist) continue;
        results.push({
          id: playlist.id,
          name: playlist.name,
          type: 'playlist',
          images: simplifyImages(playlist.images),
          owner: playlist.owner ? playlist.owner.display_name : 'Unknown',
          uri: playlist.uri,
        });
      }
    }

    res.json({
      results,
      total: {
        albums: data.body.albums ? data.body.albums.total : 0,
        playlists: data.body.playlists ? data.body.playlists.total : 0,
      },
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: 'Search failed', message: err.message });
  }
});

/**
 * GET /album/:id
 */
router.get('/album/:id', async (req, res) => {
  try {
    const api = getAuthenticatedApi(req);
    if (!api) {
      return res.status(401).json({ error: 'Missing access_token header' });
    }

    const albumData = await api.getAlbum(req.params.id);
    const album = albumData.body;

    // Fetch artist details for genres
    let genres = [];
    let artistImages = [];
    if (album.artists && album.artists.length > 0) {
      try {
        const artistData = await api.getArtist(album.artists[0].id);
        genres = artistData.body.genres || [];
        artistImages = simplifyImages(artistData.body.images);
      } catch (_) {
        // Genre fetch is non-critical
      }
    }

    const tracks = album.tracks.items.map((t) => ({
      id: t.id,
      name: t.name,
      trackNumber: t.track_number,
      durationMs: t.duration_ms,
      uri: t.uri,
    }));

    res.json({
      id: album.id,
      name: album.name,
      artists: album.artists.map((a) => a.name).join(', '),
      artistIds: album.artists.map((a) => a.id),
      images: simplifyImages(album.images),
      artistImages,
      genres,
      tracks,
      releaseDate: album.release_date,
      totalTracks: album.total_tracks,
      uri: album.uri,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: 'Failed to get album', message: err.message });
  }
});

/**
 * GET /playlist/:id
 */
router.get('/playlist/:id', async (req, res) => {
  try {
    const api = getAuthenticatedApi(req);
    if (!api) {
      return res.status(401).json({ error: 'Missing access_token header' });
    }

    const playlistData = await api.getPlaylist(req.params.id);
    const playlist = playlistData.body;

    const tracks = playlist.tracks.items
      .filter((item) => item.track)
      .slice(0, 100)
      .map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map((a) => a.name).join(', '),
        durationMs: item.track.duration_ms,
        uri: item.track.uri,
      }));

    res.json({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      images: simplifyImages(playlist.images),
      owner: playlist.owner ? playlist.owner.display_name : 'Unknown',
      tracks,
      totalTracks: playlist.tracks.total,
      uri: playlist.uri,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: 'Failed to get playlist', message: err.message });
  }
});

/**
 * GET /artist/:id
 */
router.get('/artist/:id', async (req, res) => {
  try {
    const api = getAuthenticatedApi(req);
    if (!api) {
      return res.status(401).json({ error: 'Missing access_token header' });
    }

    const artistData = await api.getArtist(req.params.id);
    const artist = artistData.body;

    res.json({
      id: artist.id,
      name: artist.name,
      images: simplifyImages(artist.images),
      genres: artist.genres || [],
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: 'Failed to get artist', message: err.message });
  }
});

module.exports = router;
