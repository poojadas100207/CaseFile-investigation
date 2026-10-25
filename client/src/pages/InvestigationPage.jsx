import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  KeyRound,
  Users,
  FileText,
  HelpCircle,
  Gavel,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { getCaseById, discoverClue, requestHint } from '../services/api';
import ScoreBadge from '../components/ScoreBadge';

export default function InvestigationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier', 'suspects', 'evidence', 'hints'
  const [discoveringClueId, setDiscoveringClueId] = useState(null);
  const [requestingHint, setRequestingHint] = useState(false);
  const [hintConfirmOpen, setHintConfirmOpen] = useState(false);
  const [clueNotification, setClueNotification] = useState(null);
  const [evidenceFilter, setEvidenceFilter] = useState('all');

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);
        const data = await getCaseById(id);
        if (data.status !== 'investigating') {
          // If case is already completed, redirect to result debrief
          navigate(`/case/${id}/result`);
          return;
        }
        setCaseData(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load investigation data.');
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id, navigate]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const tabs = ['dossier', 'suspects', 'evidence', 'hints'];
      const tabIndex = Number(event.key) - 1;
      if (tabIndex >= 0 && tabIndex < tabs.length) {
        setActiveTab(tabs[tabIndex]);
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleDiscoverClue = async (clueId) => {
    try {
      setDiscoveringClueId(clueId);
      const res = await discoverClue(id, clueId);

      setCaseData((prev) => ({
        ...prev,
        score: res.score,
        scoreBreakdown: res.scoreBreakdown,
        clues: prev.clues.map((c) => (c.id === clueId ? res.clue : c)),
      }));

      setClueNotification(`Discovered Clue: "${res.clue.title}" (+5 PTS)`);
      setTimeout(() => setClueNotification(null), 3500);
    } catch (err) {
      console.error(err);
      alert('Failed to discover evidence.');
    } finally {
      setDiscoveringClueId(null);
    }
  };

  const handleRequestHint = async () => {
    try {
      setRequestingHint(true);
      setHintConfirmOpen(false);
      const res = await requestHint(id);

      setCaseData((prev) => ({
        ...prev,
        score: res.score,
        scoreBreakdown: res.scoreBreakdown,
        hints: res.allHints,
      }));

      setClueNotification(`Hint Decrypted (-10 PTS penalty applied)`);
      setTimeout(() => setClueNotification(null), 3500);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to request hint.');
    } finally {
      setRequestingHint(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-mono text-cyan-400">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Accessing Secure Incident Log #{id}...</p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white mb-2">Investigation Not Found</h2>
        <p className="text-slate-400 text-xs font-mono mb-6">{error || 'Invalid Case Identifier.'}</p>
        <Link
          to="/"
          className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-mono text-xs font-bold"
        >
          Return to HQ
        </Link>
      </div>
    );
  }

  const discoveredCluesCount = caseData.clues.filter((c) => c.discovered).length;
  const totalClues = caseData.clues.length;
  const cluesPercent = Math.round((discoveredCluesCount / totalClues) * 100);
  const unlockedHintsCount = caseData.hints.filter((h) => h.unlocked).length;
  const totalHints = caseData.hints.length;
  const hintsRemaining = totalHints - unlockedHintsCount;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-28">
      {/* Toast Notification */}
      {clueNotification && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 border border-cyan-400 text-cyan-300 px-4 py-2.5 rounded-xl shadow-2xl font-mono text-xs flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{clueNotification}</span>
        </div>
      )}

      {/* Case Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
              CASE #{caseData._id.slice(-6)}
            </span>
            <span
              className={`px-2.5 py-1 rounded font-mono text-xs font-semibold uppercase tracking-wider ${
                caseData.difficulty === 'easy'
                  ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-400'
                  : caseData.difficulty === 'hard'
                  ? 'bg-rose-950/80 border border-rose-500/30 text-rose-400'
                  : 'bg-cyan-950/80 border border-cyan-500/30 text-cyan-400'
              }`}
            >
              {caseData.difficulty} DIFFICULTY
            </span>
            <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs">
              IN PROGRESS
            </span>
          </div>

          <ScoreBadge score={caseData.score} scoreBreakdown={caseData.scoreBreakdown} />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {caseData.title}
            </h1>
            <p className="text-slate-400 text-xs font-mono mt-1 line-clamp-1">
              Premise: {caseData.premise}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl">
              <span className="text-slate-500 block text-[10px]">EVIDENCE DISCOVERED</span>
              <span className="text-cyan-400 font-bold text-sm">
                {discoveredCluesCount} / {totalClues}
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl">
              <span className="text-slate-500 block text-[10px]">HINTS REMAINING</span>
              <span className="text-amber-400 font-bold text-sm">
                {hintsRemaining} / {totalHints}
              </span>
            </div>
          </div>
        </div>

        {/* Clues Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-1.5 mt-4 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${cluesPercent}%` }}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dossier')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'dossier'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Incident Dossier</span>
        </button>

        <button
          onClick={() => setActiveTab('suspects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'suspects'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Suspects Lineup ({caseData.suspects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'evidence'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Evidence Board ({discoveredCluesCount}/{totalClues})</span>
        </button>

        <button
          onClick={() => setActiveTab('hints')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-semibold transition-all whitespace-nowrap ${
            activeTab === 'hints'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Tactical Hints ({unlockedHintsCount}/{totalHints})</span>
        </button>
      </div>

      {/* TAB 1: Incident Dossier */}
      {activeTab === 'dossier' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Official Breach Narrative</span>
            </div>
            <p className="text-slate-200 font-sans text-base leading-relaxed whitespace-pre-line">
              {caseData.story}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-slate-500 text-[10px] uppercase">TARGET ASSET</div>
              <div className="text-white font-bold text-sm mt-1">₹50L Quantum Prototype</div>
              <div className="text-slate-400 text-xs mt-1">
                Q-Core-9 Silicon Cryogenic Assembly
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-slate-500 text-[10px] uppercase">SECURITY CLEARANCE</div>
              <div className="text-cyan-400 font-bold text-sm mt-1">Four Persons Isolated</div>
              <div className="text-slate-400 text-xs mt-1">
                Zero exterior breach logs detected
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-slate-500 text-[10px] uppercase">INVESTIGATIVE DIRECTIVE</div>
              <div className="text-amber-400 font-bold text-sm mt-1">Examine Physical Evidence</div>
              <div className="text-slate-400 text-xs mt-1">
                Check duct seals, swipe logs & motives
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Suspects Lineup */}
      {activeTab === 'suspects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseData.suspects.map((suspect, idx) => (
            <div
              key={suspect.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-lg font-bold flex-shrink-0 shadow-inner">
                  {suspect.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      SUSPECT #{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{suspect.name}</h3>
                  <p className="text-xs font-mono text-cyan-400">{suspect.role}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">
                    Background Profile
                  </span>
                  <p className="text-slate-300 mt-0.5">{suspect.bio}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-blue-400 block uppercase">
                    Stated Alibi
                  </span>
                  <p className="text-slate-300 mt-0.5">{suspect.alibi}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-rose-400 block uppercase">
                    Suspected Motive
                  </span>
                  <p className="text-slate-300 mt-0.5">{suspect.motive}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Evidence Board (Clues) */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs font-mono text-slate-400">
              Click "Examine Evidence" to analyze forensic traces and uncover details (+5 PTS each).
            </p>
            <div className="flex items-center gap-2">
              {[
                ['all', 'All'],
                ['locked', 'Locked'],
                ['discovered', 'Discovered'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setEvidenceFilter(value)}
                  className={`px-2.5 py-1 rounded-lg border font-mono text-[10px] uppercase transition-colors ${
                    evidenceFilter === value
                      ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300'
                      : 'border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
              <span className="text-xs font-mono text-cyan-400 whitespace-nowrap">
                {discoveredCluesCount} of {totalClues}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseData.clues
              .filter((clue) => evidenceFilter === 'all' || (evidenceFilter === 'discovered' ? clue.discovered : !clue.discovered))
              .map((clue, idx) => {
              const isDiscovered = clue.discovered;
              const isProcessing = discoveringClueId === clue.id;

              return (
                <div
                  key={clue.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isDiscovered
                      ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/30'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isDiscovered
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}
                      >
                        {isDiscovered ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-500 block">
                          EVIDENCE #{idx + 1}
                        </span>
                        <h4 className="font-semibold text-sm text-white">
                          {isDiscovered ? clue.title : `Encrypted Clue #${idx + 1}`}
                        </h4>
                      </div>
                    </div>

                    {isDiscovered ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                        +5 PTS ADDED
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDiscoverClue(clue.id)}
                        disabled={isProcessing}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
                      >
                        {isProcessing ? 'Analyzing...' : 'Examine Evidence'}
                      </button>
                    )}
                  </div>

                  {isDiscovered ? (
                    <p className="text-xs font-sans text-slate-300 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                      {clue.description}
                    </p>
                  ) : (
                    <div className="bg-slate-900/40 border border-dashed border-slate-800 p-3.5 rounded-xl text-center">
                      <p className="text-xs font-mono text-slate-500">
                        Forensic specimen sealed. Click to run spectroscopy and log retrieval.
                      </p>
                    </div>
                  )}
                </div>
              );
              })}
          </div>
          {caseData.clues.filter((clue) => evidenceFilter === 'all' || (evidenceFilter === 'discovered' ? clue.discovered : !clue.discovered)).length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-xs font-mono text-slate-500">
              No evidence matches this filter. Switch views to continue your investigation.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Tactical Hints */}
      {activeTab === 'hints' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Tactical Hint Decryption</span>
              </h3>
              <p className="text-xs font-sans text-slate-400 mt-0.5">
                Each decrypted hint carries a penalty of <strong className="text-rose-400">-10 points</strong>.
                Use them only when you are struggling to connect the suspect alibis.
              </p>
            </div>

            {hintsRemaining > 0 ? (
              <button
                onClick={() => setHintConfirmOpen(true)}
                disabled={requestingHint}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95 whitespace-nowrap"
              >
                {requestingHint ? 'Decrypting...' : `Request Next Hint (${hintsRemaining} left)`}
              </button>
            ) : (
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500">
                All hints unlocked
              </span>
            )}
          </div>

          {/* Hint Confirmation Modal */}
          {hintConfirmOpen && (
            <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/40 space-y-3">
              <p className="text-xs font-mono text-rose-300">
                Are you sure you want to unlock a tactical hint? 10 points will be deducted from your final score.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRequestHint}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-mono text-xs font-bold"
                >
                  Confirm (-10 PTS)
                </button>
                <button
                  onClick={() => setHintConfirmOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Hints List */}
          <div className="space-y-3">
            {caseData.hints.map((hint, idx) => (
              <div
                key={hint.id}
                className={`p-4 rounded-xl border font-sans text-xs transition-all ${
                  hint.unlocked
                    ? 'bg-slate-900/90 border-amber-500/40 text-slate-200'
                    : 'bg-slate-950/50 border-slate-800/80 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 font-mono text-[10px]">
                  <span className={hint.unlocked ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                    HINT #{idx + 1}
                  </span>
                  <span>{hint.unlocked ? 'UNLOCKED (-10 PTS)' : 'LOCKED'}</span>
                </div>
                {hint.unlocked ? (
                  <p className="leading-relaxed text-slate-300">{hint.text}</p>
                ) : (
                  <p className="italic text-slate-600">Locked encrypted intelligence.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-400">
              Evidence: <strong className="text-cyan-400">{discoveredCluesCount}/{totalClues}</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              Live Score: <strong className="text-amber-300">{caseData.score} PTS</strong>
            </span>
          </div>

          <Link
            to={`/case/${id}/accuse`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-bold font-mono text-sm tracking-wide shadow-lg shadow-rose-500/25 transition-all active:scale-95 ml-auto"
          >
            <Gavel className="w-4 h-4" />
            <span>Proceed to Accusation Chamber</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
