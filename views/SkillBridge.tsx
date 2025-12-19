
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { translateAthleticSkills } from '../services/geminiService';
import { BrainCircuit, ArrowRight, BookOpen, MonitorPlay, BarChart3, Binary, Award, ExternalLink } from 'lucide-react';

export const SkillBridge: React.FC = () => {
  const [sport, setSport] = useState('');
  const [role, setRole] = useState('');
  const [translation, setTranslation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sport || !role) return;
    setIsLoading(true);
    const result = await translateAthleticSkills(sport, role);
    try {
        setTranslation(JSON.parse(result));
    } catch(e) {
        setTranslation(null);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 animate-fade-in">
        
        <div className="mb-12">
            <div className="inline-block px-3 py-1 bg-cyan-500/10 rounded text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2 border border-cyan-500/20">
             Upskilling Engine
           </div>
           <h1 className="font-display text-5xl font-bold text-white mb-4">Skill <span className="text-cyan-400">Bridge</span></h1>
           <p className="text-slate-400 max-w-2xl text-lg">
             Don't start from zero. Your "Game Sense" is actually Data Analytics in disguise. 
             Use our translator to find your corporate superpower.
           </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Translator Tool */}
            <div>
                <Card title="The Skill Translator" className="border-cyan-500/20 shadow-2xl shadow-cyan-900/10">
                    <div className="space-y-4">
                        <Input label="My Sport" placeholder="e.g. Kabaddi, Cricket" value={sport} onChange={e => setSport(e.target.value)} />
                        <Input label="My Role" placeholder="e.g. Raider, Wicket-Keeper, Defender" value={role} onChange={e => setRole(e.target.value)} />
                        
                        <Button className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400" onClick={handleTranslate} isLoading={isLoading}>
                            Translate to Tech Skills
                        </Button>
                    </div>

                    {translation && (
                        <div className="mt-8 pt-8 border-t border-white/10 animate-fade-in">
                            <div className="bg-slate-950 p-6 rounded-lg border border-cyan-500/30">
                                <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-widest mb-2">Core Transferable Skill</h3>
                                <div className="text-2xl font-display font-bold text-white mb-4">{translation.core_transferable_skill}</div>
                                
                                <h3 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-2">Corporate Translation</h3>
                                <p className="text-slate-300 text-sm leading-relaxed mb-6">{translation.corporate_translation}</p>
                                
                                <h3 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-2">Suggested Roles</h3>
                                <div className="flex flex-wrap gap-2">
                                    {translation.suggested_roles?.map((r: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white">
                                            {r}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Right: Pathways */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="text-cyan-400" />
                    <h2 className="font-display text-2xl font-bold text-white uppercase">Learning Pathways</h2>
                </div>

                {/* Path 1 */}
                <div className="group bg-slate-900/40 border border-white/5 p-6 rounded-xl hover:bg-slate-900/60 hover:border-cyan-500/30 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-cyan-500/10 rounded text-cyan-400">
                            <BarChart3 size={24} />
                        </div>
                        <ArrowRight className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-white mb-2">Sports Data Analyst</h3>
                    <p className="text-sm text-slate-400 mb-4">
                        Learn Python and SQL to analyze player performance stats. Perfect for strategists.
                    </p>
                    <div className="flex gap-2">
                        <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">Python</span>
                        <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">Tableau</span>
                    </div>
                </div>

                {/* Path 2 */}
                <div className="group bg-slate-900/40 border border-white/5 p-6 rounded-xl hover:bg-slate-900/60 hover:border-cyan-500/30 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-500/10 rounded text-purple-400">
                            <MonitorPlay size={24} />
                        </div>
                        <ArrowRight className="text-slate-600 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-white mb-2">Video Performance Analyst</h3>
                    <p className="text-sm text-slate-400 mb-4">
                        Master Dartfish or Hudl to break down game footage. Ideal for those with high "Game IQ".
                    </p>
                    <div className="flex gap-2">
                        <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">Dartfish</span>
                        <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">Tagging</span>
                    </div>
                </div>

                {/* Resources */}
                <div className="bg-slate-950 border border-white/10 p-6 rounded-xl">
                    <h3 className="font-bold text-white text-sm uppercase mb-4">Official Certification Partners</h3>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li className="flex items-center gap-2 hover:text-cyan-400 cursor-pointer">
                            <ExternalLink size={14} /> <span>LNIPE Gwalior (Sports Management)</span>
                        </li>
                        <li className="flex items-center gap-2 hover:text-cyan-400 cursor-pointer">
                            <ExternalLink size={14} /> <span>RESET Programme (BCCI/NCA)</span>
                        </li>
                        <li className="flex items-center gap-2 hover:text-cyan-400 cursor-pointer">
                            <ExternalLink size={14} /> <span>Netaji Subhas National Institute (NIS)</span>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </div>
  );
};
