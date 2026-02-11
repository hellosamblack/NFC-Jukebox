export default function SearchResults({ results, onSelect, onLoadMore, hasMore, loading }) {
  if (!loading && results.length === 0) {
    return (
      <div className="text-center text-[#a0a0b5] py-16">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-lg">Search for albums or playlists to get started</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {results.map((item) => (
          <button
            key={`${item.type}-${item.id}`}
            onClick={() => onSelect(item)}
            className="bg-[#1a1a24] rounded-xl overflow-hidden text-left hover:bg-[#242435] transition-colors group cursor-pointer border border-transparent hover:border-[#242435]"
          >
            <div className="aspect-square overflow-hidden bg-[#242435]">
              <img
                src={item.images?.[0]?.url || item.thumbnail || ''}
                alt={item.name || item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <p className="text-white text-sm font-medium truncate">
                {item.name || item.title}
              </p>
              <p className="text-[#a0a0b5] text-xs truncate mt-0.5">
                {item.artists || item.owner || item.artist || ''}
              </p>
              <span
                className={`inline-block mt-1.5 text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  item.type === 'album'
                    ? 'bg-indigo-900/40 text-indigo-300'
                    : item.type === 'playlist'
                      ? 'bg-emerald-900/40 text-emerald-300'
                      : 'bg-rose-900/40 text-rose-300'
                }`}
              >
                {item.type || 'video'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <span className="text-indigo-400 animate-spin text-2xl">⟳</span>
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center pt-6">
          <button
            onClick={onLoadMore}
            className="bg-[#1a1a24] hover:bg-[#242435] text-[#a0a0b5] hover:text-white border border-[#242435] rounded-lg px-6 py-2 text-sm transition-colors cursor-pointer"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
