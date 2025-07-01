import { useState } from 'react';

const LOREM = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua';

function generateDummyText({ chars, words, paras, type, customWord }: { chars: number, words: number, paras: number, type: string, customWord: string }) {
  let base = type === 'lorem' ? LOREM : customWord || 'dummy';
  let wordArr = base.split(' ');
  let result = '';
  if (paras > 0) {
    for (let p = 0; p < paras; p++) {
      let para = '';
      let w = 0;
      while ((words && w < words) || (chars && para.length < chars)) {
        let word = wordArr[Math.floor(Math.random() * wordArr.length)];
        if (para.length + word.length + 1 > chars && chars) break;
        para += (para ? ' ' : '') + word;
        w++;
      }
      result += para.trim() + (p < paras - 1 ? '\n\n' : '');
    }
  } else {
    let w = 0;
    while ((words && w < words) || (chars && result.length < chars)) {
      let word = wordArr[Math.floor(Math.random() * wordArr.length)];
      if (result.length + word.length + 1 > chars && chars) break;
      result += (result ? ' ' : '') + word;
      w++;
    }
  }
  if (chars) result = result.slice(0, chars);
  return result.trim();
}

export default function DummyTextGenerator() {
  const [chars, setChars] = useState(0);
  const [words, setWords] = useState(0);
  const [paras, setParas] = useState(1);
  const [type, setType] = useState<'lorem' | 'custom'>('lorem');
  const [customWord, setCustomWord] = useState('');
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    setOutput(generateDummyText({ chars, words, paras, type, customWord }));
  };

  const handleClear = () => {
    setOutput('');
    setChars(0);
    setWords(0);
    setParas(1);
    setType('lorem');
    setCustomWord('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-purple-200 mb-4">Dummy Text Generator</h2>
          <div className="flex flex-wrap gap-4 mb-4 items-end">
            <div>
              <label className="block text-purple-100 mb-1 text-sm">Characters</label>
              <input type="number" min={0} className="w-24 p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" value={chars} onChange={e => setChars(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-purple-100 mb-1 text-sm">Words</label>
              <input type="number" min={0} className="w-24 p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" value={words} onChange={e => setWords(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-purple-100 mb-1 text-sm">Paragraphs</label>
              <input type="number" min={1} className="w-24 p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" value={paras} onChange={e => setParas(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-purple-100 mb-1 text-sm">Type</label>
              <select className="w-32 p-3 rounded-lg bg-transparent text-white border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" value={type} onChange={e => setType(e.target.value as any)}>
                <option value="lorem">Lorem Ipsum</option>
                <option value="custom">Custom Word</option>
              </select>
            </div>
            {type === 'custom' && (
              <div>
                <label className="block text-purple-100 mb-1 text-sm">Custom Word(s)</label>
                <input type="text" className="w-32 p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" value={customWord} onChange={e => setCustomWord(e.target.value)} placeholder="e.g. banana" />
              </div>
            )}
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
              onClick={handleGenerate}
            >
              Generate
            </button>
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
          <textarea
            className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[120px] max-h-[320px] p-3 rounded-lg border border-purple-400"
            value={output}
            readOnly
            placeholder="Generated text will appear here.."
          />
        </div>
      </div>
    </div>
  );
} 