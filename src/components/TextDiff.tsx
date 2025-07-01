import { useState } from 'react';

function diffLines(a: string, b: string) {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const maxLen = Math.max(aLines.length, bLines.length);
  const result: { type: 'added' | 'removed' | 'unchanged', text: string }[] = [];
  for (let i = 0; i < maxLen; i++) {
    if (aLines[i] === bLines[i]) {
      if (aLines[i] !== undefined) result.push({ type: 'unchanged', text: aLines[i] });
    } else {
      if (aLines[i] !== undefined) result.push({ type: 'removed', text: aLines[i] });
      if (bLines[i] !== undefined) result.push({ type: 'added', text: bLines[i] });
    }
  }
  return result;
}

export default function TextDiff() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const diff = showDiff ? diffLines(textA, textB) : [];

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-purple-200 mb-4">Text Diff Checker</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <textarea
              className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[120px] max-h-[320px] p-3 rounded-lg border border-purple-400"
              value={textA}
              onChange={e => setTextA(e.target.value)}
              placeholder="Original text.."
            />
            <textarea
              className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[120px] max-h-[320px] p-3 rounded-lg border border-purple-400"
              value={textB}
              onChange={e => setTextB(e.target.value)}
              placeholder="Modified text.."
            />
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
              onClick={() => setShowDiff(true)}
              disabled={!textA && !textB}
            >
              Compare
            </button>
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
              onClick={() => { setTextA(''); setTextB(''); setShowDiff(false); }}
              disabled={!textA && !textB}
            >
              Clear
            </button>
          </div>
          {showDiff && (
            <div className="mt-4 bg-slate-900/80 rounded-lg p-4 border border-purple-400 text-sm overflow-x-auto">
              {diff.length === 0 && <div className="text-purple-300">No differences found.</div>}
              {diff.map((line, i) => (
                <div key={i} className={
                  line.type === 'added' ? 'text-green-400 bg-green-400/10 rounded px-1' :
                  line.type === 'removed' ? 'text-red-400 bg-red-400/10 rounded px-1' :
                  'text-white'
                }>
                  {line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '}{line.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 