import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Sparkles,
  Shield,
  FileCode,
  Terminal,
  Zap,
  Check,
  AlertCircle,
} from 'lucide-react';
import { createCase } from '../services/api';
import LoadingDecryption from '../components/LoadingDecryption';

const PRESETS = [
  {
    id: 'tech_heist',
    title: 'The Tech Campus Heist',
    subtitle: 'Midnight Hackathon Quantum Chip Theft',
    premise:
      'During the midnight annual tech symposium hackathon, a revolutionary quantum microchip prototype worth ₹50 Lakhs was stolen from the locked main server room. Only four people had swipe-card access during the lockdown window: the lead hardware architect who was deep in debugging, the rival team captain who lost the qualifiers, the late-night janitor with a history of debt, and the head of security whose logs show a mysterious manual override.',
    badge: 'Recommended Flagship',
  },
  {
    id: 'ai_leak',
    title: 'Frontier AI Weights Leak',
    subtitle: 'Autonomous Agent Source Exfiltration',
    premise:
      'Inside the high-security AI Research Institute, the unreleased neural network weights of project "MindEcho" were exfiltrated onto an external NVMe drive 20 minutes before a federal safety audit. Access was isolated to the lead alignment researcher, the chief cloud infrastructure engineer, the visiting venture auditor, and the executive assistant with master MFA passkeys.',
    badge: 'Cyber Espionage',
  },
  {
    id: 'crypto_drain',
    title: 'The Web3 Treasury Drain',
    subtitle: 'Midnight Multi-Sig Exploit',
    premise:
      'During an unscheduled smart contract upgrade at 2:00 AM, $3.2 Million USDC was drained from a decentralized liquidity pool. The multi-sig transaction was signed by three of five shard holders, but two shard holders swear their hardware wallets were stored in physical safes in different cities.',
    badge: 'Blockchain Noir',
  },
];

const DIFFICULTIES = [
  {
    id: 'easy',
    name: 'Easy',
    suspects: 3,
    clues: 5,
    hints: 2,
    baseScore: 100,
    color: 'emerald',
    desc: 'Streamlined investigation with clear forensic trails.',
  },
  {
    id: 'medium',
    name: 'Medium',
    suspects: 4,
    clues: 7,
    hints: 3,
    baseScore: 150,
    color: 'cyan',
    desc: 'Balanced mystery with red herrings and overlapping alibis.',
  },
  {
    id: 'hard',
    name: 'Hard',
    suspects: 5,
    clues: 9,
    hints: 3,
    baseScore: 200,
    color: 'purple',
    desc: 'Complex conspiracy requiring razor-sharp deductive cross-referencing.',
  },
];

export default function CreateCasePage() {
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState('tech_heist');
  const [premiseText, setPremiseText] = useState(PRESETS[0].premise);
  const [difficulty, setDifficulty] = useState('medium');
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset.id);
    setPremiseText(preset.premise);
    setIsCustom(false);
  };

  const handleSelectCustom = () => {
    setSelectedPreset('custom');
    setIsCustom(true);
    setPremiseText('');
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!premiseText.trim()) {
      setError('Please provide a mystery premise or select one of the presets.');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const newCase = await createCase(premiseText, difficulty);
      navigate(`/case/${newCase._id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to generate mystery case. Is the backend running?');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {loading && <LoadingDecryption message="Generating procedural case with Gemini..." />}

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-3">
          <Terminal className="w-3.5 h-3.5" />
          <span>CASE COMMISSIONER TERMINAL</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Initialize New Investigation
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Select a pre-configured crime scenario or formulate your own custom premise. Gemini will
          synthesize a logically validated mystery with suspects, clues, and hidden forensic trails.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-8">
        {/* Step 1: Select Premise */}
        <div className="space-y-4">
          <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
            Step 1: Choose Scenario Preset or Custom Premise
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESETS.map((preset) => {
              const active = selectedPreset === preset.id && !isCustom;
              return (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-4 rounded-xl text-left border transition-all relative ${
                    active
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-950'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                      {preset.badge}
                    </span>
                    {active && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <h3 className="font-semibold text-sm text-white mb-1">{preset.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{preset.subtitle}</p>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSelectCustom}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                isCustom
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              + Write Custom Premise
            </button>
          </div>

          {/* Premise Textarea */}
          <div className="relative">
            <textarea
              rows={4}
              value={premiseText}
              onChange={(e) => {
                setPremiseText(e.target.value);
                setIsCustom(true);
                setSelectedPreset('custom');
              }}
              placeholder="Describe the incident: what was stolen or sabotaged, the restricted environment, and the initial suspects who had access..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500/70 p-4 font-sans text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Step 2: Difficulty Level */}
        <div className="space-y-4">
          <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
            Step 2: Select Investigation Difficulty
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DIFFICULTIES.map((diff) => {
              const active = difficulty === diff.id;
              return (
                <button
                  type="button"
                  key={diff.id}
                  onClick={() => setDifficulty(diff.id)}
                  className={`p-5 rounded-xl text-left border transition-all relative ${
                    active
                      ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-400/50'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-base text-white">{diff.name}</span>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      +{diff.baseScore} PTS
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-4">{diff.desc}</p>

                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-center pt-2 border-t border-slate-800/80">
                    <div className="p-1.5 rounded bg-slate-950/80">
                      <div className="text-slate-500 text-[9px]">SUSPECTS</div>
                      <div className="text-cyan-400 font-bold">{diff.suspects}</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-950/80">
                      <div className="text-slate-500 text-[9px]">CLUES</div>
                      <div className="text-blue-400 font-bold">{diff.clues}</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-950/80">
                      <div className="text-slate-500 text-[9px]">HINTS</div>
                      <div className="text-amber-400 font-bold">{diff.hints}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 active:scale-[0.99] transition-all"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>COMMISSION CASE WITH GEMINI</span>
          </button>
        </div>
      </form>
    </div>
  );
}
