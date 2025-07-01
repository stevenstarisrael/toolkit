import { useState } from 'react';

const units = [
  { label: 'g', factor: 1 },
  { label: 'kg', factor: 1000 },
  { label: 'ml', factor: 1 },
  { label: 'L', factor: 1000 },
];

export default function UnitConversionCostCalculator() {
  const [baseQty, setBaseQty] = useState('');
  const [baseUnit, setBaseUnit] = useState('kg');
  const [basePrice, setBasePrice] = useState('');
  const [targetQty, setTargetQty] = useState('');
  const [targetUnit, setTargetUnit] = useState('g');

  const getUnitFactor = (unit: string) => units.find(u => u.label === unit)?.factor || 1;

  let result = '';
  const baseQtyNum = parseFloat(baseQty);
  const basePriceNum = parseFloat(basePrice);
  const targetQtyNum = parseFloat(targetQty);
  if (!isNaN(baseQtyNum) && !isNaN(basePriceNum) && !isNaN(targetQtyNum)) {
    const baseInG = baseQtyNum * getUnitFactor(baseUnit);
    const targetInG = targetQtyNum * getUnitFactor(targetUnit);
    const pricePerG = basePriceNum / baseInG;
    const cost = pricePerG * targetInG;
    result = `Cost of ${targetQtyNum}${targetUnit} = ₹${cost.toFixed(2)}`;
  }

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-10">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-200 mb-6">Unit Conversion Cost Calculator</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <input type="number" min="0" value={baseQty} onChange={e => setBaseQty(e.target.value)} placeholder="Base quantity" className="w-45 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <select value={baseUnit} onChange={e => setBaseUnit(e.target.value)} className="px-3 py-2 rounded bg-white/20 border border-white/20 text-white focus:outline-none">
              {units.map(u => <option key={u.label} value={u.label}>{u.label}</option>)}
            </select>
            <span className="text-purple-200">=</span>
            <input type="number" min="0" value={basePrice} onChange={e => setBasePrice(e.target.value)} placeholder="Price (₹)" className="w-32 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <input type="number" min="0" value={targetQty} onChange={e => setTargetQty(e.target.value)} placeholder="Target quantity" className="w-45 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <select value={targetUnit} onChange={e => setTargetUnit(e.target.value)} className="px-3 py-2 rounded bg-white/20 border border-white/20 text-white focus:outline-none">
              {units.map(u => <option key={u.label} value={u.label}>{u.label}</option>)}
            </select>
          </div>
        </div>
        {result && <div className="text-lg text-teal-300 font-semibold bg-white/10 rounded p-4 text-center mt-4">{result}</div>}
      </div>
    </div>
  );
} 