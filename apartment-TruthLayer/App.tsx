import React, { useState, useEffect, useRef } from 'react';
import { AgentState, LogEntry, TruthReport, SourceWeight, AgentAction, UserPreferences } from './types';
import { AgentTerminal } from './components/AgentTerminal';
import { ReportCard } from './components/ReportCard';
import { LearningPanel } from './components/LearningPanel';
import { StatusBadge } from './components/StatusBadge';
import { ActionFeed } from './components/ActionFeed';
import { generateAgentStep, realAgentService } from './services/realAgentService';
import { Search, Shield, Globe, Terminal as TerminalIcon, Play, Square, Link as LinkIcon, Brain, Zap, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

const DEFAULT_URL = "https://www.zillow.com/homedetails/123-Market-St-San-Francisco-CA/fake";

const App: React.FC = () => {
  // App State
  const [url, setUrl] = useState(DEFAULT_URL);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    city: 'San Francisco',
    budget: 3500,
    priorities: { safety: 5, commute: 3, quietness: 4, value: 3 }
  });

  // Agent State
  const [isRunning, setIsRunning] = useState(false);
  const [currentState, setCurrentState] = useState<AgentState>(AgentState.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [report, setReport] = useState<TruthReport | null>(null);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [weights, setWeights] = useState<SourceWeight[]>([
    { source: 'City Records', reliability: 95, trend: 'stable' },
    { source: 'Official Listing', reliability: 80, trend: 'down' },
    { source: 'Reddit Community', reliability: 65, trend: 'up' },
    { source: 'Google Reviews', reliability: 70, trend: 'stable' }
  ]);
  
  const stateRef = useRef<AgentState>(AgentState.IDLE);
  const runningRef = useRef(false);

  const addLog = (source: LogEntry['source'], message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      source,
      message,
      type
    };
    setLogs(prev => [...prev, newLog]);
  };

  // Autonomous Loop
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const runLoop = async () => {
      if (!runningRef.current) return;

      // State Transition Logic
      let nextState = AgentState.IDLE;
      switch (stateRef.current) {
        case AgentState.IDLE: nextState = AgentState.SCRAPING; break;
        case AgentState.SCRAPING: nextState = AgentState.INVESTIGATING; break;
        case AgentState.INVESTIGATING: nextState = AgentState.ANALYZING; break;
        case AgentState.ANALYZING: nextState = AgentState.ACTING; break;
        case AgentState.ACTING: nextState = AgentState.LEARNING; break;
        case AgentState.LEARNING: 
            runningRef.current = false;
            nextState = AgentState.IDLE; 
            addLog('SYSTEM', 'Investigation complete. Truth Report generated.', 'success');
            setIsRunning(false);
            break;
      }

      if (nextState !== AgentState.IDLE) {
        stateRef.current = nextState;
        setCurrentState(nextState);

        // Always try real integration first, fallback to offline simulation
        try {
          const result = await generateAgentStep(url, nextState, preferences);
          
          let source: LogEntry['source'] = 'SYSTEM';
          if (nextState === AgentState.SCRAPING) source = 'LIGHTPANDA';
          if (nextState === AgentState.INVESTIGATING) source = 'PARALLEL';
          if (nextState === AgentState.ANALYZING || nextState === AgentState.LEARNING) source = 'GEMINI';
          if (nextState === AgentState.ACTING) source = 'POSTMAN';

          addLog(source, result.logMessage || `Executing ${nextState}...`, 'info');

          if (result.report) setReport(result.report);
          if (result.weights) setWeights(result.weights);
          
          if (nextState === AgentState.ACTING && result.actions) {
             setActions(result.actions);
             result.actions.forEach((action, index) => {
                setTimeout(() => {
                   setActions(prev => prev.map(a => a.id === action.id ? { ...a, status: 'EXECUTING' } : a));
                   setTimeout(() => {
                      setActions(prev => prev.map(a => a.id === action.id ? { ...a, status: 'COMPLETED' } : a));
                      addLog('POSTMAN', `Action Completed: ${action.description}`, 'success');
                   }, 1000);
                }, index * 1200);
             });
          }
        } catch (error) {
          console.error('Real agent service failed, falling back to offline mode:', error);
          addLog('SYSTEM', 'Using offline mode - real integrations not configured', 'warning');
          simulateOfflineStep(nextState);
        }
      } else {
          setCurrentState(AgentState.IDLE);
      }

      const delay = nextState === AgentState.ACTING ? 4000 : 3000;
      if (runningRef.current) timeoutId = setTimeout(runLoop, delay);
    };

    if (isRunning) {
      runningRef.current = true;
      setReport(null); 
      setActions([]);
      
      // Reset the real agent service for new analysis
      realAgentService.reset();
      
      if (stateRef.current === AgentState.IDLE) {
         addLog('SYSTEM', `Initialization: RentCheck Agent v2.1`, 'info');
         addLog('SYSTEM', `Target: ${url}`, 'info');
         addLog('SYSTEM', `Profile: Safety Priority (${preferences.priorities.safety}/5)`, 'info');
         if (realAgentService.hasRealIntegrations()) {
           addLog('SYSTEM', 'Real integrations enabled: Parallel Web + Lightpanda', 'success');
         } else {
           addLog('SYSTEM', 'Demo mode: Add API keys to .env for real data', 'warning');
         }
      }
      runLoop();
    } else {
      runningRef.current = false;
      stateRef.current = AgentState.IDLE;
      setCurrentState(AgentState.IDLE);
      clearTimeout(timeoutId);
    }

    return () => clearTimeout(timeoutId);
  }, [isRunning, url, preferences]);

  // Action handlers for report card buttons
  const handleReportAction = async (action: 'shortlist' | 'blacklist' | 'schedule_tour' | 'share') => {
    try {
      addLog('POSTMAN', `Executing user action: ${action}`, 'info');
      
      const userInfo = {
        name: 'Demo User',
        email: 'demo@example.com',
        phone: '+1234567890',
        priorities: preferences.priorities
      };

      const resultActions = await realAgentService.executeUserAction(action, null, report, userInfo);
      
      // Add the new actions to the existing actions
      setActions(prev => [...prev, ...resultActions]);
      
      // Animate the action execution
      resultActions.forEach((resultAction, index) => {
        setTimeout(() => {
          setActions(prev => prev.map(a => 
            a.id === resultAction.id ? { ...a, status: 'EXECUTING' } : a
          ));
          
          setTimeout(() => {
            setActions(prev => prev.map(a => 
              a.id === resultAction.id ? { ...a, status: 'COMPLETED' } : a
            ));
            addLog('POSTMAN', `Action completed: ${resultAction.description}`, 'success');
          }, 1500);
        }, index * 500);
      });

    } catch (error) {
      addLog('POSTMAN', `Action failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const handleFeedback = (feedback: 'thumbs_up' | 'thumbs_down') => {
    realAgentService.processFeedback(feedback);
    
    // Update source weights display
    const updatedWeights = realAgentService.getSourceWeights();
    setWeights(updatedWeights);
    
    addLog('SYSTEM', `Feedback processed: ${feedback === 'thumbs_up' ? 'positive' : 'negative'} - updating learning weights`, 'info');
  };

  const simulateOfflineStep = (state: AgentState) => {
    // Offline Fallback for Demo purposes if API key is missing
    switch (state) {
        case AgentState.SCRAPING:
            addLog('LIGHTPANDA', 'Scraping listing... extracted rent $3,400, admin fee $200.', 'info');
            break;
        case AgentState.INVESTIGATING:
            addLog('PARALLEL', 'Found 3 noise complaints in last 60 days via City Data.', 'warning');
            break;
        case AgentState.ANALYZING:
            setReport({
                verdict: 'CAUTION',
                verdictTitle: '⚠️ Proceed with Caution',
                overallScore: 68,
                scores: { scamRisk: 'Low', safety: 8, noise: 3, value: 'Overpriced', commute: '30m' },
                evidence: [
                    { category: 'Noise', points: ['Construction permit active next door', 'Bar downstairs'], sentiment: 'negative' },
                    { category: 'Safety', points: ['Low crime index (Last 30 days)'], sentiment: 'positive' }
                ],
                summary: 'Great location and safety, but high noise risk due to active construction.',
                actionRecommendation: 'SCHEDULE_TOUR'
            });
            break;
        // ... other states
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 font-sans selection:bg-indigo-500/30">
      
      {/* Product Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-900/20">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-tight leading-none">RentCheck</h1>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">Apartment Truth Layer</p>
                </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
                <span>How it Works</span>
                <span>Agent Pricing</span>
                <span className="text-indigo-400">Login</span>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Inputs & Main Report (User Value) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Hero Input Section */}
            <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-white mb-2">Paste a listing link. Get the truth.</h2>
                <p className="text-zinc-400 text-sm">Autonomous verification of crime, noise, landlords, and hidden fees.</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-1 backdrop-blur-sm shadow-2xl">
                <div className="flex gap-2 p-2">
                    <input 
                        type="text" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://zillow.com/homedetails/..." 
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                    <button 
                        onClick={() => setIsRunning(!isRunning)}
                        className={`px-6 py-3 rounded-lg font-bold text-xs tracking-wide uppercase transition-all flex items-center gap-2 ${
                            isRunning 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                        }`}
                    >
                        {isRunning ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        {isRunning ? 'Stop' : 'Check Truth'}
                    </button>
                </div>
                
                {/* Preferences Toggle */}
                <div className="px-3 pb-2">
                    <button 
                        onClick={() => setPrefsOpen(!prefsOpen)}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-zinc-500 hover:text-indigo-400 transition-colors"
                    >
                        <SlidersHorizontal className="w-3 h-3" />
                        Customize Priorities
                        {prefsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    
                    {prefsOpen && (
                        <div className="mt-3 pt-3 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                            <div>
                                <label className="text-xs text-zinc-400 block mb-1.5">Max Budget</label>
                                <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded px-3 py-2">
                                    <span className="text-zinc-500">$</span>
                                    <input 
                                        type="number" 
                                        value={preferences.budget}
                                        onChange={(e) => setPreferences({...preferences, budget: parseInt(e.target.value)})}
                                        className="bg-transparent w-full text-sm focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: 'Safety', key: 'safety' as const },
                                    { label: 'Quietness', key: 'quietness' as const }
                                ].map(p => (
                                    <div key={p.key}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-zinc-400">{p.label} Priority</span>
                                            <span className="text-indigo-400 font-mono">{preferences.priorities[p.key]}/5</span>
                                        </div>
                                        <input 
                                            type="range" min="1" max="5" 
                                            value={preferences.priorities[p.key]}
                                            onChange={(e) => setPreferences({
                                                ...preferences, 
                                                priorities: { ...preferences.priorities, [p.key]: parseInt(e.target.value) }
                                            })}
                                            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* THE MAIN VALUE: TRUTH REPORT */}
            <ReportCard 
              report={report} 
              loading={isRunning && currentState !== AgentState.IDLE && currentState !== AgentState.LEARNING && !report}
              onAction={handleReportAction}
              onFeedback={handleFeedback}
            />

        </div>

        {/* Right Column: Agent Brain (Sidebar) */}
        <div className="lg:col-span-4 flex flex-col gap-6 border-l border-zinc-800/50 pl-6 lg:pl-8">
            
            <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Brain className="w-4 h-4" /> Agent Live Status
                </h3>
                <StatusBadge state={currentState} />
            </div>

            {/* Stack Visualizer */}
            <div className="grid grid-cols-1 gap-2">
                {[
                    { id: 'LIGHTPANDA', icon: Globe, label: 'Browser Automation', desc: 'Scraping & Form Filling', active: currentState === AgentState.SCRAPING || currentState === AgentState.ACTING },
                    { id: 'PARALLEL', icon: Search, label: 'Parallel Web', desc: 'Truth & Evidence Research', active: currentState === AgentState.INVESTIGATING },
                    { id: 'GEMINI', icon: Brain, label: 'Gemini 2.5 Flash', desc: 'Reasoning & Scoring', active: currentState === AgentState.ANALYZING || currentState === AgentState.LEARNING },
                    { id: 'POSTMAN', icon: Zap, label: 'Postman API', desc: 'Webhooks & Actions', active: currentState === AgentState.ACTING },
                ].map((tool) => (
                    <div key={tool.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-500 ${
                        tool.active 
                        ? 'bg-zinc-800 border-zinc-700 opacity-100' 
                        : 'bg-transparent border-zinc-900 opacity-40'
                    }`}>
                        <div className={`p-2 rounded bg-black ${tool.active ? 'text-indigo-400' : 'text-zinc-600'}`}>
                            <tool.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-zinc-300">{tool.label}</div>
                            <div className="text-[10px] text-zinc-600">{tool.desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            <ActionFeed actions={actions} />

            <div className="flex-1 flex flex-col min-h-[200px]">
                <AgentTerminal logs={logs} />
            </div>
            
            <LearningPanel weights={weights} />

        </div>
      </main>
    </div>
  );
};

export default App;