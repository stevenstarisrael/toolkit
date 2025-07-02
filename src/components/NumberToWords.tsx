import { useState } from 'react';

function numberToWordsInternational(num: number): string {
  if (isNaN(num)) return '';
  if (num === 0) return 'zero';
  const belowTwenty = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const thousand = ['', 'thousand', 'million', 'billion'];
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
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + belowTwenty[n % 10] : '');
    return belowTwenty[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + helper(n % 100) : '');
  }
}

function numberToWordsIndian(num: number): string {
  if (isNaN(num)) return '';
  if (num === 0) return 'zero';
  const belowTwenty = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const units = [
    { value: 10000000, str: 'crore' },
    { value: 100000, str: 'lakh' },
    { value: 1000, str: 'thousand' },
    { value: 100, str: 'hundred' }
  ];
  let word = '';
  for (let i = 0; i < units.length; i++) {
    const unitValue = Math.floor(num / units[i].value);
    if (unitValue > 0) {
      word += numberToWordsIndian(unitValue) + ' ' + units[i].str + ' ';
      num = num % units[i].value;
    }
  }
  if (num > 0) {
    if (word !== '') word += 'and ';
    if (num < 20) word += belowTwenty[num];
    else {
      word += tens[Math.floor(num / 10)];
      if (num % 10) word += '-' + belowTwenty[num % 10];
    }
  }
  return word.trim();
}

// Utility to convert a string to sentence case
function toSentenceCase(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function NumberToWords() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [system, setSystem] = useState<'indian' | 'international'>('indian');
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-purple-200 mb-4">Number to Words Converter</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 items-stretch sm:items-center w-full relative z-10">
            <label className="text-purple-200 text-sm font-medium">System:</label>
            <select value={system} onChange={e => setSystem(e.target.value as any)} className="px-3 py-2 rounded bg-white/20 border border-white/20 text-white focus:outline-none w-full sm:w-auto relative z-20">
              <option value="indian">Indian (lakh, crore)</option>
              <option value="international">International (million, billion)</option>
            </select>
          </div>
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
              onClick={() => setOutput(system === 'indian' ? toSentenceCase(numberToWordsIndian(Number(input))) : toSentenceCase(numberToWordsInternational(Number(input))))}
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
