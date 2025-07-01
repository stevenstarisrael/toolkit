import { useState } from 'react';

function toRoman(num: number): string {
  if (isNaN(num) || num < 1 || num > 3999) return '';
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let res = '';
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) {
      res += syms[i];
      num -= vals[i];
    }
  }
  return res;
}

export default function RomanNumeral() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-purple-200 mb-4">Roman Numeral Converter</h2>
          <input
            type="number"
            className="w-full bg-transparent text-white placeholder-purple-300/60 outline-none text-lg leading-relaxed p-3 rounded-lg border border-purple-400 mb-4"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter a number (1-3999).."
            min={1}
            max={3999}
          />
          <div className="flex gap-2 mb-2">
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
              onClick={() => setOutput(toRoman(Number(input)))}
              disabled={!input}
            >
              Convert
            </button>
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
              onClick={() => { setInput(''); setOutput(''); }}
              disabled={!input && !output}
            >
              Clear
            </button>
          </div>
          <input
            className="w-full bg-transparent text-white placeholder-purple-300/60 outline-none text-lg leading-relaxed p-3 rounded-lg border border-purple-400 mt-2"
            value={output}
            readOnly
            placeholder="Result will appear here.."
          />
        </div>
      </div>
    </div>
  );
}