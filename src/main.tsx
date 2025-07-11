import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!show) return null;
  return (
    <div className="fixed bottom-4 left-0 w-full flex justify-center sm:justify-end sm:pr-6 z-50 pointer-events-none">
      <div className="bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-2xl flex flex-col items-center max-w-xs w-full pointer-events-auto">
        <h3 className="text-lg font-bold text-purple-200 mb-1">Install Toolkit</h3>
        <p className="text-purple-100 mb-2 text-center text-sm">Add this app to your home screen for a better experience.</p>
        <div className="flex gap-2 w-full">
          <button
            className="flex-1 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 text-white text-sm shadow hover:from-purple-600 hover:to-teal-600 transition flex items-center justify-center gap-2"
            onClick={async () => {
              if (deferredPrompt) {
                deferredPrompt.prompt();
                const choice = await deferredPrompt.userChoice;
                if (choice.outcome === 'accepted') setShow(false);
              }
            }}
          >
            Install
          </button>
          <button
            className="flex-1 px-4 py-2 rounded-full bg-white/20 border border-white/20 text-purple-200 text-sm shadow hover:bg-white/30 transition flex items-center justify-center gap-2"
            onClick={() => setShow(false)}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/src/service-worker.js');
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <InstallPrompt />
  </React.StrictMode>
);
