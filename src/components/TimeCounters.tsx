import { useState, useEffect, useRef } from 'react';
import { set, get } from 'idb-keyval';
import { toast } from 'sonner';

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

// Reminder types
const REPEAT_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'custom', label: 'Custom' },
];

function getNextReminderTime(date: Date, repeat: string, customValue: number, customUnit: string) {
  const d = new Date(date);
  switch (repeat) {
    case 'hourly': d.setHours(d.getHours() + 1); break;
    case 'daily': d.setDate(d.getDate() + 1); break;
    case 'weekly': d.setDate(d.getDate() + 7); break;
    case 'monthly': d.setMonth(d.getMonth() + 1); break;
    case 'yearly': d.setFullYear(d.getFullYear() + 1); break;
    case 'custom':
      if (customUnit === 'seconds') d.setSeconds(d.getSeconds() + customValue);
      if (customUnit === 'minutes') d.setMinutes(d.getMinutes() + customValue);
      if (customUnit === 'hours') d.setHours(d.getHours() + customValue);
      if (customUnit === 'days') d.setDate(d.getDate() + customValue);
      break;
    default: return null;
  }
  return d;
}

function canNotify() {
  return 'Notification' in window;
}

function requestNotificationPermission() {
  if (!canNotify()) return Promise.resolve('denied');
  if (Notification.permission === 'granted') return Promise.resolve('granted');
  return Notification.requestPermission();
}

// Move Reminder interface and helper functions above TimeCounters
interface Reminder {
  id: string;
  name: string;
  description?: string;
  datetime: string;
  repeat: string;
  customValue?: string;
  customUnit?: string;
  scheduled?: boolean;
  notified?: boolean;
}

function formatDateDMY(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

// 1. Add a helper to abbreviate repeat units
const REPEAT_UNIT_ABBREVIATIONS: Record<string, string> = {
  seconds: 'sec',
  minutes: 'min',
  hours: 'hr',
  days: 'day',
};

function getNextRepeatTime(rem: Reminder) {
  if (!rem.repeat || rem.repeat === 'none') return null;
  const now = new Date();
  let last = new Date(rem.datetime);

  if (rem.repeat === 'custom' && rem.customUnit === 'minutes') {
    const intervalMs = Number(rem.customValue) * 60 * 1000;
    const lastTime = last.getTime();
    const nowTime = now.getTime();
    const missed = Math.max(0, Math.ceil((nowTime - lastTime) / intervalMs));
    const nextTime = lastTime + missed * intervalMs;
    // If nextTime is not strictly greater than now, add one more interval
    return new Date(nextTime > nowTime ? nextTime : nextTime + intervalMs);
  }

  let next = getNextReminderTime(last, rem.repeat, Number(rem.customValue), rem.customUnit!);
  if (!next) return null;
  while (next < now) {
    next = getNextReminderTime(next, rem.repeat, Number(rem.customValue), rem.customUnit!);
    if (!next) return null;
  }
  return next;
}
function formatRelativeTime(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return 'now';
  const s = Math.floor(diff / 1000) % 60;
  const m = Math.floor(diff / 1000 / 60) % 60;
  const h = Math.floor(diff / 1000 / 60 / 60) % 24;
  const d = Math.floor(diff / 1000 / 60 / 60 / 24);
  let str = '';
  if (d > 0) str += `${d}d `;
  if (h > 0) str += `${h}h `;
  if (m > 0) str += `${m}m `;
  if (s > 0 && d === 0 && h === 0) str += `${s}s`;
  return str.trim();
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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

  // Reminders state
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const remindersLoaded = useRef(false);
  const todayStr = new Date().toISOString().slice(0, 10);
  const [reminderName, setReminderName] = useState('');
  const [reminderDesc, setReminderDesc] = useState('');
  const [reminderDate, setReminderDate] = useState(todayStr);
  const [reminderTime, setReminderTime] = useState('');
  const [reminderRepeat, setReminderRepeat] = useState('none');
  const [customRepeatValue, setCustomRepeatValue] = useState('');
  const [customRepeatUnit, setCustomRepeatUnit] = useState('minutes');
  const [notifStatus, setNotifStatus] = useState(Notification.permission);

  useEffect(() => {
    intervalRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    localStorage.setItem('timeCounters', JSON.stringify(counters));
  }, [counters]);

  // Load reminders from IndexedDB on mount (only if not already loaded)
  useEffect(() => {
    if (!remindersLoaded.current) {
      get('reminders').then((data: Reminder[] | undefined) => {
        if (data && data.length > 0) setReminders(data);
        remindersLoaded.current = true;
      });
    }
  }, []);
  // Save reminders to IndexedDB
  useEffect(() => {
    set('reminders', reminders);
  }, [reminders]);
  // On page load, check for due reminders and show notifications for any missed ones
  useEffect(() => {
    if (!canNotify() || notifStatus !== 'granted') return;
    const now = Date.now();
    setReminders((rs: Reminder[]) => rs.map((rem: Reminder) => {
      const target = new Date(rem.datetime).getTime();
      // Only mark as notified if not repeating
      if (!rem.notified && target <= now && (!rem.repeat || rem.repeat === 'none')) {
        console.log('Marking as notified (missed, non-repeating):', rem);
        return { ...rem, notified: true };
      }
      if (!rem.notified && target <= now && rem.repeat && rem.repeat !== 'none') {
        console.log('NOT marking as notified (missed, repeating):', rem);
      }
      return rem;
    }));
  }, [notifStatus]);

  // On mount, check notification permission
  useEffect(() => {
    if (canNotify()) setNotifStatus(Notification.permission);
  }, []);

  // Real-time check for due reminders every 1 second
  useEffect(() => {
    if (!canNotify() || notifStatus !== 'granted') return;
    const interval = setInterval(() => {
      setReminders((prevReminders: Reminder[]) => {
        // console.log('All reminders in state:', prevReminders);
        let updated = false;
        const now = Date.now();
        const newReminders = prevReminders.map(rem => {
          const target = new Date(rem.datetime).getTime();
          // console.log('Checking reminder:', rem, 'now:', now, 'target:', target, 'notified:', rem.notified);
          if (!rem.notified && target <= now) {
            // console.log('Triggering notification for:', rem);
            showNotification(rem.name, { body: rem.description || undefined });
            if (rem.repeat && rem.repeat !== 'none') {
              let next = new Date();
              switch (rem.repeat) {
                case 'hourly': next.setHours(next.getHours() + 1); break;
                case 'daily': next.setDate(next.getDate() + 1); break;
                case 'weekly': next.setDate(next.getDate() + 7); break;
                case 'monthly': next.setMonth(next.getMonth() + 1); break;
                case 'yearly': next.setFullYear(next.getFullYear() + 1); break;
                case 'custom':
                  // if (rem.customUnit === 'seconds') next.setSeconds(next.getSeconds() + Number(rem.customValue));
                  if (rem.customUnit === 'minutes') next.setMinutes(next.getMinutes() + Number(rem.customValue));
                  if (rem.customUnit === 'hours') next.setHours(next.getHours() + Number(rem.customValue));
                  if (rem.customUnit === 'days') next.setDate(next.getDate() + Number(rem.customValue));
                  break;
              }
              updated = true;
              // For repeating reminders, keep notified: false so it will trigger again at the next repeat
              return { ...rem, datetime: next.toISOString(), notified: false };
            } else {
              updated = true;
              return { ...rem, notified: true };
            }
          }
          return rem;
        });
        return updated ? newReminders : prevReminders;
      });
    }, 5000); // 1 second interval
    return () => clearInterval(interval);
  }, [notifStatus]);

  function showToast(message: string) {
    toast(message);
  }

  function showNotification(title: string, options: NotificationOptions) {
    if (canNotify() && Notification.permission === 'granted') {
      new Notification(title, options);
    }
    // Only show alert if page is visible and not on mobile
    if (document.visibilityState === 'visible' && !isMobileDevice()) {
      window.alert(`${title}${options.body ? '\n' + options.body : ''}`);
    }
    // showToast(`${title}${options.body ? ': ' + options.body : ''}`);
  }

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

  function addReminder() {
    if (!reminderName || !reminderDate || !reminderTime) return;
    const datetime = new Date(reminderDate + 'T' + reminderTime);
    if (isNaN(datetime.getTime())) return;
    requestNotificationPermission().then(status => {
      setNotifStatus(status as NotificationPermission);
      if (status === 'granted') {
        setReminders((rs: Reminder[]) => [
          ...rs,
          {
            id: Math.random().toString(36).slice(2),
            name: reminderName,
            description: reminderDesc,
            datetime: datetime.toISOString(),
            repeat: reminderRepeat,
            customValue: customRepeatValue,
            customUnit: customRepeatUnit,
            scheduled: false,
            notified: false,
          },
        ]);
        setReminderName('');
        setReminderDesc('');
        setReminderDate(todayStr); // set to today after adding
        setReminderTime('');
        setReminderRepeat('none');
        setCustomRepeatValue('');
        setCustomRepeatUnit('minutes');
      }
    });
  }

  function removeReminder(id: string) {
    setReminders((rs: Reminder[]) => rs.filter((r: Reminder) => r.id !== id));
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

      {/* Divider above alerts/reminders */}
      <hr className="my-10 border-purple-400/30" />
      {/* Alerts and Reminders Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl mt-0">
        <h2 className="text-2xl font-bold text-purple-200 mb-2">Alerts & Reminders</h2>
        <div className="text-xs text-purple-300 mb-4">
          <b>Note:</b> Background notifications work best when the app is installed as a PWA and in supported browsers (e.g., Chrome, Edge). If your browser does not support background sync, reminders will only work while the app is open.
        </div>
        {notifStatus !== 'granted' && (
          <div className="bg-red-900/80 border border-red-400/40 text-red-200 rounded p-3 mb-4 text-sm text-center flex flex-col items-center gap-2">
            <div>
              <b>Notifications are not enabled.</b><br />
              Please enable notifications for this app in your <b>browser settings</b> and, if needed, in your <b>system settings</b> to receive alerts and reminders.
            </div>
            <div className="flex gap-3 mt-2">
              <button
                className="text-purple-200 underline hover:text-purple-100 transition text-xs font-semibold bg-transparent border-0 p-0 cursor-pointer"
                onClick={() => {
                  requestNotificationPermission().then(status => {
                    setNotifStatus(status as NotificationPermission);
                    if (status !== 'granted') {
                      showToast('Please allow notifications in your browser settings.');
                    }
                  });
                }}
              >
                Request Browser Permission
              </button>
              {isMobileDevice() && (
                <button
                  className="text-purple-200 underline hover:text-purple-100 transition text-xs font-semibold bg-transparent border-0 p-0 cursor-pointer"
                  onClick={() => {
                    // Try to open system notification settings, or show a toast with instructions
                    let opened = false;
                    if (/Android/i.test(navigator.userAgent)) {
                      window.open('intent://settings#Intent;scheme=android.settings.APP_NOTIFICATION_SETTINGS;end', '_blank');
                      opened = true;
                    } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                      showToast('Go to iOS Settings > Notifications > [Your Browser] to enable notifications.');
                      opened = true;
                    }
                    if (!opened) {
                      showToast('Please enable notifications in your system settings for this browser.');
                    }
                  }}
                >
                  Open System Notification Settings
                </button>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-3 mb-4">
          <input
            type="text"
            value={reminderName}
            onChange={e => setReminderName(e.target.value)}
            placeholder="Reminder Name"
            className="w-full px-3 py-2 rounded bg-transparent border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <textarea
            value={reminderDesc}
            onChange={e => setReminderDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-3 py-2 rounded bg-transparent border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            rows={2}
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="date"
              value={reminderDate}
              onChange={e => setReminderDate(e.target.value)}
              className="w-full sm:w-1/2 px-3 py-2 rounded bg-transparent border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <input
              type="time"
              value={reminderTime}
              onChange={e => setReminderTime(e.target.value)}
              className="w-full sm:w-1/2 px-3 py-2 rounded bg-transparent border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full">
            <label className="text-purple-200 text-sm mb-1 sm:mb-0">Repeat:</label>
            <select
              value={reminderRepeat}
              onChange={e => setReminderRepeat(e.target.value)}
              className="px-3 py-2 rounded bg-white/20 border border-white/20 text-white focus:outline-none w-full sm:w-auto"
            >
              {REPEAT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {reminderRepeat === 'custom' && (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="number"
                  min="1"
                  value={customRepeatValue}
                  onChange={e => setCustomRepeatValue(e.target.value)}
                  placeholder="Repeat every..."
                  className="w-full sm:w-24 px-3 py-2 rounded bg-transparent border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <select
                  value={customRepeatUnit}
                  onChange={e => setCustomRepeatUnit(e.target.value)}
                  className="px-3 py-2 rounded bg-white/20 border border-white/20 text-white focus:outline-none w-full sm:w-auto"
                >
                  {/* <option value="seconds">Seconds</option> */}
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            )}
          </div>
          <button
            onClick={addReminder}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl w-full sm:w-auto"
            disabled={!reminderName || !reminderDate || !reminderTime}
          >
            Add Reminder
          </button>
          {notifStatus !== 'granted' && (
            <div className="text-xs text-red-300 mt-1">Notifications are not enabled. Please allow notifications to receive alerts.</div>
          )}
        </div>
      </div>
      {reminders.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl mt-8">
          <div>
            <h2 className="text-2xl font-bold text-purple-200 mb-2">Your Reminders</h2>
            {/* Split reminders into Upcoming and Past */}
            {(() => {
              const now = Date.now();
              // Upcoming: unnotified and in the future, or repeating with next repeat in the future
              const upcoming = reminders.filter(rem => {
                if (!rem.notified && new Date(rem.datetime).getTime() > now) return true;
                const nextRepeat = getNextRepeatTime(rem);
                return nextRepeat && nextRepeat.getTime() > now;
              }).sort((a, b) => {
                // Sort by next due time
                const aNext = getNextRepeatTime(a) || new Date(a.datetime);
                const bNext = getNextRepeatTime(b) || new Date(b.datetime);
                return aNext.getTime() - bNext.getTime();
              });
              // Past: not in upcoming
              const past = reminders.filter(rem => !upcoming.includes(rem));
              return (
                <>
                  <div className="mb-8">
                    <h4 className="text-teal-200 font-semibold mb-2 text-center">Upcoming</h4>
                    {upcoming.length === 0 ? (
                      <div className="text-xs text-purple-300/60 text-center mb-4">No upcoming reminders.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcoming.map((rem: Reminder) => {
                          const nextRepeat = getNextRepeatTime(rem);
                          return (
                            <div key={rem.id} className="bg-white/10 border border-white/10 rounded-xl p-4 flex flex-col gap-2 relative h-full">
                              <div className="flex justify-between">
                                <div>
                                  <div className="text-white font-semibold">{rem.name}</div>
                                  {rem.description && <div className="text-purple-200/80 text-xs mb-1">{rem.description}</div>}
                                  <div className="text-xs text-purple-300/60">
                                    {formatDateDMY(rem.datetime)}
                                  </div>
                                </div>
                                <div>
                                  <button
                                    onClick={() => removeReminder(rem.id)}
                                    className="ml-2 px-2 py-1 rounded bg-white/20 border border-white/20 text-white text-xs shadow hover:bg-gradient-to-br hover:from-red-500/20 hover:to-pink-500/20 transition focus:outline-none focus:ring-2 focus:ring-red-400"
                                  >Remove</button>
                                </div>
                              </div>
                              {(rem.repeat && rem.repeat !== 'none') || nextRepeat ? (
                                <div className="text-xs mt-auto flex justify-between">
                                  {rem.repeat && rem.repeat !== 'none' && (
                                    <span className="text-teal-300">(Repeat: {rem.repeat === 'custom' ? `${rem.customValue} ${REPEAT_UNIT_ABBREVIATIONS[rem.customUnit!] || rem.customUnit}` : rem.repeat})</span>
                                  )}
                                  {nextRepeat && (
                                    <span className="ml-2 text-yellow-300">Next: in {formatRelativeTime(nextRepeat)}</span>
                                  )}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-purple-200 font-semibold mb-2 text-center">Past</h4>
                    {past.length === 0 ? (
                      <div className="text-xs text-purple-300/60 text-center mb-4">No past reminders.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {past.map((rem: Reminder) => {
                          const nextRepeat = getNextRepeatTime(rem);
                          return (
                            <div key={rem.id} className="bg-white/10 border border-white/10 rounded-xl p-4 flex flex-col gap-2 relative h-full opacity-70">
                              <div className="flex justify-between">
                                <div>
                                  <div className="text-white font-semibold">{rem.name}</div>
                                  {rem.description && <div className="text-purple-200/80 text-xs mb-1">{rem.description}</div>}
                                  <div className="text-xs text-purple-300/60">
                                    {formatDateDMY(rem.datetime)}
                                  </div>
                                </div>
                                <div>
                                  <button
                                    onClick={() => removeReminder(rem.id)}
                                    className="ml-2 px-2 py-1 rounded bg-white/20 border border-white/20 text-white text-xs shadow hover:bg-gradient-to-br hover:from-red-500/20 hover:to-pink-500/20 transition focus:outline-none focus:ring-2 focus:ring-red-400"
                                  >Remove</button>
                                </div>
                              </div>
                              {(rem.repeat && rem.repeat !== 'none') || nextRepeat ? (
                                <div className="text-xs mt-auto flex justify-between">
                                  {rem.repeat && rem.repeat !== 'none' && (
                                    <span className="text-teal-300">(Repeat: {rem.repeat === 'custom' ? `${rem.customValue} ${REPEAT_UNIT_ABBREVIATIONS[rem.customUnit!] || rem.customUnit}` : rem.repeat})</span>
                                  )}
                                  {nextRepeat && (
                                    <span className="ml-2 text-yellow-300">Next: in {formatRelativeTime(nextRepeat)}</span>
                                  )}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
} 