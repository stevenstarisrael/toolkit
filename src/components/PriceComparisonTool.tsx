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
  { label: 'hour', factor: 1 },
  { label: 'day', factor: 1 },
  { label: 'week', factor: 1 },
  { label: 'month', factor: 1 },
  { label: 'year', factor: 1 },
  { label: 'unit', factor: 1 },
];

function getBothPerUnitPrices(price: number, qty: number, unit: string) {
  // Returns { perBase, perLarge, baseUnit, largeUnit }
  if (unit === 'g' || unit === 'kg') {
    const qtyInG = unit === 'g' ? qty : qty * 1000;
    const qtyInKg = unit === 'kg' ? qty : qty / 1000;
    const perG = qtyInG > 0 ? price / qtyInG : 0;
    const perKg = qtyInKg > 0 ? price / qtyInKg : 0;
    return {
      perBase: perG,
      perLarge: perKg,
      baseUnit: 'g',
      largeUnit: 'kg',
    };
  } else if (unit === 'ml' || unit === 'L') {
    const qtyInMl = unit === 'ml' ? qty : qty * 1000;
    const qtyInL = unit === 'L' ? qty : qty / 1000;
    const perMl = qtyInMl > 0 ? price / qtyInMl : 0;
    const perL = qtyInL > 0 ? price / qtyInL : 0;
    return {
      perBase: perMl,
      perLarge: perL,
      baseUnit: 'ml',
      largeUnit: 'L',
    };
  } else if (unit === 'hour') {
    // per day (24 hours), per day (for display)
    const days = qty / 24;
    const perDay = days > 0 ? price / days : 0;
    const perYear = days > 0 ? price / (days / 365) : 0;
    return {
      perBase: perDay,
      perLarge: perYear,
      baseUnit: 'day',
      largeUnit: 'year',
    };
  } else if (unit === 'day') {
    // per day, per year (365 days)
    const perDay = qty > 0 ? price / qty : 0;
    const perYear = qty > 0 ? price / (qty / 365) : 0;
    return {
      perBase: perDay,
      perLarge: perYear,
      baseUnit: 'day',
      largeUnit: 'year',
    };
  } else if (unit === 'week') {
    // per day, per year (1 week = 7 days, 1 year = 365 days)
    const days = qty * 7;
    const perDay = days > 0 ? price / days : 0;
    const perYear = days > 0 ? price / (days / 365) : 0;
    return {
      perBase: perDay,
      perLarge: perYear,
      baseUnit: 'day',
      largeUnit: 'year',
    };
  } else if (unit === 'month') {
    // per day, per year (1 month = 30.44 days, 1 year = 365 days)
    const days = qty * 30.44;
    const perDay = days > 0 ? price / days : 0;
    const perYear = days > 0 ? price / (days / 365) : 0;
    return {
      perBase: perDay,
      perLarge: perYear,
      baseUnit: 'day',
      largeUnit: 'year',
    };
  } else if (unit === 'year') {
    // per day, per year (1 year = 365 days)
    const days = qty * 365;
    const perDay = days > 0 ? price / days : 0;
    const perYear = days > 0 ? price / (days / 365) : 0;
    return {
      perBase: perDay,
      perLarge: perYear,
      baseUnit: 'day',
      largeUnit: 'year',
    };
  } else if (unit === 'unit') {
    // per 1 unit, per 100 units
    const per1 = qty > 0 ? price / qty : 0;
    const per100 = qty > 0 ? price / (qty / 100) : 0;
    return {
      perBase: per1,
      perLarge: per100,
      baseUnit: '1 unit',
      largeUnit: '100 units',
    };
  }
  return { perBase: 0, perLarge: 0, baseUnit: unit, largeUnit: unit };
}

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
    // Do not reset unit; persist last picked
    // setUnit('g');
  };
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  // For comparison, use per-base value for all units
  const perBasePrices = items.map(i => {
    const qtyNum = parseFloat(i.qty);
    const priceNum = parseFloat(i.price);
    const { perBase } = getBothPerUnitPrices(priceNum, qtyNum, i.unit);
    return perBase > 0 ? perBase : Infinity;
  });
  const min = Math.min(...perBasePrices);
  const max = Math.max(...perBasePrices);

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
                const qtyNum = parseFloat(i.qty);
                const priceNum = parseFloat(i.price);
                const { perBase, perLarge, baseUnit, largeUnit } = getBothPerUnitPrices(priceNum, qtyNum, i.unit);
                // For highlighting, compare per-base value
                const isMin = perBase === min;
                const isMax = perBase === max;
                return (
                  <li key={idx} className={`px-2 py-2 ${isMin ? 'bg-teal-900/30' : isMax ? 'bg-red-900/20' : ''} rounded`}>
                    <div className="flex items-center justify-between">
                      <span className="text-white truncate">₹{i.price} for {i.qty}{i.unit}</span>
                      <button
                        onClick={() => removeItem(idx)}
                        className="ml-2 px-2 py-1 rounded bg-white/20 border border-white/20 text-white text-xs shadow hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-teal-500/20 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >Remove</button>
                    </div>
                    <div className={`grid grid-cols-2 text-xs ${isMin ? 'text-teal-300' : isMax ? 'text-red-300' : 'text-purple-200'} mt-1`}>
                      <span>₹{perBase.toFixed(2)} per {baseUnit}</span>
                      <span>₹{perLarge.toFixed(2)} per {largeUnit}</span>
                    </div>
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