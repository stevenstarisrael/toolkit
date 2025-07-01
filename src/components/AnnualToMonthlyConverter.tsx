import { useState } from 'react';

const units = [
  { label: '', factor: 1 },
  { label: 'Thousand', factor: 1_000 },
  { label: 'Lakh', factor: 1_00_000 },
  { label: 'Crore', factor: 1_00_00_000 },
];

export default function AnnualToMonthlyConverter() {
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('');

  let result = '';
  const amt = parseFloat(amount) * (units.find(u => u.label === unit)?.factor || 1);
  if (!isNaN(amt)) {
    const perMonth = amt / 12;
    let display = perMonth;
    let displayUnit = '';
    if (perMonth >= 1_00_00_000) {
      display = perMonth / 1_00_00_000;
      displayUnit = 'Cr';
    } else if (perMonth >= 1_00_000) {
      display = perMonth / 1_00_000;
      displayUnit = 'L';
    } else if (perMonth >= 1_000) {
      display = perMonth / 1_000;
      displayUnit = 'K';
    }
    result = `₹${display.toFixed(2)}${displayUnit}/month`;
  }

  return (
    <div className="w-full max-w-lg mx-auto px-6 py-10">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-200 mb-6">Annual to Monthly Converter</h2>
        <div className="flex flex-wrap gap-2 items-center w-full">
          <input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Annual amount" className="w-50 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400" />
          <select value={unit} onChange={e => setUnit(e.target.value)} className="px-3 py-2 rounded bg-white/20 border border-white/20 text-white focus:outline-none">
            {units.map(u => <option key={u.label} value={u.label}>{u.label || 'Number'}</option>)}
          </select>
        </div>
        {result && <div className="text-lg text-teal-300 font-semibold bg-white/10 rounded p-4 text-center mt-4">{result}</div>}
      </div>
    </div>
  );
} 