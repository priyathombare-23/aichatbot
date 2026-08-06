export interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  options?: QuickOption[];
  isCard?: boolean;
}

export interface QuickOption {
  label: string;
  value: string;
  action?: string;
  icon?: string;
}

export interface UserLead {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  branch: string;
  programmeInterest?: string;
  createdAt?: string;
}

export type OnboardingStep = 'name' | 'email' | 'phone' | 'branch' | 'completed';

export interface InquiryCategory {
  title: string;
  description: string;
  items: string[];
}

