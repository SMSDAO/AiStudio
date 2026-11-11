import React, { useState } from 'react';
import { 
  Play, 
  ExternalLink, 
  Code2, 
  Coins, 
  Layers, 
  DollarSign, 
  Users, 
  Activity, 
  ShieldCheck, 
  Share2, 
  Copy, 
  Plus, 
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Sliders,
  Radio,
  Star,
  Pin
} from 'lucide-react';
import { AppItem, UserSession } from '../types';

interface Props {
  apps: AppItem[];
  user: UserSession;
  onSelectApp: (app: AppItem) => void;
  onClaimFees: (appId: string) => void;
  onCreateNew: () => void;
  onShareApp: (app: AppItem) => void;
  onSyncFarcasterHubs: (app: AppItem) => void;
  onOpenFeedback: (app: AppItem) => void;
  onToggleFeatured?: (appId: string) => void;
  canFeatureApp: boolean;
}

export function MyAppsView({ 
  apps, 
  user, 
  onSelectApp, 
  onClaimFees, 
  onCreateNew,
  onShareApp,
  onSyncFarcasterHubs,
  onOpenFeedback,
  onToggleFeatured,
  canFeatureApp
}: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalOpens = apps.reduce((acc, a) => acc + a.metrics.opens, 0);
  const totalUnique = apps.reduce((acc, a) => acc + a.metrics.uniqueUsers, 0);
  const totalUnclaimedFees = apps.reduce((acc, a) => acc + a.wallet.unclaimedFeesEth, 0);

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Banner & Summary Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            My Onchain Apps
          </h1>
          <p className="text-xs text-slate-400">
            Manage your deployed miniapps, Base Smart Wallets, Clanker tokens, and 60% trading fee rewards.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center space-x-1.5 self-start sm:self-auto active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>BUILD NEW MINIAPP</span>
        </button>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4 border border-purple-500/30 rounded-2xl">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Deployed Apps</span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-white mt-1">
            {apps.length}
          </div>
          <div className="text-[10px] text-cyan-400 mt-0.5">Base L2 Verified</div>
        </div>

        <div className="glass-card p-4 border border-cyan-500/30 rounded-2xl">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Total Unique Users</span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-white mt-1">
            {totalUnique.toLocaleString()}
          </div>
          <div className="text-[10px] text-green-400 mt-0.5">+24% this week</div>
        </div>

        <div className="glass-card p-4 border border-orange-500/30 rounded-2xl">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center space-x-1">
            <Activity className="w-3.5 h-3.5 text-orange-400" />
            <span>Total App Opens</span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-white mt-1">
            {totalOpens.toLocaleString()}
          </div>
          <div className="text-[10px] text-orange-400 mt-0.5">Farcaster + Web</div>
        </div>

        <div className="glass-card p-4 border border-green-500/40 rounded-2xl bg-gradient-to-br from-green-950/20 to-slate-900">
          <div className="text-[10px] text-green-400 font-mono uppercase tracking-wider flex items-center space-x-1">
            <Coins className="w-3.5 h-3.5 text-green-400" />
            <span>Claimable 60% Fees</span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-display text-white mt-1">
            {totalUnclaimedFees.toFixed(3)} ETH
          </div>
          <div className="text-[10px] text-green-300 mt-0.5">
            ~${(totalUnclaimedFees * 3340).toFixed(2)} USD
          </div>
        </div>
      </div>

      {/* Apps List */}
      <div className="space-y-4">
        {apps.map((app) => {
          const borderClass = 
            app.neonBorderColor === 'purple' ? 'neon-box-purple' :
            app.neonBorderColor === 'blue' ? 'neon-box-blue' :
            app.neonBorderColor === 'green' ? 'neon-box-green' :
            app.neonBorderColor === 'orange' ? 'neon-box-orange' : 'neon-box-yellow';

          return (
            <div
              key={app.id}
              className={`glass-card p-5 sm:p-6 border rounded-3xl transition-all ${borderClass}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left App Details */}
                <div className="flex items-start space-x-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg border border-white/20"
                    style={{ backgroundColor: `${app.accentColor}33`, borderColor: app.accentColor }}
                  >
                    {app.type === 'arcade' ? '🕹️' : app.type === 'tipping' ? '💸' : app.type === 'meme' ? '🎨' : app.type === 'casino' ? '🎲' : '🔮'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold font-display text-white">{app.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold">
                        {app.token?.symbol || '$APP'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-mono font-bold">
                        60% FEE SPLIT
                      </span>
                      {app.featured && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-mono font-bold">
                          ★ FEATURED
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-1 max-w-xl">
                      {app.tagline}
                    </p>

                    {/* Platform badging & Rating */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-500/30">
                        Farcaster Frames v2
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-300 border border-blue-500/30">
                        Base Smart Wallet
                      </span>
                      <button
                        onClick={() => onOpenFeedback(app)}
                        className="px-2 py-0.5 rounded-md bg-yellow-950/50 text-yellow-300 border border-yellow-500/30 flex items-center space-x-1"
                      >
                        <Star className="w-2.5 h-2.5 fill-yellow-400" />
                        <span>{app.metrics.rating} ({app.metrics.feedbackCount || 0} reviews)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Middle Financials: 60% Creator Trading Fees */}
                <div className="flex items-center space-x-4 bg-slate-950/60 p-3.5 rounded-2xl border border-white/5">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">
                      Unclaimed 60% Fees
                    </div>
                    <div className="text-base font-extrabold font-mono text-green-400">
                      {app.wallet.unclaimedFeesEth.toFixed(3)} ETH
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ~${(app.wallet.unclaimedFeesEth * 3340).toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => onClaimFees(app.id)}
                    disabled={app.wallet.unclaimedFeesEth <= 0}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(34,197,94,0.5)] disabled:opacity-40 hover:brightness-110 active:scale-95 transition-all"
                  >
                    CLAIM 60% 💸
                  </button>
                </div>

                {/* Right Interactive CTAs */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onSelectApp(app)}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center space-x-1.5 active:scale-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>SIMULATOR</span>
                  </button>

                  <button
                    onClick={() => onShareApp(app)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 transition-all"
                    title="Share to X & Farcaster"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSyncFarcasterHubs(app)}
                    className="p-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-500/40 transition-all"
                    title="Sync to Farcaster Hubs"
                  >
                    <Radio className="w-4 h-4" />
                  </button>

                  <a
                    href={app.vercelDeployUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
                    title="Live Miniapp Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {canFeatureApp && onToggleFeatured && (
                    <button
                      onClick={() => onToggleFeatured(app.id)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        app.featured 
                          ? 'bg-yellow-500/30 border-yellow-400 text-yellow-300' 
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                      title="Toggle Curated Featured Pin"
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
