import React, { useMemo, useState } from 'react';
import { Button } from './ui/Button';
import { RoadmapData } from '../types';
import { MapPin, Building2, Wallet, Briefcase, GraduationCap, Calendar, ChevronDown, Download, ExternalLink, Share2 } from 'lucide-react';

interface RoadmapDisplayProps {
  content: string;
  onSave?: () => void;
  onReset: () => void;
  isSaving?: boolean;
}

const RoadmapStep = ({ step, index }: { step: RoadmapData['roadmap_steps'][0], index: number }) => {
  // Only the first step is expanded by default to improve readability
  const [isExpanded, setIsExpanded] = useState(index === 0);

  return (
    <div className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">
        {/* Icon Indicator - Aligned to top (mt-4) to match header text */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-slate-900 shadow-lg shadow-black/50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mt-4 transition-transform group-hover:scale-110 duration-300">
           <span className={`text-xs font-bold ${isExpanded ? 'text-lime-400' : 'text-slate-500 group-hover:text-lime-400'} transition-colors`}>{index + 1}</span>
        </div>
        
        {/* Content Card */}
        <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-900/40 rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-lime-400/20 shadow-[0_0_30px_rgba(163,230,53,0.05)]' : 'border-white/5 hover:border-white/10'}`}>
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left p-5 flex justify-between items-start focus:outline-none group/btn select-none"
                aria-expanded={isExpanded}
            >
                <div className="pr-4">
                    <h4 className={`font-display font-bold text-lg transition-colors duration-300 ${isExpanded ? 'text-lime-400' : 'text-white group-hover/btn:text-lime-400'}`}>
                      {step.phase}
                    </h4>
                    <span className="text-[10px] font-medium bg-slate-800 text-slate-400 px-2 py-1 rounded border border-white/5 mt-2 inline-block">
                      {step.duration}
                    </span>
                </div>
                
                {/* Animated Chevron */}
                <div className={`p-2 rounded-full transition-all duration-300 transform ${isExpanded ? 'bg-lime-400/10 text-lime-400 rotate-180' : 'bg-white/5 text-slate-500 group-hover/btn:bg-white/10 group-hover/btn:text-white rotate-0'}`}>
                    <ChevronDown size={16} />
                </div>
            </button>
            
            {/* Smooth Height Animation */}
            <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <ul className="space-y-3 px-5 pb-6 border-t border-white/5 pt-4">
                        {step.actions?.map((action, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-lime-500/50 shrink-0"></span>
                                <span>{action}</span>
                            </li>
                        )) || <li className="text-sm text-slate-500 italic">Detailed actions loading...</li>}
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );
};

export const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({ content, onSave, onReset, isSaving }) => {
  
  const data: RoadmapData | null = useMemo(() => {
    try {
      // Clean content of markdown fences if present
      const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanContent);
    } catch (e) {
      console.error("Failed to parse roadmap JSON", e);
      return null;
    }
  }, [content]);

  const handleExport = () => {
    if (!data) return;
    
    // Format text as Markdown for better Google Drive/Docs compatibility
    const textContent = `# SECOND INNINGS STRATEGIC BLUEPRINT
**${data.title}**

---

## CURRENT SITUATION
${data.current_status_analysis}

## EXECUTION ROADMAP
${data.roadmap_steps.map((step, i) => `
### Phase ${i+1}: ${step.phase}
**Duration:** ${step.duration}
${step.actions.map(a => `- ${a}`).join('\n')}
`).join('\n')}

${data.pivot_options ? `
## CAREER PIVOT OPTIONS
${data.pivot_options.map(p => `
### ${p.role}
- **Description:** ${p.description}
- **Pathway:** ${p.pathway}
`).join('\n')}
` : ''}

## KEY INSTITUTIONS
${data.key_institutions.map(inst => `- ${inst}`).join('\n')}

## FINANCIAL AID
${data.financial_aid_tips.map(tip => `- ${tip}`).join('\n')}

---
*Generated by Second Innings AI*
`;

    const blob = new Blob([textContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Using .md extension allows for preview in Drive and "Open with Google Docs"
    a.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGoogleMapsSearch = (query: string) => {
    // Open in new tab with secure features
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Fallback for generic markdown if parsing fails (legacy support)
  if (!data || !data.title) {
     return (
        <div className="p-4 text-slate-300">
           <p>Format not supported or error parsing data.</p>
           <Button variant="ghost" onClick={onReset} className="mt-4">Reset</Button>
        </div>
     );
  }

  return (
    <div className="animate-fade-in space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 gap-4">
        <div>
           <div className="inline-block px-2 py-1 bg-lime-400/10 rounded text-lime-400 text-[10px] font-bold uppercase tracking-widest mb-2 border border-lime-400/20">
             Strategic Blueprint
           </div>
           <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight">{data.title}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="ghost" onClick={handleExport} className="text-xs py-2 px-3 border border-white/10 hover:border-lime-400/50 hover:text-lime-400 group" title="Download as Markdown (Upload to Google Drive)">
               <Download size={14} className="mr-2 group-hover:scale-110 transition-transform" /> 
               <span className="hidden sm:inline">Save to Drive / Export</span>
           </Button>
           <Button variant="ghost" onClick={onReset} className="text-xs py-2 px-4 border border-white/10">New Search</Button>
           {onSave && <Button onClick={onSave} isLoading={isSaving} className="text-xs py-2 px-4">Save to Locker</Button>}
        </div>
      </div>

      {/* Analysis Section */}
      <div className="bg-slate-800/50 p-6 rounded-lg border-l-4 border-lime-400">
         <h3 className="text-lime-400 font-display text-lg font-bold uppercase mb-2">Current Situation Analysis</h3>
         <p className="text-slate-300 leading-relaxed text-sm md:text-base">{data.current_status_analysis}</p>
      </div>

      {/* Main Roadmap Timeline */}
      <div>
         <div className="flex items-center gap-2 mb-6">
            <Calendar className="text-lime-400" size={20} />
            <h3 className="text-xl font-display font-bold text-white uppercase">Execution Roadmap</h3>
         </div>
         <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
            {data.roadmap_steps?.map((step, idx) => (
                <RoadmapStep key={idx} step={step} index={idx} />
            ))}
         </div>
      </div>

      {/* Pivot Options (Render only if available) */}
      {data.pivot_options && data.pivot_options.length > 0 && (
         <div>
            <div className="flex items-center gap-2 mb-6 mt-12">
               <Briefcase className="text-purple-400" size={20} />
               <h3 className="text-xl font-display font-bold text-white uppercase">Career Pivot Pathways</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
               {data.pivot_options.map((option, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-5 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all group">
                     <h4 className="font-display font-bold text-white text-lg mb-2 group-hover:text-purple-400 transition-colors">{option.role}</h4>
                     <p className="text-xs text-slate-400 mb-4 h-10 line-clamp-2">{option.description}</p>
                     <div className="bg-purple-500/10 p-3 rounded border border-purple-500/10">
                        <div className="text-[10px] uppercase font-bold text-purple-400 mb-1">Recommended Pathway</div>
                        <p className="text-xs text-slate-300">{option.pathway}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* Info Grid: Institutions & Financial Aid */}
      <div className="grid md:grid-cols-2 gap-8 mt-12">
         {/* Institutions with Google Maps Integration */}
         <div className="bg-slate-900/30 p-6 rounded-lg border border-white/5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                   <Building2 className="text-blue-400" size={18} />
                   <h3 className="font-display font-bold text-white uppercase">Key Indian Institutions</h3>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-white/5">Tap to Locate</span>
            </div>
            <ul className="space-y-3">
               {data.key_institutions?.map((inst, idx) => (
                  <li key={idx}>
                      <button 
                          onClick={() => handleGoogleMapsSearch(inst)}
                          className="w-full flex items-start gap-3 text-sm text-slate-300 bg-slate-800/50 p-3 rounded hover:bg-slate-800 hover:text-white transition-all group border border-transparent hover:border-blue-400/30 text-left"
                          title="View on Google Maps"
                      >
                         <MapPin size={14} className="mt-0.5 text-blue-400 shrink-0 group-hover:text-lime-400 transition-colors" />
                         <span className="flex-1">{inst}</span>
                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-[10px] text-lime-400 font-bold uppercase">Map</span>
                             <ExternalLink size={10} className="text-lime-400" />
                         </div>
                      </button>
                  </li>
               ))}
            </ul>
         </div>

         {/* Financial Aid */}
         <div className="bg-slate-900/30 p-6 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 mb-4">
               <Wallet className="text-green-400" size={18} />
               <h3 className="font-display font-bold text-white uppercase">Scholarships & Grants</h3>
            </div>
             <ul className="space-y-3">
               {data.financial_aid_tips?.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 bg-slate-800/50 p-3 rounded">
                     <GraduationCap size={14} className="mt-0.5 text-green-400 shrink-0" />
                     {tip}
                  </li>
               ))}
            </ul>
         </div>
      </div>
    </div>
  );
};
