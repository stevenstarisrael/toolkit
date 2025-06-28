import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import { Whisper } from '../types';

interface ListenModeProps {
  whispers: Whisper[];
  // audioEnabled: boolean;
}

const ListenMode: React.FC<ListenModeProps> = ({ whispers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechDuration, setSpeechDuration] = useState(0);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const currentWhisper = whispers[currentIndex];

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechRef.current = new SpeechSynthesisUtterance();
      speechRef.current.rate = 0.8; // Slower speech
      speechRef.current.pitch = 0.9; // Slightly lower pitch
      speechRef.current.volume = 0.7; // Moderate volume

      speechRef.current.onstart = () => {
        setIsSpeaking(true);
        setProgress(0);

        // Estimate speech duration (rough calculation)
        const textLength = currentWhisper?.poeticContent.length || 0;
        const estimatedDuration = (textLength / 10) * 1000; // Rough estimate: 10 chars per second
        setSpeechDuration(estimatedDuration);

        // Start progress bar
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }

        progressIntervalRef.current = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + (100 / (estimatedDuration / 100));
            return newProgress >= 100 ? 100 : newProgress;
          });
        }, 100);
      };

      speechRef.current.onend = () => {
        setIsSpeaking(false);
        setProgress(100);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }

        if (isPlaying) {
          // Auto-advance to next whisper after a short delay
          setTimeout(() => {
            handleNext();
          }, 1000);
        }
      };

      speechRef.current.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        setIsPlaying(false);
        setProgress(0);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [currentWhisper, isPlaying]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying && currentWhisper) {
      if (speechRef.current) {
        speechRef.current.text = currentWhisper.poeticContent;
        window.speechSynthesis.speak(speechRef.current);
      }
    } else if (!isPlaying) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  }, [isPlaying, currentWhisper]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setProgress(0);
    } else {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };

  const handleNext = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    if (currentIndex < whispers.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
      setIsPlaying(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  if (whispers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 max-w-md">
          <Volume2 className="w-12 h-12 text-purple-300/60 mx-auto mb-4" />
          <h3 className="text-xl text-white/90 font-light mb-2">No Whispers Yet</h3>
          <p className="text-purple-300/60">
            Share some thoughts first, then return to listen mode to hear them transformed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      {/* Main listening interface */}
      <div className="relative max-w-2xl w-full">
        {/* Ambient glow effect */}
        <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/20 via-teal-500/20 to-purple-500/20 rounded-full blur-3xl opacity-60 animate-pulse-slow" />

        {/* Content card */}
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
          {/* Current whisper display */}
          <div className="mb-8">
            <div className="text-sm text-purple-300/60 mb-4">
              Whisper {currentIndex + 1} of {whispers.length}
            </div>

            <div className="min-h-[120px] flex items-center justify-center">
              <p className={`text-xl text-white/90 font-light leading-relaxed max-w-lg transition-opacity duration-300 ${isSpeaking ? 'opacity-100' : 'opacity-80'
                }`}>
                {currentWhisper?.poeticContent}
              </p>
            </div>

            <div className="text-xs text-purple-300/50 mt-4">
              {currentWhisper?.timestamp.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-teal-400 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={handlePlay}
              // disabled={!audioEnabled}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-400 hover:to-teal-400 disabled:from-gray-500 disabled:to-gray-400 flex items-center justify-center text-white shadow-lg transform hover:scale-105 transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </button>

            <button
              onClick={handleNext}
              // disabled={!audioEnabled}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/15 disabled:bg-white/5 flex items-center justify-center text-purple-300 border border-white/20 transition-all duration-300 disabled:cursor-not-allowed"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Status messages */}
          {/* {!audioEnabled && (
            <div className="mt-6 text-sm text-purple-300/60">
              Enable audio to start the listening experience
            </div>
          )} */}

          {isSpeaking && (
            <div className="mt-4 text-sm text-purple-300/80 animate-pulse">
              Speaking..
            </div>
          )}
        </div>
      </div>

      {/* Ambient visualization */}
      <div className="absolute inset-0 pointer-events-none">
        {isPlaying && (
          <>
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl animate-pulse animate-delay-300" />
            <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-purple-300/20 rounded-full blur-xl animate-pulse animate-delay-700" />
          </>
        )}
      </div>
    </div>
  );
};

export default ListenMode;