import React, { useEffect, useState } from 'react';
import { Particle } from '../types';

const ParticleField: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Initialize particles
    const initialParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: `particle-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.5 + 0.1,
      direction: Math.random() * 360,
      color: Math.random() > 0.5 ? 'purple' : 'teal',
    }));

    setParticles(initialParticles);

    // Animate particles
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => {
        const radians = (particle.direction * Math.PI) / 180;
        let newX = particle.x + Math.cos(radians) * particle.speed;
        let newY = particle.y + Math.sin(radians) * particle.speed;

        // Wrap around screen
        if (newX > 100) newX = -5;
        if (newX < -5) newX = 100;
        if (newY > 100) newY = -5;
        if (newY < -5) newY = 100;

        return {
          ...particle,
          x: newX,
          y: newY,
          direction: particle.direction + (Math.random() - 0.5) * 2, // Slight direction variation
        };
      }));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full transition-all duration-1000 ${
            particle.color === 'purple' 
              ? 'bg-purple-400/30' 
              : 'bg-teal-400/30'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${
              particle.color === 'purple' ? '#a855f7' : '#14b8a6'
            }`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;