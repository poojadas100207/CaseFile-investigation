import React from 'react';
import { Award, Search, HelpCircle } from 'lucide-react';

export default function ScoreBadge({ score = 0, scoreBreakdown = null }) {
  return (
    <div className="flex items-center gap-3 bg-slate-900/90 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl shadow-inner font-mono text-xs">
      <div className="flex items-center gap-1.5 text-cyan-400">
        <Award className="w-4 h-4 text-amber-400" />
        <span className="text-slate-400 font-sans text-xs">Score:</span>
        <strong className="text-base text-amber-300 font-bold">{score}</strong>
        <span className="text-[10px] text-slate-500">PTS</span>
      </div>

      {scoreBreakdown && (
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400" title="Clues Bonus (+5 each)">
            <Search className="w-3 h-3" />
            +{scoreBreakdown.cluesBonus || 0}
          </span>
          <span className="flex items-center gap-1 text-rose-400" title="Hints Penalty (-10 each)">
            <HelpCircle className="w-3 h-3" />
            -{scoreBreakdown.hintsPenalty || 0}
          </span>
        </div>
      )}
    </div>
  );
}
