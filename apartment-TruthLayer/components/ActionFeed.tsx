import React from 'react';
import { AgentAction } from '../types';
import { Send, MousePointer, Bell, CheckCircle2, Circle, XCircle, Loader2 } from 'lucide-react';

interface ActionFeedProps {
  actions: AgentAction[];
}

export const ActionFeed: React.FC<ActionFeedProps> = ({ actions }) => {
  if (actions.length === 0) return null;

  const getIcon = (type: AgentAction['type']) => {
    switch (type) {
      case 'API_CALL': return <Send className="w-3.5 h-3.5" />;
      case 'BROWSER_INTERACTION': return <MousePointer className="w-3.5 h-3.5" />;
      case 'NOTIFICATION': return <Bell className="w-3.5 h-3.5" />;
    }
  };

  const getStatusIcon = (status: AgentAction['status']) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'EXECUTING': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'FAILED': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Circle className="w-4 h-4 text-zinc-700" />;
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 backdrop-blur-sm mb-4 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          Autonomous Actions
        </h3>
        <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 font-mono">POSTMAN / LIGHTPANDA</span>
      </div>

      <div className="space-y-2">
        {actions.map((action) => (
          <div key={action.id} className="flex items-center gap-3 bg-black/40 p-2.5 rounded border border-zinc-800/50">
            <div className="p-1.5 bg-zinc-900 rounded text-zinc-400">
              {getIcon(action.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">{action.description}</p>
              <p className="text-[10px] text-zinc-500 font-mono truncate">{action.detail}</p>
            </div>
            <div className="pl-2">
              {getStatusIcon(action.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};