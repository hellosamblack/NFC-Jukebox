import { API_BASE } from '../utils/constants';

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function authenticateSpotify(clientId, clientSecret) {
  return fetchJSON(`${API_BASE}/spotify/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, clientSecret }),
  });
}

export async function searchSpotify(query, token, type = 'album,playlist', offset = 0, limit = 20) {
  const params = new URLSearchParams({ q: query, type, offset, limit });
  return fetchJSON(`${API_BASE}/spotify/search?${params}`, {
    headers: { 'access-token': token },
  });
}

export async function getSpotifyAlbum(id, token) {
  return fetchJSON(`${API_BASE}/spotify/album/${id}`, {
    headers: { 'access-token': token },
  });
}

export async function getSpotifyPlaylist(id, token) {
  return fetchJSON(`${API_BASE}/spotify/playlist/${id}`, {
    headers: { 'access-token': token },
  });
}

export async function getSpotifyArtist(id, token) {
  return fetchJSON(`${API_BASE}/spotify/artist/${id}`, {
    headers: { 'access-token': token },
  });
}

export async function searchYouTube(query) {
  const params = new URLSearchParams({ q: query });
  return fetchJSON(`${API_BASE}/youtube/search?${params}`);
}

export async function renderSticker(config) {
  return fetchJSON(`${API_BASE}/export/render-sticker`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
}

export async function exportPDF(stickers) {
  const res = await fetch(`${API_BASE}/export/export-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stickers }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Export failed: ${res.status}`);
  }
  return res.blob();
}

export async function exportZIP(stickers) {
  const res = await fetch(`${API_BASE}/export/export-project`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stickers }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Export failed: ${res.status}`);
  }
  return res.blob();
}
