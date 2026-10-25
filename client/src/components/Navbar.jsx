import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Terminal, Sparkles, FolderLock, PlusCircle, Activity } from 'lucide-react';
import { getHealth } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const [serverOnline, setServerOnline] = useState(null);

  useEffect(() => {
    let mounted = true;
    const checkServer = async () => {
      try {
        await getHealth();
        if (mounted) setServerOnline(true);
      } catch (err) {
        if (mounted) setServerOnline(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-cyan-500/20 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors shadow-sm shadow-cyan-500/20">
            <Terminal className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold tracking-wider text-base text-cyan-400 uppercase">
                AI Mystery Room
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                Gemini 2.5
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              Cyber Forensic Investigation Bureau
            </p>
          </div>
        </Link>

        {/* Navigation & Status */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                serverOnline === true
                  ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]'
                  : serverOnline === false
                  ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-400">
              {serverOnline === true
                ? 'CORE ONLINE'
                : serverOnline === false
                ? 'OFFLINE'
                : 'CONNECTING...'}
            </span>
          </div>

          <Link
            to="/create"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm font-mono tracking-wide transition-all shadow-md shadow-cyan-500/25 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Case</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
