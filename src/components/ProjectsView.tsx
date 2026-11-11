import React, { useState } from 'react';
import { 
  FolderKanban, 
  Search, 
  Maximize2, 
  Code2, 
  Share2, 
  Coins, 
  Radio, 
  ExternalLink,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  Github
} from 'lucide-react';
import { AppItem, UserProfile } from '../types';
import { MiniWindowItem } from './MiniPopupWindow';
import { FlashGlowCard, NeonVariant } from './FlashGlowCard';

interface ProjectsViewProps {
  apps: AppItem[];
  user: UserProfile;
  onSelectAppForWorkspace: (app: AppItem) => void;
  onOpenMiniWindow: (item: MiniWindowItem) => void;
  onOpenShareModal: (app: AppItem) => void;
  onClaimFees: (appId: string) => void;
  onOpenGitHubSync?: (app: AppItem) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  apps,
  user,
  onSelectAppForWorkspace,
  onOpenMiniWindow,
  onOpenShareModal,
  onClaimFees,
  onOpenGitHubSync,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'DEFI', 'GAMING', 'SOCIAL', 'AI', 'MEME'];

  const filteredApps = apps.filter((app) => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || app.category.toUpperCase() === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              AI STUDIO Miniapp Catalog
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white mt-1">
            Projects & Deployments
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Cards with title, tags, last edited, and quick actions. Tap any listing to inspect in a fast mini pop window.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tags, or contracts..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#A020F0] to-[#3A8DFF] text-white shadow-[0_0_12px_rgba(160,32,240,0.3)]'
                : 'text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* =========================================================================
          PROJECT CARDS GRID
          Card specifications:
          - Title
          - Tags
          - Last edited
          - Quick actions
          Search Listings rule:
          - H1 category
          - H2 item title
          - H3 metadata
          - Tap -> mini pop window
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredApps.map((app) => {
          const getCategoryVariant = (cat: string): NeonVariant => {
            switch (cat.toUpperCase()) {
              case 'DEFI': return 'green';
              case 'GAMING': return 'purple';
              case 'SOCIAL': return 'cyan';
              case 'AI': return 'blue';
              case 'MEME': return 'yellow';
              default: return 'orange';
            }
          };

          const cardVariant = getCategoryVariant(app.category);

          return (
            <FlashGlowCard
              key={app.id}
              variant={cardVariant}
              intensity="medium"
              className="p-5 flex flex-col justify-between space-y-4 group"
            >
              {/* Search Listing Header: H1, H2, H3 */}
              <div 
                className="space-y-1 cursor-pointer"
                onClick={() =>
                  onOpenMiniWindow({
                    type: 'search_result',
                    title: app.name,
                    category: app.category.toUpperCase(),
                    metadata: `Last Edited: 2 hours ago • Rating: ${app.metrics.rating} ★ • Network: Base L2`,
                    content: `Application Overview:\n\n` +
                      `${app.description}\n\n` +
                      `- Category: ${app.category}\n` +
                      `- Base Smart Account: ${app.wallet.address}\n` +
                      `- Unclaimed Creator Cut: ${app.wallet.unclaimedFeesEth} ETH (60%)\n` +
                      `- Farcaster Frame Status: Verified v2 Hubs payload\n` +
                      `- Target Platforms: Web, Telegram, World, Celo, Farcaster`,
                    appId: app.id,
                  })
                }
              >
                {/* H1: Category */}
                <h1 className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center justify-between">
                  <span>{app.category}</span>
                  <span className="text-slate-500 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>2h ago</span>
                  </span>
                </h1>

                {/* H2: Item Title */}
                <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                  <span>{app.name}</span>
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </h2>

                {/* H3: Metadata */}
                <h3 className="text-xs font-mono text-slate-400 line-clamp-2">
                  {app.description}
                </h3>
              </div>

              {/* Tags Block */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                  Base L2
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-950/60 border border-green-500/30 text-green-300">
                  60% Creator Cut
                </span>
                {app.token && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                    ${app.token.symbol}
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                <button
                  onClick={() =>
                    onOpenMiniWindow({
                      type: 'page_preview',
                      title: app.name,
                      category: app.category,
                      metadata: `Contract: ${app.wallet.address}`,
                      content: `Quick Preview: ${app.name}\n\n${app.description}`,
                      appId: app.id,
                    })
                  }
                  className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 flex items-center space-x-1"
                  title="Mini Window Preview"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => onOpenShareModal(app)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  title="Share miniapp"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {onOpenGitHubSync && (
                  <button
                    onClick={() => onOpenGitHubSync(app)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-950/40 border border-transparent hover:border-purple-500/30 transition-all"
                    title={app.githubRepoUrl ? `Synced: ${app.githubRepoUrl}` : 'Sync with GitHub Repo'}
                  >
                    <Github className="w-4 h-4 text-purple-400" />
                  </button>
                )}

                {app.wallet.unclaimedFeesEth > 0 && (
                  <button
                    onClick={() => onClaimFees(app.id)}
                    className="px-2 py-1 rounded-lg text-[11px] font-mono font-bold text-[#00FF9D] bg-green-950/60 border border-green-500/40 hover:bg-green-900/60"
                    title="Claim 60% Fees"
                  >
                    ${(app.wallet.unclaimedFeesEth * 3340).toFixed(0)} Fees
                  </button>
                )}

                <button
                  onClick={() => onSelectAppForWorkspace(app)}
                  className="px-3 py-1.5 rounded-[12px] text-xs font-semibold text-white bg-gradient-to-r from-[#A020F0] to-[#3A8DFF] hover:from-[#b030ff] hover:to-[#4a9dff] flex items-center space-x-1 shadow-[0_0_10px_rgba(160,32,240,0.3)]"
                >
                  <span>Workspace</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </FlashGlowCard>
          );
        })}
      </div>
    </div>
  );
};
