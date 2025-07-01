import { useState } from 'react';

export default function CharacterCount() {
  const [text, setText] = useState('');
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-purple-200 mb-4">Character & Word Count</h2>
          <textarea
            className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[120px] max-h-[320px] p-3 rounded-lg border border-purple-400 mb-2"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type or paste your text here.."
          />
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col text-purple-200 text-sm">
              <span>Characters: <span className="font-semibold text-white">{charCount}</span></span>
              <span>Words: <span className="font-semibold text-white">{wordCount}</span></span>
            </div>
            <button
              type="button"
              onClick={() => setText('')}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
              disabled={!text}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 