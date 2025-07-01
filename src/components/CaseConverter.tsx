import { useState } from 'react';

function toSentenceCase(text: string) {
  return text.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()).replace(/([A-Z])([^A-Z]*)/g, (a, b) => a + b.toLowerCase());
}
function toTitleCase(text: string) {
  return text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}
function toAlternatingCase(text: string) {
  return text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
}
function toCamelCase(text: string) {
  return text
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word, i) => i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = (type: string) => {
    switch (type) {
      case 'upper': setOutput(input.toUpperCase()); break;
      case 'lower': setOutput(input.toLowerCase()); break;
      case 'sentence': setOutput(toSentenceCase(input)); break;
      case 'title': setOutput(toTitleCase(input)); break;
      case 'alt': setOutput(toAlternatingCase(input)); break;
      case 'camel': setOutput(toCamelCase(input)); break;
      default: setOutput(input);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-purple-200 mb-4">Case Converter</h2>
          <textarea
            className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[120px] max-h-[320px] p-3 rounded-lg border border-purple-400 mb-2"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your text here.."
          />
          <div className="flex flex-wrap gap-2 mb-2">
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-xs font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl" onClick={() => convert('upper')} disabled={!input}>UPPERCASE</button>
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-xs font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl" onClick={() => convert('lower')} disabled={!input}>lowercase</button>
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-xs font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl" onClick={() => convert('sentence')} disabled={!input}>Sentence case</button>
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-xs font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl" onClick={() => convert('title')} disabled={!input}>Title Case</button>
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-xs font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl" onClick={() => convert('alt')} disabled={!input}>aLtErNaTiNg</button>
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-xs font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl" onClick={() => convert('camel')} disabled={!input}>camelCase</button>
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-xs font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl" onClick={() => { setInput(''); setOutput(''); }} disabled={!input && !output}>Clear</button>
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