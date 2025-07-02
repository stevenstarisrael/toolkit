import { useState } from 'react';

export default function FuelCostEstimator() {
  const [distance, setDistance] = useState('');
  const [mileage, setMileage] = useState('');
  const [price, setPrice] = useState('');

  // EV fields
  const [evDistance, setEvDistance] = useState('');
  const [evRange, setEvRange] = useState('');
  const [evUnitPrice, setEvUnitPrice] = useState('');
  const [evBattery, setEvBattery] = useState('');

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

  // EV calculation
  let evResult = '';
  let evPerKm = '';
  let evPerCharge = '';
  const ed = parseFloat(evDistance);
  const er = parseFloat(evRange);
  const eup = parseFloat(evUnitPrice);
  const eb = parseFloat(evBattery);
  if (!isNaN(er) && !isNaN(eup) && !isNaN(eb) && er > 0 && eb > 0) {
    // Battery pack in kWh, price per unit (kWh)
    // Cost per full charge = battery pack (kWh) * price per kWh
    // Range per full charge = er
    // Cost per km = cost per full charge / range
    const costPerFullCharge = eb * eup;
    const costPerKm = costPerFullCharge / er;
    evPerCharge = `Cost per full charge = ₹${costPerFullCharge.toFixed(2)}`;
    evPerKm = `Cost per km = ₹${costPerKm.toFixed(2)}`;
    if (!isNaN(ed) && ed > 0) {
      // Number of charges = distance / range
      // Total cost = number of charges * cost per full charge
      const numCharges = ed / er;
      const totalCost = numCharges * costPerFullCharge;
      evResult = `EV cost for ${ed} km = ₹${totalCost.toFixed(2)}`;
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl mb-8">
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
      {/* EV Cost Estimator */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-200 mb-6">EV Cost Estimator</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 items-center w-full">
            <input type="number" min="0" value={evRange} onChange={e => setEvRange(e.target.value)} placeholder="Range (km/full charge)" className="w-45 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-green-400" />
            <input type="number" min="0" value={evBattery} onChange={e => setEvBattery(e.target.value)} placeholder="Battery Pack (kWh)" className="w-45 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-green-400" />
            <input type="number" min="0" value={evUnitPrice} onChange={e => setEvUnitPrice(e.target.value)} placeholder="Price per 1 unit (kWh) (₹)" className="w-45 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-green-400" />
            <input type="number" min="0" value={evDistance} onChange={e => setEvDistance(e.target.value)} placeholder="Distance (km)" className="w-45 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
        </div>
        {evResult || evPerCharge || evPerKm ? (
          <div className="flex flex-col gap-2 mt-4">
            {evResult && <div className="text-lg text-teal-300 font-semibold bg-white/10 rounded p-4 text-center">{evResult}</div>}
            {evPerCharge && <div className="text-base text-purple-200 font-semibold bg-white/10 rounded p-3 text-center">{evPerCharge}</div>}
            {evPerKm && <div className="text-base text-purple-200 font-semibold bg-white/10 rounded p-3 text-center">{evPerKm}</div>}
          </div>
        ) : null}
      </div>
    </div>
  );
} 