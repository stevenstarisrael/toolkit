import { useRef, useState, useEffect } from 'react';

const LANGUAGES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'te-IN', name: 'Telugu' },
  { code: 'mr-IN', name: 'Marathi' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'bn-IN', name: 'Bengali' },
  { code: 'pa-IN', name: 'Punjabi' },
  { code: 'gu-IN', name: 'Gujarati' },
  { code: 'ur-PK', name: 'Urdu' },
  // Add more as needed
];

export default function SpeechToText() {
  const [output, setOutput] = useState('');
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('speechToTextLang');
      if (storedLang && LANGUAGES.some(l => l.code === storedLang)) {
        return storedLang;
      }
    }
    return 'en-US';
  });
  const [continuous, setContinuous] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Store language to localStorage
  useEffect(() => {
    localStorage.setItem('speechToTextLang', lang);
  }, [lang]);

  const isSupported = typeof window !== 'undefined' && (
    'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  );

  const getRecognition = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return null;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang;
    return recognition;
  };

  const startListening = () => {
    setError('');
    if (!continuous) setOutput('');
    const recognition = getRecognition();
    if (!recognition) {
      setError('Speech recognition is not supported in this browser. Please use Google Chrome.');
      return;
    }
    recognitionRef.current = recognition;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setOutput(prev => continuous && prev ? prev + ' ' + transcript : transcript);
    };
    recognition.onerror = (event: any) => {
      setError('Error: ' + event.error);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        {/* Main input container */}
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-purple-200 mb-4">Speech to Text (Multi-language)</h2>
          <div className="mb-4">
            <label className="block text-purple-100 mb-2">Select Language:</label>
            <select
              className="w-full bg-transparent text-white p-3 rounded-lg border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={lang}
              onChange={e => setLang(e.target.value)}
              disabled={listening}
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex items-center gap-4">
            <button
              className={`relative z-40 flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 disabled:from-gray-500/50 disabled:to-gray-400/50 rounded-full text-white text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed group/btn backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl ${listening ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={startListening}
              disabled={listening || !isSupported}
              style={{ pointerEvents: 'auto' }}
            >
              <span>{listening ? '🎙 Listening...' : '🎙 Start Listening'}</span>
            </button>
            {listening && (
              <button
                className="relative z-40 flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-slate-600/80 to-slate-700/80 hover:from-slate-600 hover:to-slate-700 rounded-full text-white text-sm font-medium transition-all duration-300 group/btn backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl"
                onClick={stopListening}
              >
                Stop
              </button>
            )}
          </div>
          <textarea
            className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[160px] max-h-[320px] p-3 rounded-lg border border-purple-400 mb-2"
            value={output}
            onChange={e => setOutput(e.target.value)}
            placeholder="Your speech will appear here.."
          />
          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-purple-200 text-sm select-none cursor-pointer">
              <span>Continuous Text</span>
              <span
                className={`relative inline-block w-10 h-6 transition duration-200 align-middle select-none ${listening ? 'opacity-60' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={continuous}
                  onChange={e => setContinuous(e.target.checked)}
                  disabled={listening}
                  className="sr-only peer"
                />
                <span
                  className={`block w-10 h-6 rounded-full transition-colors duration-300
                    ${continuous ? 'bg-gradient-to-r from-purple-500 to-teal-400' : 'bg-slate-600'}`}
                ></span>
                <span
                  className={`dot absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300
                    ${continuous ? 'translate-x-4' : ''}`}
                ></span>
              </span>
            </label>
            <button
              type="button"
              onClick={() => setOutput('')}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
              disabled={!output}
            >
              Clear
            </button>
          </div>
          {error && <div className="text-red-400 mt-2">{error}</div>}
          {!isSupported && (
            <div className="text-yellow-300 mt-4">Your browser does not support speech recognition. Please use Google Chrome.</div>
          )}
        </div>
      </div>
    </div>
  );
} 