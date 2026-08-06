import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, RefreshCw, Loader2, Info } from 'lucide-react';
import { Message, UserLead, OnboardingStep } from './types';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { QuickChips } from './components/QuickChips';
import { ContactModal } from './components/ContactModal';
import { AdminPortal } from './components/AdminPortal';
import { VidyaAvatar } from './components/VidyaAvatar';

// Initial two welcome messages as required by user specification
const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome-msg-1',
    sender: 'bot',
    text: "Hello, Welcome to Somaiya Vidyavihar University. You're talking with Vidya, the smartest virtual admission assistant, I can help you with admissions, programmes, fees, or campus information",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: 'welcome-msg-2',
    sender: 'bot',
    text: "Before we begin I want to know more about you. Please help me with your Full Name",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const MAIN_MENU_OPTIONS = [
  { label: '🏛️ About Somaiya Vidyavihar University', value: 'Tell me about Somaiya Vidyavihar University, KJSIT, vision, leadership, and campus.' },
  { label: '🏡 On-Campus Hostels & Fees', value: 'Tell me about Somaiya Vidyavihar hostels, accommodation steps, fee structure, and helpline numbers.' },
  { label: '🏆 Ranking & Accreditation', value: 'What are the rankings, NAAC grade, NBA accreditation, and autonomous status of KJSIT?' },
  { label: '💼 Placement Highlights', value: 'Can you provide placement statistics, highest salary, and top recruiters at KJSIT?' },
  { label: '📊 Fee Structure 2026–27', value: 'What is the fee structure for First Year B.Tech and Direct Second Year for 2026-27?' },
  { label: '🎓 B.Tech Programmes & Intake', value: 'What B.Tech programmes are offered at KJSIT along with seat intake?' },
  { label: '🚀 Somaiya BeliefSat-0 (ISRO)', value: 'Tell me about Somaiya BeliefSat-0 satellite developed by KJSIT and launched by ISRO.' },
  { label: '📜 Admission Documents Checklist', value: 'What is the document checklist required for First Year Engineering admission at KJSIT?' },
  { label: '📞 Contact Admissions Desk', value: 'Give me official contact details, phone numbers, email, and campus address of KJSIT.' },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('name');
  
  // Draft lead details
  const [leadDraft, setLeadDraft] = useState<Partial<UserLead>>({});
  const [userLead, setUserLead] = useState<UserLead | null>(null);

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Speech Recognition if supported
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
        }
      };

      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Save lead to backend database
  const saveLeadToBackend = async (leadData: UserLead) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      const data = await res.json();
      console.log('Lead persisted to backend:', data);
    } catch (e) {
      console.error('Failed to post lead to backend:', e);
    }
  };

  // Main input submission handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append User Message to UI
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: userTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // --- STEP 1: Full Name Input ---
    if (onboardingStep === 'name') {
      const updatedDraft = { ...leadDraft, fullName: text };
      setLeadDraft(updatedDraft);
      setOnboardingStep('email');

      setTimeout(() => {
        const nextBotMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Your Email address',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, nextBotMsg]);
      }, 400);

      return;
    }

    // --- STEP 2: Email Address Input ---
    if (onboardingStep === 'email') {
      const updatedDraft = { ...leadDraft, email: text };
      setLeadDraft(updatedDraft);
      setOnboardingStep('phone');

      setTimeout(() => {
        const nextBotMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Drop in your Number to get the best assistance',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, nextBotMsg]);
      }, 400);

      return;
    }

    // --- STEP 3: Contact Phone Input ---
    if (onboardingStep === 'phone') {
      const updatedDraft = { ...leadDraft, phone: text };
      setLeadDraft(updatedDraft);
      setOnboardingStep('branch');

      setTimeout(() => {
        const nextBotMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'In what branch are you interested?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: [
            { label: '💻 CS (Computer Engineering)', value: 'CS (Computer Engineering)' },
            { label: '🤖 AI & DS (Artificial Intelligence & Data Science)', value: 'AI & DS (Artificial Intelligence & Data Science)' },
            { label: '🌐 IT (Information Technology)', value: 'IT (Information Technology)' },
            { label: '📡 EXTC (Electronics & Telecommunication)', value: 'EXTC (Electronics & Telecommunication)' },
          ],
        };
        setMessages((prev) => [...prev, nextBotMsg]);
      }, 400);

      return;
    }

    // --- STEP 4: Branch Selection & Completion ---
    if (onboardingStep === 'branch') {
      const finalLead: UserLead = {
        fullName: leadDraft.fullName || 'Student',
        email: leadDraft.email || 'Not provided',
        phone: leadDraft.phone || 'Not provided',
        branch: text,
      };

      setUserLead(finalLead);
      setOnboardingStep('completed');

      // Store in backend admin database
      saveLeadToBackend(finalLead);

      setTimeout(() => {
        const completionMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Great! Thanks for sharing your details. How may I assist you today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: MAIN_MENU_OPTIONS,
        };
        setMessages((prev) => [...prev, completionMsg]);
      }, 400);

      return;
    }

    // --- STEP 5+: Normal AI Chat Query Handling ---
    setIsLoading(true);
    const updatedHistory = [...messages, userMessage];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory,
          userLead,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const botReplyText = data.text || 'I am happy to assist you with KJSIT information.';

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: MAIN_MENU_OPTIONS.slice(0, 4),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Speak response if voice is enabled
      if (isAudioEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanText = botReplyText.replace(/[*_#`~]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err: any) {
      console.error(err);
      // Fallback response generator if API is offline
      const fallbackReply = generateOfflineFallback(text);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Offline query fallback
  const generateOfflineFallback = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('hostel') || q.includes('accommodation') || q.includes('sandipani') || q.includes('maitreyi') || q.includes('polytechnic') || q.includes('ashtavakra') || q.includes('mess')) {
      return `### 🏡 Somaiya Vidyavihar On-Campus Hostels

**Hostel Buildings:**
* **Sandipani:** Only Boys
* **Maitreyi:** Only Girls
* **Polytechnic:** Boys & Girls
* **Ashtavakra:** Boys & Girls (Sion)

---

### 📝 Steps to Apply for Hostel Accommodation:
* **Step 1:** Tick **'Yes'** for Hostel Accommodation in your Application Form.
* **Step 2:** Log in to **Somaiya My Account**: [myaccount.somaiya.edu](https://myaccount.somaiya.edu/#/login) *(Accessible after payment of 1st installment)*.
* **Step 3:** Go to **Dashboard** → Click **"Apply for Hostel"** → **"Complete Now"**.
* **Step 4:** Select preferred accommodation type (*Triple / Double Sharing*).
* **Step 5:** Upload valid ID Proof (*Aadhaar / Driving License / Passport*).
* **Step 6:** Submit the hostel application on My Account.
* **Step 7:** Application is verified → Hostel issues Offer Letter → Proceed to Pay Hostel Fees.
* **Step 8 (Helpline):** 📞 022-67280107 / 02 / 03 / 04 / 06 | 022-35306571 / 74

---

### 💰 Hostel Fee Structure (12 Months):
* **Double Sharing:** ₹ 4,12,499 per year
* **Triple Sharing:** ₹ 2,85,651 per year
* **Mess Charges:** ₹ 60,000 per year *(4 meals per day)*
* **Air-Conditioned Rooms:** Additional charges of **₹ 5,000 per month**`;
    }

    if (q.includes('eligibility') || q.includes('process') || q.includes('admission') || q.includes('minority') || q.includes('quota') || q.includes('cet') || q.includes('gate')) {
      return `### 📜 KJSIT Admission Guidelines & Eligibility Criteria (2026–27)

**Admission Process:**
* Admissions are strictly merit-based, conducted via the **Centralized Admission Process (CAP)** by the State CET Cell, Maharashtra.
* Vacant seats post-CAP are filled on inter-se merit via institutional applications.
* The institute holds **Gujarati Linguistic Minority Status** (51% minority quota, 49% non-minority quota).

**Eligibility Criteria for B.Tech (Undergraduate):**
* Applicants must pass HSC (10+2) or equivalent with **Physics and Mathematics** as compulsory subjects along with Chemistry / Biotechnology / Biology / Technical subjects.
* **Minimum Marks:** At least **45% marks** (40% for reserved categories in Maharashtra).
* **Entrance Exam:** Non-zero score in **MHT-CET 2026**.

**Eligibility Criteria for M.Tech (Postgraduate):**
* Relevant B.E. / B.Tech degree with minimum **50% marks**.
* Valid **GATE score** OR 2 years of relevant full-time work experience.`;
    }

    if (q.includes('programme') || q.includes('specialization') || q.includes('branch') || q.includes('intake') || q.includes('honor') || q.includes('minor')) {
      return `### 🎓 KJSIT Academic Programmes & Specializations

**Undergraduate B.Tech Degree Programs (4 Years - Intake: 480 Total):**
* 💻 **Computer Engineering (COMP):** Intake 120
* 🤖 **Artificial Intelligence & Data Science (AI&DS):** Intake 120
* 🌐 **Information Technology (IT):** Intake 120
* 📡 **Electronics and Telecommunication Engineering (EXTC):** Intake 120

**Postgraduate Degree Program (M.Tech):**
* 🎓 **M.Tech in Artificial Intelligence:** Intake 18 (2 Years)

**Doctoral Programs (Ph.D.):**
* Research Centres in Computer Engg (15), IT (15), EXTC (20)

**Honors Programs (18–20 Additional Credits in TY & Final Year):**
* AI & Machine Learning | Data Science | Internet of Things (IoT) | Blockchain | Cyber Security

**Minor Programs (Semester III to VI):**
* Innovation & Entrepreneurship | VLSI Design | Biotechnology | Geographic Information Systems (GIS) | IoT, Robotics & Automation`;
    }

    if (q.includes('fee') || q.includes('cost') || q.includes('tuition')) {
      return `### 💰 KJSIT Fees Structure (Academic Year 2026–27)

**First Year B.Tech (Undergraduate):**
* **Open Category (CAP) - MS Board:** Total ₹1,88,701 (Tuition+Dev: ₹1,83,500)
* **Open Category (CAP) - Other Board:** Total ₹1,89,521
* **OBC / EBC Boys (CAP):** Total ₹1,08,919
* **VJ/NT/DT/SBC/TFWS/Girls (CAP):** Total ₹29,136
* **SC / ST (CAP):** Total ₹5,201 (MS) / ₹6,021 (Other)
* **J&K & GOI (CAP):** Total ₹29,201

**Direct Second Year (DSE):**
* **Open Category:** Total ₹1,95,784 (Tuition+Dev: ₹1,90,000)
* **OBC / EBC:** Total ₹1,13,176
* **SC / ST:** Total ₹5,784

*Full concession benefits are extended to eligible SC/ST/OBC/EBC/TFWS candidates as per Maharashtra government scholarship norms.*`;
    }

    if (q.includes('placement') || q.includes('salary') || q.includes('package') || q.includes('recruiter')) {
      return `### 💼 Placement Highlights at KJSIT

* 🏆 **Highest Salary Offered:** ₹51 Lakh / year
* 📈 **Average Salary:** ₹11.35 Lakh / year
* 🎯 **1 in every 2 students** gets more than ₹10 Lakh salary
* 🤝 **450+ Top Recruiters** visit campus.

**Top Recruiting Companies & Salary Packages:**
* **Cache Labs:** ₹17.4 LPA | **IDFC First Bank:** ₹13.8 LPA | **Seclore:** ₹12 LPA | **nVent:** ₹9.6 LPA | **Deloitte:** ₹7.6 LPA | **TCS & Jio:** ₹7.0 LPA`;
    }

    return `Thank you for your inquiry regarding KJSIT! 

K J Somaiya Institute of Technology (Sion, Mumbai) is an **Autonomous Engineering Institute** affiliated to University of Mumbai, NAAC 'A' Grade accredited (3.21 CGPA), and AICTE approved.

Feel free to ask about B.Tech Admissions, Eligibility, Fee Structure, Specializations, Honors & Minor degrees, or Placements!`;
  };

  const handleResetChat = () => {
    if (window.confirm('Are you sure you want to restart the onboarding and chat session?')) {
      setMessages(INITIAL_MESSAGES);
      setOnboardingStep('name');
      setLeadDraft({});
      setUserLead(null);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  // Get input placeholder based on onboarding step
  const getInputPlaceholder = () => {
    if (onboardingStep === 'name') return 'Type your Full Name...';
    if (onboardingStep === 'email') return 'Type your Email address...';
    if (onboardingStep === 'phone') return 'Type your Contact Number...';
    if (onboardingStep === 'branch') return 'Select or type your interested branch (CS, AI & DS, IT, EXTC)...';
    return 'Type your inquiry about admissions, fees, placements...';
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-slate-900 antialiased selection:bg-red-100 selection:text-[#a60921]">
      {/* Top Header */}
      <Header
        onReset={handleResetChat}
        userLead={userLead}
        onOpenLeadModal={() => setIsLeadModalOpen(true)}
        isAudioEnabled={isAudioEnabled}
        onToggleAudio={() => setIsAudioEnabled(!isAudioEnabled)}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
      />

      {/* Main Chat Messages Stream */}
      <main className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onOptionClick={(optVal) => handleSendMessage(optVal)}
            isAudioEnabled={isAudioEnabled}
          />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="py-4 px-4 sm:px-6 bg-white">
            <div className="max-w-4xl mx-auto flex gap-3 sm:gap-4 items-center">
              <VidyaAvatar size="sm" />
              <div className="flex items-center gap-2 text-xs font-semibold text-[#a60921] bg-red-50 border border-red-200 px-3.5 py-2 rounded-2xl">
                <Loader2 className="w-4 h-4 animate-spin text-[#a60921]" />
                <span>Vidya is processing official KJSIT records...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Quick Chips Bar (Enabled only when onboarding is complete) */}
      {onboardingStep === 'completed' && (
        <QuickChips
          disabled={isLoading}
          onSelectChip={(promptText) => handleSendMessage(promptText)}
        />
      )}

      {/* Bottom Message Input Box */}
      <footer className="bg-white border-t border-slate-200 p-3 sm:p-4 sticky bottom-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-slate-50 border border-slate-300 focus-within:border-[#a60921] focus-within:ring-2 focus-within:ring-[#a60921]/20 rounded-2xl px-3 py-1.5 transition-all shadow-xs"
          >
            {/* Speech Microphone Input Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-xl text-slate-500 hover:text-black transition-colors cursor-pointer shrink-0 ${
                isListening ? 'bg-[#a60921] text-white animate-pulse' : 'hover:bg-slate-200/60'
              }`}
              title={isListening ? 'Stop Listening' : 'Speak query'}
            >
              {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={getInputPlaceholder()}
              className="flex-1 text-sm bg-transparent outline-none text-black placeholder:text-slate-400 font-normal py-1.5 px-1"
              disabled={isLoading}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2 bg-[#a60921] hover:bg-[#850518] disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:cursor-not-allowed shrink-0 flex items-center gap-1.5 shadow-xs"
              title="Send Message"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Footer Disclaimer */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
            <span className="flex items-center gap-1 font-semibold">
              <Info className="w-3.5 h-3.5 text-[#a60921]" />
              Official AI Assistant of KJSIT, Sion, Mumbai (Brochure 2026–27)
            </span>
            <span className="hidden sm:inline font-semibold">Desk Tel: 022-44444419</span>
          </div>
        </div>
      </footer>

      {/* Lead Contact Modal */}
      <ContactModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        initialLead={userLead}
        onSubmitLead={(lead) => {
          setUserLead(lead);
          saveLeadToBackend(lead);
          // Post confirmation message in chat
          setMessages((prev) => [
            ...prev,
            {
              id: `system-${Date.now()}`,
              sender: 'bot',
              text: `Thank you **${lead.fullName}**! Your contact details (**${lead.phone}**) for **${lead.programmeInterest || lead.branch}** have been registered with the KJSIT Admission Desk. How else can Vidya assist you today?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }}
      />

      {/* Admin Leads Portal */}
      <AdminPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />
    </div>
  );
}

