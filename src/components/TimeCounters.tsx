import { useState, useEffect, useRef } from 'react';

interface TimeCounter {
  id: string;
  title: string;
  description: string;
  target: string; // ISO string
}

function getNow() {
  return new Date();
}

function getTimeDiff(target: string) {
  const now = getNow();
  const tgt = new Date(target);
  const diff = tgt.getTime() - now.getTime();
  return diff;
}

export default function TimeCounters() {
  const [counters, setCounters] = useState<TimeCounter[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('timeCounters') || '[]');
    } catch {
      return [];
    }
  });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');
  const [, setNow] = useState(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    intervalRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    localStorage.setItem('timeCounters', JSON.stringify(counters));
  }, [counters]);

  function addCounter() {
    if (!title || !target) return;
    setCounters(cs => [
      ...cs,
      {
        id: Math.random().toString(36).slice(2),
        title,
        description,
        target,
      },
    ]);
    setTitle('');
    setDescription('');
    setTarget('');
  }

  function removeCounter(id: string) {
    setCounters(cs => cs.filter(c => c.id !== id));
  }

  // Split and sort counters
  const nowDate = getNow();
  const comingUp = counters
    .filter(c => new Date(c.target) > nowDate)
    .sort((a, b) => new Date(a.target).getTime() - new Date(b.target).getTime());
  const elapsed = counters
    .filter(c => new Date(c.target) <= nowDate)
    .sort((a, b) => new Date(b.target).getTime() - new Date(a.target).getTime());

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-200 mb-6">Time Counters</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-3 py-2 rounded bg-transparent border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-2"
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-3 py-2 rounded bg-transparent border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-2 resize-none"
            rows={2}
          />
          <input
            type="datetime-local"
            value={target}
            onChange={e => setTarget(e.target.value)}
            className="w-full px-3 py-2 rounded bg-transparent border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-2"
          />
          <button
            onClick={addCounter}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl w-full sm:w-auto"
            disabled={!title || !target}
          >
            Add Counter
          </button>
        </div>
      </div>
      {(comingUp.length > 0 || elapsed.length > 0) && (
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {comingUp.length > 0 && (
            <div className={elapsed.length === 0 ? 'w-full' : 'flex-1'}>
              <h3 className="text-lg font-bold text-teal-200 mb-4 text-center">Coming Up</h3>
              <div className={elapsed.length === 0 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}>
                {comingUp.map(counter => {
                  const diff = getTimeDiff(counter.target);
                  const abs = Math.abs(diff);
                  const s = Math.floor(abs / 1000) % 60;
                  const m = Math.floor(abs / 1000 / 60) % 60;
                  const h = Math.floor(abs / 1000 / 60 / 60) % 24;
                  const d = Math.floor(abs / 1000 / 60 / 60 / 24);
                  return (
                    <div key={counter.id} className="bg-white/10 border border-white/10 rounded-xl p-4 flex flex-col gap-2 mb-4 relative">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-semibold text-white">{counter.title}</div>
                          {counter.description && <div className="text-purple-200/80 text-sm mb-1">{counter.description}</div>}
                        </div>
                        <button
                          onClick={() => removeCounter(counter.id)}
                          className="ml-2 px-2 py-1 rounded bg-white/20 border border-white/20 text-white text-xs shadow hover:bg-gradient-to-br hover:from-red-500/20 hover:to-pink-500/20 transition focus:outline-none focus:ring-2 focus:ring-red-400"
                        >Remove</button>
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <div className="text-teal-300 font-semibold text-base mb-2">Coming up in:</div>
                        <div className="flex gap-2 justify-center">
                          {d > 0 && (
                            <div className="flex flex-col items-center"><span className="text-2xl font-bold text-white">{d}</span><span className="text-xs text-purple-200">d</span></div>
                          )}
                          <div className="flex flex-col items-center"><span className="text-2xl font-bold text-white">{h.toString().padStart(2, '0')}</span><span className="text-xs text-purple-200">h</span></div>
                          <div className="flex flex-col items-center"><span className="text-2xl font-bold text-white">{m.toString().padStart(2, '0')}</span><span className="text-xs text-purple-200">m</span></div>
                          <div className="flex flex-col items-center"><span className="text-2xl font-bold text-white">{s.toString().padStart(2, '0')}</span><span className="text-xs text-purple-200">s</span></div>
                        </div>
                      </div>
                      <div className="text-xs text-purple-300/60 mt-1 text-right">
                        Target: {new Date(counter.target).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {elapsed.length > 0 && (
            <div className={comingUp.length === 0 ? 'w-full' : 'flex-1'}>
              <h3 className="text-lg font-bold text-purple-200 mb-4 text-center">Elapsed</h3>
              <div className={comingUp.length === 0 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}>
                {elapsed.map(counter => {
                  const diff = getTimeDiff(counter.target);
                  const abs = Math.abs(diff);
                  const s = Math.floor(abs / 1000) % 60;
                  const m = Math.floor(abs / 1000 / 60) % 60;
                  const h = Math.floor(abs / 1000 / 60 / 60) % 24;
                  const d = Math.floor(abs / 1000 / 60 / 60 / 24);
                  return (
                    <div key={counter.id} className="bg-white/10 border border-white/10 rounded-xl p-4 flex flex-col gap-2 mb-4 relative">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-semibold text-white">{counter.title}</div>
                          {counter.description && <div className="text-purple-200/80 text-sm mb-1">{counter.description}</div>}
                        </div>
                        <button
                          onClick={() => removeCounter(counter.id)}
                          className="ml-2 px-2 py-1 rounded bg-white/20 border border-white/20 text-white text-xs shadow hover:bg-gradient-to-br hover:from-red-500/20 hover:to-pink-500/20 transition focus:outline-none focus:ring-2 focus:ring-red-400"
                        >Remove</button>
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <div className="text-purple-200 font-semibold text-base mb-2">Elapsed:</div>
                        <div className="flex gap-2 justify-center">
                          {d > 0 && (
                            <div className="flex flex-col items-center"><span className="text-2xl font-bold text-white">{d}</span><span className="text-xs text-purple-200">d</span></div>
                          )}
                          <div className="flex flex-col items-center"><span className="text-2xl font-bold text-white">{h.toString().padStart(2, '0')}</span><span className="text-xs text-purple-200">h</span></div>
                          <div className="flex flex-col items-center"><span className="text-2xl font-bold text-white">{m.toString().padStart(2, '0')}</span><span className="text-xs text-purple-200">m</span></div>
                          <div className="flex flex-col items-center"><span className="text-2xl font-bold text-white">{s.toString().padStart(2, '0')}</span><span className="text-xs text-purple-200">s</span></div>
                        </div>
                      </div>
                      <div className="text-xs text-purple-300/60 mt-1 text-right">
                        Target: {new Date(counter.target).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 