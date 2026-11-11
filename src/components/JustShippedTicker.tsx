import React from 'react';
import { 
  Radio, 
  ExternalLink, 
  Sparkles, 
  Coins, 
  DollarSign, 
  CheckCircle2, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ShippedEvent } from '../types';

interface Props {
  events: ShippedEvent[];
  onOpenAppBySlug: (slug: string) => void;
}

export function JustShippedTicker({ events, onOpenAppBySlug }: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-display text-white flex items-center space-x-2">
              <span>Just Shipped</span>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            </h1>
            <p className="text-xs text-slate-400">
              Real-time onchain telemetry of miniapps, Clanker tokens, and fee settlements on Base L2.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
          WEBSOCKET LIVE
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {events.map((evt) => {
          const badgeClass =
            evt.badgeColor === 'green' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
            evt.badgeColor === 'purple' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
            evt.badgeColor === 'blue' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
            'bg-orange-500/20 text-orange-400 border-orange-500/30';

          return (
            <div
              key={evt.id}
              className="glass-card p-4 border border-white/10 hover:border-cyan-500/40 rounded-2xl flex items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-base">
                  {evt.type === 'fees_claimed' ? '💸' : evt.type === 'token_created' ? '🪙' : evt.type === 'app_launched' ? '🚀' : '⚡'}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold font-display text-white">
                      {evt.appName}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badgeClass}`}>
                      {evt.badge}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {evt.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-0.5 font-sans">
                    {evt.detail}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                {evt.txHash && (
                  <span className="text-[10px] font-mono text-cyan-400/80 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 hidden sm:inline">
                    Tx: {evt.txHash}
                  </span>
                )}
                <button
                  onClick={() => onOpenAppBySlug(evt.appSlug)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center space-x-1 border border-slate-700 transition-all"
                >
                  <span>View</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
