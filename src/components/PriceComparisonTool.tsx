import { useState } from 'react';

interface Item {
  price: string;
  qty: string;
  unit: string;
}

const units = [
  { label: 'g', factor: 1 },
  { label: 'kg', factor: 1000 },
  { label: 'ml', factor: 1 },
  { label: 'L', factor: 1000 },
];

export default function PriceComparisonTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('g');

  const addItem = () => {
    if (!price || !qty) return;
    setItems([...items, { price, qty, unit }]);
    setPrice('');
    setQty('');
    setUnit('g');
  };
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const getUnitFactor = (unit: string) => units.find(u => u.label === unit)?.factor || 1;

  const perUnitPrices = items.map(i => {
    const qtyNum = parseFloat(i.qty) * getUnitFactor(i.unit);
    const priceNum = parseFloat(i.price);
    return qtyNum > 0 ? priceNum / qtyNum : Infinity;
  });
  const min = Math.min(...perUnitPrices);
  const max = Math.max(...perUnitPrices);

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-200 mb-6">Price Comparison Tool</h2>
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex flex-wrap gap-2 w-full">
            <input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price (₹)" className="w-30 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <input type="number" min="0" value={qty} onChange={e => setQty(e.target.value)} placeholder="Quantity" className="w-30 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <select value={unit} onChange={e => setUnit(e.target.value)} className="px-3 py-2 rounded bg-white/20 border border-white/20 text-white focus:outline-none">
              {units.map(u => <option key={u.label} value={u.label}>{u.label}</option>)}
            </select>
            <button
              onClick={addItem}
              className="px-4 py-2 rounded bg-white/20 border border-white/20 text-white font-bold shadow hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-teal-500/20 transition focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-auto whitespace-nowrap"
            >Add</button>
          </div>
        </div>
        <div className="mb-4">
          {items.length === 0 ? (
            <div className="text-purple-200/70 text-center">No items added.</div>
          ) : (
            <ul className="divide-y divide-white/10">
              {items.map((i, idx) => {
                const qtyNum = parseFloat(i.qty) * getUnitFactor(i.unit);
                const priceNum = parseFloat(i.price);
                const perUnit = qtyNum > 0 ? priceNum / qtyNum : 0;
                const isMin = perUnit === min;
                const isMax = perUnit === max;
                return (
                  <li key={idx} className={`flex items-center justify-between px-2 py-2 ${isMin ? 'bg-teal-900/30' : isMax ? 'bg-red-900/20' : ''} rounded`}> 
                    <span className="text-white">₹{i.price} for {i.qty}{i.unit}</span>
                    <span className={`text-sm font-semibold ${isMin ? 'text-teal-300' : isMax ? 'text-red-300' : 'text-purple-200'}`}>₹{perUnit.toFixed(2)} per {i.unit}</span>
                    <button
                      onClick={() => removeItem(idx)}
                      className="ml-2 px-2 py-1 rounded bg-white/20 border border-white/20 text-white text-xs shadow hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-teal-500/20 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >Remove</button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="flex flex-col gap-2 mt-6">
            <div className="text-lg text-teal-300 font-semibold bg-white/10 rounded p-3 text-center">Lowest per-unit price: ₹{min.toFixed(2)}</div>
            <div className="text-lg text-red-300 font-semibold bg-white/10 rounded p-3 text-center">Highest per-unit price: ₹{max.toFixed(2)}</div>
          </div>
        )}
      </div>
    </div>
  );
} 