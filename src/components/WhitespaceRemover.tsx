import { useState } from 'react';

export default function WhitespaceRemover() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [removeSpaces, setRemoveSpaces] = useState(true);
  const [removeBreaks, setRemoveBreaks] = useState(true);

  const process = () => {
    let result = input;
    if (removeSpaces) result = result.replace(/\s+/g, ' ').trim();
    if (removeBreaks) result = result.replace(/\n+/g, ' ');
    setOutput(result);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-purple-200 mb-4">Whitespace & Line Break Remover</h2>
          <textarea
            className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[120px] max-h-[320px] p-3 rounded-lg border border-purple-400 mb-2"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your text here.."
          />
          <div className="flex flex-wrap gap-4 mb-2 items-center">
            <label className="flex items-center gap-2 text-purple-200 text-sm select-none cursor-pointer">
              <input type="checkbox" checked={removeSpaces} onChange={e => setRemoveSpaces(e.target.checked)} className="accent-purple-500 w-4 h-4" />
              Remove extra spaces
            </label>
            <label className="flex items-center gap-2 text-purple-200 text-sm select-none cursor-pointer">
              <input type="checkbox" checked={removeBreaks} onChange={e => setRemoveBreaks(e.target.checked)} className="accent-purple-500 w-4 h-4" />
              Remove line breaks
            </label>
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
              onClick={process}
              disabled={!input}
            >
              Process
            </button>
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
              onClick={() => { setInput(''); setOutput(''); }}
              disabled={!input && !output}
            >
              Clear
            </button>
          </div>
          <textarea
            className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[80px] max-h-[240px] p-3 rounded-lg border border-purple-400 mt-2"
            value={output}
            readOnly
            placeholder="Result will appear here.."
          />
        </div>
      </div>
    </div>
  );
} 