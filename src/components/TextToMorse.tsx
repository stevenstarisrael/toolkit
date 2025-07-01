import { useState, useRef } from 'react';

const MORSE_CODE: Record<string, string> = {
  'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
  'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
  'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
  'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
  'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
  'Z': '--..',  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', ' ': '/',
};
const REVERSE_MORSE = Object.fromEntries(Object.entries(MORSE_CODE).map(([k, v]) => [v, k]));

function textToMorse(text: string) {
  return text.toUpperCase().split('').map(c => MORSE_CODE[c] || '').join(' ');
}
function morseToText(morse: string) {
  return morse.split(' ').map(m => REVERSE_MORSE[m] || '').join('');
}

const UNIT = 120; // ms for a dot

export default function TextToMorse() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [direction, setDirection] = useState<'text2morse' | 'morse2text'>('text2morse');
  const [playing, setPlaying] = useState(false);
  const [listening, setListening] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopPlaybackRef = useRef<() => void>();

  const convert = () => {
    setOutput(direction === 'text2morse' ? textToMorse(input) : morseToText(input));
  };

  // Morse playback logic
  const playMorse = async () => {
    if (!output) return;
    setPlaying(true);
    const morse = output.trim();
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.value = 0.2;
    let stopped = false;
    stopPlaybackRef.current = () => { stopped = true; ctx.close(); setPlaying(false); setHighlightIdx(null); };
    const symbols = morse.split('');
    const playSymbol = (i: number) => {
      if (stopped || i >= symbols.length) {
        setPlaying(false);
        setHighlightIdx(null);
        ctx.close();
        return;
      }
      const s = symbols[i];
      setHighlightIdx(i);
      let duration = UNIT;
      if (s === '.') duration = UNIT;
      else if (s === '-') duration = 3 * UNIT;
      else if (s === ' ') duration = UNIT;
      else if (s === '/') duration = 7 * UNIT;
      if (s === '.' || s === '-') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 700;
        osc.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + duration / 1000);
        osc.onended = () => {
          setTimeout(() => playSymbol(i + 1), UNIT);
        };
      } else {
        setTimeout(() => playSymbol(i + 1), duration + UNIT);
      }
    };
    playSymbol(0);
  };

  const stopMorse = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setPlaying(false);
    setHighlightIdx(null);
    if (stopPlaybackRef.current) stopPlaybackRef.current();
  };

  // Listen to Morse (microphone, amplitude detection)
  const listenMorse = async () => {
    setListening(true);
    setOutput('');
    setHighlightIdx(null);
    // Simple amplitude detection for beeps (not robust, demo only)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 2048;
    const data = new Uint8Array(analyser.fftSize);
    let lastOn = 0, lastOff = 0, morse = '';
    let listeningActive = true;
    let lastState: 'on' | 'off' = 'off';
    let lastChange = Date.now();
    const threshold = 30; // Lowered for more sensitivity
    const livePreview = (m: string) => {
      setOutput(m);
    };
    const listenLoop = () => {
      if (!listeningActive) return;
      analyser.getByteTimeDomainData(data);
      const avg = data.reduce((a, b) => a + Math.abs(b - 128), 0) / data.length;
      const now = Date.now();
      if (avg > threshold) {
        if (lastState === 'off') {
          // Transition: silence -> beep
          lastOn = now;
          // If silence was long, add space or slash
          const offDur = now - lastChange;
          if (offDur > 6 * UNIT) morse += ' /';
          else if (offDur > 2 * UNIT) morse += ' ';
          lastChange = now;
        }
        lastState = 'on';
      } else {
        if (lastState === 'on') {
          // Transition: beep -> silence
          lastOff = now;
          const onDur = now - lastChange;
          if (onDur > 2 * UNIT) morse += ' -';
          else if (onDur > 0) morse += ' .';
          lastChange = now;
        }
        lastState = 'off';
      }
      livePreview(morse.trim());
      setTimeout(listenLoop, 20);
    };
    listenLoop();
    stopPlaybackRef.current = () => { listeningActive = false; ctx.close(); stream.getTracks().forEach(t => t.stop()); setListening(false); };
    // After 10 seconds, stop listening and decode
    setTimeout(() => {
      listeningActive = false;
      ctx.close();
      stream.getTracks().forEach(t => t.stop());
      setListening(false);
      setOutput(morseToText(morse.trim()));
    }, 10000);
  };

  const stopListen = () => {
    if (stopPlaybackRef.current) stopPlaybackRef.current();
    setListening(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-purple-200 mb-4">Text &lt;-&gt; Morse Code</h2>
          <textarea
            className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[120px] max-h-[320px] p-3 rounded-lg border border-purple-400 mb-2"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={direction === 'text2morse' ? 'Enter text...' : 'Enter morse code (separate with spaces, / for space)...'}
            disabled={playing || listening}
          />
          <div className="flex flex-wrap gap-2 mb-2">
            <label className="flex items-center gap-2 text-purple-200 text-sm select-none cursor-pointer">
              <input type="radio" name="direction" value="text2morse" checked={direction === 'text2morse'} onChange={() => setDirection('text2morse')} className="accent-purple-500 w-4 h-4" disabled={playing || listening} />
              Text to Morse
            </label>
            <label className="flex items-center gap-2 text-purple-200 text-sm select-none cursor-pointer">
              <input type="radio" name="direction" value="morse2text" checked={direction === 'morse2text'} onChange={() => setDirection('morse2text')} className="accent-purple-500 w-4 h-4" disabled={playing || listening} />
              Morse to Text
            </label>
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl w-full sm:w-auto"
              onClick={convert}
              disabled={!input || playing || listening}
            >
              Convert
            </button>
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl w-full sm:w-auto"
              onClick={() => { setInput(''); setOutput(''); setHighlightIdx(null); }}
              disabled={(!input && !output) || playing || listening}
            >
              Clear
            </button>
          </div>
          <textarea
            className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[80px] max-h-[240px] p-3 rounded-lg border border-purple-400 mt-2"
            value={output}
            readOnly
            placeholder="Result will appear here.."
          />
          {/* Morse playback and listen controls */}
          {direction === 'text2morse' && output && (
            <div className="flex items-center gap-4 mt-4">
              <button
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
                onClick={playing ? stopMorse : playMorse}
                disabled={listening}
              >
                {playing ? 'Stop' : 'Play Morse'}
              </button>
            </div>
          )}
          {direction === 'text2morse' && output && (
            <div className="mt-4">
              <div className="bg-transparent rounded-lg p-4 border border-purple-400 text-lg overflow-x-auto whitespace-nowrap max-w-full">
                {output.split('').map((c, i) => (
                  <span key={i} className={highlightIdx === i ? 'bg-yellow-300 text-black rounded px-1' : ''}>{c}</span>
                ))}
              </div>
            </div>
          )}
          {direction === 'morse2text' && (
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-4">
                <button
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
                  onClick={listening ? stopListen : listenMorse}
                  disabled={playing}
                >
                  {listening ? 'Stop Listening' : 'Listen to Morse'}
                </button>
                {listening && (
                  <span className="text-yellow-300 animate-pulse">Listening...</span>
                )}
              </div>
              {listening && (
                <div className="mt-2">
                  <div className="bg-slate-900/80 rounded-lg p-4 border border-purple-400 text-lg overflow-x-auto whitespace-nowrap max-w-full">
                    {output ? output.split('').map((c, i) => (
                      <span key={i} className={c === '.' ? 'text-green-400' : c === '-' ? 'text-blue-400' : c === '/' ? 'text-pink-400' : 'text-white'}>{c}</span>
                    )) : <span className="text-purple-300">Waiting for beeps...</span>}
                  </div>
                  <div className="text-xs text-purple-300 mt-1">Live Morse preview (auto stops after 10s)</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 