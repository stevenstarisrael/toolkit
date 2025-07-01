import { useState } from 'react';

export default function RecurringCostToDailyImpact() {
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'month' | 'year'>('month');

  let result = '';
  const amt = parseFloat(amount);
  if (!isNaN(amt)) {
    let perDay = 0;
    if (period === 'month') perDay = amt / 30;
    else perDay = amt / 365;
    result = `₹${perDay.toFixed(2)}/day`;
  }

  return (
    <div className="w-full max-w-lg mx-auto px-6 py-10">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-200 mb-6">Recurring Cost to Daily Impact</h2>
        <div className="flex flex-wrap gap-2 items-center w-full">
          <input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="w-45 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400" />
          <select value={period} onChange={e => setPeriod(e.target.value as any)} className="px-3 py-2 rounded bg-white/20 border border-white/20 text-white focus:outline-none">
            <option value="month">/month</option>
            <option value="year">/year</option>
          </select>
        </div>
        {result && <div className="text-lg text-teal-300 font-semibold bg-white/10 rounded p-4 text-center mt-4">{result}</div>}
      </div>
    </div>
  );
} 