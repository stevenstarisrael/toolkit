import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { transformToPoetry } from '../utils/poetryTransform';

interface WhisperInputProps {
  onSubmit: (content: string, poeticContent: string) => void;
}

const WhisperInput: React.FC<WhisperInputProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsTransforming(true);
    
    // Simulate AI transformation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const poeticContent = transformToPoetry(content);
    onSubmit(content, poeticContent);
    
    setContent('');
    setIsTransforming(false);
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 to-teal-400/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          
          {/* Main input container */}
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What secret lies within your heart? Share your dreams, fears, or confessions.."
              className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[80px] max-h-[120px]"
              disabled={isTransforming}
              maxLength={500}
            />
            
            {/* Transformation animation */}
            {isTransforming && (
              <div className="absolute inset-0 bottom-16 flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-xl">
                <div className="flex items-center space-x-3 text-purple-300">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-light">Transforming into poetry..</span>
                </div>
              </div>
            )}
            
            {/* Submit button */}
            <div className="flex justify-between items-center mt-4 relative z-30">
              <div className={`text-xs ${content.length >= 500 ? 'text-red-400' : 'text-purple-300/50'}`}>
                {content.length} / 500 characters
              </div>
              
              <button
                type="submit"
                disabled={!content.trim() || isTransforming}
                className="relative z-40 flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 disabled:from-gray-500/50 disabled:to-gray-400/50 rounded-full text-white text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed group/btn backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl"
                style={{ pointerEvents: 'auto' }}
              >
                <span>Release</span>
                <Send className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WhisperInput;