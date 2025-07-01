import { useState } from 'react';

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [months, setMonths] = useState('');
  const [emi, setEmi] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [interest, setInterest] = useState<number | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 1200;
    const n = parseInt(months);
    if (!isNaN(p) && !isNaN(r) && !isNaN(n) && n > 0) {
      const emiVal = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      setEmi(emiVal);
      setTotal(emiVal * n);
      setInterest(emiVal * n - p);
    } else {
      setEmi(null);
      setTotal(null);
      setInterest(null);
    }
  };

  const clear = () => {
    setPrincipal('');
    setRate('');
    setMonths('');
    setEmi(null);
    setTotal(null);
    setInterest(null);
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-10">
      <div className="relative group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-200 mb-4">EMI (Loan) Calculator</h2>
        <div className="flex flex-col gap-4 mb-4">
          <input type="number" className="p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" placeholder="Principal Amount" value={principal} onChange={e => setPrincipal(e.target.value)} min="0" />
          <input type="number" className="p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" placeholder="Rate of Interest (% per annum)" value={rate} onChange={e => setRate(e.target.value)} min="0" step="0.01" />
          <input type="number" className="p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" placeholder="Tenure (months)" value={months} onChange={e => setMonths(e.target.value)} min="1" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl w-full sm:w-auto" onClick={calculate} disabled={!principal || !rate || !months}>Calculate</button>
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl w-full sm:w-auto" onClick={clear} disabled={!principal && !rate && !months && emi === null}>Clear</button>
        </div>
        {emi !== null && (
          <div className="mt-4 text-lg text-purple-100 space-y-1">
            <div>Monthly EMI: <span className="font-semibold text-white">₹{emi.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
            <div>Total Payment: <span className="font-semibold text-white">₹{total?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
            <div>Total Interest: <span className="font-semibold text-white">₹{interest?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
          </div>
        )}
      </div>
    </div>
  );
} 