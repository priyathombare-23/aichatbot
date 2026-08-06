import React, { useState } from 'react';
import { X, Send, User, Mail, Phone, BookOpen, CheckCircle } from 'lucide-react';
import { UserLead } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLead: (lead: UserLead) => void;
  initialLead?: UserLead | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSubmitLead,
  initialLead,
}) => {
  const [fullName, setFullName] = useState(initialLead?.fullName || '');
  const [email, setEmail] = useState(initialLead?.email || '');
  const [phone, setPhone] = useState(initialLead?.phone || '');
  const [programmeInterest, setProgrammeInterest] = useState(
    initialLead?.programmeInterest || 'B.Tech Computer Engineering'
  );
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const lead: UserLead = {
      fullName,
      email,
      phone,
      branch: programmeInterest,
      programmeInterest,
    };

    onSubmitLead(lead);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-3">
          <div className="w-10 h-10 rounded-full bg-[#a60921] text-white flex items-center justify-center font-bold text-lg shadow-xs border border-[#a60921]">
            K
          </div>
          <div>
            <h2 className="text-lg font-bold text-black uppercase tracking-tight">Request Admission Assistance</h2>
            <p className="text-xs text-slate-600">Connect directly with KJSIT Admissions Desk</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-black">Details Received!</h3>
            <p className="text-xs text-slate-600">
              Thank you, <strong>{fullName}</strong>. Our admission counsellors will reach out to you at <strong>{phone}</strong> shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Thombare"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#a60921] focus:border-[#a60921] outline-none text-black bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  placeholder="e.g. priya.thombare@somaiya.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#a60921] focus:border-[#a60921] outline-none text-black bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">Contact Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 918793980301"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#a60921] focus:border-[#a60921] outline-none text-black bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">Programme of Interest</label>
              <div className="relative">
                <BookOpen className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <select
                  value={programmeInterest}
                  onChange={(e) => setProgrammeInterest(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#a60921] focus:border-[#a60921] outline-none text-black bg-white"
                >
                  <option value="B.Tech Computer Engineering">B.Tech Computer Engineering</option>
                  <option value="B.Tech Information Technology">B.Tech Information Technology</option>
                  <option value="B.Tech AI & Data Science">B.Tech Artificial Intelligence & Data Science</option>
                  <option value="B.Tech Electronics & Telecommunication">B.Tech Electronics & Telecommunication</option>
                  <option value="M.Tech Artificial Intelligence">M.Tech Artificial Intelligence</option>
                  <option value="Ph.D. Doctoral Programme">Ph.D. Doctoral Programme</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#a60921] hover:bg-[#850518] text-white font-semibold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
