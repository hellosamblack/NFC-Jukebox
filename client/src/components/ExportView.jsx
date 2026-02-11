import { useState } from 'react';
import { useProject } from '../hooks/useProject';
import { exportPDF, exportZIP } from '../services/api';
import StickerPreview from './StickerPreview';

export default function ExportView() {
  const { stickers, saveProject } = useProject();
  const [exporting, setExporting] = useState(null); // 'pdf' | 'zip' | null
  const [error, setError] = useState('');

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const buildStickerConfigs = () =>
    stickers.map((s) => ({
      imageUrl: s.imageUrl,
      title: s.title,
      subtitle: s.subtitle,
      genre: s.genre,
      spotifyUri: s.spotifyUri || '',
    }));

  const handleExportPDF = async () => {
    setExporting('pdf');
    setError('');
    try {
      const blob = await exportPDF(buildStickerConfigs());
      downloadBlob(blob, `nfc-jukebox-stickers-${Date.now()}.pdf`);
    } catch (err) {
      setError(err.message);
    }
    setExporting(null);
  };

  const handleExportZIP = async () => {
    setExporting('zip');
    setError('');
    try {
      const blob = await exportZIP(buildStickerConfigs());
      downloadBlob(blob, `nfc-jukebox-stickers-${Date.now()}.zip`);
    } catch (err) {
      setError(err.message);
    }
    setExporting(null);
  };

  if (stickers.length === 0) {
    return (
      <div className="text-center text-[#a0a0b5] py-16">
        <p className="text-4xl mb-3">📦</p>
        <p className="text-lg">No stickers to export</p>
        <p className="text-sm mt-1">Search and add stickers to your project first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Export {stickers.length} Sticker{stickers.length !== 1 ? 's' : ''}
        </h2>
      </div>

      {/* Export buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExportZIP}
          disabled={!!exporting}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg px-5 py-2.5 text-sm cursor-pointer transition-colors"
        >
          {exporting === 'zip' ? 'Exporting…' : 'Export as PNG (ZIP)'}
        </button>
        <button
          onClick={handleExportPDF}
          disabled={!!exporting}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg px-5 py-2.5 text-sm cursor-pointer transition-colors"
        >
          {exporting === 'pdf' ? 'Exporting…' : 'Export as PDF'}
        </button>
        <button
          onClick={saveProject}
          disabled={!!exporting}
          className="bg-[#1a1a24] hover:bg-[#242435] text-[#a0a0b5] hover:text-white border border-[#242435] rounded-lg px-5 py-2.5 text-sm cursor-pointer transition-colors"
        >
          Download Config
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
          ⚠ {error}
        </p>
      )}

      {exporting && (
        <div className="flex items-center gap-2 text-indigo-400 text-sm">
          <span className="animate-spin">⟳</span>
          <span>Generating {exporting === 'pdf' ? 'PDF' : 'ZIP'}… This may take a moment.</span>
        </div>
      )}

      {/* Preview grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stickers.map((sticker) => (
          <div key={sticker.id} className="bg-[#1a1a24] rounded-xl p-3 border border-[#242435]">
            <StickerPreview
              imageUrl={sticker.imageUrl}
              title={sticker.title}
              subtitle={sticker.subtitle}
              genre={sticker.genre}
              width={340}
            />
            <p className="text-white text-sm font-medium mt-2 truncate">{sticker.title}</p>
            <p className="text-[#a0a0b5] text-xs truncate">{sticker.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
