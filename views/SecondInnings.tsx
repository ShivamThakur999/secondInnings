import React, { useState } from 'react';
import { SecondInningsForm, Roadmap } from '../types';
import { Card } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { RoadmapDisplay } from '../components/RoadmapDisplay';
import { generateSecondInningsRoadmap } from '../services/geminiService';
import { db } from '../db';
import { RefreshCcw, Briefcase, BrainCircuit, Activity, HeartPulse, Wallet, ArrowRight, UserCheck, Phone, Stethoscope } from 'lucide-react';

interface SecondInningsProps {
  onBack: () => void;
  initialRoadmap?: Roadmap | null;
}

// Steps for the wizard
type Step = 'intro' | 'constraints' | 'identity' | 'physical' | 'role' | 'urgency' | 'generating' | 'results';

export const SecondInnings: React.FC<SecondInningsProps> = ({ onBack, initialRoadmap }) => {
  const [currentStep, setCurrentStep] = useState<Step>(initialRoadmap ? 'results' : 'intro');
  const [formData, setFormData] = useState<SecondInningsForm>({
    sport: 'Cricket',
    yearsPlayed: '',
    constraints: [],
    identityScore: 5,
    physicalCapacity: 'mixed',
    role: 'strategist',
    financialUrgency: 'stable'
  });
  
  const [result, setResult] = useState<string | null>(initialRoadmap?.fullContent || null);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (initialRoadmap) {
      setResult(initialRoadmap.fullContent);
      setCurrentStep('results');
    }
  }, [initialRoadmap]);

  const toggleConstraint = (constraint: string) => {
    setFormData(prev => {
      if (prev.constraints.includes(constraint)) {
        return { ...prev, constraints: prev.constraints.filter(c => c !== constraint) };
      }
      return { ...prev, constraints: [...prev.constraints, constraint] };
    });
  };

  const generatePlan = async () => {
    setCurrentStep('generating');
    const generatedRoadmap = await generateSecondInningsRoadmap(formData);
    setResult(generatedRoadmap);
    setCurrentStep('results');
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      await db.roadmaps.add({
        type: 'second-innings',
        sport: formData.sport,
        title: `Pivot Plan: ${formData.sport}`,
        summary: `Played ${formData.yearsPlayed} yrs. Role: ${formData.role}`,
        fullContent: result,
        timestamp: new Date()
      });
      alert("Pivot plan saved to Locker!");
    } catch (e) {
      console.error(e);
      alert("Failed to save.");
    }
    setIsSaving(false);
  };

  // --- Render Steps ---

  const renderIntro = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-white uppercase">Profile Setup</h2>
        <p className="text-slate-400 text-sm">Let's start with the basics of your career.</p>
      </div>
      <Select 
        label="Sport Played"
        value={formData.sport}
        onChange={(e) => setFormData({...formData, sport: e.target.value})}
        options={[
            { value: 'Cricket', label: 'Cricket' },
            { value: 'Football', label: 'Football' },
            { value: 'Badminton', label: 'Badminton' },
            { value: 'Tennis', label: 'Tennis' },
            { value: 'Hockey', label: 'Hockey' },
            { value: 'Athletics', label: 'Athletics' },
            { value: 'Kabaddi', label: 'Kabaddi' },
            { value: 'Other', label: 'Other' },
        ]}
      />
      <Input 
        label="Years Played"
        type="number"
        placeholder="e.g. 10"
        value={formData.yearsPlayed}
        onChange={(e) => setFormData({...formData, yearsPlayed: e.target.value})}
      />
      <Button 
        className="w-full mt-4" 
        onClick={() => {
            if(!formData.yearsPlayed) { alert("Please enter years played"); return; }
            setCurrentStep('constraints');
        }}
      >
        Start Discovery <ArrowRight className="inline ml-2 w-4 h-4" />
      </Button>
    </div>
  );

  const renderConstraints = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="text-center mb-6">
            <h2 className="text-xl font-display font-bold text-white uppercase">Current Reality</h2>
            <p className="text-slate-400 text-sm">What is holding you back right now? (Select all that apply)</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
            {['Acute Injury', 'Financial Pressure', 'Age Factor', 'Burnout/Mental Fatigue', 'Family Responsibility', 'Lack of Degrees'].map(opt => (
                <button
                    key={opt}
                    onClick={() => toggleConstraint(opt)}
                    className={`p-4 rounded-lg border text-sm font-medium transition-all ${
                        formData.constraints.includes(opt)
                        ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:bg-slate-800'
                    }`}
                >
                    {opt}
                </button>
            ))}
        </div>
        <Button className="w-full mt-6" onClick={() => setCurrentStep('identity')}>Next Step</Button>
    </div>
  );

  const renderIdentity = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="text-center mb-6">
            <h2 className="text-xl font-display font-bold text-white uppercase">Athletic Identity</h2>
            <p className="text-slate-400 text-sm">On a scale of 1-10, how lost do you feel without the sport?</p>
        </div>
        
        <div className="px-4">
            <input 
                type="range" 
                min="1" 
                max="10" 
                value={formData.identityScore} 
                onChange={(e) => setFormData({...formData, identityScore: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">
                <span>I'm adaptable (1)</span>
                <span className="text-purple-400 text-lg">{formData.identityScore}</span>
                <span>It's who I am (10)</span>
            </div>
        </div>

        <div className="bg-slate-900/50 p-4 rounded border border-white/5 text-sm text-slate-300">
            {formData.identityScore > 7 
                ? "Insight: You likely need a role that keeps you ON the field (Coaching, Umpiring) to feel fulfilled."
                : "Insight: You might be ready to explore corporate or management roles away from the turf."}
        </div>

        <Button className="w-full" onClick={() => setCurrentStep('physical')}>Next Step</Button>
    </div>
  );

  const renderPhysical = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="text-center mb-6">
            <h2 className="text-xl font-display font-bold text-white uppercase">Physical Capacity</h2>
            <p className="text-slate-400 text-sm">Can your body still handle the daily grind?</p>
        </div>
        <div className="space-y-3">
            {[
                { val: 'field', label: 'Active / On-Field', desc: 'I can demonstrate drills and stand for hours.' },
                { val: 'mixed', label: 'Hybrid', desc: 'I prefer a mix of field work and strategy.' },
                { val: 'desk', label: 'Desk / Analyst', desc: 'My body needs a rest. I want to use my brain.' }
            ].map(opt => (
                <button
                    key={opt.val}
                    onClick={() => setFormData({...formData, physicalCapacity: opt.val})}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                        formData.physicalCapacity === opt.val
                        ? 'bg-purple-500/20 border-purple-500 text-white'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:bg-slate-800'
                    }`}
                >
                    <div className="font-bold">{opt.label}</div>
                    <div className="text-xs opacity-70">{opt.desc}</div>
                </button>
            ))}
        </div>
        <Button className="w-full mt-4" onClick={() => setCurrentStep('role')}>Next Step</Button>
    </div>
  );

  const renderRole = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="text-center mb-6">
            <h2 className="text-xl font-display font-bold text-white uppercase">Locker Room Persona</h2>
            <p className="text-slate-400 text-sm">In your team, what was your unofficial role?</p>
        </div>
        <div className="grid grid-cols-1 gap-3">
             {[
                { val: 'strategist', label: 'The Strategist', desc: 'Captain/Senior. Obsessed with tactics & reading the game.', icon: BrainCircuit },
                { val: 'motivator', label: 'The Motivator', desc: 'Kept the team spirit high. Good communicator.', icon: HeartPulse },
                { val: 'technician', label: 'The Technician', desc: 'Obsessed with equipment, diet, or biomechanics.', icon: Activity },
            ].map(opt => (
                <button
                    key={opt.val}
                    onClick={() => setFormData({...formData, role: opt.val})}
                    className={`flex items-center gap-4 p-4 rounded-lg border text-left transition-all ${
                        formData.role === opt.val
                        ? 'bg-purple-500/20 border-purple-500 text-white'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:bg-slate-800'
                    }`}
                >
                    <div className={`p-3 rounded-full ${formData.role === opt.val ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        <opt.icon size={20} />
                    </div>
                    <div>
                        <div className="font-bold">{opt.label}</div>
                        <div className="text-xs opacity-70">{opt.desc}</div>
                    </div>
                </button>
            ))}
        </div>
        <Button className="w-full mt-4" onClick={() => setCurrentStep('urgency')}>Next Step</Button>
    </div>
  );

  const renderUrgency = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="text-center mb-6">
            <h2 className="text-xl font-display font-bold text-white uppercase">Financial Urgency</h2>
            <p className="text-slate-400 text-sm">How soon do you need a paycheck?</p>
        </div>
        <div className="space-y-3">
             {[
                { val: 'immediate', label: 'Immediate / Critical', desc: 'I need a job now. Govt quota or entry-level.' },
                { val: 'stable', label: 'Stable / 3-6 Months', desc: 'I have some runway to get certified.' },
                { val: 'study', label: 'Long Term / Can Study', desc: 'I can invest 1-2 years in a Degree/MBA.' },
            ].map(opt => (
                <button
                    key={opt.val}
                    onClick={() => setFormData({...formData, financialUrgency: opt.val})}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                        formData.financialUrgency === opt.val
                        ? 'bg-purple-500/20 border-purple-500 text-white'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:bg-slate-800'
                    }`}
                >
                    <div className="font-bold">{opt.label}</div>
                    <div className="text-xs opacity-70">{opt.desc}</div>
                </button>
            ))}
        </div>
        <Button className="w-full mt-6" onClick={generatePlan}> Reveal My Path </Button>
    </div>
  );

  const renderGenerating = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
        <RefreshCcw className="w-16 h-16 text-purple-400 animate-spin mb-6" />
        <h2 className="text-2xl font-display font-bold text-white uppercase">Analyzing Profile...</h2>
        <p className="text-slate-400 mt-2 max-w-sm">Mapping your {formData.yearsPlayed} years of {formData.sport} experience to high-demand industry roles.</p>
    </div>
  );

  // --- Main Render ---

  if (currentStep === 'results' && result) {
    return (
        <div className="max-w-4xl mx-auto p-6 md:p-12 animate-fade-in">
           <div className="mb-8">
              <button onClick={() => { setCurrentStep('intro'); setResult(null); }} className="text-slate-500 hover:text-white mb-4 flex items-center gap-2 text-sm">
                  ← Restart Discovery
              </button>
              <h1 className="font-display text-4xl font-bold text-white mb-2">CAREER <span className="text-purple-400">PIVOT</span></h1>
              <p className="text-slate-400">Transition strategy tailored to your identity and skills.</p>
           </div>
           
           <Card className="border-purple-500/20 mb-8">
              <RoadmapDisplay 
                content={result} 
                onReset={() => { setCurrentStep('intro'); setResult(null); }} 
                onSave={handleSave}
                isSaving={isSaving}
              />
           </Card>

           {/* Skill Bridge Section */}
            <div className="grid md:grid-cols-2 gap-4 animate-fade-in delay-500">
                <div className="bg-slate-900/40 border border-white/5 p-6 rounded-lg flex items-start gap-4 hover:bg-slate-900/60 transition-colors cursor-pointer group">
                    <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-white text-lg group-hover:text-blue-400 transition-colors">Mentorship Network</h3>
                        <p className="text-slate-400 text-sm mb-3">Connect with former athletes who have successfully transitioned to corporate roles.</p>
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Find a Mentor →</span>
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-white/5 p-6 rounded-lg flex items-start gap-4 hover:bg-slate-900/60 transition-colors cursor-pointer group">
                    <div className="p-3 bg-pink-500/10 rounded-full text-pink-400">
                        <Stethoscope size={24} />
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-white text-lg group-hover:text-pink-400 transition-colors">Physical & Mental Recovery</h3>
                        <p className="text-slate-400 text-sm mb-3">Access specialized physiotherapy and "Athlete Grief" counseling.</p>
                        <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">View Resources →</span>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 min-h-full flex flex-col md:flex-row gap-12 items-center">
      <div className="flex-1 space-y-6">
        <div className="inline-block px-3 py-1 bg-purple-900/30 border border-purple-500/30 rounded text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">
            Pivot Discovery Engine
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight">
          FIND YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            NEXT PLAY
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
            The transition is hard. We use a 5-dimensional assessment to map your on-field identity to real-world opportunities in the Indian sports ecosystem.
        </p>
        
        {/* Progress Indicator */}
        {currentStep !== 'intro' && currentStep !== 'generating' && (
             <div className="flex gap-2 mt-8">
                {['intro', 'constraints', 'identity', 'physical', 'role', 'urgency'].map((step, idx) => {
                     // Simple check to highlight completed steps
                     const steps = ['intro', 'constraints', 'identity', 'physical', 'role', 'urgency'];
                     const currentIdx = steps.indexOf(currentStep);
                     const isActive = idx <= currentIdx;
                     return (
                         <div key={step} className={`h-1.5 flex-1 rounded-full transition-all ${isActive ? 'bg-purple-500' : 'bg-slate-800'}`} />
                     );
                })}
             </div>
        )}
      </div>

      <div className="flex-1 w-full max-w-md relative">
        <Card className="shadow-2xl shadow-purple-900/20 border-purple-500/10 min-h-[400px] flex flex-col justify-center">
            {currentStep === 'intro' && renderIntro()}
            {currentStep === 'constraints' && renderConstraints()}
            {currentStep === 'identity' && renderIdentity()}
            {currentStep === 'physical' && renderPhysical()}
            {currentStep === 'role' && renderRole()}
            {currentStep === 'urgency' && renderUrgency()}
            {currentStep === 'generating' && renderGenerating()}
        </Card>
      </div>
    </div>
  );
};