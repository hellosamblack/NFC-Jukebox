const express = require('express');

const router = express.Router();

/**
 * GET /search?q=query
 * YouTube Music search.
 * Uses YouTube Data API v3 when YOUTUBE_API_KEY is configured, otherwise returns mock data.
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (apiKey) {
      const url = new URL('https://www.googleapis.com/youtube/v3/search');
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('q', `${q} music`);
      url.searchParams.set('type', 'playlist');
      url.searchParams.set('maxResults', '20');
      url.searchParams.set('key', apiKey);

      const response = await fetch(url.toString());
      if (!response.ok) {
        const errBody = await response.text();
        return res.status(response.status).json({
          error: 'YouTube API error',
          message: errBody,
        });
      }

      const data = await response.json();
      const results = (data.items || []).map((item) => ({
        id: item.id.playlistId || item.id.videoId || item.id.channelId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        type: item.id.kind === 'youtube#playlist' ? 'playlist' : 'video',
      }));

      return res.json({ results, source: 'youtube-api' });
    }

    // Mock data fallback
    res.json({
      results: [
        {
          id: 'mock-yt-1',
          title: `${q} - Top Hits`,
          artist: 'YouTube Music',
          thumbnail: 'https://via.placeholder.com/300x300.png?text=YouTube+Music',
          type: 'playlist',
        },
        {
          id: 'mock-yt-2',
          title: `${q} - Best Of`,
          artist: 'YouTube Music',
          thumbnail: 'https://via.placeholder.com/300x300.png?text=YouTube+Music',
          type: 'album',
        },
      ],
      source: 'mock',
      note: 'YouTube Music integration requires a YouTube Data API v3 key. Set YOUTUBE_API_KEY in your .env file.',
    });
  } catch (err) {
    res.status(500).json({ error: 'YouTube search failed', message: err.message });
  }
});

/**
 * GET /playlists
 * Fetch the authenticated user's YouTube Music playlists.
 * Requires a YouTube Music Premium OAuth token sent via the 'yt-access-token' header.
 * The client must implement the OAuth 2.0 flow and provide the token.
 */
router.get('/playlists', async (req, res) => {
  try {
    const accessToken = req.headers['yt-access-token'];
    if (!accessToken) {
      return res.status(401).json({
        error: 'Missing yt-access-token header',
        message: 'YouTube Music Premium features require OAuth authentication. Connect your YouTube account in Settings.',
      });
    }

    const url = new URL('https://www.googleapis.com/youtube/v3/playlists');
    url.searchParams.set('part', 'snippet,contentDetails');
    url.searchParams.set('mine', 'true');
    url.searchParams.set('maxResults', '50');

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errBody = await response.text();
      return res.status(response.status).json({
        error: 'YouTube API error',
        message: errBody,
      });
    }

    const data = await response.json();
    const results = (data.items || []).map((item) => ({
      id: item.id,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      type: 'playlist',
      trackCount: item.contentDetails?.itemCount || 0,
    }));

    res.json({ results, source: 'youtube-premium' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch playlists', message: err.message });
  }
});

/**
 * GET /recommendations
 * Fetch YouTube Music recommendations/liked music for the authenticated user.
 * Requires a YouTube Music Premium OAuth token sent via the 'yt-access-token' header.
 *
 * This uses the YouTube Data API to fetch the user's "Liked Music" playlist
 * and recently played/recommended content.
 */
router.get('/recommendations', async (req, res) => {
  try {
    const accessToken = req.headers['yt-access-token'];
    if (!accessToken) {
      return res.status(401).json({
        error: 'Missing yt-access-token header',
        message: 'YouTube Music Premium features require OAuth authentication. Connect your YouTube account in Settings.',
      });
    }

    // Fetch Liked Music playlist (special playlist ID "LL")
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('playlistId', 'LL');
    url.searchParams.set('maxResults', '50');

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errBody = await response.text();
      return res.status(response.status).json({
        error: 'YouTube API error',
        message: errBody,
      });
    }

    const data = await response.json();
    const results = (data.items || []).map((item) => ({
      id: item.snippet.resourceId?.videoId || item.id,
      title: item.snippet.title,
      artist: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      type: 'video',
    }));

    res.json({ results, source: 'youtube-premium-liked' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendations', message: err.message });
  }
});

module.exports = router;
