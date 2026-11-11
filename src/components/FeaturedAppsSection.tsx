import React from 'react';
import { 
  Sparkles, 
  Play, 
  ExternalLink, 
  Star, 
  Users, 
  Coins, 
  Flame, 
  ShieldCheck,
  Pin
} from 'lucide-react';
import { AppItem } from '../types';

interface Props {
  apps: AppItem[];
  onSelectApp: (app: AppItem) => void;
  onToggleFeatured?: (appId: string) => void;
  canFeatureApp: boolean;
}

export function FeaturedAppsSection({ apps, onSelectApp, onToggleFeatured, canFeatureApp }: Props) {
  const featuredApps = apps.filter(a => a.featured);

  if (featuredApps.length === 0) return null;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black font-display text-white flex items-center space-x-2">
              <span>Featured Onchain Miniapps</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                CURATED
              </span>
            </h2>
            <p className="text-xs text-slate-400">High-vibe miniapps on Base L2 with verified Farcaster Frames v2 manifests</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featuredApps.map((app) => (
          <div
            key={app.id}
            className="glass-card p-5 border-2 border-purple-500/40 hover:border-cyan-400/60 rounded-3xl relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(168,85,247,0.2)] transition-all"
          >
            {/* Top Glowing Sweep Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400" />

            <div className="flex items-start justify-between mb-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border border-white/20"
                style={{ backgroundColor: `${app.accentColor}33`, borderColor: app.accentColor }}
              >
                {app.type === 'arcade' ? '🕹️' : app.type === 'tipping' ? '💸' : app.type === 'meme' ? '🎨' : app.type === 'casino' ? '🎲' : '🔮'}
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold">
                  {app.token?.symbol || '$APP'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-mono font-bold">
                  60% FEE SPLIT
                </span>
              </div>
            </div>

            <h3 className="text-base font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
              {app.name}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
              {app.description}
            </p>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-400">
                <img src={app.author.avatarUrl} alt={app.author.name} className="w-4 h-4 rounded-full" />
                <span className="text-[11px] truncate">{app.author.handle}</span>
              </div>

              <div className="flex items-center space-x-1 font-mono text-cyan-400 font-semibold text-xs">
                <Users className="w-3.5 h-3.5" />
                <span>{app.metrics.uniqueUsers.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-3">
              <button
                onClick={() => onSelectApp(app)}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>PLAY NOW</span>
              </button>

              <a
                href={app.vercelDeployUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {canFeatureApp && onToggleFeatured && (
                <button
                  onClick={() => onToggleFeatured(app.id)}
                  title="Toggle Featured"
                  className="p-2 rounded-xl bg-slate-900 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30"
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
