import { useState } from 'react';
import md5 from 'blueimp-md5';
import { sha1 } from 'js-sha1';
import { sha256 } from 'js-sha256';

export default function TextHasher() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [algo, setAlgo] = useState<'md5' | 'sha1' | 'sha256'>('md5');

  const hash = () => {
    if (algo === 'md5') setOutput(md5(input));
    else if (algo === 'sha1') setOutput(sha1(input));
    else setOutput(sha256(input));
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-purple-200 mb-4">Text Hasher (MD5, SHA1, SHA256)</h2>
          <textarea
            className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[120px] max-h-[320px] p-3 rounded-lg border border-purple-400 mb-2"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter text to hash.."
          />
          <div className="flex flex-wrap gap-2 mb-2">
            <label className="flex items-center gap-2 text-purple-200 text-sm select-none cursor-pointer">
              <input type="radio" name="algo" value="md5" checked={algo === 'md5'} onChange={() => setAlgo('md5')} className="accent-purple-500 w-4 h-4" />
              MD5
            </label>
            <label className="flex items-center gap-2 text-purple-200 text-sm select-none cursor-pointer">
              <input type="radio" name="algo" value="sha1" checked={algo === 'sha1'} onChange={() => setAlgo('sha1')} className="accent-purple-500 w-4 h-4" />
              SHA1
            </label>
            <label className="flex items-center gap-2 text-purple-200 text-sm select-none cursor-pointer">
              <input type="radio" name="algo" value="sha256" checked={algo === 'sha256'} onChange={() => setAlgo('sha256')} className="accent-purple-500 w-4 h-4" />
              SHA256
            </label>
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl w-full sm:w-auto"
              onClick={hash}
              disabled={!input}
            >
              Hash
            </button>
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl w-full sm:w-auto"
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