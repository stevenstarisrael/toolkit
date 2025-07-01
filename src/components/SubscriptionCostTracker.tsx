import { useState, useEffect } from 'react';

interface Subscription {
  name: string;
  amount: string;
  period: 'month' | 'year';
}

export default function SubscriptionCostTracker() {
  const [subs, setSubs] = useState<Subscription[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('subscriptionCostTrackerSubs');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return [];
  });

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'month' | 'year'>('month');

  // Store to localStorage
  useEffect(() => {
    localStorage.setItem('subscriptionCostTrackerSubs', JSON.stringify(subs));
  }, [subs]);

  const addSub = () => {
    if (!name || !amount) return;
    setSubs([...subs, { name, amount, period }]);
    setName('');
    setAmount('');
    setPeriod('month');
  };
  const removeSub = (idx: number) => setSubs(subs.filter((_, i) => i !== idx));

  const totalPerMonth = subs.reduce((sum, s) => sum + (parseFloat(s.amount) / (s.period === 'year' ? 12 : 1)), 0);
  const totalPerYear = subs.reduce((sum, s) => sum + (parseFloat(s.amount) * (s.period === 'month' ? 12 : 1)), 0);

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-200 mb-6">Subscription Cost Tracker</h2>
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex flex-wrap gap-2 w-full">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Subscription name" className="flex-1 min-w-[120px] px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="w-30 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <select value={period} onChange={e => setPeriod(e.target.value as any)} className="px-3 py-2 rounded bg-white/20 border border-white/20 text-white focus:outline-none">
              <option value="month">/month</option>
              <option value="year">/year</option>
            </select>
            <button
              onClick={addSub}
              className="px-4 py-2 rounded bg-white/20 border border-white/20 text-white font-bold shadow hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-teal-500/20 transition focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-auto whitespace-nowrap"
            >Add</button>
          </div>
        </div>
        <div className="mb-4">
          {subs.length === 0 ? (
            <div className="text-purple-200/70 text-center">No subscriptions added.</div>
          ) : (
            <ul className="divide-y divide-white/10">
              {subs.map((s, i) => (
                <li key={i} className="flex items-center justify-between py-2">
                  <span className="text-white">{s.name}</span>
                  <span className="text-purple-200">₹{s.amount} / {s.period}</span>
                  <button
                    onClick={() => removeSub(i)}
                    className="ml-2 px-2 py-1 rounded bg-white/20 border border-white/20 text-white text-xs shadow hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-teal-500/20 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-6">
          <div className="text-lg text-teal-300 font-semibold bg-white/10 rounded p-3 text-center">Total per month: ₹{totalPerMonth.toFixed(2)}</div>
          <div className="text-lg text-purple-300 font-semibold bg-white/10 rounded p-3 text-center">Total per year: ₹{totalPerYear.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
} 