
import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { ViewState, Roadmap } from '../types';
import { LayoutDashboard, History, Trophy, RefreshCcw, LogOut, Trash2, AlertTriangle, Briefcase, GraduationCap, Heart } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLoadRoadmap: (roadmap: Roadmap) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLoadRoadmap, isOpen, toggleSidebar }) => {
  const roadmaps = useLiveQuery(() => db.roadmaps.orderBy('timestamp').reverse().toArray());
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (deleteId) {
      await db.roadmaps.delete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-lg max-w-sm w-full shadow-2xl transform scale-100">
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <AlertTriangle size={24} />
              <h3 className="font-display font-bold text-lg uppercase tracking-wide">Delete Strategy?</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to remove this roadmap from your locker? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-slate-950 border-r border-white/5 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Logo Area */}
        <div className="p-8 border-b border-white/5">
          <h1 className="font-display text-3xl font-bold text-white tracking-tighter italic">
            SECOND <span className="text-lime-400">INNINGS</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 tracking-widest uppercase">Elite Career Architecture</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="mb-8">
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Main Menu</p>
            <button 
              onClick={() => { setView('landing'); if(window.innerWidth < 768) toggleSidebar(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'landing' ? 'bg-lime-400/10 text-lime-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button 
              onClick={() => { setView('first-innings'); if(window.innerWidth < 768) toggleSidebar(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'first-innings' ? 'bg-lime-400/10 text-lime-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Trophy size={18} />
              First Innings <span className="text-[10px] ml-auto bg-slate-800 px-2 py-0.5 rounded text-slate-400">NEW</span>
            </button>
            <button 
              onClick={() => { setView('second-innings'); if(window.innerWidth < 768) toggleSidebar(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'second-innings' ? 'bg-lime-400/10 text-lime-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <RefreshCcw size={18} />
              Second Innings <span className="text-[10px] ml-auto bg-slate-800 px-2 py-0.5 rounded text-slate-400">PIVOT</span>
            </button>
            <button 
              onClick={() => { setView('opportunity-hub'); if(window.innerWidth < 768) toggleSidebar(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'opportunity-hub' ? 'bg-lime-400/10 text-lime-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Briefcase size={18} />
              Opportunity Hub
            </button>
            <button 
              onClick={() => { setView('skill-bridge'); if(window.innerWidth < 768) toggleSidebar(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'skill-bridge' ? 'bg-lime-400/10 text-lime-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <GraduationCap size={18} />
              Skill Bridge
            </button>
            <button 
              onClick={() => { setView('mental-safe-zone'); if(window.innerWidth < 768) toggleSidebar(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'mental-safe-zone' ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Heart size={18} />
              Safe Zone
            </button>
          </div>

          {/* History Section */}
          <div>
            <div className="flex items-center justify-between px-4 mb-4">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Locker Room</p>
                {roadmaps && roadmaps.length > 0 && (
                   <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">
                     {roadmaps.length}
                   </span>
                )}
              </div>
              <History size={14} className="text-slate-600" />
            </div>
            
            <div className="space-y-1">
              {roadmaps?.length === 0 && (
                <div className="px-4 py-8 text-center border border-dashed border-slate-800 rounded-lg mx-2">
                  <p className="text-xs text-slate-600">No saved roadmaps yet.</p>
                </div>
              )}
              {roadmaps?.map(roadmap => (
                <div 
                  key={roadmap.id}
                  className="group relative flex items-center rounded-lg hover:bg-white/5 transition-colors pr-2"
                >
                  <button
                    onClick={() => { onLoadRoadmap(roadmap); if(window.innerWidth < 768) toggleSidebar(); }}
                    className="flex-1 text-left px-4 py-3 min-w-0"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${roadmap.type === 'first-innings' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                        {roadmap.type === 'first-innings' ? 'ROOKIE' : 'VETERAN'}
                      </span>
                      <span className="text-[10px] text-slate-600">{roadmap.timestamp.toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-300 truncate group-hover:text-lime-400 transition-colors">
                      {roadmap.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {roadmap.sport}
                    </p>
                  </button>
                  
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (roadmap.id) setDeleteId(roadmap.id); 
                    }}
                    className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                    title="Delete Roadmap"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
