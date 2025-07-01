import { useState } from 'react';

function calculateDiff(date1: string, date2: string) {
  if (!date1 || !date2) return null;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  if (d2 < d1) return null;
  let years = d2.getFullYear() - d1.getFullYear();
  let months = d2.getMonth() - d1.getMonth();
  let days = d2.getDate() - d1.getDate();
  if (days < 0) {
    months--;
    days += new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}

export default function DateDifferenceCalculator() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const diff = calculateDiff(from, to);
  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-6 shadow-2xl mt-6">
      <h3 className="text-xl font-bold text-purple-200 mb-4">Date Difference Calculator</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-purple-100 mb-1 text-sm">From Date</label>
          <input
            type="date"
            className="w-48 p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400"
            value={from}
            onChange={e => setFrom(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-purple-100 mb-1 text-sm">To Date</label>
          <input
            type="date"
            className="w-48 p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400"
            value={to}
            onChange={e => setTo(e.target.value)}
          />
        </div>
      </div>
      {diff && (
        <div className="mt-4 text-lg text-purple-200">
          <div><span className="font-semibold text-white">{diff.years}</span> years</div>
          <div><span className="font-semibold text-white">{diff.months}</span> months</div>
          <div><span className="font-semibold text-white">{diff.days}</span> days</div>
        </div>
      )}
    </div>
  );
} 