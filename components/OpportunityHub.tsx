
import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Opportunity, Scheme, JobPosting } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Search, Star, ExternalLink, Bot, Building2, Briefcase, GraduationCap, X, CheckCircle, AlertCircle, FileText, Printer, Shield, Wallet, Train } from 'lucide-react';
import { analyzeEligibility } from '../services/geminiService';

// --- MOCK DATA ---

const MOCK_SCHEMES: Scheme[] = [
  {
    id: 'sai-pension',
    title: 'Sports Fund for Pension',
    organization: 'Ministry of Youth Affairs',
    category: 'pension',
    eligibility: 'Medalists in Olympics, CWG, Asian Games, World Cups.',
    benefit: '₹12,000 - ₹20,000 Monthly',
    amount: '₹20,000/mo',
    checklist: ['Aadhaar Card', 'Medal Certificate', 'Bank Passbook', 'Affidavit'],
    link: 'https://yas.nic.in',
    status: 'open'
  },
  {
    id: 'pdunwfs',
    title: 'PDUNWFS (Welfare Fund)',
    organization: 'National Welfare Fund',
    category: 'scholarship',
    eligibility: 'Indigent sportspersons living in poverty who represented India.',
    benefit: 'Lump sum grant up to ₹5 Lakh',
    amount: '₹5,00,000',
    checklist: ['Income Certificate', 'Representation Proof', 'Medical Bills (if injured)'],
    status: 'open'
  },
  {
    id: 'ongc-scholarship',
    title: 'ONGC Sports Scholarship',
    organization: 'ONGC',
    category: 'scholarship',
    eligibility: 'Age 14-25. State/National level participation.',
    benefit: '₹15,000 - ₹25,000 stipend',
    amount: '₹25,000/mo',
    checklist: ['Age Proof', 'Federation NOC', 'Performance Record'],
    deadline: 'March 31st',
    status: 'expired'
  }
];

const MOCK_JOBS: JobPosting[] = [
  {
    id: 'rly-wr-2024',
    title: 'Ticket Collector / Clerk',
    organization: 'Western Railway',
    category: 'job',
    department: 'Railways',
    designation: 'Group C',
    quotaType: 'Sports Quota (Open Advt)',
    eligibility: '12th Pass + National Representation (Senior/Youth)',
    benefit: 'Level 2/3 Pay Matrix (7th CPC)',
    status: 'open',
    link: 'https://rrc-wr.com'
  },
  {
    id: 'hry-pol-dsp',
    title: 'Direct Deputy Superintendent (DSP)',
    organization: 'Haryana Police',
    category: 'job',
    department: 'Police',
    designation: 'Class 1 Gazetted',
    quotaType: 'Direct Entry',
    eligibility: 'Olympic/Asian Games Gold/Silver Medalist (Haryana Domicile)',
    benefit: 'Level 10 Pay Matrix',
    status: 'open'
  },
  {
    id: 'army-havildar',
    title: 'Havildar (Sports)',
    organization: 'Indian Army',
    category: 'job',
    department: 'Army',
    designation: 'Havildar',
    quotaType: 'Direct Entry',
    eligibility: 'National Medalist in Athletics/Shooting/Boxing',
    benefit: 'Permanent Commission + Pension',
    status: 'open'
  },
  {
    id: 'sbi-clerk',
    title: 'Clerical Sports Quota',
    organization: 'State Bank of India',
    category: 'job',
    department: 'Bank',
    designation: 'Junior Associate',
    quotaType: 'Recruitment Drive',
    eligibility: 'Graduate + State Representation',
    benefit: '₹37,000/mo approx',
    status: 'expired'
  }
];

export const OpportunityHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'financial' | 'career'>('financial');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Financial Filters
  const [financialFilter, setFinancialFilter] = useState<'all' | 'pension' | 'scholarship'>('all');
  
  // Job Filters
  const [jobFilter, setJobFilter] = useState<'all' | 'Police' | 'Railways' | 'Bank' | 'Army'>('all');

  // Modals
  const [eligibilityModal, setEligibilityModal] = useState<{open: boolean, scheme?: Scheme}>({open: false});
  const [userProfile, setUserProfile] = useState('');
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // CV Builder State
  const [cvData, setCvData] = useState({ name: '', sport: '', medals: '', years: '' });

  // Persistence
  const starredItems = useLiveQuery(() => db.opportunities.toArray());
  const starredIds = starredItems?.map(item => item.id) || [];

  const toggleStar = async (opp: Opportunity) => {
    if (starredIds.includes(opp.id)) {
      await db.opportunities.delete(opp.id);
    } else {
      await db.opportunities.add(opp);
    }
  };

  const handleCheckEligibility = async () => {
    if (!eligibilityModal.scheme) return;
    setIsAnalyzing(true);
    
    const profileToCheck = userProfile.trim() || "I am a State Level athlete with 5 years experience but no major national medals yet.";
    const schemeContext = `${eligibilityModal.scheme.title}. Eligibility Requirements: ${eligibilityModal.scheme.eligibility}`;
    
    const result = await analyzeEligibility(profileToCheck, schemeContext);
    setEligibilityResult(result);
    setIsAnalyzing(false);
  };

  const filteredData = activeTab === 'financial' 
    ? MOCK_SCHEMES.filter(s => (financialFilter === 'all' || s.category === financialFilter))
    : MOCK_JOBS.filter(j => (jobFilter === 'all' || j.department === jobFilter));

  const finalData = filteredData.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 animate-fade-in min-h-full">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
           <h1 className="font-display text-4xl font-bold text-white uppercase mb-1">Opportunity <span className="text-lime-400">Hub</span></h1>
           <p className="text-slate-400 text-sm">Secure your financial future and career stability.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="bg-slate-900 p-1 rounded-lg flex border border-white/10">
            <button 
                onClick={() => setActiveTab('financial')}
                className={`px-6 py-2 rounded font-bold text-sm uppercase tracking-wide transition-all ${activeTab === 'financial' ? 'bg-slate-800 text-lime-400 shadow-sm' : 'text-slate-500 hover:text-white'}`}
            >
                <span className="flex items-center gap-2"><Wallet size={16} /> Financial Hope</span>
            </button>
            <button 
                onClick={() => setActiveTab('career')}
                className={`px-6 py-2 rounded font-bold text-sm uppercase tracking-wide transition-all ${activeTab === 'career' ? 'bg-slate-800 text-lime-400 shadow-sm' : 'text-slate-500 hover:text-white'}`}
            >
                <span className="flex items-center gap-2"><Briefcase size={16} /> Career Security</span>
            </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder={activeTab === 'financial' ? "Search scholarships, pensions..." : "Search sports quota jobs..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-full px-5 py-3 pl-12 text-white focus:outline-none focus:border-lime-400/50"
          />
          <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {activeTab === 'financial' ? (
                <>
                  <button onClick={() => setFinancialFilter('all')} className={`px-4 py-2 rounded-full border text-xs font-bold uppercase ${financialFilter === 'all' ? 'bg-lime-400 text-slate-950 border-lime-400' : 'border-white/10 text-slate-400'}`}>All</button>
                  <button onClick={() => setFinancialFilter('pension')} className={`px-4 py-2 rounded-full border text-xs font-bold uppercase ${financialFilter === 'pension' ? 'bg-lime-400 text-slate-950 border-lime-400' : 'border-white/10 text-slate-400'}`}>Pensions</button>
                  <button onClick={() => setFinancialFilter('scholarship')} className={`px-4 py-2 rounded-full border text-xs font-bold uppercase ${financialFilter === 'scholarship' ? 'bg-lime-400 text-slate-950 border-lime-400' : 'border-white/10 text-slate-400'}`}>Scholarships</button>
                </>
            ) : (
                <>
                  <button onClick={() => setJobFilter('all')} className={`px-4 py-2 rounded-full border text-xs font-bold uppercase ${jobFilter === 'all' ? 'bg-lime-400 text-slate-950 border-lime-400' : 'border-white/10 text-slate-400'}`}>All</button>
                  <button onClick={() => setJobFilter('Railways')} className={`px-4 py-2 rounded-full border text-xs font-bold uppercase ${jobFilter === 'Railways' ? 'bg-lime-400 text-slate-950 border-lime-400' : 'border-white/10 text-slate-400'}`}>Railways</button>
                  <button onClick={() => setJobFilter('Police')} className={`px-4 py-2 rounded-full border text-xs font-bold uppercase ${jobFilter === 'Police' ? 'bg-lime-400 text-slate-950 border-lime-400' : 'border-white/10 text-slate-400'}`}>Police</button>
                  <button onClick={() => setJobFilter('Army')} className={`px-4 py-2 rounded-full border text-xs font-bold uppercase ${jobFilter === 'Army' ? 'bg-lime-400 text-slate-950 border-lime-400' : 'border-white/10 text-slate-400'}`}>Army</button>
                </>
            )}
        </div>
        
        {activeTab === 'career' && (
             <Button variant="outline" className="whitespace-nowrap" onClick={() => setCvModalOpen(true)}>
                <FileText size={16} className="mr-2" /> Sports CV Builder
             </Button>
        )}
      </div>

      {/* Grid Display */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {finalData.map((item) => {
           const isStarred = starredIds.includes(item.id);
           return (
             <div key={item.id} className={`bg-slate-900/40 border rounded-xl p-6 relative group transition-all duration-300 hover:-translate-y-1 ${item.status === 'expired' ? 'border-rose-500/20 opacity-70' : 'border-white/5 hover:border-lime-400/30'}`}>
                
                {/* Badges */}
                <div className="flex justify-between items-start mb-4">
                     <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${item.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                         {item.status === 'open' ? 'Applications Open' : 'Expired'}
                     </span>
                     <button onClick={() => toggleStar(item as Opportunity)} className={`${isStarred ? 'text-lime-400' : 'text-slate-600 hover:text-white'}`}>
                        <Star size={18} fill={isStarred ? "currentColor" : "none"} />
                     </button>
                </div>

                <h3 className="font-display text-xl font-bold text-white mb-1 leading-tight">{item.title}</h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-4">{item.organization}</p>

                <div className="space-y-3 mb-6 border-t border-white/5 pt-4">
                    {activeTab === 'financial' && 'amount' in item && (
                         <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">Amount</span>
                            <span className="text-sm font-bold text-lime-400">{item.amount}</span>
                         </div>
                    )}
                    {activeTab === 'career' && 'department' in item && (
                         <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">Department</span>
                            <span className="text-sm font-bold text-blue-400 uppercase">{item.department}</span>
                         </div>
                    )}
                    <div>
                        <span className="text-xs text-slate-500 block mb-1">Eligibility</span>
                        <p className="text-sm text-slate-300 leading-snug line-clamp-2">{item.eligibility}</p>
                    </div>
                </div>

                <div className="flex gap-2 mt-auto">
                    <Button variant="secondary" className="flex-1 text-xs py-2 h-10" onClick={() => window.open(item.link || '#', '_blank')} disabled={item.status === 'expired'}>
                        {activeTab === 'financial' ? 'Apply Now' : 'View Job'}
                    </Button>
                    {activeTab === 'financial' && (
                        <button 
                            onClick={() => { setEligibilityModal({open: true, scheme: item as Scheme}); setEligibilityResult(null); setUserProfile(''); }}
                            className="h-10 px-3 flex items-center justify-center rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-lime-400 hover:border-lime-400/50 transition-colors text-xs font-bold uppercase"
                        >
                            Check Eligibility
                        </button>
                    )}
                </div>
             </div>
           );
        })}
      </div>

      {/* --- ELIGIBILITY CHECKER MODAL --- */}
      {eligibilityModal.open && eligibilityModal.scheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <Card className="max-w-md w-full shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
                          <Shield size={20} className="text-lime-400" /> Eligibility Check
                      </h3>
                      <button onClick={() => setEligibilityModal({open: false})}><X size={20} className="text-slate-500" /></button>
                  </div>
                  
                  <div className="bg-slate-900 p-4 rounded-lg border border-white/10 mb-6">
                      <h4 className="text-slate-400 text-xs font-bold uppercase mb-2">Reviewing for:</h4>
                      <p className="text-white text-sm font-medium">{eligibilityModal.scheme.title}</p>
                      <p className="text-slate-500 text-xs mt-1">{eligibilityModal.scheme.eligibility}</p>
                  </div>

                  {!eligibilityResult ? (
                      <div>
                          <div className="mb-4">
                              <label className="text-xs uppercase tracking-widest text-lime-400/80 font-display font-medium mb-1 block">Your Profile / Achievements</label>
                              <textarea 
                                  className="w-full bg-slate-900/50 border border-white/10 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-lime-400/50 h-24 placeholder:text-slate-600"
                                  placeholder="e.g. I won Gold at State Level Football 2023. I am 22 years old."
                                  value={userProfile}
                                  onChange={(e) => setUserProfile(e.target.value)}
                              />
                          </div>

                          <div className="text-center py-2">
                              {!isAnalyzing ? (
                                  <Button className="w-full" onClick={handleCheckEligibility}>Run AI Analysis</Button>
                              ) : (
                                  <div className="flex items-center justify-center gap-2 text-lime-400 text-sm font-bold animate-pulse">
                                      <Bot size={18} /> Checking Government Criteria...
                                  </div>
                              )}
                          </div>
                      </div>
                  ) : (
                      <div className={`p-4 rounded-lg border text-sm leading-relaxed mb-4 ${eligibilityResult.includes("QUALIFIED") ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100' : 'bg-rose-500/10 border-rose-500/30 text-rose-100'}`}>
                           {eligibilityResult}
                      </div>
                  )}
                  
                  {eligibilityResult && (
                      <Button variant="secondary" className="w-full" onClick={() => setEligibilityModal({open: false})}>Close</Button>
                  )}
              </Card>
          </div>
      )}

      {/* --- SPORTS CV BUILDER MODAL --- */}
      {cvModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-4xl h-[80vh] flex overflow-hidden shadow-2xl">
                  {/* Left: Input */}
                  <div className="w-1/3 p-6 border-r border-white/5 bg-slate-950 overflow-y-auto">
                      <h3 className="font-display font-bold text-white text-lg mb-6 uppercase">CV Details</h3>
                      <div className="space-y-4">
                          <Input label="Full Name" value={cvData.name} onChange={e => setCvData({...cvData, name: e.target.value})} placeholder="e.g. Rahul Kumar" />
                          <Input label="Sport & Position" value={cvData.sport} onChange={e => setCvData({...cvData, sport: e.target.value})} placeholder="e.g. Cricket (Wicket-Keeper)" />
                          <div>
                              <label className="text-xs uppercase tracking-widest text-lime-400/80 font-display font-medium block mb-1">Key Medals (Comma Sep)</label>
                              <textarea 
                                className="w-full bg-slate-900/50 border border-white/10 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-lime-400/50 h-24"
                                placeholder="Gold - All India Inter-University 2023, Silver - Senior Nationals 2022"
                                value={cvData.medals}
                                onChange={e => setCvData({...cvData, medals: e.target.value})}
                              />
                          </div>
                          <Input label="Representation Years" value={cvData.years} onChange={e => setCvData({...cvData, years: e.target.value})} placeholder="e.g. 2018-2024" />
                      </div>
                  </div>

                  {/* Right: Preview */}
                  <div className="w-2/3 p-8 bg-slate-800 flex flex-col items-center justify-center relative">
                      <button onClick={() => setCvModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
                      
                      <div className="bg-white text-slate-900 w-full max-w-[500px] aspect-[1/1.414] p-8 shadow-2xl transform scale-90 origin-top flex flex-col">
                          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
                              <div>
                                <h1 className="font-bold text-2xl uppercase tracking-tight">{cvData.name || "ATHLETE NAME"}</h1>
                                <p className="text-sm font-medium text-slate-600 uppercase">{cvData.sport || "SPORT / DISCIPLINE"}</p>
                              </div>
                              <div className="text-right text-xs">
                                  <p>Sports Quota Applicant</p>
                              </div>
                          </div>
                          
                          <div className="mb-6">
                              <h2 className="font-bold text-sm uppercase border-b border-slate-300 mb-2">Sports Achievements</h2>
                              <ul className="text-sm list-disc pl-4 space-y-1">
                                  {cvData.medals ? cvData.medals.split(',').map((m, i) => <li key={i}>{m.trim()}</li>) : <li className="text-slate-400 italic">List your medals here...</li>}
                              </ul>
                          </div>

                          <div className="mb-6">
                              <h2 className="font-bold text-sm uppercase border-b border-slate-300 mb-2">Representation History</h2>
                              <p className="text-sm">{cvData.years || "Years active..."}</p>
                          </div>
                          
                          <div className="mt-auto border-t border-slate-200 pt-4 text-[10px] text-center text-slate-500">
                              Generated by Second Innings Sports CV Builder
                          </div>
                      </div>

                      <Button className="mt-4" onClick={() => alert("Printing Feature would open system dialog here.")}>
                          <Printer size={16} className="mr-2" /> Print / Save PDF
                      </Button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};
