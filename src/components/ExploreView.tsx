/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS AI STUDIO — Explore Miniapp Ecosystem
 * Displays curated list of public miniapps fetched directly from the database.
 * Supports sorting and filtering by creation date or popularity, includes
 * live deployment URLs, and features an integrated 'Just Shipped' feed.
 */

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Search, 
  Sparkles, 
  Play, 
  ExternalLink, 
  Star, 
  Users, 
  Layers,
  ArrowRight,
  GitFork,
  Share2,
  Calendar,
  Flame,
  Radio,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  RefreshCw,
  Coins,
  Rocket
} from 'lucide-react';
import { AppItem, ShippedEvent } from '../types';
import { 
  miniappDatabaseService, 
  SortOption 
} from '../services/miniappDatabaseService';
import { FeaturedAppsSection } from './FeaturedAppsSection';
import { FlashGlowCard } from './FlashGlowCard';

interface Props {
  apps?: AppItem[];
  onSelectApp: (app: AppItem) => void;
  onRemixApp: (app: AppItem) => void;
  onShareApp: (app: AppItem) => void;
  onOpenFeedback: (app: AppItem) => void;
  onToggleFeatured?: (appId: string) => void;
  canFeatureApp: boolean;
}

export function ExploreView({ 
  onSelectApp, 
  onRemixApp, 
  onShareApp, 
  onOpenFeedback,
  onToggleFeatured,
  canFeatureApp
}: Props) {
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [apps, setApps] = useState<AppItem[]>([]);
  const [shippedEvents, setShippedEvents] = useState<ShippedEvent[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [activeViewMode, setActiveViewMode] = useState<'curated' | 'just_shipped'>('curated');
  const [lastSynced, setLastSynced] = useState<string>('');

  // Fetch data from database
  const loadDatabaseApps = async () => {
    setIsLoading(true);
    try {
      const [appResult, eventsResult] = await Promise.all([
        miniappDatabaseService.fetchPublicMiniapps({
          category: selectedCat,
          searchQuery: search,
          sortBy,
        }),
        miniappDatabaseService.fetchJustShippedFeed(),
      ]);

      setApps(appResult.apps);
      setCategories(appResult.categories);
      setShippedEvents(eventsResult);
      setLastSynced(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load miniapp database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseApps();
  }, [selectedCat, search, sortBy]);

  const handleToggleFeaturedLocal = (appId: string) => {
    if (!canFeatureApp) return;
    miniappDatabaseService.toggleFeatured(appId);
    loadDatabaseApps();
    if (onToggleFeatured) onToggleFeatured(appId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-2 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>CURATED PUBLIC MINIAPPS • ONCHAIN BASE & FARCASTER</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight">
            Explore Miniapps Ecosystem
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Browse verified production miniapps, autonomous agents, and game frames deployed to Vercel and Base L2. Sort by popularity, release date, and launch live apps instantly.
          </p>
        </div>

        {/* Database Status & View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Tabs */}
          <div className="p-1 bg-white/[0.04] border border-white/10 rounded-2xl flex items-center space-x-1">
            <button
              onClick={() => setActiveViewMode('curated')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                activeViewMode === 'curated'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Directory ({apps.length})</span>
            </button>

            <button
              onClick={() => setActiveViewMode('just_shipped')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                activeViewMode === 'just_shipped'
                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Just Shipped Feed ({shippedEvents.length})</span>
            </button>
          </div>

          <button
            onClick={loadDatabaseApps}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-all"
            title="Refresh from Database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Featured Apps Section Showcase (Only in curated mode) */}
      {activeViewMode === 'curated' && apps.length > 0 && (
        <FeaturedAppsSection 
          apps={apps} 
          onSelectApp={onSelectApp} 
          onToggleFeatured={handleToggleFeaturedLocal}
          canFeatureApp={canFeatureApp}
        />
      )}

      {/* =========================================================================
          VIEW MODE 1: CURATED PUBLIC MINIAPPS DIRECTORY
          ========================================================================= */}
      {activeViewMode === 'curated' && (
        <div className="space-y-6">
          {/* Filter & Sort Controls Bar */}
          <div className="glass-card p-4 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search miniapps by title, description, or creator..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white font-mono"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort & Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-700 rounded-2xl px-3 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[11px] font-mono text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="popularity" className="bg-slate-900 text-white">🔥 Popularity (Most Active)</option>
                  <option value="date_desc" className="bg-slate-900 text-white">⚡ Creation Date (Newest First)</option>
                  <option value="date_asc" className="bg-slate-900 text-white">📅 Creation Date (Oldest First)</option>
                  <option value="rating" className="bg-slate-900 text-white">⭐ Highest Rated</option>
                </select>
              </div>

              {/* Database Live Status Badge */}
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>DB: Connected ({apps.length} verified)</span>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCat === cat
                    ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading Skeleton State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="glass-card p-5 rounded-3xl border border-white/5 animate-pulse space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/5" />
                    <div className="w-20 h-5 rounded-full bg-white/5" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-3/4 h-5 rounded-lg bg-white/5" />
                    <div className="w-full h-3 rounded bg-white/5" />
                    <div className="w-2/3 h-3 rounded bg-white/5" />
                  </div>
                  <div className="w-full h-10 rounded-xl bg-white/5" />
                </div>
              ))}
            </div>
          ) : apps.length === 0 ? (
            /* Empty State */
            <FlashGlowCard variant="yellow" className="p-8 text-center rounded-3xl space-y-3">
              <Compass className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">No miniapps match your criteria</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try searching for different keywords, selecting "All" categories, or resetting the sort filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCat('All');
                  setSearch('');
                  setSortBy('popularity');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold hover:bg-amber-500/30 transition-all"
              >
                Reset Filters
              </button>
            </FlashGlowCard>
          ) : (
            /* Grid of Curated Public Miniapps */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {apps.map((app) => {
                const formattedDate = app.createdAt 
                  ? new Date(app.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'Recent';

                return (
                  <div
                    key={app.id}
                    className="glass-card p-5 border border-white/10 hover:border-purple-500/50 rounded-3xl flex flex-col justify-between space-y-4 group transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] relative overflow-hidden"
                  >
                    {/* Top ambient highlight */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1 opacity-60" 
                      style={{ backgroundColor: app.accentColor || '#A855F7' }} 
                    />

                    <div className="space-y-3.5">
                      {/* Header Row: Icon, Token Symbol & Rating */}
                      <div className="flex items-center justify-between">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-md border border-white/20"
                          style={{ backgroundColor: `${app.accentColor || '#a855f7'}33`, borderColor: app.accentColor || '#a855f7' }}
                        >
                          {app.type === 'arcade' ? '🕹️' : app.type === 'tipping' ? '💸' : app.type === 'meme' ? '🎨' : app.type === 'casino' ? '🎲' : '🔮'}
                        </div>

                        <div className="flex items-center space-x-1.5">
                          {app.token?.symbol && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold border border-purple-500/30">
                              {app.token.symbol}
                            </span>
                          )}
                          <button
                            onClick={() => onOpenFeedback(app)}
                            className="flex items-center space-x-1 text-xs text-yellow-400 font-bold hover:scale-105 transition-transform bg-white/5 px-2 py-0.5 rounded-full border border-white/10"
                            title="Rate & Review"
                          >
                            <Star className="w-3 h-3 fill-yellow-400" />
                            <span>{app.metrics.rating || 5.0}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({app.metrics.feedbackCount || 0})</span>
                          </button>
                        </div>
                      </div>

                      {/* Title & Brief Description */}
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-base font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                            {app.name}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {formattedDate}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed font-sans">
                          {app.description}
                        </p>
                      </div>

                      {/* Live URL Link preview badge */}
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400 truncate max-w-[200px]">
                          {app.vercelDeployUrl || `https://${app.slug}.vini.run`}
                        </span>
                        <a
                          href={app.vercelDeployUrl || `https://${app.slug}.vini.run`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold"
                          title="Open Live Hosted URL"
                        >
                          <span>Live URL</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Author & Popularity metrics */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400">
                        <div className="flex items-center space-x-1.5">
                          <img
                            src={app.author.avatarUrl}
                            alt={app.author.name}
                            className="w-4 h-4 rounded-full border border-white/10"
                          />
                          <span className="font-mono">{app.author.handle}</span>
                        </div>

                        <div className="flex items-center space-x-1 font-mono text-cyan-400">
                          <Users className="w-3 h-3" />
                          <span>{app.metrics.uniqueUsers?.toLocaleString() || 0} users</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Play Live, Share, Fork, Live Link */}
                    <div className="flex items-center space-x-2 pt-3 border-t border-white/10">
                      <button
                        onClick={() => onSelectApp(app)}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>PLAY LIVE</span>
                      </button>

                      <a
                        href={app.vercelDeployUrl || `https://${app.slug}.vini.run`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-all flex items-center justify-center"
                        title="Open Live Deployment in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => onShareApp(app)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all"
                        title="Share Miniapp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onRemixApp(app)}
                        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center space-x-1 transition-all"
                        title="Remix and Fork Miniapp in Studio"
                      >
                        <GitFork className="w-3.5 h-3.5" />
                        <span>Fork</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: 'JUST SHIPPED' LIVE DEPLOYMENT FEED
          ========================================================================= */}
      {activeViewMode === 'just_shipped' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-900/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Rocket className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white font-display">
                  Live 'Just Shipped' Feed
                </h2>
                <p className="text-xs text-slate-300">
                  Real-time stream of autonomous miniapps recently deployed to Vercel and Base L2.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
              <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
              <span>LIVE FEED</span>
            </div>
          </div>

          {/* Events Stream List */}
          <div className="space-y-3">
            {shippedEvents.map((evt) => {
              const badgeClass =
                evt.badgeColor === 'green' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                evt.badgeColor === 'purple' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                evt.badgeColor === 'blue' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                'bg-orange-500/20 text-orange-400 border-orange-500/30';

              const liveUrl = `https://${evt.appSlug}.vini.run`;

              return (
                <div
                  key={evt.id}
                  className="glass-card p-4 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shrink-0">
                      {evt.type === 'fees_claimed' ? '💸' : evt.type === 'token_created' ? '🪙' : '🚀'}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-white font-display">
                          {evt.appName}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badgeClass}`}>
                          {evt.badge}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {evt.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1 font-sans">
                        {evt.detail}
                      </p>

                      <div className="mt-1 flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                        <span>URL: <span className="text-cyan-400">{liveUrl}</span></span>
                        {evt.txHash && <span>Tx: <span className="text-slate-500">{evt.txHash}</span></span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                    >
                      <span>Open Live App</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
