import { useState, useEffect, useRef } from 'react';

export default function SearchBar({ onSearch, source, onSourceChange, typeFilter, onTypeFilterChange, loading, ytConnected, onYtPlaylists, onYtRecommendations }) {
  const [query, setQuery] = useState('');
  const prevSearchRef = useRef({ query: '', source, typeFilter });

  useEffect(() => {
    const trimmed = query.trim();
    const timer = setTimeout(() => {
      if (trimmed !== prevSearchRef.current.query ||
          source !== prevSearchRef.current.source ||
          typeFilter !== prevSearchRef.current.typeFilter) {
        prevSearchRef.current = { query: trimmed, source, typeFilter };
        onSearch(trimmed);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, source, typeFilter, onSearch]);

  const sources = ['Spotify', 'YouTube'];
  const types = ['Albums', 'Playlists', 'Both'];

  return (
    <div className="space-y-3">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b5]">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${source}…`}
          className="w-full bg-[#1a1a24] border border-[#242435] rounded-xl pl-10 pr-10 py-3 text-white placeholder-[#a0a0b5] focus:outline-none focus:border-indigo-500 transition-colors"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 animate-spin text-sm">⟳</span>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex bg-[#1a1a24] rounded-lg p-0.5 border border-[#242435]">
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => onSourceChange(s)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                source === s
                  ? 'bg-indigo-600 text-white'
                  : 'text-[#a0a0b5] hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {source === 'Spotify' && (
          <div className="flex bg-[#1a1a24] rounded-lg p-0.5 border border-[#242435]">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => onTypeFilterChange(t)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
                  typeFilter === t
                    ? 'bg-[#242435] text-white'
                    : 'text-[#a0a0b5] hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {source === 'YouTube' && ytConnected && (
          <div className="flex gap-2">
            <button
              onClick={onYtPlaylists}
              className="px-3 py-1.5 rounded-md text-sm bg-red-900/30 border border-red-800 text-red-300 hover:bg-red-900/50 transition-colors cursor-pointer"
            >
              📋 My Playlists
            </button>
            <button
              onClick={onYtRecommendations}
              className="px-3 py-1.5 rounded-md text-sm bg-red-900/30 border border-red-800 text-red-300 hover:bg-red-900/50 transition-colors cursor-pointer"
            >
              ❤️ Liked Music
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
