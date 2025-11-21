import { GoogleGenAI } from "@google/genai";
import { AgentState, TruthReport, SourceWeight, AgentAction, UserPreferences } from "../types";

const SYSTEM_INSTRUCTION = `
You are the brain of "RentCheck", an autonomous agent. 
Your goal is to simulate a multi-agent system (Lightpanda, Parallel, Postman) that investigates apartment listings.
Input: Target URL, Current State, User Preferences.
Output: JSON containing logs, simulated investigation data, actions, and learning weights.
`;

export const generateAgentStep = async (
  url: string,
  currentState: AgentState,
  preferences: UserPreferences
): Promise<{
  logMessage: string;
  report?: TruthReport;
  weights?: SourceWeight[];
  actions?: AgentAction[];
}> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Target URL: ${url}
    Current State: ${currentState}
    User Preferences: ${JSON.stringify(preferences)}
    
    Generate a JSON response based on the state:

    IF SCRAPING (Lightpanda):
    - Log: "Lightpanda: Navigating to URL... Bypassing bot detection... Extracting DOM elements (price, address, hidden fields)."
    
    IF INVESTIGATING (Parallel):
    - Log: "Parallel Task: Cross-referencing address with City Crime Logs, Reddit threads, and Landlord Registries."
    
    IF ANALYZING (Gemini):
    - Log: "Synthesizing evidence against user priorities (Safety: ${preferences.priorities.safety}/5, Quiet: ${preferences.priorities.quietness}/5)."
    - Generate a "report" object with: 
      - verdict: 'RECOMMENDED' | 'CAUTION' | 'AVOID'
      - verdictTitle: Short punchy title (e.g. "👍 Worth pursuing")
      - overallScore: 0-100
      - scores: { scamRisk: 'Low'|'Med'|'High', safety: 0-10, noise: 0-10, value: string (e.g. "Fair"), commute: string (e.g. "35m") }
      - evidence: Array of { category: 'Safety'|'Noise'|'Landlord'|'Value', points: string[], sentiment: 'positive'|'neutral'|'negative' }
      - summary: 1-2 sentences
      - actionRecommendation: 'SHORTLIST' | 'BLACKLIST' | 'SCHEDULE_TOUR' | 'AVOID'
    
    IF ACTING (Postman/Lightpanda):
    - Log: "Executing autonomous workflows based on verdict."
    - Generate "actions": Array of { id, type: 'API_CALL'|'BROWSER_INTERACTION'|'NOTIFICATION', description, status: 'PENDING', detail }.
      - If Good Fit: "POST /shortlist", "Lightpanda: Click Schedule Tour", "Webhook: Notify User".
      - If Bad Fit: "POST /blacklist", "Database: Mark as Scammed".
    
    IF LEARNING:
    - Log: "Adjusting source weights based on signal consistency."
    - Generate "weights": Array of {source, reliability (0-100), trend}.

    JSON Format Only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      logMessage: "System: Rerouting connection to cognitive core...",
    };
  }
};