const poeticWords = {
  // Emotional words
  sad: ['melancholy', 'sorrowful', 'wistful'],
  happy: ['euphoric', 'radiant', 'luminous'],
  angry: ['tempestuous', 'fierce', 'burning'],
  scared: ['trembling', 'whispered fears', 'shadow-touched'],
  lonely: ['solitary', 'adrift', 'yearning'],
  love: ['devotion', 'tender embrace', 'heart\'s song'],
  
  // Common words
  heart: ['soul', 'essence', 'core'],
  mind: ['thoughts', 'consciousness', 'inner world'],
  eyes: ['gaze', 'vision', 'windows'],
  night: ['twilight', 'moonlit hours', 'starlit darkness'],
  day: ['dawn\'s embrace', 'golden hours', 'sunlit moments'],
  time: ['fleeting moments', 'eternal dance', 'whispered seconds'],
  
  // Actions
  walk: ['wander', 'drift', 'meander'],
  think: ['ponder', 'contemplate', 'muse'],
  feel: ['sense', 'experience', 'perceive'],
  remember: ['cherish', 'hold dear', 'treasure'],
  forget: ['release', 'let drift away', 'surrender'],
};

const poeticPhrases = [
  'like whispers in the wind',
  'as gentle as morning dew',
  'through veils of starlight',
  'in the silence between heartbeats',
  'where shadows dance with light',
  'beneath the moon\'s tender gaze',
  'in gardens of memory',
  'through corridors of time',
  'like petals on still water',
  'in the quiet of the soul',
];

const addPoetry = (text: string): string => {
  // Add poetic phrases occasionally
  if (Math.random() > 0.7) {
    const phrase = poeticPhrases[Math.floor(Math.random() * poeticPhrases.length)];
    return `${text} ${phrase}`;
  }
  return text;
};

export const transformToPoetry = (text: string): string => {
  let transformed = text.toLowerCase();
  
  // Replace common words with poetic alternatives
  Object.entries(poeticWords).forEach(([word, alternatives]) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (transformed.match(regex)) {
      const replacement = alternatives[Math.floor(Math.random() * alternatives.length)];
      transformed = transformed.replace(regex, replacement);
    }
  });
  
  // Add poetic elements
  transformed = addPoetry(transformed);
  
  // Capitalize first letter and add ellipsis for mystery
  transformed = transformed.charAt(0).toUpperCase() + transformed.slice(1);
  
  // Add poetic ending
  if (!transformed.endsWith('...') && !transformed.endsWith('.')) {
    transformed += Math.random() > 0.5 ? '...' : '.';
  }
  
  return transformed;
};