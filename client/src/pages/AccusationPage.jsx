import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Gavel,
  ShieldAlert,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
} from 'lucide-react';
import { getCaseById, submitAccusation } from '../services/api';

export default function AccusationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSuspectId, setSelectedSuspectId] = useState('');
  const [rationale, setRationale] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);
        const data = await getCaseById(id);
        if (data.status !== 'investigating') {
          navigate(`/case/${id}/result`);
          return;
        }
        setCaseData(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load investigation.');
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSuspectId) {
      setError('Please select a suspect from the lineup to accuse.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await submitAccusation(id, selectedSuspectId, rationale);
      navigate(`/case/${id}/result`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to submit accusation.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-mono text-cyan-400">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Preparing Lineup for Case #{id}...</p>
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  const basePoints =
    caseData.difficulty === 'easy' ? 100 : caseData.difficulty === 'hard' ? 200 : 150;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <Link
          to={`/case/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Evidence Board</span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400 font-mono text-xs w-max mb-3">
          <Gavel className="w-3.5 h-3.5" />
          <span>ACCUSATION CHAMBER</span>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Indict the Prime Culprit
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review the suspects, evaluate their motives against discovered clues, and declare your
          formal verdict. A correct conviction yields{' '}
          <strong className="text-emerald-400">+{basePoints} base points</strong>.
        </p>
      </div>

      {/* Irreversible Action Warning */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
        <div>
          <strong className="font-bold">Irreversible Action:</strong> Submitting an accusation will
          immediately seal the case, calculate your final forensic score, and reveal the true
          culprit and solution explanation.
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Suspect Lineup Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
            Step 1: Select Suspect from Lineup
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {caseData.suspects.map((suspect) => {
              const selected = selectedSuspectId === suspect.id;
              return (
                <button
                  type="button"
                  key={suspect.id}
                  onClick={() => setSelectedSuspectId(suspect.id)}
                  className={`p-5 rounded-2xl text-left border transition-all relative ${
                    selected
                      ? 'bg-rose-950/40 border-rose-500 shadow-xl shadow-rose-950/50 ring-1 ring-rose-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                          selected
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {suspect.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">{suspect.name}</h3>
                        <p className="text-xs font-mono text-cyan-400">{suspect.role}</p>
                      </div>
                    </div>

                    {selected && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500 text-white font-bold">
                        ACCUSED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-2">{suspect.bio}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Rationale */}
        <div className="space-y-3">
          <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
            Step 2: Detective's Indictment Rationale (Optional)
          </label>
          <textarea
            rows={3}
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder="Explain how the swipe logs, physical clues, and alibi contradictions led to your conclusion..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500/70 p-4 font-sans text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-bold font-mono text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-500/25 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            <Gavel className="w-5 h-5 text-slate-950" />
            <span>
              {submitting ? 'PROCESSING VERDICT...' : 'SUBMIT FORMAL INDICTMENT'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
