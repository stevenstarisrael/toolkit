import { useState, useEffect, useMemo } from 'react';
import emojiData from '../../public/emoji.json';

export default function EmojiFinder() {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [emojis, setEmojis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEmojis(emojiData);
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return emojis;
    const s = search.toLowerCase();
    return emojis.filter(e =>
      e.char.includes(search) ||
      (e.name && e.name.toLowerCase().includes(s)) ||
      (e.category && e.category.toLowerCase().includes(s)) ||
      (e.group && e.group.toLowerCase().includes(s)) ||
      (e.subgroup && e.subgroup.toLowerCase().includes(s))
    );
  }, [search, emojis]);

  const handleCopy = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    setCopied(emoji);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10">
      <div className="relative group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-200 mb-6">Emoji Finder</h2>
        <div className="flex justify-center mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search emojis by name, category, or emoji..."
            className="w-full max-w-md px-4 py-3 rounded-full bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg shadow-lg backdrop-blur-md"
          />
        </div>
        {loading ? (
          <div className="text-center text-purple-200 text-xl py-16">Loading emojis…</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-h-[70vh] overflow-y-auto" style={{ overflowX: 'hidden' }}>
            {filtered.length === 0 ? (
              <div className="col-span-full text-center text-purple-200 text-xl py-16">No emojis found.</div>
            ) : (
              filtered.map(e => (
                <button
                  key={e.codes + e.char}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 border border-white/10 hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-teal-500/20 transition shadow group relative focus:outline-none min-h-[90px]`}
                  onClick={() => handleCopy(e.char)}
                  title={e.name}
                >
                  <span className="text-3xl mb-1">{e.char}</span>
                  <span className="text-xs text-purple-200 text-center break-words max-w-full leading-tight whitespace-normal">{e.name}</span>
                  <span className="text-[10px] text-purple-400/80 text-center break-words max-w-full leading-tight whitespace-normal">{e.category?.split(' (')[0]}</span>
                  {copied === e.char && (
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs px-2 py-1 rounded-full shadow-lg z-10">Copied!</span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
} 