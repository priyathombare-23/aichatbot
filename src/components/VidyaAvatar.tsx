import React, { useState } from 'react';
import { Bot } from 'lucide-react';

interface VidyaAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VidyaAvatar: React.FC<VidyaAvatarProps> = ({
  className = '',
  size = 'sm',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  if (imageError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-[#a60921] text-white flex items-center justify-center font-bold border-2 border-[#a60921] shadow-xs shrink-0 ${className}`}
      >
        <Bot className="w-1/2 h-1/2 text-white" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-[#a60921] shadow-xs shrink-0 bg-red-50 flex items-center justify-center ${className}`}
    >
      <img
        src="/vidya_avatar.jpg"
        alt="Vidya AI Assistant Avatar"
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
