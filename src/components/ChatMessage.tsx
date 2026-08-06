import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Copy, Check, Volume2, ArrowRight } from 'lucide-react';
import { Message } from '../types';
import { VidyaAvatar } from './VidyaAvatar';

interface ChatMessageProps {
  message: Message;
  onOptionClick?: (optionValue: string) => void;
  isAudioEnabled?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onOptionClick,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const isBot = message.sender === 'bot';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      window.speechSynthesis.cancel();
      const cleanText = message.text.replace(/[*_#`~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className={`py-4 px-4 sm:px-6 transition-all ${
        isBot ? 'bg-white' : 'bg-slate-50'
      }`}
    >
      <div className="max-w-4xl mx-auto flex gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isBot ? (
            <VidyaAvatar size="sm" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs border border-black shadow-xs">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#a60921] uppercase tracking-wider">
              {isBot ? 'Vidya (Official KJSIT AI)' : 'You'}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {message.timestamp}
            </span>
          </div>

          {/* Message Bubble Body */}
          <div
            className={`rounded-2xl p-4 text-[15px] leading-relaxed border ${
              isBot
                ? 'bg-[#fcfcfc] border-slate-200 text-black shadow-2xs rounded-tl-xs'
                : 'bg-[#a60921] border-[#a60921] text-white font-medium shadow-2xs rounded-tr-xs'
            }`}
          >
            {isBot ? (
              <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-white prose-strong:text-[#a60921] prose-strong:font-bold prose-a:text-[#a60921]">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{message.text}</p>
            )}
          </div>

          {/* Quick Option Buttons if attached to message */}
          {message.options && message.options.length > 0 && (
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-2">
              {message.options.map((opt, index) => (
                <button
                  key={index}
                  onClick={() => onOptionClick && onOptionClick(opt.value)}
                  className="px-4 py-2.5 bg-white hover:bg-[#a60921] text-[#a60921] hover:text-white border-2 border-[#a60921] rounded-full text-xs font-bold flex items-center justify-between gap-2 transition-all cursor-pointer shadow-xs text-left"
                >
                  <span>{opt.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-80 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Message Toolbar for Bot */}
          {isBot && (
            <div className="flex items-center gap-3 pt-1 text-slate-500">
              <button
                onClick={handleCopy}
                className="text-xs text-slate-600 hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSpeak}
                className={`text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                  isPlaying ? 'text-black font-bold' : 'text-slate-600 hover:text-black'
                }`}
                title="Listen to response"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlaying ? 'Speaking...' : 'Listen'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
