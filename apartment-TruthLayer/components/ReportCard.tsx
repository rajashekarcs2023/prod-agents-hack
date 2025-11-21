import React from 'react';
import { TruthReport } from '../types';
import { ShieldCheck, AlertTriangle, Home, DollarSign, CheckCircle, Ban, Calendar, ExternalLink, ThumbsUp, ThumbsDown, Clock, Volume2, MapPin } from 'lucide-react';

interface ReportCardProps {
  report: TruthReport | null;
  loading: boolean;
  onAction?: (action: 'shortlist' | 'blacklist' | 'schedule_tour' | 'share') => void;
  onFeedback?: (feedback: 'thumbs_up' | 'thumbs_down') => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, loading, onAction, onFeedback }) => {
  if (loading) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-zinc-600 gap-4 bg-zinc-900/30 border border-zinc-800 rounded-xl p-8 backdrop-blur-sm">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-zinc-800 border-t-indigo-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-indigo-500/50 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
            <p className="text-sm font-mono text-indigo-300 animate-pulse font-medium">INVESTIGATING LISTING</p>
            <p className="text-xs text-zinc-500 mt-1">Checking crime logs, reviews, and hidden fees...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-zinc-600 gap-4 bg-zinc-900/30 border border-zinc-800 rounded-xl p-8 border-dashed">
        <div className="p-4 bg-zinc-900/50 rounded-full">
             <ShieldCheck className="w-8 h-8 opacity-30" />
        </div>
        <div className="text-center">
            <p className="text-sm font-mono text-zinc-500">NO LISTING ANALYZED</p>
            <p className="text-xs text-zinc-600 mt-1 max-w-[250px]">Paste a URL above to generate a Truth Report.</p>
        </div>
      </div>
    );
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'RECOMMENDED': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'CAUTION': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'AVOID': return 'text-red-400 border-red-500/30 bg-red-500/10';
      default: return 'text-zinc-400 border-zinc-500/30 bg-zinc-500/10';
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Verdict Header */}
      <div className={`p-6 rounded-xl border ${getVerdictColor(report.verdict)} flex items-start justify-between shadow-lg`}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            {report.verdictTitle}
          </h2>
          <p className="text-sm opacity-80 mt-1 font-medium">{report.summary}</p>
        </div>
        <div className="text-right">
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Truth Score</div>
            <div className="text-4xl font-mono font-bold leading-none mt-1">{report.overallScore}</div>
        </div>
      </div>

      {/* Score Radar Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg">
            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Safety</div>
            <div className="text-lg font-mono font-semibold text-zinc-200">{report.scores.safety}/10</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg">
            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1 flex items-center gap-1"><Volume2 className="w-3 h-3" /> Quietness</div>
            <div className="text-lg font-mono font-semibold text-zinc-200">{report.scores.noise}/10</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg">
            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Commute</div>
            <div className="text-lg font-mono font-semibold text-zinc-200">{report.scores.commute}</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg">
            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Scam Risk</div>
            <div className={`text-lg font-mono font-semibold ${report.scores.scamRisk === 'Low' ? 'text-emerald-400' : report.scores.scamRisk === 'High' ? 'text-red-400' : 'text-yellow-400'}`}>
                {report.scores.scamRisk}
            </div>
        </div>
      </div>

      {/* Evidence Sections */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 space-y-5">
         <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Collected Evidence</h3>
            <span className="text-[10px] text-zinc-600 font-mono bg-zinc-900 px-2 py-0.5 rounded">Source: Parallel Web</span>
         </div>
         
         <div className="grid gap-4">
            {report.evidence.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                    <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${item.sentiment === 'negative' ? 'bg-red-500' : item.sentiment === 'positive' ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
                    <div>
                        <h4 className="text-sm font-semibold text-zinc-200 mb-1">{item.category}</h4>
                        <ul className="space-y-1">
                            {item.points.map((point, pIdx) => (
                                <li key={pIdx} className="text-xs text-zinc-400 leading-relaxed">
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
         </div>
      </div>

      {/* Actions Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
         <button 
            onClick={() => onAction?.('shortlist')}
            className="bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all"
         >
            <CheckCircle className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Shortlist</span>
         </button>
         <button 
            onClick={() => onAction?.('schedule_tour')}
            className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all"
         >
            <Calendar className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Schedule Tour</span>
         </button>
         <button 
            onClick={() => onAction?.('share')}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all"
         >
            <ExternalLink className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Share Report</span>
         </button>
         <button 
            onClick={() => onAction?.('blacklist')}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all"
         >
            <Ban className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Blacklist</span>
         </button>
      </div>

      {/* Feedback */}
      <div className="flex items-center justify-between bg-zinc-950 rounded-lg p-3 border border-zinc-800/50">
         <span className="text-[10px] text-zinc-600">Help RentCheck improve this analysis:</span>
         <div className="flex gap-2">
            <button 
               onClick={() => onFeedback?.('thumbs_up')}
               className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-emerald-400 transition-colors"
            >
               <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button 
               onClick={() => onFeedback?.('thumbs_down')}
               className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-red-400 transition-colors"
            >
               <ThumbsDown className="w-3.5 h-3.5" />
            </button>
         </div>
      </div>

    </div>
  );
};