import React, { useState } from 'react';
import { 
  Menu, 
  Sparkles, 
  Wallet, 
  Coins, 
  User, 
  ChevronDown, 
  Home, 
  LayoutDashboard, 
  Code2, 
  FolderKanban, 
  Award, 
  Settings, 
  ShieldAlert,
  ArrowRight,
  Layers,
  Compass,
  Loader2,
  Zap
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { EnterpriseTab } from './SliderMenu';
import { realtimeBuildService, RealtimeBuildState } from '../services/realtimeBuildService';

interface Props {
  activeTab: EnterpriseTab;
  setActiveTab: (tab: EnterpriseTab) => void;
  onOpenSliderMenu: () => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onOpenCreditsModal: () => void;
  onOpenWalletModal: () => void;
  onOpenProfileModal: () => void;
  onOpenOnboardingTour: () => void;
  myAppsCount: number;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenSliderMenu,
  user,
  setUser,
  onOpenCreditsModal,
  onOpenWalletModal,
  onOpenProfileModal,
  onOpenOnboardingTour,
  myAppsCount,
}: Props) {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [buildState, setBuildState] = useState<RealtimeBuildState>(realtimeBuildService.getState());

  React.useEffect(() => {
    const unsub = realtimeBuildService.subscribe((s) => setBuildState(s));
    return () => unsub();
  }, []);

  const roles: { role: UserRole; label: string; badge: string }[] = [
    { role: 'PLATFORM_SUPER_ADMIN', label: 'Platform Super Admin', badge: 'SUPER' },
    { role: 'ORG_OWNER', label: 'Organization Owner', badge: 'OWNER' },
    { role: 'ORG_ADMIN', label: 'Organization Admin', badge: 'ADMIN' },
    { role: 'APP_OWNER', label: 'App Owner (Creator)', badge: 'CREATOR' },
    { role: 'BUILDER', label: 'Builder / Developer', badge: 'DEV' },
    { role: 'VIEWER', label: 'Read-only Viewer', badge: 'VIEW' },
  ];

  const handleSelectRole = (r: UserRole) => {
    setUser((prev) => ({ ...prev, role: r }));
    setRoleDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-[20px] bg-[#05070B]/90 border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* Top 6-Color Cyber Neon Pulse Glow Line (Purple, Orange, Red, Green, Yellow, Cyan) */}
      <div className="w-full h-[2px] bg-gradient-to-r from-[#A855F7] via-[#F97316] via-[#EF4444] via-[#22C55E] via-[#EAB308] to-[#06B6D4] shadow-[0_0_12px_rgba(168,85,247,0.6)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Hamburger Slider + AI STUDIO Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenSliderMenu}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 hover:text-white transition-all shadow-[0_0_15px_rgba(160,32,240,0.25)]"
            title="Open Slider Menu"
            aria-label="Open Slider Menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#A020F0] via-[#FF2A55] to-[#3A8DFF] p-[1px] shadow-[0_0_15px_rgba(160,32,240,0.5)]">
              <div className="w-full h-full bg-[#070913] rounded-[7px] flex items-center justify-center font-display font-black text-xs text-white">
                AI
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-bold text-base tracking-wider text-white">
                AI STUDIO
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 hidden sm:inline-block">
                v2.0.0
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Shortcuts */}
        <div className="hidden md:flex items-center space-x-1 p-1 bg-white/[0.03] border border-white/10 rounded-xl">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'landing'
                ? 'bg-white/10 text-white border border-white/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-purple-400" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'workspace'
                ? 'bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 text-white border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#00FF9D]" />
            <span>Workspace</span>
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'explore'
                ? 'bg-gradient-to-r from-cyan-900/40 to-blue-900/40 text-white border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Explore</span>
          </button>

          <button
            onClick={() => setActiveTab('factory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'factory'
                ? 'bg-gradient-to-r from-orange-900/40 to-amber-900/40 text-white border border-orange-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5 text-orange-400" />
            <span>Factory</span>
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'agents'
                ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Agents</span>
          </button>

          <button
            onClick={() => setActiveTab('workflows')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'workflows'
                ? 'bg-amber-900/40 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Workflows</span>
          </button>

          <button
            onClick={() => setActiveTab('web3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'web3'
                ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span>Web3</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'admin'
                ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin</span>
          </button>
        </div>

        {/* Right: Realtime Build Pill, Credits, RBAC Role, Wallet */}
        <div className="flex items-center space-x-2">
          {/* Active AI Build Realtime Status Pill with Clear Loading State */}
          {buildState.isBuilding ? (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-400 text-xs font-mono text-cyan-300 flex items-center space-x-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-pulse"
              title="Click to view Live AI Build Dashboard"
            >
              <Loader2 className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
              <span className="font-bold hidden sm:inline">BUILD:</span>
              <span className="text-white font-semibold truncate max-w-[120px]">{buildState.stageLabel}</span>
              <span className="text-cyan-400 font-bold">({buildState.progress}%)</span>
            </button>
          ) : buildState.stage === 'live' ? (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 hidden lg:flex items-center space-x-1"
              title="View Deployed Build"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>LIVE AT EDGE</span>
            </button>
          ) : null}

          {/* Credits Counter */}
          <button
            onClick={onOpenCreditsModal}
            className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 hover:border-purple-500/40 text-xs font-mono text-slate-200 flex items-center space-x-1.5 transition-all"
            title="AI Compute Credits"
          >
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-bold text-[#00FF9D]">{user.creditBalance}</span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">CR</span>
          </button>

          {/* Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 hover:border-white/20 text-xs font-mono text-slate-300 flex items-center space-x-1 transition-all"
            >
              <span className="text-[10px] font-bold text-purple-300">
                {user.role === 'PLATFORM_SUPER_ADMIN' ? 'SUPER' : user.role === 'APP_OWNER' ? 'CREATOR' : user.role}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0a0e1c] border border-white/15 rounded-xl shadow-2xl z-50 p-1.5 font-mono text-xs animate-in fade-in duration-150">
                <div className="px-2.5 py-1 text-[10px] uppercase text-slate-400 font-semibold border-b border-white/10 mb-1">
                  Active Security Role
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => handleSelectRole(r.role)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                      user.role === r.role
                        ? 'bg-purple-600/30 text-white border border-purple-500/40'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{r.label}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-white/10">
                      {r.badge}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Button */}
          <button
            onClick={onOpenProfileModal}
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#A020F0] to-[#3A8DFF] flex items-center justify-center text-white font-mono text-xs font-bold shadow-[0_0_10px_rgba(160,32,240,0.4)]"
            title="User Profile & Settings"
          >
            {user.username.slice(0, 2).toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
}
