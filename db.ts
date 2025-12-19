
import Dexie, { type EntityTable } from 'dexie';
import { Roadmap, Opportunity } from './types';

const db = new Dexie('SecondInningsDB') as Dexie & {
  roadmaps: EntityTable<Roadmap, 'id'>;
  opportunities: EntityTable<Opportunity, 'id'>;
};

// Version 1
db.version(1).stores({
  roadmaps: '++id, type, sport, timestamp'
});

// Version 2: Add opportunities
db.version(2).stores({
  roadmaps: '++id, type, sport, timestamp',
  opportunities: 'id, category' 
});

export { db };
