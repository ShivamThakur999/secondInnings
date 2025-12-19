
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { generateMentalSupport } from '../services/geminiService';
import { Heart, Sun, Users, BookOpen, MessageCircle, Quote, ExternalLink, Leaf } from 'lucide-react';

const QUOTES = [
  { text: "You don't play for revenge, you play for respect and pride.", author: "Rahul Dravid" },
  { text: "I don't think I can ever be satisfied. That's the beauty of the game.", author: "PV Sindhu" },
  { text: "When I started losing, I started learning.", author: "Abhinav Bindra" },
  { text: "The medal is just a metal. The journey is the gold.", author: "Deepa Malik" },
  { text: "It is important to understand that there is a life beyond sport.", author: "Pullela Gopichand" }
];

const FOUNDATIONS = [
  { 
    name: "Abhinav Bindra Foundation", 
    focus: "Mental Wellness & High Performance", 
    link: "https://abhinavbindra.com/",
    desc: "Offers psychological support and workshops for elite and grassroots athletes."
  },
  { 
    name: "Mpower - The Centre", 
    focus: "Clinical Mental Health", 
    link: "https://mpowerminds.com/",
    desc: "Holistic mental health care with specific programs for sports psychology."
  },
  { 
    name: "GoSports Foundation", 
    focus: "Athlete Career Support", 
    link: "https://www.gosportsfoundation.in/",
    desc: "Empowerment programs that often include mentorship and well-being checks."
  }
];

export const MentalSafeZone: React.FC = () => {
  const [quote, setQuote] = useState(QUOTES[0]);
  const [step, setStep] = useState<'assessment' | 'result'>('assessment');
  const [answers, setAnswers] = useState({
    timeSince: '',
    misses: '',
    purpose: 5,
    mood: ''
  });
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  const handleAssess = async () => {
    setIsLoading(true);
    const result = await generateMentalSupport(answers);
    setAiResponse(result);
    setStep('result');
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 animate-fade-in min-h-full">
        
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 rounded-full text-sky-400 text-xs font-bold uppercase tracking-widest mb-3 border border-sky-500/20">
             <Heart size={12} fill="currentColor" />
             Safe Zone
           </div>
           <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">The Emotional <span className="text-sky-400">Pivot</span></h1>
           <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
             The silence after the crowd stops cheering is the loudest sound an athlete ever hears. 
             You are not just a jersey number. You are human first.
           </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Left Column: Assessment (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* Daily Quote */}
                <div className="bg-gradient-to-r from-sky-900/20 to-slate-900 border border-sky-500/20 p-6 rounded-xl flex items-start gap-4 relative overflow-hidden">
                    <Quote className="text-sky-500/20 absolute -top-4 -left-4 w-32 h-32 transform -scale-x-100" />
                    <div className="relative z-10 w-full">
                        <p className="font-display text-xl md:text-2xl text-white italic mb-3">"{quote.text}"</p>
                        <p className="text-sky-400 text-sm font-bold uppercase tracking-widest">— {quote.author}</p>
                    </div>
                </div>

                {/* Assessment Module */}
                <Card className="border-sky-500/10 bg-slate-900/60" title={step === 'assessment' ? "Grief to Growth Assessment" : "Your Personal Insight"}>
                    {step === 'assessment' ? (
                        <div className="space-y-6">
                            <p className="text-slate-400 text-sm italic">This is a non-clinical check-in to help you process the transition.</p>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <Input 
                                    label="Time since last competition?" 
                                    placeholder="e.g. 6 months, 2 years"
                                    value={answers.timeSince}
                                    onChange={(e) => setAnswers({...answers, timeSince: e.target.value})}
                                />
                                <Input 
                                    label="Current Mood (One Word)" 
                                    placeholder="e.g. Empty, Relieved, Anxious"
                                    value={answers.mood}
                                    onChange={(e) => setAnswers({...answers, mood: e.target.value})}
                                />
                            </div>

                            <Select 
                                label="What do you miss the most?"
                                options={[
                                    { value: 'Adrenaline', label: 'The Adrenaline / Competition' },
                                    { value: 'Locker Room', label: 'The Locker Room / Camaraderie' },
                                    { value: 'Identity', label: 'The Identity / Fame' },
                                    { value: 'Routine', label: 'The Routine / Structure' },
                                ]}
                                value={answers.misses}
                                onChange={(e) => setAnswers({...answers, misses: e.target.value})}
                            />

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-sky-400/80 font-display font-medium">
                                    Clarity of Purpose (1-10)
                                </label>
                                <input 
                                    type="range" min="1" max="10" 
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                                    value={answers.purpose}
                                    onChange={(e) => setAnswers({...answers, purpose: parseInt(e.target.value)})}
                                />
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Lost (1)</span>
                                    <span>Crystal Clear (10)</span>
                                </div>
                            </div>

                            <Button 
                                onClick={handleAssess} 
                                isLoading={isLoading}
                                className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 border-none"
                            >
                                Get Support Perspective
                            </Button>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="prose prose-invert prose-sm max-w-none">
                                <div className="bg-sky-500/5 border border-sky-500/10 p-6 rounded-lg text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {aiResponse}
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                className="mt-6 text-sky-400 hover:text-white"
                                onClick={() => setStep('assessment')}
                            >
                                Take Assessment Again
                            </Button>
                        </div>
                    )}
                </Card>

            </div>

            {/* Right Column: Resources (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
                
                <div className="bg-slate-900 border border-white/5 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Users className="text-sky-400" />
                        <h3 className="font-display font-bold text-white text-lg uppercase">Mentorship Directory</h3>
                    </div>
                    
                    <div className="space-y-4">
                        {FOUNDATIONS.map((f, i) => (
                            <a 
                                key={i} 
                                href={f.link} 
                                target="_blank" 
                                rel="noreferrer"
                                className="block p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-sky-500/30 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-white text-sm group-hover:text-sky-400 transition-colors">{f.name}</h4>
                                    <ExternalLink size={12} className="text-slate-600 group-hover:text-sky-400" />
                                </div>
                                <p className="text-xs text-sky-500 font-medium mb-2">{f.focus}</p>
                                <p className="text-xs text-slate-400 leading-snug">{f.desc}</p>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border border-emerald-500/20 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2 text-emerald-400">
                        <Leaf size={18} />
                        <h3 className="font-bold text-sm uppercase tracking-wide">Wellness Tip</h3>
                    </div>
                    <p className="text-sm text-slate-300 italic">
                        "Your worth is not measured by the scoreboard. Reconnect with hobbies you sacrificed for training—music, art, or just walking without a stopwatch."
                    </p>
                </div>

            </div>

        </div>
    </div>
  );
};
