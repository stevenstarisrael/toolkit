import { useState } from 'react';

export default function PercentageCalculator() {
  const [x, setX] = useState('');
  const [y, setY] = useState('');

  let percentOf = '';
  let percentValue = '';
  let timesOfY = '';
  let timesOfX = '';
  const xNum = parseFloat(x);
  const yNum = parseFloat(y);
  if (!isNaN(xNum) && !isNaN(yNum) && yNum !== 0) {
    percentOf = `${xNum} is ${(xNum / yNum * 100).toFixed(2)}% of ${yNum}`;
    percentValue = `${xNum}% of ${yNum} is ${(xNum / 100 * yNum).toFixed(2)}`;
    timesOfY = `${xNum} is ${(xNum / yNum).toFixed(2)} times of ${yNum}`;
    timesOfX = `${yNum} is ${(yNum / xNum).toFixed(2)} times of ${xNum}`;
  }

  return (
    <div className="w-full max-w-lg mx-auto px-6 py-10">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-200 mb-6">Percentage Calculator</h2>
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-wrap gap-2 items-center w-full">
            <input type="number" value={x} onChange={e => setX(e.target.value)} placeholder="X" className="w-32 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <input type="number" value={y} onChange={e => setY(e.target.value)} placeholder="Y" className="w-32 px-3 py-2 rounded bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
        </div>
        <div className="flex flex-col gap-2 text-purple-300 text-lg font-semibold">
          {percentOf && <div className="bg-white/10 rounded p-3 text-center">{percentOf}</div>}
          {percentValue && <div className="bg-white/10 rounded p-3 text-center">{percentValue}</div>}
          {timesOfY && <div className="bg-white/10 rounded p-3 text-center">{timesOfY}</div>}
          {timesOfY && <div className="bg-white/10 rounded p-3 text-center">{timesOfX}</div>}
        </div>
      </div>
    </div>
  );
} 