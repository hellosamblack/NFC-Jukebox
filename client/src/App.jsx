import { useState, useRef, useCallback } from 'react';
import { ProjectProvider, useProject } from './hooks/useProject';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import StickerEditor from './components/StickerEditor';
import MyStickersList from './components/MyStickersList';
import ExportView from './components/ExportView';
import SettingsModal from './components/SettingsModal';
import { searchSpotify, searchYouTube } from './services/api';

const TABS = [
  { id: 'search', label: 'Search', icon: '🔍' },
  { id: 'stickers', label: 'My Stickers', icon: '🎴' },
  { id: 'export', label: 'Export', icon: '📦' },
];

function AppContent() {
  const { stickers, spotifyToken, saveProject, loadProject } = useProject();
  const [activeTab, setActiveTab] = useState('search');
  const [showSettings, setShowSettings] = useState(false);
  const [searchSource, setSearchSource] = useState('Spotify');
  const [typeFilter, setTypeFilter] = useState('Both');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [lastQuery, setLastQuery] = useState('');
  const [editorItem, setEditorItem] = useState(null);
  const fileInputRef = useRef(null);

  const performSearch = useCallback(
    async (query, append = false) => {
      if (!query) {
        setResults([]);
        setHasMore(false);
        return;
      }
      const currentOffset = append ? offset : 0;
      setLoading(true);
      setLastQuery(query);

      try {
        if (searchSource === 'Spotify') {
          if (!spotifyToken) {
            setShowSettings(true);
            setLoading(false);
            return;
          }
          const typeParam =
            typeFilter === 'Albums' ? 'album' : typeFilter === 'Playlists' ? 'playlist' : 'album,playlist';
          const data = await searchSpotify(query, spotifyToken, typeParam, currentOffset, 20);
          const items = data.results || [];
          setResults(append ? (prev) => [...prev, ...items] : items);
          const total = (data.total?.albums || 0) + (data.total?.playlists || 0);
          setOffset(currentOffset + items.length);
          setHasMore(currentOffset + items.length < total);
        } else {
          const data = await searchYouTube(query);
          setResults(data.results || []);
          setHasMore(false);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
      setLoading(false);
    },
    [searchSource, typeFilter, spotifyToken, offset],
  );

  const handleSearch = useCallback(
    (query) => {
      setOffset(0);
      performSearch(query, false);
    },
    [performSearch],
  );

  const handleLoadMore = () => performSearch(lastQuery, true);

  const handleLoadProject = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await loadProject(file);
      setActiveTab('stickers');
    } catch (err) {
      alert(err.message);
    }
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-[#0f0f14]">
      {/* Header */}
      <header className="bg-[#1a1a24] border-b border-[#242435] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">💿</span>
            <h1 className="text-lg font-semibold text-white">NFC Jukebox</h1>
            {stickers.length > 0 && (
              <span className="bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {stickers.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={saveProject}
              disabled={stickers.length === 0}
              className="text-sm text-[#a0a0b5] hover:text-white disabled:opacity-30 px-3 py-1.5 rounded-lg hover:bg-[#242435] transition-colors cursor-pointer"
            >
              💾 Save
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-[#a0a0b5] hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#242435] transition-colors cursor-pointer"
            >
              📂 Load
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleLoadProject}
              className="hidden"
            />
            <button
              onClick={() => setActiveTab('export')}
              disabled={stickers.length === 0}
              className="text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Export
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                spotifyToken
                  ? 'text-emerald-400 hover:bg-[#242435]'
                  : 'text-amber-400 hover:bg-[#242435]'
              }`}
              title={spotifyToken ? 'Spotify connected' : 'Connect Spotify'}
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-[#a0a0b5] hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'search' && (
          <div className="space-y-6">
            <SearchBar
              onSearch={handleSearch}
              source={searchSource}
              onSourceChange={setSearchSource}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              loading={loading}
            />
            <SearchResults
              results={results}
              onSelect={setEditorItem}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loading={loading}
            />
          </div>
        )}

        {activeTab === 'stickers' && <MyStickersList />}

        {activeTab === 'export' && <ExportView />}
      </main>

      {/* Modals */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {editorItem && (
        <StickerEditor item={editorItem} onClose={() => setEditorItem(null)} editingSticker={null} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
}
