import { useState } from 'react';

export default function TextToUrl() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  // WhatsApp Message Generator
  const [waCountry, setWaCountry] = useState('91');
  const [waPhone, setWaPhone] = useState('');
  const [waCountryTouched, setWaCountryTouched] = useState(false);
  const [waPhoneTouched, setWaPhoneTouched] = useState(false);
  const [waMsg, setWaMsg] = useState('');
  const [waResult, setWaResult] = useState('');

  const convert = () => {
    setOutput(encodeURIComponent(input));
  };

  // Validation helpers
  function isValidCountryCode(code: string) {
    return /^\d{1,4}$/.test(code);
  }
  function isValidPhone(phone: string) {
    return /^\d{6,15}$/.test(phone);
  }
  const waCountryValid = isValidCountryCode(waCountry);
  const waPhoneValid = isValidPhone(waPhone);
  const waError = !waCountryValid
    ? 'Country code must be 1-4 digits.'
    : !waPhoneValid
      ? 'Phone number must be 6-15 digits.'
      : '';

  const generateWa = () => {
    if (!waCountry || !waPhone || !waMsg || !waCountryValid || !waPhoneValid) {
      setWaResult('');
      return;
    }
    const msg = encodeURIComponent(waMsg);
    setWaResult(`https://wa.me/${waCountry}${waPhone}?text=${msg}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-purple-200 mb-4">Text to URL Format</h2>
          <textarea
            className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[120px] max-h-[320px] p-3 rounded-lg border border-purple-400 mb-2"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your text here.."
          />
          <div className="flex gap-2 mb-2">
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
              onClick={convert}
              disabled={!input}
            >
              Convert
            </button>
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
              onClick={() => { setInput(''); setOutput(''); }}
              disabled={!input && !output}
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

          {/* WhatsApp Message Generator */}
          <div className="mt-8 border-t border-purple-400/30 pt-6">
            <h3 className="text-lg font-semibold text-purple-200 mb-4">WhatsApp Message Link Generator</h3>
            <div className="flex flex-wrap gap-4 mb-2 items-end">
              <div>
                <label className="block text-purple-100 mb-1 text-sm">Country Code</label>
                <input
                  type="text"
                  className="w-24 p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400"
                  value={waCountry}
                  onChange={e => {
                    setWaCountry(e.target.value.replace(/\D/g, ''));
                    setWaCountryTouched(true);
                  }}
                  placeholder="91"
                />
              </div>
              <div>
                <label className="block text-purple-100 mb-1 text-sm">Phone Number</label>
                <input
                  type="text"
                  className="w-32 p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400"
                  value={waPhone}
                  onChange={e => {
                    setWaPhone(e.target.value.replace(/\D/g, ''));
                    setWaPhoneTouched(true);
                  }}
                  placeholder="9876543210"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-purple-100 mb-1 text-sm">Message</label>
                <input type="text" className="w-full p-3 rounded-lg bg-transparent text-white placeholder-purple-300/60 border border-purple-400 outline-none focus:ring-2 focus:ring-purple-400" value={waMsg} onChange={e => setWaMsg(e.target.value)} placeholder="Type your message.." />
              </div>
              <button
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
                onClick={generateWa}
                disabled={!waCountry || !waPhone || !waMsg || !waCountryValid || !waPhoneValid}
              >
                Generate Link
              </button>
            </div>
            <input
              className="w-full bg-transparent text-white placeholder-purple-300/60 outline-none text-lg leading-relaxed p-3 rounded-lg border border-purple-400 mt-2"
              value={waResult}
              readOnly
              placeholder="WhatsApp wa.me link will appear here.."
              onFocus={e => e.target.select()}
            />
            {waResult && (
              <a
                href={waResult}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-teal-300 underline hover:text-teal-200 text-sm"
              >
                Open WhatsApp Link
              </a>
            )}
            {waError && ((waCountryTouched && !waCountryValid) || (waPhoneTouched && !waPhoneValid)) && (
              <div className="text-red-400 text-sm mt-2">{waError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 