
export type ViewState = 'landing' | 'first-innings' | 'second-innings' | 'opportunity-hub' | 'skill-bridge' | 'mental-safe-zone';

export interface Roadmap {
  id?: number;
  type: 'first-innings' | 'second-innings';
  sport: string; // or "Pivot" for second innings
  title: string;
  summary: string;
  fullContent: string; // The AI response (JSON string)
  timestamp: Date;
}

export interface RoadmapData {
  title: string;
  current_status_analysis: string;
  roadmap_steps: {
    phase: string;
    duration: string;
    actions: string[];
  }[];
  pivot_options?: {
    role: string;
    description: string;
    pathway: string;
  }[];
  key_institutions: string[];
  financial_aid_tips: string[];
}

export interface FirstInningsForm {
  sport: string;
  age: string;
  level: string;
  goal: string;
}

export interface SecondInningsForm {
  sport: string;
  yearsPlayed: string;
  constraints: string[];
  identityScore: number; // 1-10
  physicalCapacity: string; // 'field', 'desk', 'mixed'
  role: string; // 'strategist', 'motivator', 'technician'
  financialUrgency: string; // 'immediate', 'stable', 'study'
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: 'pension' | 'scholarship' | 'job';
  eligibility: string;
  benefit: string;
  deadline?: string;
  link?: string;
  status?: 'open' | 'expired';
}

export interface JobPosting extends Opportunity {
  department: 'Police' | 'Railways' | 'Bank' | 'Army' | 'Corporate';
  designation: string;
  quotaType: string;
}

export interface Scheme extends Opportunity {
  amount: string;
  checklist: string[];
}
