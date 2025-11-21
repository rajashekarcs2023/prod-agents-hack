export enum AgentState {
  IDLE = 'IDLE',
  SCRAPING = 'SCRAPING',       // Lightpanda (Extracting listing data)
  INVESTIGATING = 'INVESTIGATING', // Parallel (Background checks, crime, landlord)
  ANALYZING = 'ANALYZING',     // Gemini (Truth scoring)
  ACTING = 'ACTING',           // Postman (API) + Lightpanda (Browser Actions)
  REPORTING = 'REPORTING',     // Sanity (Persisting Data)
  LEARNING = 'LEARNING'        // Self-improvement step
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: 'SYSTEM' | 'PARALLEL' | 'LIGHTPANDA' | 'GEMINI' | 'POSTMAN' | 'SANITY';
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AgentAction {
  id: string;
  type: 'API_CALL' | 'BROWSER_INTERACTION' | 'NOTIFICATION';
  description: string;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
  detail?: string;
}

export interface UserPreferences {
  city: string;
  budget: number;
  priorities: {
    safety: number; // 1-5
    commute: number; // 1-5
    quietness: number; // 1-5
    value: number; // 1-5
  };
}

export interface TruthReport {
  verdict: 'RECOMMENDED' | 'CAUTION' | 'AVOID';
  verdictTitle: string; // e.g., "👍 Worth pursuing"
  overallScore: number; // 0-100
  scores: {
    scamRisk: 'Low' | 'Medium' | 'High';
    safety: number; // 0-10
    noise: number; // 0-10
    value: string; // e.g. "Fair", "Overpriced"
    commute: string; // e.g. "45m"
  };
  evidence: {
    category: 'Safety' | 'Noise' | 'Landlord' | 'Value';
    points: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
  }[];
  summary: string;
  actionRecommendation: 'SHORTLIST' | 'BLACKLIST' | 'SCHEDULE_TOUR' | 'AVOID';
}

export interface SourceWeight {
  source: string;
  reliability: number; // 0-100
  trend: 'up' | 'down' | 'stable';
}