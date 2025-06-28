export interface Whisper {
  id: string;
  content: string;
  poeticContent: string;
  timestamp: Date;
  x: number; // percentage position
  y: number; // percentage position
  opacity: number;
  scale: number;
  rotation: number;
  drift: {
    x: number;
    y: number;
  };
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  direction: number;
  color: string;
}