import { useState } from 'react';

export default function FuelCostEstimator() {
  const [distance, setDistance] = useState('');
  const [mileage, setMileage] = useState('');
  const [price, setPrice] = useState('');

  let result = '';
  let perKm = '';
  const d = parseFloat(distance);
  const m = parseFloat(mileage);
  const p = parseFloat(price);
  if (!isNaN(d) && !isNaN(m) && !isNaN(p) && m > 0) {
    const litres = d / m;
    const cost = litres * p;
    const costPerKm = p / m;
    result = `Fuel cost for ${d} km = ₹${cost.toFixed(2)}`;
    perKm = `Cost per km = ₹${costPerKm.toFixed(2)}`;
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-200 mb-6">Fuel Cost Estimator</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 items-center w-full">
            <input type="number" min="0" value={distance} onChange={e => setDistance(e.target.value)} placeholder="Distance (km)" className="w-45 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <input type="number" min="0" value={mileage} onChange={e => setMileage(e.target.value)} placeholder="Mileage (km/L)" className="w-45 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price/Litre (₹)" className="w-45 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
        </div>
        {result && (
          <div className="flex flex-col gap-2 mt-4">
            <div className="text-lg text-teal-300 font-semibold bg-white/10 rounded p-4 text-center">{result}</div>
            <div className="text-base text-purple-200 font-semibold bg-white/10 rounded p-3 text-center">{perKm}</div>
          </div>
        )}
      </div>
    </div>
  );
} 