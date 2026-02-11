import { useState } from 'react';
import { authenticateSpotify } from '../services/api';
import { useProject } from '../hooks/useProject';

export default function SettingsModal({ onClose }) {
  const { setSpotifyAuth, spotifyToken, setYtAuth, ytAccessToken } = useProject();
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [ytToken, setYtToken] = useState('');
  const [ytStatus, setYtStatus] = useState(null);

  const handleConnect = async () => {
    if (!clientId.trim() || !clientSecret.trim()) {
      setStatus('error');
      setErrorMsg('Both fields are required');
      return;
    }
    setStatus('loading');
    try {
      const data = await authenticateSpotify(clientId.trim(), clientSecret.trim());
      setSpotifyAuth(data.accessToken, Date.now() + data.expiresIn * 1000);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Authentication failed');
    }
  };

  const handleYtConnect = () => {
    if (!ytToken.trim()) {
      setYtStatus('error');
      return;
    }
    setYtAuth(ytToken.trim());
    setYtStatus('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-[#1a1a24] rounded-xl shadow-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#a0a0b5] hover:text-white text-xl cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-1">Spotify Settings</h2>
        <p className="text-sm text-[#a0a0b5] mb-5">
          Connect your Spotify Developer credentials to search for albums and playlists.
        </p>

        {spotifyToken && status !== 'error' && (
          <div className="bg-emerald-900/30 border border-emerald-700 text-emerald-300 rounded-lg p-3 text-sm mb-4">
            ✓ Connected to Spotify
          </div>
        )}

        <label className="block text-sm text-[#a0a0b5] mb-1">Client ID</label>
        <input
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          placeholder="Enter your Spotify Client ID"
          className="w-full bg-[#0f0f14] border border-[#242435] rounded-lg px-3 py-2 text-white text-sm mb-3 focus:outline-none focus:border-indigo-500"
        />

        <label className="block text-sm text-[#a0a0b5] mb-1">Client Secret</label>
        <input
          type="password"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          placeholder="Enter your Spotify Client Secret"
          className="w-full bg-[#0f0f14] border border-[#242435] rounded-lg px-3 py-2 text-white text-sm mb-4 focus:outline-none focus:border-indigo-500"
        />

        {status === 'error' && (
          <p className="text-red-400 text-sm mb-3">⚠ {errorMsg}</p>
        )}
        {status === 'success' && (
          <p className="text-emerald-400 text-sm mb-3">✓ Successfully connected!</p>
        )}

        <button
          onClick={handleConnect}
          disabled={status === 'loading'}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm cursor-pointer transition-colors"
        >
          {status === 'loading' ? 'Connecting…' : 'Connect'}
        </button>

        <a
          href="https://developer.spotify.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-indigo-400 hover:text-indigo-300 text-xs mt-3"
        >
          Get credentials from Spotify Developer Dashboard →
        </a>

        {/* YouTube Music Premium Section */}
        <hr className="border-[#242435] my-6" />

        <h2 className="text-xl font-semibold mb-1">YouTube Music Premium</h2>
        <p className="text-sm text-[#a0a0b5] mb-5">
          Connect your YouTube account to access saved playlists and recommendations.
          Requires a YouTube Data API OAuth 2.0 access token.
        </p>

        {ytAccessToken && ytStatus !== 'error' && (
          <div className="bg-emerald-900/30 border border-emerald-700 text-emerald-300 rounded-lg p-3 text-sm mb-4">
            ✓ Connected to YouTube Music
          </div>
        )}

        <label className="block text-sm text-[#a0a0b5] mb-1">OAuth Access Token</label>
        <input
          type="password"
          value={ytToken}
          onChange={(e) => setYtToken(e.target.value)}
          placeholder="Enter your YouTube OAuth access token"
          className="w-full bg-[#0f0f14] border border-[#242435] rounded-lg px-3 py-2 text-white text-sm mb-4 focus:outline-none focus:border-indigo-500"
        />

        {ytStatus === 'error' && (
          <p className="text-red-400 text-sm mb-3">⚠ Token is required</p>
        )}
        {ytStatus === 'success' && (
          <p className="text-emerald-400 text-sm mb-3">✓ YouTube Music token saved!</p>
        )}

        <button
          onClick={handleYtConnect}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg py-2.5 text-sm cursor-pointer transition-colors"
        >
          Connect YouTube Music
        </button>

        <a
          href="https://console.cloud.google.com/apis/credentials"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-red-400 hover:text-red-300 text-xs mt-3"
        >
          Set up OAuth credentials in Google Cloud Console →
        </a>
      </div>
    </div>
  );
}
