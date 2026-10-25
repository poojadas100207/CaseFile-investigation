import React, { useEffect, useState } from 'react';
import { Terminal, Cpu, ShieldCheck, Database, Sparkles } from 'lucide-react';

const LOG_MESSAGES = [
  'Initializing forensic sandbox...',
  'Connecting to campus security biometric mainframe...',
  'Querying midnight hackathon swipe-card audit logs...',
  'Isolating cryogenic thermal anomalies in Server Room 01...',
  'Extracting CCTV static freeze timestamps...',
  'Synthesizing suspect profiles, alibis, and motives with Gemini...',
  'Verifying logical consistency of evidence against Zod schema...',
  'Encrypting culprit identity on secure enclave...',
  'Ready to deploy detective briefing...',
];

export default function LoadingDecryption({ message = 'Synthesizing Crime Scenario' }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < LOG_MESSAGES.length - 1 ? prev + 1 : prev));
    }, 1100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4">
      <div className="w-full max-w-lg bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/80 relative overflow-hidden">
        {/* Scanning laser line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

        {/* Header Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <Cpu className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h3 className="font-mono font-bold text-lg text-slate-100 flex items-center gap-2">
              <span>DECRYPTING EVIDENCE</span>
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </h3>
            <p className="text-xs font-mono text-cyan-400/80">{message}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 mb-6 overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-700 shadow-[0_0_12px_#06b6d4]"
            style={{ width: `${Math.round(((currentStep + 1) / LOG_MESSAGES.length) * 100)}%` }}
          />
        </div>

        {/* Terminal Log Console */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 min-h-[140px] shadow-inner">
          <div className="text-[11px] text-slate-500 flex items-center justify-between border-b border-slate-800/80 pb-1.5 mb-2">
            <span>FORENSIC TELEMETRY STREAM</span>
            <span>{Math.round(((currentStep + 1) / LOG_MESSAGES.length) * 100)}% COMPLETE</span>
          </div>
          {LOG_MESSAGES.slice(0, currentStep + 1).map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${
                index === currentStep ? 'text-cyan-300 font-semibold' : 'text-slate-400'
              }`}
            >
              <span className="text-cyan-500 font-bold">&gt;</span>
              <span>{msg}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 text-center">
          <p className="text-[11px] font-mono text-slate-500">
            Secure Gemini AI Inference • Please do not refresh the terminal
          </p>
        </div>
      </div>
    </div>
  );
}
