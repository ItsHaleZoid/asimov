"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Sparkles, ArrowUp } from 'lucide-react';


export default function PromptInput() {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim()) {
      console.log('Submitted:', message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Input Container */}
      <div className="relative bg-transparent border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden backdrop">
        {/* Shiny outline effect */}
        <div className="absolute -inset-[1px] rounded-2xl bg-black/50" />
        
        
        {/* Blue stroke on top left that fades out */}
        <div className='relative'>
        <div 
          className="absolute top-0 left-0 w-32 h-32 pointer-events-none"
          style={{
            filter: 'blur(0px) drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))',
            borderTop: '2px solid rgba(59, 130, 246, 0.8)',
            borderLeft: '2px solid rgba(112, 0, 240, 0.8)',
            borderTopLeftRadius: '16px',
            maskImage: 'linear-gradient(to top, black 0%, black 10%, transparent 90%), linear-gradient(to right, black 0%, black 30%, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 30%, transparent 90%), linear-gradient(to right, black 0%, black 30%, transparent 70%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in'  
          }}
          />
          <div 
          className="absolute top-0 left-0 w-32 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(112, 0, 240, 0.4) 100%, transparent 100%)',
            borderTopLeftRadius: '18px',
            maskImage: 'radial-gradient(ellipse 120px 120px at top left, black 0%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 120px 120px at top left, black 0%, black 40%, transparent 100%)',
            filter: 'blur(0.5px)',
          }}
        />
        
        </div>
        
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setIsTyping(e.target.value.length > 0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Describe the image you want to create..."
            className="w-full min-h-[140px] max-h-[200px] px-5 pt-5 pb-20 bg-transparent text-gray-100 placeholder-gray-500 resize-none focus:outline-none leading-relaxed"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: '#4B5563 transparent'
            }}
          />

          {/* Bottom toolbar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-4 bg-gradient-to-t from-gray-900/50 to-transparent">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-gray-800/50"
                aria-label="Attach file"
              >
                <Paperclip size={20} strokeWidth={1.5} />
              </button>
             
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!message.trim()}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                message.trim()
                  ? 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-105'
                  : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
              }`}
              aria-label="Generate image"
            >
              <ArrowUp size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}