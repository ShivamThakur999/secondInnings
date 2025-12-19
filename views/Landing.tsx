import React from 'react';
import { ViewState } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ArrowRight, Activity, Users } from 'lucide-react';

interface LandingProps {
  onNavigate: (view: ViewState) => void;
}

export const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-lime-400/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 text-center z-10 py-20">
        <h1 className="font-display text-6xl md:text-8xl font-bold text-white tracking-tighter mb-6">
          SECOND <span className="text-lime-400 inline-block transform hover:skew-x-12 transition-transform duration-300">INNINGS</span>
        </h1>
        
        <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          The ultimate AI-powered career architect for athletes. <br/>
          Whether you're just stepping onto the field or hanging up your boots, we have a plan for you.
        </p>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* First Innings CTA */}
          <button 
            onClick={() => onNavigate('first-innings')}
            className="group relative text-left"
          >
            <Card className="h-full border-lime-400/20 hover:border-lime-400/50 transition-all duration-300 hover:translate-y-[-5px]">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-lime-400/10 rounded-lg text-lime-400">
                        <Activity size={32} />
                    </div>
                    <ArrowRight className="text-slate-600 group-hover:text-lime-400 group-hover:translate-x-2 transition-all" />
                </div>
                <h2 className="font-display text-3xl font-bold text-white mb-2">FIRST INNINGS</h2>
                <p className="text-slate-400 text-sm mb-6">
                    For aspiring athletes (ages 10-25). Get AI-generated training roadmaps, diet plans, and career milestones specific to your sport and level.
                </p>
                <span className="text-lime-400 text-sm font-bold tracking-widest uppercase">Start Journey →</span>
            </Card>
          </button>

          {/* Second Innings CTA */}
          <button 
            onClick={() => onNavigate('second-innings')}
            className="group relative text-left"
          >
            <Card className="h-full border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:translate-y-[-5px]">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                        <Users size={32} />
                    </div>
                    <ArrowRight className="text-slate-600 group-hover:text-purple-400 group-hover:translate-x-2 transition-all" />
                </div>
                <h2 className="font-display text-3xl font-bold text-white mb-2">SECOND INNINGS</h2>
                <p className="text-slate-400 text-sm mb-6">
                    For retired athletes & professionals. Pivot your sports experience into high-value careers in management, analytics, coaching, and more.
                </p>
                <span className="text-purple-400 text-sm font-bold tracking-widest uppercase">Begin Pivot →</span>
            </Card>
          </button>
        </div>
      </main>

      {/* Footer Stats */}
      <footer className="w-full border-t border-white/5 bg-slate-900/30 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 uppercase tracking-widest">
            <div>Powered by Gemini 3 Flash</div>
            <div className="mt-2 md:mt-0">Local-First Architecture • DexieDB</div>
        </div>
      </footer>
    </div>
  );
};