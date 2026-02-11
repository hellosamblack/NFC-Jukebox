import { useState, useEffect, useCallback } from 'react';
import { GENRE_NAMES, detectGenreClient } from '../utils/genres';
import { useProject } from '../hooks/useProject';
import { getSpotifyAlbum, getSpotifyArtist } from '../services/api';
import StickerPreview from './StickerPreview';
import GenreIcon from './GenreIcon';

export default function StickerEditor({ item, onClose, editingSticker }) {
  const { addSticker, updateSticker, spotifyToken } = useProject();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [genre, setGenre] = useState('Default');
  const [imageSource, setImageSource] = useState('album');
  const [imageUrl, setImageUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [artistImageUrl, setArtistImageUrl] = useState('');
  const [albumImageUrl, setAlbumImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [spotifyUri, setSpotifyUri] = useState('');

  const fetchAlbumDetails = useCallback(async (id) => {
    if (!spotifyToken) return;
    setLoading(true);
    try {
      const data = await getSpotifyAlbum(id, spotifyToken);
      if (data.genres?.length) {
        const detectedFromAlbum = detectGenreClient(data.genres);
        setGenre(detectedFromAlbum);
      }
      if (data.artistIds?.[0]) {
        const artist = await getSpotifyArtist(data.artistIds[0], spotifyToken);
        if (artist.images?.[0]?.url) {
          setArtistImageUrl(artist.images[0].url);
        }
        if (artist.genres?.length) {
          // Simple genre detection
          const detected = detectGenreClient(artist.genres);
          setGenre(detected);
        }
      }
    } catch {
      // Non-critical, keep defaults
    }
    setLoading(false);
  }, [spotifyToken]);

  useEffect(() => {
    if (editingSticker) {
      setTitle(editingSticker.title || '');
      setSubtitle(editingSticker.subtitle || '');
      setGenre(editingSticker.genre || 'Default');
      setImageUrl(editingSticker.imageUrl || '');
      setAlbumImageUrl(editingSticker.imageUrl || '');
      setCustomUrl(editingSticker.customUrl || '');
      setSpotifyUri(editingSticker.spotifyUri || '');
      setImageSource(editingSticker.imageSource || 'album');
      return;
    }
    if (!item) return;

    // YouTube item
    if (item.thumbnail) {
      setTitle(item.title || '');
      setSubtitle(item.artist || item.channelTitle || '');
      setImageUrl(item.thumbnail);
      setAlbumImageUrl(item.thumbnail);
      return;
    }

    // Spotify item
    const img = item.images?.[0]?.url || '';
    setAlbumImageUrl(img);
    setImageUrl(img);
    setSpotifyUri(item.uri || '');

    if (item.type === 'album') {
      setTitle(item.name || '');
      setSubtitle(typeof item.artists === 'string' ? item.artists : item.artists?.join(', ') || '');
      fetchAlbumDetails(item.id);
    } else if (item.type === 'playlist') {
      setTitle(item.name || '');
      setSubtitle(item.owner || '');
    }
  }, [item, editingSticker, fetchAlbumDetails]);

  const currentImageUrl = imageSource === 'custom' ? customUrl : imageSource === 'artist' ? artistImageUrl : albumImageUrl;

  useEffect(() => {
    setImageUrl(currentImageUrl);
  }, [currentImageUrl]);

  const handleSave = () => {
    const config = {
      title,
      subtitle,
      genre,
      imageUrl,
      imageSource,
      customUrl: imageSource === 'custom' ? customUrl : '',
      spotifyUri,
      sourceType: item?.type || editingSticker?.sourceType || 'unknown',
      sourceId: item?.id || editingSticker?.sourceId || '',
    };

    if (editingSticker) {
      updateSticker(editingSticker.id, config);
    } else {
      addSticker(config);
    }
    onClose();
  };

  const imageSources = [
    { key: 'album', label: 'Album Art' },
    { key: 'artist', label: 'Artist Photo', disabled: !artistImageUrl },
    { key: 'custom', label: 'Custom URL' },
  ];

  return (
    <div className="fixed inset-0 z-40 flex bg-black/60" onClick={onClose}>
      <div
        className="ml-auto w-full max-w-4xl bg-[#0f0f14] h-full overflow-y-auto shadow-2xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {editingSticker ? 'Edit Sticker' : 'Create Sticker'}
            </h2>
            <button
              onClick={onClose}
              className="text-[#a0a0b5] hover:text-white text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview */}
            <div className="flex flex-col items-center gap-4">
              <StickerPreview
                imageUrl={imageUrl}
                title={title}
                subtitle={subtitle}
                genre={genre}
                width={460}
              />
              {loading && <p className="text-indigo-400 text-sm animate-pulse">Loading details…</p>}
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#a0a0b5] mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#1a1a24] border border-[#242435] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-[#a0a0b5] mb-1">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-[#1a1a24] border border-[#242435] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-[#a0a0b5] mb-1">Genre</label>
                <div className="flex items-center gap-2">
                  <GenreIcon genre={genre} size={28} />
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="flex-1 bg-[#1a1a24] border border-[#242435] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {GENRE_NAMES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#a0a0b5] mb-1">Image Source</label>
                <div className="flex bg-[#1a1a24] rounded-lg p-0.5 border border-[#242435]">
                  {imageSources.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => !s.disabled && setImageSource(s.key)}
                      disabled={s.disabled}
                      className={`flex-1 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                        imageSource === s.key
                          ? 'bg-indigo-600 text-white'
                          : 'text-[#a0a0b5] hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {imageSource === 'custom' && (
                <div>
                  <label className="block text-sm text-[#a0a0b5] mb-1">Custom Image URL</label>
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-[#1a1a24] border border-[#242435] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg py-2.5 text-sm cursor-pointer transition-colors"
                >
                  {editingSticker ? 'Update Sticker' : 'Save to Project'}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 bg-[#1a1a24] hover:bg-[#242435] text-[#a0a0b5] hover:text-white border border-[#242435] rounded-lg py-2.5 text-sm cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
