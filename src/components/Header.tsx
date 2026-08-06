import React from 'react';
import { RefreshCw, UserCheck, Volume2, VolumeX, PhoneCall, ShieldCheck } from 'lucide-react';
import { UserLead } from '../types';
import { VidyaAvatar } from './VidyaAvatar';

interface HeaderProps {
  onReset: () => void;
  userLead: UserLead | null;
  onOpenLeadModal: () => void;
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  userLead,
  onOpenLeadModal,
  isAudioEnabled,
  onToggleAudio,
  onOpenAdmin,
}) => {
  return (
    <header className="bg-white border-b-2 border-[#a60921] sticky top-0 z-20 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <VidyaAvatar size="md" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-black tracking-tight leading-tight">
                Vidya
              </h1>
              <span className="bg-[#a60921]/10 text-[#a60921] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border border-[#a60921]/30">
                Official AI
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 border border-slate-300 px-2 py-0.5 rounded hidden md:inline-block">
                KJSIT 2026–27
              </span>
            </div>
            <p className="text-xs text-black font-medium">
              K J Somaiya Institute of Technology, Sion, Mumbai
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:border-[#a60921] hover:text-[#a60921] bg-white text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Open Admin Portal to view saved leads"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#a60921]" />
            <span className="hidden sm:inline">Admin Portal</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={onToggleAudio}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isAudioEnabled
                ? 'bg-[#a60921] text-white border-[#a60921]'
                : 'bg-white text-black border-slate-300 hover:border-[#a60921] hover:text-[#a60921]'
            }`}
            title={isAudioEnabled ? 'Mute AI voice output' : 'Enable AI voice readout'}
          >
            {isAudioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Voice On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Voice Off</span>
              </>
            )}
          </button>

          {/* Lead Details / Call Back */}
          <button
            onClick={onOpenLeadModal}
            className="px-3 py-1.5 bg-[#a60921] hover:bg-[#850518] text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border border-[#a60921] transition-colors cursor-pointer shadow-xs"
          >
            {userLead ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">{userLead.fullName.split(' ')[0]}</span>
              </>
            ) : (
              <>
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Back</span>
              </>
            )}
          </button>

          {/* Reset Chat */}
          <button
            onClick={onReset}
            className="p-1.5 text-black hover:bg-red-50 hover:text-[#a60921] rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Restart conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

