import React, { useState, useEffect } from 'react';
import { Trash2, Heart, Star } from 'lucide-react';
import { Whisper } from '../types';

interface WhisperNoteProps {
  whisper: Whisper;
  onRemove: (id: string) => void;
  zIndex?: number;
}

const WhisperNote: React.FC<WhisperNoteProps> = ({ whisper, onRemove, zIndex = 1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: whisper.x, y: whisper.y });
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);
  const [isCherished, setIsCherished] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);

    // Optimized drift animation with requestAnimationFrame
    let animationId: number;
    let lastTime = 0;
    const targetFPS = 30; // Limit to 30 FPS for smoother animation
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        setPosition(prev => {
          const newX = prev.x + whisper.drift.x;
          const newY = prev.y + whisper.drift.y;
          
          // Let cards drift much further off-screen before repositioning
          let finalX = newX;
          let finalY = newY;
          
          // Only reposition when card is completely off-screen (beyond 150%)
          if (newX < -50) {
            finalX = 150; // Appear from far right
            finalY = Math.random() * 80 + 10; // Random Y position
          }
          else if (newX > 150) {
            finalX = -50; // Appear from far left
            finalY = Math.random() * 80 + 10; // Random Y position
          }
          else if (newY < -50) {
            finalX = Math.random() * 80 + 10; // Random X position
            finalY = 150; // Appear from far bottom
          }
          else if (newY > 150) {
            finalX = Math.random() * 80 + 10; // Random X position
            finalY = -50; // Appear from far top
          }
          
          return {
            x: finalX,
            y: finalY,
          };
        });
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [whisper.drift]);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(whisper.id), 500);
  };

  const handleCherish = () => {
    setIsCherished(true);
    
    // Generate particles around the card
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 50, // -50 to 150 to spread around the card
      y: Math.random() * 200 - 50, // -50 to 150 to spread around the card
      opacity: 1,
    }));
    setParticles(newParticles);

    // Fade out particles
    setTimeout(() => {
      setParticles([]);
    }, 3000);
    
    // Reset cherished state after animation
    setTimeout(() => {
      setIsCherished(false);
    }, 1000);
  };

  return (
    <div
      className={`absolute ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `rotate(${whisper.rotation}deg) scale(${whisper.scale})`,
        zIndex: zIndex,
        transformOrigin: 'center center',
        transition: 'opacity 0.5s ease-in-out',
        willChange: 'transform, left, top',
        backfaceVisibility: 'hidden',
        perspective: 1000,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Particle effects - positioned relative to the card */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute z-20"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.opacity,
          }}
        >
          <Star className="w-4 h-4 text-yellow-300 animate-ping" />
        </div>
      ))}

      {/* Main whisper card */}
      <div className="relative group min-w-[280px] max-w-xs">
        {/* Glow effect on hover */}
        <div className={`absolute -inset-2 bg-gradient-to-r from-purple-400/30 to-teal-400/30 rounded-2xl blur transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Card content */}
        <div className={`relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 z-30 ${
          isCherished ? 'ring-2 ring-yellow-300/50' : ''
        }`}>
          {/* Delete button - Always visible trash can */}
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500/90 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-300 text-white shadow-lg hover:shadow-xl hover:scale-110 z-40"
            title="Delete whisper"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Whisper content */}
          <div className="space-y-3 relative z-30">
            <div 
              className="text-white/90 pr-2"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '14px',
                lineHeight: '1.5',
                fontWeight: '300',
                fontFamily: 'Inter, system-ui, sans-serif',
                maxHeight: '105px',
                wordWrap: 'break-word',
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
              }}
            >
              {whisper.poeticContent}
            </div>
            
            <div className="flex items-center justify-between text-xs text-purple-300/60 gap-2 relative z-30">
              <span className="flex-shrink-0">
                {whisper.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
              <button
                onClick={handleCherish}
                className={`flex items-center space-x-1 hover:text-purple-300 transition-all duration-300 flex-shrink-0 relative z-40 ${
                  isCherished ? 'text-yellow-300 scale-110' : ''
                }`}
                title="Cherish this whisper"
                style={{ pointerEvents: 'auto' }}
              >
                <Heart className={`w-3 h-3 ${isCherished ? 'fill-current animate-pulse' : ''}`} />
                <span>Cherish</span>
              </button>
            </div>
          </div>

          {/* Dissolve effect on hover - Lower z-index to not block buttons */}
          <div className={`absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent rounded-2xl transition-opacity duration-500 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
        </div>
      </div>
    </div>
  );
};

export default WhisperNote;