import React from 'react';
import { Sparkles, GraduationCap, DollarSign, Award, Satellite, PhoneCall, BookOpen, Home } from 'lucide-react';

interface QuickChipsProps {
  onSelectChip: (text: string) => void;
  disabled?: boolean;
}

const CHIPS = [
  {
    icon: Home,
    label: 'Hostels & Fees',
    prompt: 'Tell me about Somaiya Vidyavihar hostels, accommodation steps, fee structure, and helpline numbers.',
  },
  {
    icon: GraduationCap,
    label: 'B.Tech Programmes & Seats',
    prompt: 'What B.Tech programmes are offered at KJSIT along with seat intake?',
  },
  {
    icon: DollarSign,
    label: 'Fees 2026–27',
    prompt: 'What is the fee structure for First Year B.Tech and Direct Second Year for 2026-27?',
  },
  {
    icon: Award,
    label: 'Placement Record (51 LPA Max)',
    prompt: 'Can you provide placement statistics, highest salary, and top recruiters at KJSIT?',
  },
  {
    icon: Satellite,
    label: 'Somaiya BeliefSat-0 ISRO Launch',
    prompt: 'Tell me about Somaiya BeliefSat-0 satellite developed by KJSIT and launched by ISRO.',
  },
  {
    icon: BookOpen,
    label: 'Scholarships & Financial Aid',
    prompt: 'What government and Somaiya Trust scholarships are available at KJSIT?',
  },
  {
    icon: PhoneCall,
    label: 'Contact Admissions Desk',
    prompt: 'Give me official contact details, phone numbers, email, and campus address of KJSIT.',
  },
];

export const QuickChips: React.FC<QuickChipsProps> = ({ onSelectChip, disabled }) => {
  return (
    <div className="px-4 py-2 border-t border-slate-200 bg-white">
      <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#a60921] shrink-0 pr-1">
          <Sparkles className="w-3.5 h-3.5 text-[#a60921]" />
          <span>Quick Topics:</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {CHIPS.map((chip, idx) => {
            const Icon = chip.icon;
            return (
              <button
                key={idx}
                disabled={disabled}
                onClick={() => onSelectChip(chip.prompt)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#a60921] text-black hover:text-white border border-[#a60921]/40 hover:border-[#a60921] rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer disabled:opacity-50 shadow-2xs"
              >
                <Icon className="w-3.5 h-3.5 text-[#a60921] group-hover:text-white" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
