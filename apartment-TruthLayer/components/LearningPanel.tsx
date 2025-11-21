import React from 'react';
import { SourceWeight } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface LearningPanelProps {
  weights: SourceWeight[];
}

export const LearningPanel: React.FC<LearningPanelProps> = ({ weights }) => {
  return (
    <div className="w-full bg-zinc-900/30 border border-zinc-800 rounded-lg p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-zinc-400 text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
          Agent Learning Matrix
        </h3>
        <span className="text-[10px] text-zinc-600 font-mono">AUTO-TUNING ENABLED</span>
      </div>
      
      <div className="space-y-3">
        {weights.length === 0 ? (
            <div className="text-center py-8 text-zinc-600 text-xs font-mono">
                Processing source reliability...
            </div>
        ) : (
            weights.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 group">
                <div className="w-24 text-xs font-medium text-zinc-300 truncate">{item.source}</div>
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${item.reliability}%` }}
                />
                </div>
                <div className="w-8 text-right text-xs font-mono text-zinc-400">{item.reliability}%</div>
                <div className="w-4 flex justify-center">
                {item.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                {item.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                {item.trend === 'stable' && <Minus className="w-3 h-3 text-zinc-600" />}
                </div>
            </div>
            ))
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/50">
        <p className="text-[10px] text-zinc-500 leading-relaxed">
          *Weights represent the agent's trust in specific data sources based on historical verification accuracy. Updated autonomously after every cycle.
        </p>
      </div>
    </div>
  );
};