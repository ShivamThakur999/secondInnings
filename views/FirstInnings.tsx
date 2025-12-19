import React, { useState } from 'react';
import { FirstInningsForm, Roadmap } from '../types';
import { Card } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { RoadmapDisplay } from '../components/RoadmapDisplay';
import { generateFirstInningsRoadmap } from '../services/geminiService';
import { db } from '../db';
import { Trophy, Target, ArrowRight } from 'lucide-react';

interface FirstInningsProps {
  onBack: () => void;
  initialRoadmap?: Roadmap | null;
}

export const FirstInnings: React.FC<FirstInningsProps> = ({ onBack, initialRoadmap }) => {
  const [formData, setFormData] = useState<FirstInningsForm>({
    sport: 'Cricket',
    age: '',
    level: 'Beginner',
    goal: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(initialRoadmap?.fullContent || null);
  const [isSaving, setIsSaving] = useState(false);

  // If initialRoadmap changes (e.g. loading from sidebar), update result
  React.useEffect(() => {
    if (initialRoadmap) {
      setResult(initialRoadmap.fullContent);
    } else {
      setResult(null); // Reset if switching to clean view
    }
  }, [initialRoadmap]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const generatedRoadmap = await generateFirstInningsRoadmap(formData);
    setResult(generatedRoadmap);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      await db.roadmaps.add({
        type: 'first-innings',
        sport: formData.sport,
        title: `${formData.sport} Roadmap (${formData.age}yo)`,
        summary: formData.goal,
        fullContent: result,
        timestamp: new Date()
      });
      alert("Roadmap saved to Locker!");
    } catch (e) {
      console.error(e);
      alert("Failed to save.");
    }
    setIsSaving(false);
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-12 animate-fade-in">
         <div className="mb-8">
            <button onClick={() => setResult(null)} className="text-slate-500 hover:text-white mb-4 flex items-center gap-2 text-sm">
                ← Back to Config
            </button>
            <h1 className="font-display text-4xl font-bold text-white mb-2">ROADMAP <span className="text-lime-400">GENERATED</span></h1>
            <p className="text-slate-400">Customized for a {formData.age} year old {formData.sport} athlete.</p>
         </div>
         <Card>
            <RoadmapDisplay 
              content={result} 
              onReset={() => setResult(null)} 
              onSave={handleSave}
              isSaving={isSaving}
            />
         </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 min-h-full flex flex-col md:flex-row gap-12 items-center">
      <div className="flex-1 space-y-6">
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight">
          START YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-lime-600">
            LEGACY
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
          The First Innings is where foundations are built. Whether you're 8 or 18, get a pro-level development plan tailored to your physiology and goals.
        </p>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="p-4 rounded bg-slate-900/50 border border-white/5">
            <Trophy className="text-lime-400 mb-2" />
            <div className="font-bold text-white">Pro Metrics</div>
            <div className="text-xs text-slate-500">Benchmark vs elites</div>
          </div>
          <div className="p-4 rounded bg-slate-900/50 border border-white/5">
            <Target className="text-lime-400 mb-2" />
            <div className="font-bold text-white">Drill Sets</div>
            <div className="text-xs text-slate-500">Daily practice plans</div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-md">
        <Card title="Player Configuration" className="shadow-2xl shadow-lime-900/20">
          <form onSubmit={handleSubmit}>
            <Select 
              label="Select Sport"
              value={formData.sport}
              onChange={(e) => setFormData({...formData, sport: e.target.value})}
              options={[
                { value: 'Cricket', label: 'Cricket' },
                { value: 'Football', label: 'Football' },
                { value: 'Badminton', label: 'Badminton' },
                { value: 'Tennis', label: 'Tennis' },
                { value: 'Athletics', label: 'Athletics' },
                { value: 'Basketball', label: 'Basketball' },
              ]}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Age"
                type="number"
                placeholder="e.g. 14"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                required
              />
              <Select 
                label="Current Level"
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                options={[
                  { value: 'Beginner', label: 'Rookie (0-2 yrs)' },
                  { value: 'Intermediate', label: 'Club/School Level' },
                  { value: 'Advanced', label: 'District/State' },
                  { value: 'Elite', label: 'National Prospect' },
                ]}
              />
            </div>

            <Input 
              label="Primary Goal"
              placeholder="e.g. Make the U-16 State Team"
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
              required
            />

            <Button type="submit" className="w-full mt-4 flex justify-between items-center group" isLoading={isLoading}>
              <span>Generate Roadmap</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};