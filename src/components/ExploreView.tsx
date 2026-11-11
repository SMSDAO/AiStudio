/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS AI STUDIO — Explore & Gallery Showcase
 * Displays a curated list of successful user-created apps and pre-built templates.
 * Each listing includes:
 * 1. A brief description
 * 2. Key features (dedicated checklist)
 * 3. Link to the live hosted app (Vercel / Base)
 * 4. Link to its GitHub repository
 * 
 * Features category filtering, full-text search, popularity/date sorting,
 * quick spec modal inspection, and 1-click studio launch/remix.
 */

import React, { useState, useEffect, useMemo } from 'react';
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
  Rocket,
  Github,
  Code,
  Info,
  X,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  Laptop
} from 'lucide-react';
import { AppItem, AppTemplate, ShippedEvent } from '../types';
import { 
  miniappDatabaseService, 
  SortOption 
} from '../services/miniappDatabaseService';
import { APP_TEMPLATES } from '../data/templates';
import { FeaturedAppsSection } from './FeaturedAppsSection';
import { FlashGlowCard } from './FlashGlowCard';

interface Props {
  apps?: AppItem[];
  templates?: AppTemplate[];
  onSelectApp: (app: AppItem) => void;
  onRemixApp: (app: AppItem) => void;
  onShareApp: (app: AppItem) => void;
  onOpenFeedback: (app: AppItem) => void;
  onToggleFeatured?: (appId: string) => void;
  onSelectTemplate?: (template: AppTemplate) => void;
  canFeatureApp: boolean;
}

type ViewFilterTab = 'all' | 'apps' | 'templates' | 'just_shipped';

interface UnifiedGalleryItem {
  id: string;
  sourceType: 'user_app' | 'template';
  title: string;
  slug: string;
  icon: string;
  tagline: string;
  description: string;
  keyFeatures: string[];
  liveUrl: string;
  githubUrl: string;
  category: string;
  accentColor: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  rating: number;
  reviewsCount: number;
  activityMetric: string; // e.g., "12.4k users" or "618 uses"
  createdAt?: string;
  tags: string[];
  rawApp?: AppItem;
  rawTemplate?: AppTemplate;
}

export function ExploreView({ 
  apps: propApps,
  templates: propTemplates,
  onSelectApp, 
  onRemixApp, 
  onShareApp, 
  onOpenFeedback,
  onToggleFeatured,
  onSelectTemplate,
  canFeatureApp
}: Props) {
  const [activeTabMode, setActiveTabMode] = useState<ViewFilterTab>('all');
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [dbApps, setDbApps] = useState<AppItem[]>(propApps || []);
  const [shippedEvents, setShippedEvents] = useState<ShippedEvent[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Inspector modal state
  const [selectedInspectItem, setSelectedInspectItem] = useState<UnifiedGalleryItem | null>(null);

  const availableTemplates: AppTemplate[] = propTemplates && propTemplates.length > 0 
    ? propTemplates 
    : APP_TEMPLATES;

  // Fetch apps & events from database service
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

      setDbApps(appResult.apps);
      // Combine categories from apps + templates
      const templateCats = Array.from(new Set(availableTemplates.map(t => t.category || 'General')));
      const mergedCats = ['All', ...Array.from(new Set([...appResult.categories.filter(c => c !== 'All'), ...templateCats]))];
      setCategories(mergedCats);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Convert apps and templates into a unified gallery representation
  const unifiedItems: UnifiedGalleryItem[] = useMemo(() => {
    const items: UnifiedGalleryItem[] = [];

    // Map user-created apps
    if (activeTabMode === 'all' || activeTabMode === 'apps') {
      dbApps.forEach((app) => {
        const keyFeatures = app.keyFeatures && app.keyFeatures.length > 0
          ? app.keyFeatures
          : [
              '60fps responsive mobile-first casino cabinet architecture',
              'Farcaster Frames v2 interactive canvas engine',
              'Base L2 smart contract automated fee routing'
            ];

        items.push({
          id: app.id,
          sourceType: 'user_app',
          title: app.name,
          slug: app.slug,
          icon: app.type === 'arcade' ? '🕹️' : app.type === 'tipping' ? '💸' : app.type === 'meme' ? '🎨' : app.type === 'casino' ? '🎲' : '🔮',
          tagline: app.tagline || app.description.slice(0, 70),
          description: app.description,
          keyFeatures,
          liveUrl: app.vercelDeployUrl || `https://${app.slug}.vini.run`,
          githubUrl: app.githubRepoUrl || `https://github.com/viniapp-builds/${app.slug}`,
          category: app.category || 'General',
          accentColor: app.accentColor || '#A855F7',
          authorName: app.author?.name || 'Vini Creator',
          authorHandle: app.author?.handle || '@creator',
          authorAvatar: app.author?.avatarUrl,
          rating: app.metrics?.rating || 5.0,
          reviewsCount: app.metrics?.feedbackCount || 0,
          activityMetric: `${(app.metrics?.uniqueUsers || 1).toLocaleString()} users`,
          createdAt: app.createdAt,
          tags: [app.type, 'Base L2', 'Farcaster', 'Vercel'],
          rawApp: app,
        });
      });
    }

    // Map pre-built templates
    if (activeTabMode === 'all' || activeTabMode === 'templates') {
      availableTemplates.forEach((tmpl) => {
        const keyFeatures = tmpl.keyFeatures && tmpl.keyFeatures.length > 0
          ? tmpl.keyFeatures
          : tmpl.suggestedFeatures && tmpl.suggestedFeatures.length > 0
          ? tmpl.suggestedFeatures
          : [
              'Next.js 15 App Router architecture with React 19',
              'Tailwind CSS & Framer Motion GPU accelerated UI',
              'Base L2 smart contract boilerplate ready to deploy'
            ];

        // Apply category filter to templates
        if (selectedCat !== 'All' && tmpl.category !== selectedCat) {
          return;
        }

        // Apply search filter to templates
        if (search.trim()) {
          const q = search.toLowerCase();
          const match = 
            tmpl.title.toLowerCase().includes(q) ||
            tmpl.description.toLowerCase().includes(q) ||
            tmpl.tagline.toLowerCase().includes(q) ||
            keyFeatures.some(f => f.toLowerCase().includes(q));
          if (!match) return;
        }

        items.push({
          id: tmpl.id,
          sourceType: 'template',
          title: tmpl.title,
          slug: tmpl.slug,
          icon: tmpl.icon,
          tagline: tmpl.tagline,
          description: tmpl.description,
          keyFeatures,
          liveUrl: tmpl.liveDemoUrl || `https://${tmpl.slug}.vini.run`,
          githubUrl: tmpl.githubRepoUrl || `https://github.com/viniapp-builds/${tmpl.slug}-template`,
          category: tmpl.category || 'Templates',
          accentColor: tmpl.previewColor || '#3B82F6',
          authorName: tmpl.author?.name || 'AI Studio Core',
          authorHandle: tmpl.author?.handle || '@aistudio',
          rating: 4.9,
          reviewsCount: Math.floor((tmpl.instantiations || 250) / 4),
          activityMetric: `${(tmpl.instantiations || 300).toLocaleString()} uses`,
          tags: tmpl.tags || ['template', 'nextjs15', 'starter'],
          rawTemplate: tmpl,
        });
      });
    }

    // Sorting
    if (sortBy === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'date_desc') {
      items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }

    return items;
  }, [activeTabMode, dbApps, availableTemplates, selectedCat, search, sortBy]);

  const handleLaunchItem = (item: UnifiedGalleryItem) => {
    if (item.sourceType === 'user_app' && item.rawApp) {
      onSelectApp(item.rawApp);
    } else if (item.sourceType === 'template' && item.rawTemplate) {
      if (onSelectTemplate) {
        onSelectTemplate(item.rawTemplate);
      } else {
        // Fallback conversion to app
        const synthApp: AppItem = {
          id: `app_${Date.now()}`,
          name: item.rawTemplate.title,
          slug: item.rawTemplate.slug,
          tagline: item.rawTemplate.tagline,
          description: item.rawTemplate.description,
          type: item.rawTemplate.type,
          category: item.rawTemplate.category || 'Utilities',
          featured: false,
          author: {
            name: item.authorName,
            handle: item.authorHandle,
            avatarUrl: item.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
            verifiedX: true,
            address: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
          },
          createdAt: new Date().toISOString(),
          status: 'live',
          accentColor: item.accentColor,
          neonBorderColor: 'cyan',
          wallet: {
            address: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
            ethBalance: 0.05,
            tokenBalance: 1000000,
            usdcBalance: 250,
            unclaimedFeesEth: 0,
            totalFeesClaimedEth: 0,
            privateKeyMasked: '0x••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••',
          },
          metrics: {
            opens: 10,
            uniqueUsers: 10,
            totalTransactions: 0,
            rating: item.rating,
            feedbackCount: item.reviewsCount,
          },
          platforms: {
            web: true,
            farcaster: true,
            telegram: true,
            world: true,
            celo: true,
            base: true,
          },
          farcasterManifest: {
            name: item.rawTemplate.title,
            iconUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&h=200&q=80',
            homeUrl: item.liveUrl,
            imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&h=630&q=80',
            buttonTitle: 'Open Miniapp ⚡',
            splashImageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&h=800&q=80',
            splashBackgroundColor: '#070913',
            webhookUrl: `${item.liveUrl}/api/webhook`,
          },
          githubRepoUrl: item.githubUrl,
          vercelDeployUrl: item.liveUrl,
          keyFeatures: item.keyFeatures,
          files: item.rawTemplate.codePreset,
          buildSteps: [],
        };
        onSelectApp(synthApp);
      }
    }
  };

  const handleRemixItem = (item: UnifiedGalleryItem) => {
    if (item.sourceType === 'user_app' && item.rawApp) {
      onRemixApp(item.rawApp);
    } else if (item.sourceType === 'template' && item.rawTemplate) {
      if (onSelectTemplate) {
        onSelectTemplate(item.rawTemplate);
      } else {
        handleLaunchItem(item);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-2 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>CURATED GALLERY & TEMPLATES • BASE L2 & FARCASTER ECOSYSTEM</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight">
            Explore & Gallery Showcase
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Discover verified user-created miniapps and high-performance pre-built templates. Every showcase listing features full descriptions, key standout features, verified GitHub source repositories, and live deployment links.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="p-1 bg-white/[0.04] border border-white/10 rounded-2xl flex flex-wrap items-center gap-1">
            <button
              onClick={() => setActiveTabMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                activeTabMode === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Showcase</span>
            </button>

            <button
              onClick={() => setActiveTabMode('apps')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                activeTabMode === 'apps'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Rocket className="w-3.5 h-3.5 text-cyan-400" />
              <span>User Apps ({dbApps.length})</span>
            </button>

            <button
              onClick={() => setActiveTabMode('templates')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                activeTabMode === 'templates'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Templates ({availableTemplates.length})</span>
            </button>

            <button
              onClick={() => setActiveTabMode('just_shipped')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                activeTabMode === 'just_shipped'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Just Shipped</span>
            </button>
          </div>

          <button
            onClick={loadDatabaseApps}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-all"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Featured Apps Spotlight (In All or Apps mode) */}
      {(activeTabMode === 'all' || activeTabMode === 'apps') && dbApps.length > 0 && (
        <FeaturedAppsSection 
          apps={dbApps} 
          onSelectApp={onSelectApp} 
          onToggleFeatured={handleToggleFeaturedLocal}
          canFeatureApp={canFeatureApp}
        />
      )}

      {/* =========================================================================
          GALLERY / SHOWCASE LISTINGS (All, Apps, Templates)
          ========================================================================= */}
      {activeTabMode !== 'just_shipped' && (
        <div className="space-y-6">
          {/* Search, Sort & Filter Control Bar */}
          <div className="glass-card p-4 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, description, or key features..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
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

            {/* Sort & Count Indicators */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-700 rounded-2xl px-3 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[11px] font-mono text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="popularity" className="bg-slate-900 text-white">🔥 Most Popular</option>
                  <option value="rating" className="bg-slate-900 text-white">⭐ Highest Rated</option>
                  <option value="date_desc" className="bg-slate-900 text-white">⚡ Newest Releases</option>
                </select>
              </div>

              {/* Verified Count (Zero-Pill Discipline: Text representation) */}
              <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Showing {unifiedItems.length} curated listings</span>
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

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="glass-card p-6 rounded-3xl border border-white/5 animate-pulse space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/5" />
                    <div className="w-24 h-5 rounded-full bg-white/5" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-3/4 h-5 rounded-lg bg-white/5" />
                    <div className="w-full h-3 rounded bg-white/5" />
                    <div className="w-2/3 h-3 rounded bg-white/5" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 h-24" />
                  <div className="w-full h-10 rounded-xl bg-white/5" />
                </div>
              ))}
            </div>
          ) : unifiedItems.length === 0 ? (
            /* Empty State */
            <FlashGlowCard variant="yellow" className="p-10 text-center rounded-3xl space-y-4">
              <Compass className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-xl font-bold text-white font-display">No gallery listings match your criteria</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Try searching for different keywords, selecting the "All" category, or switching between User Apps and Pre-Built Templates.
              </p>
              <button
                onClick={() => {
                  setSelectedCat('All');
                  setSearch('');
                  setActiveTabMode('all');
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold hover:bg-amber-500/30 transition-all"
              >
                Reset All Filters
              </button>
            </FlashGlowCard>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unifiedItems.map((item) => {
                const isTemplate = item.sourceType === 'template';
                const glowVariant = isTemplate ? 'green' : 'orange';

                return (
                  <div
                    key={`${item.sourceType}_${item.id}`}
                    className="glass-card p-6 border border-white/10 hover:border-cyan-500/50 rounded-3xl flex flex-col justify-between space-y-5 group transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] relative overflow-hidden"
                  >
                    {/* Top ambient colored line */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1 opacity-70" 
                      style={{ backgroundColor: item.accentColor }} 
                    />

                    {/* Card Content Area */}
                    <div className="space-y-4">
                      {/* Header Row: Icon, Type Badge & Rating */}
                      <div className="flex items-center justify-between">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/20 transition-transform group-hover:scale-105"
                          style={{ 
                            backgroundColor: `${item.accentColor}25`, 
                            borderColor: item.accentColor 
                          }}
                        >
                          {item.icon}
                        </div>

                        {/* Metadata Tagging (Zero-Pill Discipline: Text metadata with separator) */}
                        <div className="flex items-center space-x-2 text-[11px] font-mono">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${
                            isTemplate ? 'text-emerald-400' : 'text-purple-300'
                          }`}>
                            {isTemplate ? 'Template' : 'User App'}
                          </span>
                          <span className="text-slate-600">·</span>
                          <div className="flex items-center space-x-1 text-yellow-400 font-bold">
                            <Star className="w-3 h-3 fill-yellow-400" />
                            <span>{item.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Title & Category Line */}
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-lg font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {item.category} · {item.activityMetric}
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed font-sans">
                          {item.description}
                        </p>
                      </div>

                      {/* =========================================================
                          KEY FEATURES CHECKLIST (Mandatory Highlight)
                          ========================================================= */}
                      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          <span className="flex items-center space-x-1.5">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span>Key Standout Features</span>
                          </span>
                          <span className="text-[9px] text-cyan-400 font-normal">Verified</span>
                        </div>
                        <div className="space-y-1.5">
                          {item.keyFeatures.slice(0, 3).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start space-x-2 text-xs text-slate-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-1 text-[11px] leading-tight font-sans">
                                {feat}
                              </span>
                            </div>
                          ))}
                          {item.keyFeatures.length > 3 && (
                            <div className="text-[10px] font-mono text-cyan-400 pl-5 pt-0.5">
                              +{item.keyFeatures.length - 3} more features
                            </div>
                          )}
                        </div>
                      </div>

                      {/* =========================================================
                          LIVE DEPLOYMENT & GITHUB LINKS BAR
                          ========================================================= */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {/* Live App Link Button */}
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white flex items-center justify-center space-x-1.5 text-[11px] font-mono font-semibold transition-all group/link"
                          title={`Launch live deployment: ${item.liveUrl}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover/link:scale-110 transition-transform" />
                          <span className="truncate">Live App</span>
                        </a>

                        {/* GitHub Repository Link Button */}
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white flex items-center justify-center space-x-1.5 text-[11px] font-mono font-semibold transition-all group/git"
                          title={`View GitHub source code: ${item.githubUrl}`}
                        >
                          <Github className="w-3.5 h-3.5 text-slate-400 group-hover/git:text-white transition-colors" />
                          <span className="truncate">GitHub Repo</span>
                        </a>
                      </div>

                      {/* Author Line */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <div className="flex items-center space-x-1.5 truncate">
                          {item.authorAvatar ? (
                            <img
                              src={item.authorAvatar}
                              alt={item.authorName}
                              className="w-4 h-4 rounded-full border border-white/10"
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[9px] text-slate-300">
                              ⚡
                            </div>
                          )}
                          <span className="font-mono truncate">{item.authorHandle}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          {isTemplate ? 'Template Preset' : 'Public App'}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions: Primary Launch, Fork, Inspect */}
                    <div className="flex items-center space-x-2 pt-3 border-t border-white/10">
                      <button
                        onClick={() => handleLaunchItem(item)}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 active:scale-95 transition-all text-white ${
                          isTemplate
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                            : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                        }`}
                      >
                        {isTemplate ? (
                          <>
                            <Rocket className="w-3.5 h-3.5 fill-white" />
                            <span>USE TEMPLATE</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>PLAY LIVE</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleRemixItem(item)}
                        className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all"
                        title="Fork and Remix in Studio"
                      >
                        <GitFork className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedInspectItem(item)}
                        className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-all"
                        title="Inspect Full Specs & Architecture"
                      >
                        <Info className="w-3.5 h-3.5" />
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
      {activeTabMode === 'just_shipped' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-900/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Rocket className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white font-display">
                  Live 'Just Shipped' Deployment Feed
                </h2>
                <p className="text-xs text-slate-300">
                  Real-time pulse of miniapps and agent templates deployed to Base L2, Vercel, and GitHub.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" />
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
              const gitUrl = `https://github.com/viniapp-builds/${evt.appSlug}`;

              return (
                <div
                  key={evt.id}
                  className="glass-card p-5 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center space-x-4">
                    <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shrink-0">
                      {evt.type === 'fees_claimed' ? '💸' : evt.type === 'token_created' ? '🪙' : '🚀'}
                    </div>

                    <div className="space-y-1">
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

                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {evt.detail}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-0.5">
                        <span className="flex items-center space-x-1">
                          <span>Live:</span>
                          <a href={liveUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                            {liveUrl}
                          </a>
                        </span>
                        {evt.txHash && (
                          <span>Tx: <span className="text-slate-500">{evt.txHash}</span></span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                    <a
                      href={gitUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
                      title="View GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>

                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                    >
                      <span>Open Live</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          DETAILED SPECIFICATION & ARCHITECTURE INSPECTOR MODAL
          ========================================================================= */}
      {selectedInspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 p-6 sm:p-8 space-y-6 relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedInspectItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start space-x-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl border border-white/20 shrink-0"
                style={{ 
                  backgroundColor: `${selectedInspectItem.accentColor}33`, 
                  borderColor: selectedInspectItem.accentColor 
                }}
              >
                {selectedInspectItem.icon}
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    selectedInspectItem.sourceType === 'template'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  }`}>
                    {selectedInspectItem.sourceType === 'template' ? 'Verified Starter Template' : 'User-Created Production App'}
                  </span>
                  <span className="text-xs text-yellow-400 font-bold flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    <span>{selectedInspectItem.rating}</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                  {selectedInspectItem.title}
                </h2>
                <p className="text-xs font-mono text-cyan-400">
                  {selectedInspectItem.tagline}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Overview & Architecture
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {selectedInspectItem.description}
              </p>
            </div>

            {/* Key Features List */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Key Features</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedInspectItem.keyFeatures.map((feat, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-200 font-sans leading-snug">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* External Links Section: Live URL & GitHub Repo */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Links & Repository Endpoints</span>
              </h4>

              <div className="space-y-2">
                {/* Live URL */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5 truncate">
                    <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="truncate">
                      <div className="text-[10px] font-mono text-slate-400">Live Hosted URL</div>
                      <a 
                        href={selectedInspectItem.liveUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-mono text-cyan-300 hover:underline truncate block"
                      >
                        {selectedInspectItem.liveUrl}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => copyToClipboard(selectedInspectItem.liveUrl)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1"
                      title="Copy URL"
                    >
                      {copiedUrl === selectedInspectItem.liveUrl ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={selectedInspectItem.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center space-x-1"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* GitHub Repository */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5 truncate">
                    <Github className="w-4 h-4 text-purple-400 shrink-0" />
                    <div className="truncate">
                      <div className="text-[10px] font-mono text-slate-400">GitHub Repository Source</div>
                      <a 
                        href={selectedInspectItem.githubUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-mono text-purple-300 hover:underline truncate block"
                      >
                        {selectedInspectItem.githubUrl}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => copyToClipboard(selectedInspectItem.githubUrl)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1"
                      title="Copy GitHub URL"
                    >
                      {copiedUrl === selectedInspectItem.githubUrl ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={selectedInspectItem.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center space-x-1"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack & Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-[11px] font-mono text-slate-500 mr-2">Tags:</span>
              {selectedInspectItem.tags.map((t, idx) => (
                <span key={idx} className="text-[11px] font-mono text-slate-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md">
                  #{t}
                </span>
              ))}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedInspectItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const itm = selectedInspectItem;
                  setSelectedInspectItem(null);
                  handleLaunchItem(itm);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center space-x-1.5 active:scale-95 transition-all"
              >
                <Rocket className="w-4 h-4 fill-white" />
                <span>{selectedInspectItem.sourceType === 'template' ? 'Instantiate Template' : 'Launch & Fork in Studio'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
