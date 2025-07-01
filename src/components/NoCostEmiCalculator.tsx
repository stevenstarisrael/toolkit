import { useState } from 'react';

export default function NoCostEmiCalculator() {
  const [price, setPrice] = useState('');
  const [processingFee, setProcessingFee] = useState('');
  const [gst, setGst] = useState('');
  const [months, setMonths] = useState('');
  const [rate, setRate] = useState('');
  const [emi, setEmi] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [owningCost, setOwningCost] = useState<number | null>(null);

  const calculate = () => {
    const p = parseFloat(price);
    const pf = parseFloat(processingFee);
    const g = parseFloat(gst);
    const n = parseInt(months);
    const r = parseFloat(rate) / 1200;
    if (!isNaN(p) && !isNaN(pf) && !isNaN(g) && !isNaN(n) && !isNaN(r) && n > 0) {
      const totalProcessing = pf + (pf * g / 100);
      const emiVal = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const totalEmi = emiVal * n;
      setEmi(emiVal);
      setTotalCost(totalEmi + totalProcessing);
      setOwningCost((totalEmi + totalProcessing) - p);
    } else {
      setEmi(null);
      setTotalCost(null);
      setOwningCost(null);
    }
  };

  const clear = () => {
    setPrice('');
    setProcessingFee('');
    setGst('');
    setMonths('');
    setRate('');
    setEmi(null);
    setTotalCost(null);
    setOwningCost(null);
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-10">
      <div className="relative group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-200 mb-4">No Cost EMI Calculator</h2>
        <div className="flex flex-col gap-4 mb-4">
          <input type="number" className="p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" placeholder="Product Price" value={price} onChange={e => setPrice(e.target.value)} min="0" />
          <input type="number" className="p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" placeholder="Processing Fee" value={processingFee} onChange={e => setProcessingFee(e.target.value)} min="0" />
          <input type="number" className="p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" placeholder="GST on Processing Fee (%)" value={gst} onChange={e => setGst(e.target.value)} min="0" step="0.01" />
          <input type="number" className="p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" placeholder="Tenure (months)" value={months} onChange={e => setMonths(e.target.value)} min="1" />
          <input type="number" className="p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" placeholder="Interest Rate (% per annum)" value={rate} onChange={e => setRate(e.target.value)} min="0" step="0.01" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl w-full sm:w-auto" onClick={calculate} disabled={!price || !processingFee || !gst || !months || !rate}>Calculate</button>
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl w-full sm:w-auto" onClick={clear} disabled={!price && !processingFee && !gst && !months && !rate && emi === null}>Clear</button>
        </div>
        {emi !== null && (
          <div className="mt-4 text-lg text-purple-100 space-y-1">
            <div>Monthly EMI: <span className="font-semibold text-white">₹{emi.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
            <div>Total Cost (EMI + Fees): <span className="font-semibold text-white">₹{totalCost?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
            <div>Cost of Owning: <span className="font-semibold text-white">₹{owningCost?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
          </div>
        )}
      </div>
    </div>
  );
} 