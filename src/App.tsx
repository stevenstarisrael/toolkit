import { Sparkles, Menu } from 'lucide-react';
import ParticleField from './components/ParticleField';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CharacterCount from './components/CharacterCount';
import SpeechToText from './components/SpeechToText';
import DummyTextGenerator from './components/DummyTextGenerator';
import AgeCalculator from './components/AgeCalculator';
import CaseConverter from './components/CaseConverter';
import WhitespaceRemover from './components/WhitespaceRemover';
import DuplicateLineRemover from './components/DuplicateLineRemover';
import TextSorter from './components/TextSorter';
import TextDiff from './components/TextDiff';
import TextToBinary from './components/TextToBinary';
import TextToAscii from './components/TextToAscii';
import TextToMorse from './components/TextToMorse';
import NumberToWords from './components/NumberToWords';
import RomanNumeral from './components/RomanNumeral';
import Base64Tool from './components/Base64Tool';
import TextHasher from './components/TextHasher';
import JsonFormatter from './components/JsonFormatter';
import XmlJson from './components/XmlJson';
import TextToUrl from './components/TextToUrl';
import { useState, useEffect, useRef } from 'react';
import SimpleInterestCalculator from './components/SimpleInterestCalculator';
import CompoundInterestCalculator from './components/CompoundInterestCalculator';
import EmiCalculator from './components/EmiCalculator';
import NoCostEmiCalculator from './components/NoCostEmiCalculator';
import EmojiFinder from './components/EmojiFinder';
import UnitConversionCostCalculator from './components/UnitConversionCostCalculator';
import SubscriptionCostTracker from './components/SubscriptionCostTracker';
import PriceComparisonTool from './components/PriceComparisonTool';
import FuelCostEstimator from './components/FuelCostEstimator';
import AnnualToMonthlyConverter from './components/AnnualToMonthlyConverter';
import RecurringCostToDailyImpact from './components/RecurringCostToDailyImpact';
import PercentageCalculator from './components/PercentageCalculator';
import TimeCounters from './components/TimeCounters';

const TOOL_CATEGORIES = [
  {
    name: 'Cost & Comparison Tools',
    tools: [
      { name: 'Price Comparison Tool', path: '/price-comparison', component: PriceComparisonTool, tags: ['price', 'comparison', 'quantity', 'math'], emoji: '💲' },
      { name: 'Unit Conversion Cost Calculator', path: '/unit-conversion-cost', component: UnitConversionCostCalculator, tags: ['unit', 'cost', 'conversion', 'grocery', 'math'], emoji: '⚖️' },
      { name: 'Subscription Cost Tracker', path: '/subscription-cost-tracker', component: SubscriptionCostTracker, tags: ['subscription', 'tracker', 'cost', 'monthly', 'yearly'], emoji: '💸' },
      { name: 'Fuel Cost Estimator', path: '/fuel-cost-estimator', component: FuelCostEstimator, tags: ['fuel', 'cost', 'estimator', 'travel'], emoji: '⛽' },
      { name: 'Annual to Monthly Converter', path: '/annual-to-monthly', component: AnnualToMonthlyConverter, tags: ['annual', 'monthly', 'converter', 'salary'], emoji: '📅' },
      { name: 'Recurring Cost to Daily Impact', path: '/recurring-to-daily', component: RecurringCostToDailyImpact, tags: ['recurring', 'daily', 'cost', 'impact'], emoji: '🔁' },
      { name: 'Percentage Calculator', path: '/percentage-calculator', component: PercentageCalculator, tags: ['percentage', 'calculator', 'math'], emoji: '📊' },
    ],
  },
  {
    name: 'Text Conversion',
    tools: [
      { name: 'Case Converter', path: '/case-converter', tags: ['case', 'upper', 'lower', 'title', 'sentence', 'camel', 'convert'], emoji: '🔠' },
      { name: 'Whitespace & Line Break Remover', path: '/whitespace-remover', tags: ['whitespace', 'line break', 'remove', 'text', 'clean'], emoji: '␣' },
      { name: 'Text <-> Binary', path: '/text-to-binary', tags: ['binary', 'text', 'convert', 'ascii', 'encode', 'decode'], emoji: '💾' },
      { name: 'Text <-> ASCII', path: '/text-to-ascii', tags: ['ascii', 'text', 'convert', 'binary', 'encode', 'decode'], emoji: '🔡' },
      { name: 'Text <-> Morse Code', path: '/text-to-morse', tags: ['morse', 'code', 'text', 'convert', 'audio', 'encode', 'decode'], emoji: '•–' },
      { name: 'Base64 Encode/Decode', path: '/base64', tags: ['base64', 'encode', 'decode', 'text', 'convert'], emoji: '🔐' },
      { name: 'Text Hasher', path: '/text-hasher', tags: ['hash', 'md5', 'sha1', 'sha256', 'text', 'security'], emoji: '🔑' },
      { name: 'Text to URL Format', path: '/text-to-url', tags: ['url', 'encode', 'text', 'link', 'whatsapp', 'wa.me'], emoji: '🔗' },
    ],
  },
  {
    name: 'Calculators & Converters',
    tools: [
      { name: 'Age Calculator', path: '/age-calculator', tags: ['age', 'date', 'birthday', 'years', 'calculator', 'dob'], emoji: '🎂' },
      { name: 'Number to Words Converter', path: '/number-to-words', tags: ['number', 'words', 'convert', 'math', 'calculator'], emoji: '🔢' },
      { name: 'Roman Numeral Converter', path: '/roman-numeral', tags: ['roman', 'numeral', 'convert', 'number', 'calculator'], emoji: '🏛️' },
      { name: 'Time Counters', path: '/time-counters', tags: ['time', 'countdown', 'countup', 'timer', 'clock', 'calculator'], emoji: '⏰' },
    ],
  },
  {
    name: 'Data Formatters & Generators',
    tools: [
      { name: 'Dummy Text Generator', path: '/dummy-text', tags: ['dummy', 'lorem', 'ipsum', 'text', 'generator', 'placeholder'], emoji: '📄' },
      { name: 'Emoji Finder', path: '/emoji-finder', tags: ['emoji', 'emojis', 'finder', 'search', 'copy', 'unicode', 'icon', 'smileys', 'symbols'], emoji: '😀' },
      { name: 'JSON Formatter / Minifier', path: '/json-formatter', tags: ['json', 'formatter', 'minifier', 'format', 'data'], emoji: '🔧' },
      { name: 'XML <-> JSON', path: '/xml-json', tags: ['xml', 'json', 'convert', 'data', 'formatter'], emoji: '🔄' },
    ],
  },
  {
    name: 'Financial Tools',
    tools: [
      { name: 'Simple Interest Calculator', path: '/simple-interest', tags: ['simple interest', 'finance', 'calculator', 'loan', 'interest'], emoji: '💰' },
      { name: 'Compound Interest Calculator', path: '/compound-interest', tags: ['compound interest', 'finance', 'calculator', 'loan', 'interest'], emoji: '📈' },
      { name: 'EMI (Loan) Calculator', path: '/emi-calculator', tags: ['emi', 'loan', 'finance', 'calculator', 'installment'], emoji: '💳' },
      { name: 'No Cost EMI Calculator', path: '/no-cost-emi', tags: ['emi', 'no cost', 'loan', 'finance', 'calculator', 'installment', 'gst', 'processing fee'], emoji: '🆓' },
    ],
  },
  {
    name: 'Text Analysis',
    tools: [
      { name: 'Character & Word Count', path: '/character-count', tags: ['character', 'word', 'count', 'text', 'analysis'], emoji: '🔢' },
      { name: 'Duplicate Line Remover', path: '/duplicate-line-remover', tags: ['duplicate', 'line', 'remove', 'text', 'clean'], emoji: '🚮' },
      { name: 'Text Diff Checker', path: '/text-diff', tags: ['diff', 'compare', 'text', 'difference', 'checker'], emoji: '📝' },
      { name: 'Text Sorter', path: '/text-sorter', tags: ['sort', 'text', 'lines', 'order', 'alphabetical'], emoji: '🔀' },
    ],
  },
  {
    name: 'Speech',
    tools: [
      { name: 'Speech to Text (Multi-language)', path: '/speech-to-text', tags: ['speech', 'text', 'voice', 'recognition', 'audio', 'language', 'english', 'hindi', 'telugu', 'marathi', 'spanish', 'french', 'german', 'chinese', 'mandarin', 'japanese', 'russian', 'arabic', 'portuguese', 'brazil', 'italian', 'korean', 'bengali', 'punjabi', 'gujarati', 'urdu'], emoji: '🎤' },
    ],
  },
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
        <ParticleField />
        {/* Parallax Fog Layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent animate-pulse-slow" />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-transparent to-purple-500/5 animate-drift-slow" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-float-delayed" />
        </div>
        <div className="relative z-10 min-h-screen flex flex-col">
          <header className="p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 relative z-50">
            <div className="flex items-center justify-between w-full md:w-auto space-x-3">
              <div className="flex items-center space-x-3">
                <Link to="/" className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition">
                  <Sparkles className="w-6 h-6 text-purple-300" />
                </Link>
                <Link to="/" className="text-2xl font-light text-white/90 tracking-wide hover:text-purple-200 transition">
                  ToolKit
                </Link>
              </div>
              {/* Mobile burger menu - right edge */}
              <div className="md:hidden flex items-center ml-auto">
                <button
                  className="p-2 rounded-full bg-white/10 border border-white/20 text-purple-200 hover:bg-white/20 transition"
                  onClick={() => setMobileMenuOpen(v => !v)}
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
            {/* Desktop nav */}
            <nav className="hidden md:flex flex-wrap gap-2 md:gap-4 items-center mt-2 md:mt-0">
              {TOOL_CATEGORIES.map((cat, idx) => {
                let closeTimeout: number;
                return (
                  <div
                    key={cat.name}
                    className="relative group flex flex-col items-center"
                    onMouseEnter={() => {
                      clearTimeout(closeTimeout);
                      setOpenDropdown(cat.name);
                    }}
                    onMouseLeave={() => {
                      closeTimeout = setTimeout(() => setOpenDropdown(null), 150);
                    }}
                  >
                    <button className="text-purple-200 hover:text-white px-3 py-1 rounded-full bg-white/5 hover:bg-purple-500/10 transition text-sm font-medium focus:outline-none">
                      {cat.name}
                    </button>
                    <div
                      className={`absolute ${idx === TOOL_CATEGORIES.length - 1 ? 'right-0' : 'left-0'} w-56 bg-slate-900/95 border border-white/10 rounded-xl shadow-xl transition-opacity duration-200 z-50 ${openDropdown === cat.name ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                      style={{ top: 'calc(100% + 4px)' }}
                      onMouseEnter={() => clearTimeout(closeTimeout)}
                      onMouseLeave={() => {
                        closeTimeout = setTimeout(() => setOpenDropdown(null), 150);
                      }}
                    >
                      <ul className="py-2">
                        {cat.tools.map(tool => (
                          <li key={tool.path}>
                            <Link to={tool.path} className="block px-4 py-2 text-purple-100 hover:bg-purple-500/10 hover:text-white rounded transition text-sm">
                              {tool.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </nav>
            {/* Mobile menu dropdown */}
            {mobileMenuOpen && (
              <div className="absolute top-full left-0 w-full bg-slate-900/95 border-t border-white/10 shadow-2xl rounded-b-xl z-50 animate-fade-in-down max-h-[70vh] overflow-y-auto px-2">
                <div className="p-4 flex flex-col gap-4">
                  {TOOL_CATEGORIES.map(cat => (
                    <div key={cat.name}>
                      <div className="font-semibold text-purple-200 mb-2">{cat.name}</div>
                      <ul className="space-y-1">
                        {cat.tools.map(tool => (
                          <li key={tool.path}>
                            <Link
                              to={tool.path}
                              className="block px-4 py-2 text-purple-100 hover:bg-purple-500/10 hover:text-white rounded transition text-sm"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {tool.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </header>
          <div className="flex-1 relative">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/character-count" element={<ToolUsageWrapper path="/character-count"><CharacterCount /></ToolUsageWrapper>} />
              <Route path="/speech-to-text" element={<ToolUsageWrapper path="/speech-to-text"><SpeechToText /></ToolUsageWrapper>} />
              <Route path="/dummy-text" element={<ToolUsageWrapper path="/dummy-text"><DummyTextGenerator /></ToolUsageWrapper>} />
              <Route path="/age-calculator" element={<ToolUsageWrapper path="/age-calculator"><AgeCalculator /></ToolUsageWrapper>} />
              <Route path="/case-converter" element={<ToolUsageWrapper path="/case-converter"><CaseConverter /></ToolUsageWrapper>} />
              <Route path="/whitespace-remover" element={<ToolUsageWrapper path="/whitespace-remover"><WhitespaceRemover /></ToolUsageWrapper>} />
              <Route path="/duplicate-line-remover" element={<ToolUsageWrapper path="/duplicate-line-remover"><DuplicateLineRemover /></ToolUsageWrapper>} />
              <Route path="/text-sorter" element={<ToolUsageWrapper path="/text-sorter"><TextSorter /></ToolUsageWrapper>} />
              <Route path="/text-diff" element={<ToolUsageWrapper path="/text-diff"><TextDiff /></ToolUsageWrapper>} />
              <Route path="/text-to-binary" element={<ToolUsageWrapper path="/text-to-binary"><TextToBinary /></ToolUsageWrapper>} />
              <Route path="/text-to-ascii" element={<ToolUsageWrapper path="/text-to-ascii"><TextToAscii /></ToolUsageWrapper>} />
              <Route path="/text-to-morse" element={<ToolUsageWrapper path="/text-to-morse"><TextToMorse /></ToolUsageWrapper>} />
              <Route path="/number-to-words" element={<ToolUsageWrapper path="/number-to-words"><NumberToWords /></ToolUsageWrapper>} />
              <Route path="/roman-numeral" element={<ToolUsageWrapper path="/roman-numeral"><RomanNumeral /></ToolUsageWrapper>} />
              <Route path="/time-counters" element={<ToolUsageWrapper path="/time-counters"><TimeCounters /></ToolUsageWrapper>} />
              <Route path="/base64" element={<ToolUsageWrapper path="/base64"><Base64Tool /></ToolUsageWrapper>} />
              <Route path="/text-hasher" element={<ToolUsageWrapper path="/text-hasher"><TextHasher /></ToolUsageWrapper>} />
              <Route path="/json-formatter" element={<ToolUsageWrapper path="/json-formatter"><JsonFormatter /></ToolUsageWrapper>} />
              <Route path="/xml-json" element={<ToolUsageWrapper path="/xml-json"><XmlJson /></ToolUsageWrapper>} />
              <Route path="/text-to-url" element={<ToolUsageWrapper path="/text-to-url"><TextToUrl /></ToolUsageWrapper>} />
              <Route path="/simple-interest" element={<ToolUsageWrapper path="/simple-interest"><SimpleInterestCalculator /></ToolUsageWrapper>} />
              <Route path="/compound-interest" element={<ToolUsageWrapper path="/compound-interest"><CompoundInterestCalculator /></ToolUsageWrapper>} />
              <Route path="/emi-calculator" element={<ToolUsageWrapper path="/emi-calculator"><EmiCalculator /></ToolUsageWrapper>} />
              <Route path="/no-cost-emi" element={<ToolUsageWrapper path="/no-cost-emi"><NoCostEmiCalculator /></ToolUsageWrapper>} />
              <Route path="/emoji-finder" element={<ToolUsageWrapper path="/emoji-finder"><EmojiFinder /></ToolUsageWrapper>} />
              <Route path="/unit-conversion-cost" element={<ToolUsageWrapper path="/unit-conversion-cost"><UnitConversionCostCalculator /></ToolUsageWrapper>} />
              <Route path="/subscription-cost-tracker" element={<ToolUsageWrapper path="/subscription-cost-tracker"><SubscriptionCostTracker /></ToolUsageWrapper>} />
              <Route path="/price-comparison" element={<ToolUsageWrapper path="/price-comparison"><PriceComparisonTool /></ToolUsageWrapper>} />
              <Route path="/fuel-cost-estimator" element={<ToolUsageWrapper path="/fuel-cost-estimator"><FuelCostEstimator /></ToolUsageWrapper>} />
              <Route path="/annual-to-monthly" element={<ToolUsageWrapper path="/annual-to-monthly"><AnnualToMonthlyConverter /></ToolUsageWrapper>} />
              <Route path="/recurring-to-daily" element={<ToolUsageWrapper path="/recurring-to-daily"><RecurringCostToDailyImpact /></ToolUsageWrapper>} />
              <Route path="/percentage-calculator" element={<ToolUsageWrapper path="/percentage-calculator"><PercentageCalculator /></ToolUsageWrapper>} />
            </Routes>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.25s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </Router>
  );
}

function HomePage() {
  const [search, setSearch] = useState('');
  // Flatten and filter tools by search (name or tags)
  const filteredCategories = TOOL_CATEGORIES.map(cat => ({
    ...cat,
    tools: cat.tools.filter(tool => {
      const q = search.toLowerCase();
      return tool.name.toLowerCase().includes(q) || (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(q)));
    }),
  })).filter(cat => cat.tools.length > 0);
  const location = useLocation();
  const [mostUsed, setMostUsed] = useState<{ name: string, path: string, count: number, icon?: React.ReactNode, emoji?: string }[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('favoriteTools') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    function updateMostUsed() {
      const usageRaw = localStorage.getItem('toolUsageCounts');
      if (usageRaw) {
        try {
          const usage = JSON.parse(usageRaw);
          const allTools = TOOL_CATEGORIES.flatMap(cat => cat.tools.map(tool => ({ ...tool, count: usage[tool.path] || 0 })));
          const mostUsedTools = allTools.filter(t => t.count > 0).sort((a, b) => b.count - a.count).slice(0, 4);
          setMostUsed(mostUsedTools);
        } catch { }
      } else {
        setMostUsed([]);
      }
    }
    updateMostUsed();
    window.addEventListener('tool-usage-updated', updateMostUsed);
    return () => window.removeEventListener('tool-usage-updated', updateMostUsed);
  }, [location]);

  function isFavorited(path: string) {
    return favorites.includes(path);
  }
  function toggleFavorite(path: string) {
    setFavorites(favs => {
      const updated = favs.includes(path) ? favs.filter(f => f !== path) : [...favs, path];
      localStorage.setItem('favoriteTools', JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Most Used Tools Card (homepage only) */}
      {mostUsed.length > 0 && (
        <div className="w-full max-w-4xl mx-auto mb-8 px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-purple-200">Most Used Tools</h3>
              <button
                onClick={() => {
                  localStorage.removeItem('toolUsageCounts');
                  window.dispatchEvent(new Event('tool-usage-updated'));
                }}
                className="text-xs text-purple-300 hover:text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                type="button"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mostUsed.map(tool => (
                <a key={tool.path} href={tool.path} className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/10 border border-white/10 hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-teal-500/20 transition shadow group relative focus:outline-none">
                  <span className="text-2xl mb-2">{tool.emoji || '🔧'}</span>
                  <span className="text-base text-purple-200 text-center font-semibold mb-1">{tool.name}</span>
                  <span className="text-xs text-purple-400/80">Used {tool.count} times</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      <h2 className="text-3xl font-bold text-white mb-8 text-center">All Tools</h2>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tools.."
          className="w-full max-w-md px-4 py-3 rounded-full bg-white/20 border border-white/20 text-white placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg shadow-lg backdrop-blur-md"
        />
      </div>
      <p className="text-base sm:text-sm text-purple-200/60 font-medium text-center mb-8">
        Amazing Tools — 100% Offline, No Login, No Data Tracking.
        Just Pure Utility You Can Trust.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCategories.length === 0 ? (
          <div className="col-span-full text-center text-purple-200 text-xl py-16">No tools found matching your search.</div>
        ) : (
          filteredCategories.map(cat => (
            <div key={cat.name} className="bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col">
              <div className="mb-4 text-lg font-semibold text-purple-200 uppercase tracking-wider">{cat.name}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cat.tools.map(tool => (
                  <div key={tool.path} className="bg-white/5 border border-white/10 rounded-xl shadow p-4 flex flex-col items-start group hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-teal-500/10 transition">
                    <div className="text-base font-medium text-white mb-2 group-hover:text-purple-200 transition">{tool.name}</div>
                    <div className="flex items-center w-full gap-2 mt-auto">
                      <Link
                        to={tool.path}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-xs font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
                      >
                        Open Tool
                      </Link>
                      <button
                        aria-label={isFavorited(tool.path) ? 'Unfavorite' : 'Favorite'}
                        onClick={() => toggleFavorite(tool.path)}
                        className={`ml-auto p-2 rounded-full border border-white/20 text-xs transition focus:outline-none focus:ring-2 focus:ring-purple-400 ${isFavorited(tool.path) ? 'bg-pink-500/80 text-white' : 'bg-white/10 text-pink-300 hover:bg-pink-500/20 hover:text-white'}`}
                        type="button"
                      >
                        {isFavorited(tool.path) ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.76 3.64a5.5 5.5 0 017.78 7.78l-7.07 7.07a.75.75 0 01-1.06 0l-7.07-7.07a5.5 5.5 0 017.78-7.78z" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Helper to increment tool usage count
function incrementUsage(path: string) {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem('toolUsageCounts');
  let usage: Record<string, number> = {};
  if (raw) {
    try { usage = JSON.parse(raw); } catch { }
  }
  usage[path] = (usage[path] || 0) + 1;
  localStorage.setItem('toolUsageCounts', JSON.stringify(usage));
  window.dispatchEvent(new Event('tool-usage-updated'));
}

// Wrapper to increment usage on mount
function ToolUsageWrapper({ path, children }: { path: string, children: React.ReactNode }) {
  const calledRef = useRef(false);
  useEffect(() => {
    if (!calledRef.current) {
      incrementUsage(path);
      calledRef.current = true;
    }
  }, [path]);
  return <>{children}</>;
}

export default App;