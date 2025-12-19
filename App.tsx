
import React, { useState } from 'react';
import { ViewState, Roadmap } from './types';
import { Sidebar } from './components/Sidebar';
import { Landing } from './views/Landing';
import { FirstInnings } from './views/FirstInnings';
import { SecondInnings } from './views/SecondInnings';
import { OpportunityHub } from './components/OpportunityHub';
import { SkillBridge } from './views/SkillBridge';
import { MentalSafeZone } from './views/MentalSafeZone';
import { Menu } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    setSelectedRoadmap(null); // Clear selected roadmap when navigating manually
    window.scrollTo(0, 0);
  };

  const handleLoadRoadmap = (roadmap: Roadmap) => {
    setSelectedRoadmap(roadmap);
    setCurrentView(roadmap.type);
    setIsSidebarOpen(false); // Close mobile sidebar
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans selection:bg-lime-400/30">
      
      <Sidebar 
        currentView={currentView} 
        setView={handleNavigate} 
        onLoadRoadmap={handleLoadRoadmap}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col relative w-full overflow-hidden">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
           <button onClick={() => setIsSidebarOpen(true)} className="text-white p-1">
             <Menu />
           </button>
           <span className="ml-4 font-display font-bold text-white tracking-tight">SECOND INNINGS</span>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {currentView === 'landing' && <Landing onNavigate={handleNavigate} />}
            
            {currentView === 'first-innings' && (
                <FirstInnings 
                    onBack={() => setCurrentView('landing')} 
                    initialRoadmap={selectedRoadmap?.type === 'first-innings' ? selectedRoadmap : null}
                />
            )}
            
            {currentView === 'second-innings' && (
                <SecondInnings 
                    onBack={() => setCurrentView('landing')}
                    initialRoadmap={selectedRoadmap?.type === 'second-innings' ? selectedRoadmap : null}
                />
            )}

            {currentView === 'opportunity-hub' && (
                <OpportunityHub />
            )}

            {currentView === 'skill-bridge' && (
                <SkillBridge />
            )}

            {currentView === 'mental-safe-zone' && (
                <MentalSafeZone />
            )}
        </div>
      </div>
    </div>
  );
}

export default App;
