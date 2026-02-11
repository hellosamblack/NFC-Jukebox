const express = require('express');

const router = express.Router();

/**
 * GET /search?q=query
 * YouTube Music search stub.
 * Returns mock results until a proper API key / integration is configured.
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    // YouTube Music does not have a free public search API.
    // This stub returns structured mock data so the frontend can integrate ahead of time.
    // To enable real search, add a YouTube Data API v3 key and implement the fetch below.

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

module.exports = router;
