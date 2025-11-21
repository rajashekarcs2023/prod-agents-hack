import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, Search, Globe, Brain, Database, Send, AlertCircle, Check, Zap } from 'lucide-react';

interface AgentTerminalProps {
  logs: LogEntry[];
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getIcon = (source: LogEntry['source']) => {
    switch (source) {
      case 'PARALLEL': return <Search className="w-3.5 h-3.5 text-blue-400" />;
      case 'LIGHTPANDA': return <Globe className="w-3.5 h-3.5 text-purple-400" />;
      case 'GEMINI': return <Brain className="w-3.5 h-3.5 text-emerald-400" />;
      case 'SANITY': return <Database className="w-3.5 h-3.5 text-cyan-400" />;
      case 'POSTMAN': return <Zap className="w-3.5 h-3.5 text-orange-500" />;
      default: return <Terminal className="w-3.5 h-3.5 text-zinc-500" />;
    }
  };

  const getColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'success': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-zinc-300 bg-zinc-800/50 border-zinc-700/50';
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl shadow-2xl flex flex-col font-mono text-sm h-full overflow-hidden">
      <div className="bg-zinc-900/80 px-4 py-3 border-b border-zinc-800 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
          </div>
          <span className="text-zinc-500 text-xs font-semibold tracking-wider ml-1">RENTCHECK_CORE.LOG</span>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth font-mono text-[13px]">
        {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-700 gap-2">
            <Terminal className="w-8 h-8 opacity-20" />
            <span className="text-xs uppercase tracking-widest opacity-50">System Idle</span>
          </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-1 duration-200">
            <span className="text-zinc-600 text-[11px] shrink-0 pt-0.5 select-none w-14 text-right">{log.timestamp.split(' ')[0]}</span>
            
            <div className="flex-1 flex items-start gap-2">
                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border tracking-wider min-w-[80px] text-center shrink-0 ${getColor(log.type).replace('text-', 'border-').split(' ')[2]} ${log.type === 'success' ? 'text-emerald-400' : 'text-zinc-400'}`}>
                    {log.source}
                </span>
                <span className={`${log.type === 'error' ? 'text-red-400' : 'text-zinc-300'} leading-tight`}>
                    {log.message}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};