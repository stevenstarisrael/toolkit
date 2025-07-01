import { useState } from 'react';

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);
    if (!isNaN(p) && !isNaN(r) && !isNaN(t)) {
      setResult((p * r * t) / 100);
    } else {
      setResult(null);
    }
  };

  const clear = () => {
    setPrincipal('');
    setRate('');
    setTime('');
    setResult(null);
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-10">
      <div className="relative group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-200 mb-4">Simple Interest Calculator</h2>
        <div className="flex flex-col gap-4 mb-4">
          <input type="number" className="p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" placeholder="Principal Amount" value={principal} onChange={e => setPrincipal(e.target.value)} min="0" />
          <input type="number" className="p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" placeholder="Rate of Interest (% per annum)" value={rate} onChange={e => setRate(e.target.value)} min="0" step="0.01" />
          <input type="number" className="p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" placeholder="Time (years)" value={time} onChange={e => setTime(e.target.value)} min="0" step="0.01" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl w-full sm:w-auto" onClick={calculate} disabled={!principal || !rate || !time}>Calculate</button>
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl w-full sm:w-auto" onClick={clear} disabled={!principal && !rate && !time && result === null}>Clear</button>
        </div>
        {result !== null && (
          <div className="mt-4 text-lg text-purple-100">
            Simple Interest: <span className="font-semibold text-white">₹{result.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        )}
      </div>
    </div>
  );
} 