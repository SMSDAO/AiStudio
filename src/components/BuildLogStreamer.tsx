import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, Pause, RotateCcw, Copy, Check, Download, Radio, ShieldCheck, Zap } from 'lucide-react';
import { FlashGlowCard } from './FlashGlowCard';

interface BuildLogStreamerProps {
  appId: string;
  appName: string;
  isBuilding: boolean;
  initialLogs?: string[];
  onBuildComplete?: () => void;
}

export const BuildLogStreamer: React.FC<BuildLogStreamerProps> = ({
  appId,
  appName,
  isBuilding,
  initialLogs = [],
  onBuildComplete,
}) => {
  const [logs, setLogs] = useState<string[]>(initialLogs.length > 0 ? initialLogs : [
    `[INFO] 🚀 Initializing Master Gods Autonomous Agent Core v10.3.0 for "${appName}"...`,
    `[INFO] 📦 Analyzing Zod schemas and Next.js 15 App Router requirements...`,
    `[INFO] ⚡ Provisioning secure sandbox environment & database migration...`,
  ]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Simulate real-time Supabase build logs streaming
  useEffect(() => {
    if (!isBuilding) return;

    const buildSequence = [
      `[STEP 1/6] 🔍 Parsing plain English prompt and constructing system architecture graph...`,
      `[STEP 2/6] 🎨 Generating cyber-neon glassmorphism design tokens and UI components...`,
      `[STEP 3/6] 💻 Writing TypeScript components with strict type-safety & Tailwind CSS v4...`,
      `[STEP 4/6] 🛡️ Executing security checks & zero-vulnerability audit...`,
      `[STEP 5/6] ⚡ Compiling project bundle and executing Vite production build...`,
      `[SUCCESS] 🎉 Build completed successfully! Generated vercel.yml and github-actions.yml workflow templates.`,
      `[DEPLOY] 🚀 Deploying application bundle to edge network... App is live!`,
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < buildSequence.length) {
        const nextLog = `[${new Date().toLocaleTimeString()}] ${buildSequence[index]}`;
        setLogs(prev => [...prev, nextLog]);
        index++;
      } else {
        clearInterval(interval);
        if (onBuildComplete) onBuildComplete();
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isBuilding, appId]);

  useEffect(() => {
    if (autoScroll && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLogs = () => {
    const element = document.createElement('a');
    const file = new Blob([logs.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `build-logs-${appId}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <FlashGlowCard variant="cyan" className="p-4 flex flex-col h-full rounded-2xl border-cyan-500/30">
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-3">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="font-display font-semibold text-sm text-cyan-200 tracking-wide">
            SUPABASE REALTIME BUILD LOGS STREAM
          </span>
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
            <span>CONNECTED</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              autoScroll ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
            }`}
            title="Toggle Auto-Scroll"
          >
            Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
            title="Copy Logs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownloadLogs}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
            title="Download Log File"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-950/90 rounded-xl p-3 font-mono text-xs text-slate-300 overflow-y-auto max-h-[320px] border border-cyan-500/15 shadow-inner">
        {logs.map((log, index) => {
          const isSuccess = log.includes('SUCCESS') || log.includes('LIVE') || log.includes('🚀');
          const isStep = log.includes('STEP');
          const colorClass = isSuccess 
            ? 'text-emerald-400 font-bold' 
            : isStep 
            ? 'text-cyan-300' 
            : 'text-slate-300';

          return (
            <div key={index} className={`py-1 border-b border-slate-900/60 leading-relaxed ${colorClass}`}>
              <span className="text-slate-600 mr-2 select-none">{(index + 1).toString().padStart(2, '0')}</span>
              {log}
            </div>
          );
        })}
        <div ref={logEndRef} />
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Supabase RLS active & encrypted build stream</span>
        </span>
        <span className="text-cyan-400">
          {isBuilding ? '⚡ Agent compiling app...' : '✨ Ready for deployment'}
        </span>
      </div>
    </FlashGlowCard>
  );
};
