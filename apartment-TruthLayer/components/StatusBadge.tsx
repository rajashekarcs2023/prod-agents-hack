import React from 'react';
import { AgentState } from '../types';
import { Eye, Search, Brain, Database, Sparkles, Loader2, Zap } from 'lucide-react';

interface StatusBadgeProps {
  state: AgentState;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ state }) => {
  const getConfig = () => {
    switch (state) {
      case AgentState.SCRAPING:
        return { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Eye, text: 'Lightpanda: Scraping Listing' };
      case AgentState.INVESTIGATING:
        return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Search, text: 'Parallel: Vetting Truth' };
      case AgentState.ANALYZING:
        return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Brain, text: 'Gemini: Calculating Score' };
      case AgentState.ACTING:
        return { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: Zap, text: 'Postman: Executing Actions' };
      case AgentState.REPORTING:
        return { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: Database, text: 'Sanity: Persisting Data' };
      case AgentState.LEARNING:
        return { color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', icon: Sparkles, text: 'Self-Improving' };
      default:
        return { color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', icon: Loader2, text: 'Idle / Ready' };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bg} ${config.border} transition-all duration-500`}>
      <Icon className={`w-3.5 h-3.5 ${config.color} ${state !== AgentState.IDLE ? 'animate-pulse' : ''}`} />
      <span className={`text-xs font-medium font-mono ${config.color}`}>{config.text}</span>
    </div>
  );
};