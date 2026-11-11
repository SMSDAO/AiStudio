/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS AI STUDIO — Live Real-Time Build Progress Widget
 * Displays active progress updates for the autonomous build process via
 * Supabase Realtime / PartyKit WebSocket push notifications.
 * Clearly communicates loading states, stage transitions ('Generating Code',
 * 'Setting up Wallet', 'Deploying to Vercel'), active specialist agents,
 * live log streaming, and edge deployment verification.
 */

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  XOctagon, 
  Radio, 
  ShieldCheck, 
  Zap, 
  ExternalLink, 
  CheckCircle2, 
  Loader2, 
  Code2, 
  Wallet, 
  Rocket, 
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { FlashGlowCard } from './FlashGlowCard';
import { realtimeBuildService, RealtimeBuildState } from '../services/realtimeBuildService';

interface LiveBuildProgressWidgetProps {
  onOpenAppUrl?: (url: string) => void;
  className?: string;
}

export const LiveBuildProgressWidget: React.FC<LiveBuildProgressWidgetProps> = ({
  onOpenAppUrl,
  className = '',
}) => {
  const [state, setState] = useState<RealtimeBuildState>(realtimeBuildService.getState());
  const [inputAppName, setInputAppName] = useState('CyberPulse L2 Runner');

  useEffect(() => {
    const unsubscribe = realtimeBuildService.subscribe((updated) => {
      setState(updated);
    });
    return () => unsubscribe();
  }, []);

  const handleStart = () => {
    realtimeBuildService.startBuild(inputAppName.trim() || 'CyberPulse L2 Runner');
  };

  const handleCancel = () => {
    realtimeBuildService.cancelBuild();
  };

  const handleReset = () => {
    realtimeBuildService.resetBuild();
  };

  const handleToggleChannel = () => {
    realtimeBuildService.toggleProvider();
  };

  // Stage icons mapping
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'generating_code':
        return <Code2 className="w-4 h-4 text-cyan-400 animate-bounce" />;
      case 'setting_up_wallet':
        return <Wallet className="w-4 h-4 text-purple-400 animate-pulse" />;
      case 'security_audit':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'compiling':
        return <Cpu className="w-4 h-4 text-amber-400 animate-spin" />;
      case 'deploying_to_vercel':
        return <Rocket className="w-4 h-4 text-[#FF8A32] animate-pulse" />;
      case 'live':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'failed':
        return <XOctagon className="w-4 h-4 text-red-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  // Determine container glow variant based on stage
  const getCardVariant = () => {
    if (state.stage === 'failed') return 'red';
    if (state.stage === 'live') return 'green';
    if (state.stage === 'deploying_to_vercel') return 'orange';
    if (state.stage === 'setting_up_wallet') return 'purple';
    return 'cyan';
  };

  return (
    <FlashGlowCard 
      variant={getCardVariant()} 
      intensity={state.isBuilding ? 'high' : 'medium'}
      className={`p-5 rounded-3xl border border-white/10 ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${
              state.isBuilding 
                ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]' 
                : 'bg-slate-900 border-slate-700'
            }`}>
              {state.isBuilding ? (
                <Loader2 className="w-5 h-5 text-cyan-300 animate-spin" />
              ) : (
                <Zap className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            {state.isBuilding && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm sm:text-base font-bold font-display text-white tracking-wide">
                Real-Time AI Build Process Engine
              </h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                state.isBuilding 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                  : state.stage === 'live'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {state.isBuilding ? 'ACTIVE BUILD IN PROGRESS' : state.stage === 'live' ? 'BUILD VERIFIED' : 'STANDBY'}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-0.5">
              Live status changes streamed via {state.channel.provider} WebSocket channel
            </p>
          </div>
        </div>

        {/* Realtime WebSocket Provider Badge */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleChannel}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400/50 text-[11px] font-mono text-cyan-300 transition-all"
            title="Click to switch WebSocket provider between Supabase Realtime and PartyKit"
          >
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="font-semibold">{state.channel.provider}</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400">{state.channel.latencyMs}ms</span>
          </button>
        </div>
      </div>

      {/* Main Status & Loading Indicator Display */}
      <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              {getStageIcon(state.stage)}
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Current Pipeline Status:
              </span>
              <div className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <span className={state.isBuilding ? 'text-cyan-300 animate-pulse' : 'text-white'}>
                  {state.stageLabel}
                </span>
                {state.isBuilding && (
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>
            </div>
          </div>

          <div className="text-right sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {state.progress}% Complete
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Elapsed: {state.elapsedSeconds}s • Agent: <span className="text-purple-300">{state.activeAgent}</span>
            </span>
          </div>
        </div>

        {/* Dynamic Glowing Progress Bar with Clear Loading State */}
        <div className="w-full bg-slate-900/90 rounded-full h-3 p-0.5 border border-white/10 overflow-hidden relative">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-[#A855F7] via-[#06B6D4] to-[#22C55E] transition-all duration-500 relative"
            style={{ width: `${Math.max(state.progress, state.isBuilding ? 8 : 0)}%` }}
          >
            {state.isBuilding && (
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            )}
          </div>
        </div>

        {/* Milestone Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
          <div className={`p-2 rounded-xl border flex items-center space-x-2 transition-all ${
            state.stage === 'generating_code'
              ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : state.progress > 32
              ? 'bg-slate-900/60 border-emerald-500/40 text-emerald-400'
              : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <Code2 className="w-3.5 h-3.5 shrink-0" />
            <div className="truncate">
              <span className="font-semibold block">Generating Code</span>
              <span className="text-[9px] text-slate-400">{state.progress > 32 ? '✓ Ready' : state.stage === 'generating_code' ? 'Writing...' : 'Pending'}</span>
            </div>
          </div>

          <div className={`p-2 rounded-xl border flex items-center space-x-2 transition-all ${
            state.stage === 'setting_up_wallet'
              ? 'bg-purple-950/60 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              : state.progress > 54
              ? 'bg-slate-900/60 border-emerald-500/40 text-emerald-400'
              : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <Wallet className="w-3.5 h-3.5 shrink-0" />
            <div className="truncate">
              <span className="font-semibold block">Setting up Wallet</span>
              <span className="text-[9px] text-slate-400">{state.progress > 54 ? '✓ 60% Hook' : state.stage === 'setting_up_wallet' ? 'Deploying...' : 'Pending'}</span>
            </div>
          </div>

          <div className={`p-2 rounded-xl border flex items-center space-x-2 transition-all ${
            state.stage === 'compiling' || state.stage === 'security_audit'
              ? 'bg-amber-950/60 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
              : state.progress > 86
              ? 'bg-slate-900/60 border-emerald-500/40 text-emerald-400'
              : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <Cpu className="w-3.5 h-3.5 shrink-0" />
            <div className="truncate">
              <span className="font-semibold block">Vite / Next.js Build</span>
              <span className="text-[9px] text-slate-400">{state.progress > 86 ? '✓ Compiled' : state.stage === 'compiling' ? 'Optimizing...' : 'Pending'}</span>
            </div>
          </div>

          <div className={`p-2 rounded-xl border flex items-center space-x-2 transition-all ${
            state.stage === 'deploying_to_vercel'
              ? 'bg-orange-950/60 border-orange-400 text-orange-200 shadow-[0_0_12px_rgba(251,146,60,0.3)]'
              : state.stage === 'live'
              ? 'bg-slate-900/60 border-emerald-500/40 text-emerald-400'
              : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <Rocket className="w-3.5 h-3.5 shrink-0" />
            <div className="truncate">
              <span className="font-semibold block">Deploying to Vercel</span>
              <span className="text-[9px] text-slate-400">{state.stage === 'live' ? '✓ Deployed' : state.stage === 'deploying_to_vercel' ? 'Broadcasting...' : 'Pending'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Terminal Log Streamer */}
      <div className="mt-3">
        <div className="flex items-center justify-between pb-1.5 text-xs font-mono text-slate-400">
          <span className="flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Streaming Real-Time Logs ({state.channel.channelName})</span>
          </span>
          <span className="text-[10px] text-slate-500">Live Buffer: {state.logs.length} entries</span>
        </div>

        <div className="bg-[#05070f] rounded-xl border border-white/10 p-3 font-mono text-xs max-h-36 overflow-y-auto space-y-1.5">
          {state.logs.map((log) => {
            const isSuccess = log.level === 'SUCCESS';
            const isWarn = log.level === 'WARN';
            const isErr = log.level === 'ERROR';

            return (
              <div key={log.id} className="flex items-start space-x-2 text-[11px] leading-relaxed">
                <span className="text-slate-500 select-none shrink-0">[{log.timestamp}]</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                  isSuccess ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                  isWarn ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                  isErr ? 'bg-red-950 text-red-400 border border-red-500/30' :
                  'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                }`}>
                  {log.level}
                </span>
                <span className={isSuccess ? 'text-emerald-300 font-semibold' : 'text-slate-300'}>
                  {log.message}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Controls & Action Bar */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="text"
            value={inputAppName}
            onChange={(e) => setInputAppName(e.target.value)}
            disabled={state.isBuilding}
            placeholder="Miniapp name to build..."
            className="w-full sm:w-60 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono disabled:opacity-50"
          />

          {!state.isBuilding ? (
            <button
              onClick={handleStart}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-mono text-xs font-bold flex items-center space-x-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95 transition-all whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Trigger Build</span>
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center space-x-1.5 shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-all whitespace-nowrap"
            >
              <XOctagon className="w-3.5 h-3.5" />
              <span>Cancel Build</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all"
            title="Reset Build State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live URL Link when completed */}
        {state.artifacts.hasVercelUrl && state.artifacts.vercelUrl && (
          <div className="flex items-center space-x-2">
            <a
              href={state.artifacts.vercelUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                if (onOpenAppUrl) {
                  e.preventDefault();
                  onOpenAppUrl(state.artifacts.vercelUrl!);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center space-x-1.5 shadow-[0_0_12px_rgba(34,197,94,0.3)] transition-all"
            >
              <span>Open Deployed App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </FlashGlowCard>
  );
};
