import { useState } from 'react';

function numberToWords(num: number): string {
  if (isNaN(num)) return '';
  if (num === 0) return 'zero';
  const belowTwenty = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  const thousand = ['','thousand','million','billion'];
  let word = '';
  let i = 0;
  while (num > 0) {
    if (num % 1000 !== 0) {
      word = helper(num % 1000) + (thousand[i] ? ' ' + thousand[i] : '') + (word ? ' ' + word : '');
    }
    num = Math.floor(num / 1000);
    i++;
  }
  return word.trim();
  function helper(n: number): string {
    if (n === 0) return '';
    if (n < 20) return belowTwenty[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? '-' + belowTwenty[n%10] : '');
    return belowTwenty[Math.floor(n/100)] + ' hundred' + (n%100 ? ' ' + helper(n%100) : '');
  }
}

export default function NumberToWords() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-purple-200 mb-4">Number to Words Converter</h2>
          <input
            type="number"
            className="w-full bg-transparent text-white placeholder-purple-300/60 outline-none text-lg leading-relaxed p-3 rounded-lg border border-purple-400 mb-4"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter a number..."
          />
          <div className="flex gap-2 mb-4">
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
              onClick={() => setOutput(numberToWords(Number(input)))}
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
          <textarea
            className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[80px] max-h-[240px] p-3 rounded-lg border border-purple-400"
            value={output}
            readOnly
            placeholder="Result will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
