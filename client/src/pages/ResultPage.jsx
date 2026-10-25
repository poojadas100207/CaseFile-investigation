import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Search,
  HelpCircle,
  RotateCcw,
  PlusCircle,
  FileText,
  Users,
  Sparkles,
} from 'lucide-react';
import { getCaseResult } from '../services/api';

export default function ResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const data = await getCaseResult(id);
        setResult(data);

        // Fire celebratory confetti if solved!
        if (data.isCorrect) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load case verdict.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-mono text-cyan-400">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Calculating Final Forensic Score & Debrief for Case #{id}...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-rose-400 font-mono text-sm mb-4">{error || 'Result unavailable.'}</p>
        <Link
          to={`/case/${id}`}
          className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-mono text-xs font-bold"
        >
          Return to Investigation
        </Link>
      </div>
    );
  }

  const { isCorrect, culprit, accused, scoreBreakdown, finalScore, solutionExplanation, case: c } =
    result;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-16">
      {/* Verdict Header Banner */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border text-center relative overflow-hidden shadow-2xl ${
          isCorrect
            ? 'bg-gradient-to-b from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500/50 shadow-emerald-950/50'
            : 'bg-gradient-to-b from-rose-950/80 via-slate-900 to-slate-950 border-rose-500/50 shadow-rose-950/50'
        }`}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-xl border">
          {isCorrect ? (
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-rose-500/50 flex items-center justify-center text-rose-400">
              <XCircle className="w-8 h-8" />
            </div>
          )}
        </div>

        <div className="font-mono text-xs uppercase tracking-widest mb-1 text-slate-400">
          INVESTIGATION POST-MORTEM VERDICT
        </div>

        <h1
          className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 ${
            isCorrect ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {isCorrect ? 'CASE SOLVED: CULPRIT APPREHENDED' : 'WRONGFUL ACCUSATION: CASE UNSOLVED'}
        </h1>

        <p className="text-slate-300 text-sm max-w-xl mx-auto font-sans leading-relaxed">
          {isCorrect
            ? `Outstanding detective work! Your deduction accurately identified ${culprit.name} as the mastermind behind the heist.`
            : `Unfortunately, you indicted ${accused?.name || 'an innocent suspect'}, allowing the true perpetrator (${culprit?.name}) to evade justice.`}
        </p>
      </div>

      {/* Score Breakdown Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="font-mono text-sm uppercase tracking-wider text-slate-200">
              Score Breakdown
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase">
            {c.difficulty} Difficulty
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Base Score</span>
            <span
              className={`text-lg font-bold ${
                isCorrect ? 'text-emerald-400' : 'text-slate-600 line-through'
              }`}
            >
              +{scoreBreakdown?.baseScore || 0}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Clues Bonus</span>
            <span className="text-lg font-bold text-cyan-400">
              +{scoreBreakdown?.cluesBonus || 0}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Hints Penalty</span>
            <span className="text-lg font-bold text-rose-400">
              -{scoreBreakdown?.hintsPenalty || 0}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/60 to-slate-950 border border-amber-500/40">
            <span className="text-[10px] text-amber-300 uppercase block font-semibold">
              Final Score
            </span>
            <span className="text-xl font-extrabold text-amber-300">{finalScore} PTS</span>
          </div>
        </div>
      </div>

      {/* Culprit Dossier */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Users className="w-4 h-4" />
          <span>True Culprit Dossier</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-slate-950 p-5 rounded-xl border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-950 to-slate-900 border border-rose-500/40 flex items-center justify-center font-mono font-bold text-lg text-rose-400 flex-shrink-0">
            {culprit?.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{culprit?.name}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-300 font-bold">
                PERPETRATOR
              </span>
            </div>
            <p className="text-xs font-mono text-cyan-400">{culprit?.role}</p>
            <p className="text-xs text-slate-300 font-sans mt-1">{culprit?.bio}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
          <span className="text-[10px] font-mono text-rose-400 block uppercase">
            True Criminal Motive
          </span>
          <p className="text-slate-300 mt-0.5 font-sans leading-relaxed">{culprit?.motive}</p>
        </div>
      </div>

      {/* Forensic Solution Post-Mortem */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Complete Forensic Case Solution</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 font-sans text-sm text-slate-200 leading-relaxed whitespace-pre-line">
          {solutionExplanation}
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          to="/create"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Investigate Another Case</span>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-sm tracking-wide transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Return to Bureau Archive</span>
        </Link>
      </div>
    </div>
  );
}
