import { useState, useEffect } from 'react';
import { Moon, Sparkles } from 'lucide-react';
import WhisperInput from './components/WhisperInput';
import WhisperNote from './components/WhisperNote';
import ParticleField from './components/ParticleField';
import ListenMode from './components/ListenMode';
import { Whisper } from './types/index';

function App() {
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [isListenMode, setIsListenMode] = useState(false);

  // Load whispers from localStorage on component mount
  useEffect(() => {
    // Test localStorage availability
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      console.log('localStorage is available');
    } catch (error) {
      console.error('localStorage is not available:', error);
      return;
    }

    const savedWhispers = localStorage.getItem('whispers');
    console.log('Raw saved whispers:', savedWhispers);

    if (savedWhispers) {
      try {
        const parsedWhispers = JSON.parse(savedWhispers);
        console.log('Parsed whispers:', parsedWhispers);

        // Convert timestamp strings back to Date objects
        const whispersWithDates = parsedWhispers.map((whisper: any) => ({
          ...whisper,
          timestamp: new Date(whisper.timestamp)
        }));
        setWhispers(whispersWithDates);
        console.log('Loaded whispers from localStorage:', whispersWithDates);
      } catch (error) {
        console.error('Error loading whispers from localStorage:', error);
      }
    } else {
      console.log('No saved whispers found in localStorage');
    }
  }, []);

  // Save whispers to localStorage whenever whispers change
  useEffect(() => {
    try {
      if (whispers.length > 0) {
        localStorage.setItem('whispers', JSON.stringify(whispers));
        console.log('Saved whispers to localStorage:', whispers);
      } else {
        // Clear localStorage when no whispers remain
        localStorage.removeItem('whispers');
        console.log('Cleared whispers from localStorage');
      }
    } catch (error) {
      console.error('Error saving whispers to localStorage:', error);
    }
  }, [whispers]);

  const addWhisper = (content: string, poeticContent: string) => {
    const newWhisper: Whisper = {
      id: Date.now().toString(),
      content,
      poeticContent,
      timestamp: new Date(),
      x: Math.random() * 80 + 10, // 10-90% from left (full width)
      y: Math.random() * 80 + 10, // 10-90% from top (full height)
      opacity: 0.8 + Math.random() * 0.2,
      scale: 0.8 + Math.random() * 0.4,
      rotation: Math.random() * 360,
      drift: {
        x: (Math.random() - 0.5) * 0.3, // Reduced drift speed
        y: (Math.random() - 0.5) * 0.2, // Reduced drift speed
      }
    };
    console.log('Adding new whisper:', newWhisper);
    setWhispers(prev => [newWhisper, ...prev]);
  };

  const removeWhisper = (id: string) => {
    console.log('Removing whisper with id:', id);
    setWhispers(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Particle Field Background */}
      <ParticleField />

      {/* Parallax Fog Layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent animate-pulse-slow" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-transparent to-purple-500/5 animate-drift-slow" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex justify-between items-center relative z-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-6 h-6 text-purple-300" />
            </div>
            <h1 className="text-2xl font-light text-white/90 tracking-wide">
              Whisper
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {/* <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              {audioEnabled ? (
                <Volume2 className="w-5 h-5 text-purple-300 group-hover:text-purple-200" />
              ) : (
                <VolumeX className="w-5 h-5 text-purple-300 group-hover:text-purple-200" />
              )}
            </button> */}

            <button
              onClick={() => setIsListenMode(!isListenMode)}
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 flex items-center space-x-2 group"
            >
              <Moon className="w-4 h-4 text-purple-300 group-hover:text-purple-200" />
              <span className="text-sm text-purple-300 group-hover:text-purple-200">
                {isListenMode ? 'Exit Listen' : 'Listen Mode'}
              </span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 relative">
          {isListenMode ? (
            <ListenMode whispers={whispers} />
          ) : (
            <>
              {/* Whisper Input - Fixed positioning to stay above floating whispers */}
              <div className="relative z-50 flex justify-center p-6 pointer-events-none">
                <div className="pointer-events-auto w-full">
                  <WhisperInput onSubmit={addWhisper} />
                </div>
              </div>

              {/* Floating Whispers - Higher z-index to ensure clickability */}
              {/* <div className="absolute top-48 inset-0 overflow-hidden z-20"> */}
              {whispers.map((whisper, index) => (
                <WhisperNote
                  key={whisper.id}
                  whisper={whisper}
                  onRemove={removeWhisper}
                  zIndex={index + 10} // Start from z-index 10, keeping below header (z-50)
                />
              ))}
              {/* </div> */}


              {/* Empty State */}
              {whispers.length === 0 && (
                <div className="relative z-10 flex flex-col items-center justify-center h-64 text-center">
                  <div className="p-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-4">
                    <Sparkles className="w-8 h-8 text-purple-300/60" />
                  </div>
                  <p className="text-purple-300/60 text-lg font-light max-w-md">
                    Share your secrets, dreams, and confessions..
                    <br />
                    <span className="text-sm opacity-70">They'll transform into beautiful whispers</span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;