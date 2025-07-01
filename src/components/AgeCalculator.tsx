import { useState } from 'react';
import DateDifferenceCalculator from './DateDifferenceCalculator';

function calculateAge(dob: string) {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  if (days < 0) {
    months--;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}

export default function AgeCalculator() {
  const [dob, setDob] = useState('');
  const age = calculateAge(dob);
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-purple-200 mb-4">Age Calculator</h2>
            <label className="block text-purple-100 mb-2">Date of Birth</label>
            <input
              type="date"
              className="w-48 p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400"
              value={dob}
              onChange={e => setDob(e.target.value)}
            />
          {age && (
            <div className="mt-4 text-lg text-purple-200">
              <div><span className="font-semibold text-white">{age.years}</span> years</div>
              <div><span className="font-semibold text-white">{age.months}</span> months</div>
              <div><span className="font-semibold text-white">{age.days}</span> days</div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <DateDifferenceCalculator />
      </div>
    </div>
  );
} 