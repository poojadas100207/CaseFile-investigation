import React from 'react';
import { Cpu, Terminal, Shield, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 py-8 px-4 text-xs font-mono text-slate-500 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>
            AI Mystery Room // <strong className="text-slate-300">The Tech Campus Heist</strong>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Powered by Google Gemini & Mongoose</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">Midnight Tech Symposium Edition</span>
        </div>
      </div>
    </footer>
  );
}
