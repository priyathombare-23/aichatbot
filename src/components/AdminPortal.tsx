import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck, User, Mail, Phone, BookOpen, Clock, Download, RefreshCw, Trash2, Search } from 'lucide-react';
import { UserLead } from '../types';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin@kjsit.edu');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [leads, setLeads] = useState<UserLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchLeads();
    }
  }, [isOpen, isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        fetchLeads();
      } else {
        setLoginError(data.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setLoginError('Login failed. Please check backend connection.');
    }
  };

  const exportCSV = () => {
    if (!leads.length) return;
    const headers = ['Full Name', 'Email', 'Phone', 'Branch', 'Date Captured'];
    const rows = leads.map(l => [
      `"${l.fullName}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.branch || ''}"`,
      `"${l.createdAt ? new Date(l.createdAt).toLocaleString() : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KJSIT_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const filteredLeads = leads.filter(l => 
    l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.phone.includes(searchTerm) ||
    (l.branch && l.branch.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white border-2 border-[#a60921] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#a60921] text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white text-[#a60921] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight">KJSIT Admissions Admin Portal</h2>
              <p className="text-xs text-white/80">Stored Onboarding Leads & Student Inquiries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {!isAuthenticated ? (
          /* Login Form */
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 max-w-md mx-auto w-full space-y-5">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 text-[#a60921] rounded-full flex items-center justify-center mx-auto border border-red-200">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-black">Admin Authentication Required</h3>
              <p className="text-xs text-slate-600">
                Sign in to view real-time leads captured by Vidya AI Chatbot.
              </p>
            </div>

            {/* Display Credentials Box */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 space-y-1">
              <p className="font-bold">🔑 Test Admin Login Credentials:</p>
              <p>Email: <span className="font-mono font-semibold">admin@kjsit.edu</span></p>
              <p>Password: <span className="font-mono font-semibold">admin123</span></p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 pb-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                  Admin Email / ID
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#a60921] bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#a60921] bg-white text-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#a60921] hover:bg-[#850518] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
              >
                Sign In to Admin Portal
              </button>
            </form>
          </div>
        ) : (
          /* Admin Leads Table Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search lead by name, email, phone, or branch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#a60921] text-black"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchLeads}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:border-[#a60921] text-black rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Refresh leads"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#a60921]' : ''}`} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={exportCSV}
                  disabled={!leads.length}
                  className="px-3 py-1.5 bg-[#a60921] hover:bg-[#850518] disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV ({leads.length})</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white shadow-inner">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#a60921]/10 text-[#a60921] border-b border-slate-200 uppercase font-bold tracking-wider sticky top-0 bg-white z-10">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Contact Phone</th>
                    <th className="p-3">Branch of Interest</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-slate-500">
                        No onboarding leads found.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead, idx) => (
                      <tr key={lead.id || idx} className="hover:bg-red-50/50 transition-colors">
                        <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-bold text-black flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-[#a60921]" />
                          <span>{lead.fullName}</span>
                        </td>
                        <td className="p-3 text-slate-700">
                          <span className="inline-flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {lead.email}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-black">
                          <span className="inline-flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {lead.phone}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="bg-red-100 text-[#a60921] border border-red-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
                            {lead.branch || 'General'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 text-[11px]">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : 'Just now'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer summary */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>Showing <strong>{filteredLeads.length}</strong> of <strong>{leads.length}</strong> total captured student leads.</span>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-[#a60921] font-semibold hover:underline cursor-pointer"
              >
                Sign Out Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
