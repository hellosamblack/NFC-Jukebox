import { useState } from 'react';
import { useProject } from '../hooks/useProject';
import StickerPreview from './StickerPreview';
import StickerEditor from './StickerEditor';
import GenreIcon from './GenreIcon';

export default function MyStickersList() {
  const { stickers, removeSticker } = useProject();
  const [editingSticker, setEditingSticker] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (stickers.length === 0) {
    return (
      <div className="text-center text-[#a0a0b5] py-16">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-lg">No stickers yet. Search and add some!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className="bg-[#1a1a24] rounded-xl overflow-hidden border border-[#242435] hover:border-indigo-500/30 transition-colors group"
          >
            <button
              onClick={() => setEditingSticker(sticker)}
              className="w-full cursor-pointer bg-transparent border-none p-0"
            >
              <StickerPreview
                imageUrl={sticker.imageUrl}
                title={sticker.title}
                subtitle={sticker.subtitle}
                genre={sticker.genre}
                width={320}
              />
            </button>

            <div className="p-3 flex items-center gap-2">
              <GenreIcon genre={sticker.genre} size={24} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{sticker.title}</p>
                <p className="text-[#a0a0b5] text-xs truncate">{sticker.subtitle}</p>
              </div>
              {confirmDelete === sticker.id ? (
                <div className="flex gap-1">
                  <button
                    onClick={() => { removeSticker(sticker.id); setConfirmDelete(null); }}
                    className="text-xs bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="text-xs bg-[#242435] text-[#a0a0b5] px-2 py-1 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(sticker.id)}
                  className="text-[#a0a0b5] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-sm"
                  title="Delete sticker"
                >
                  🗑
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingSticker && (
        <StickerEditor
          item={null}
          editingSticker={editingSticker}
          onClose={() => setEditingSticker(null)}
        />
      )}
    </>
  );
}
