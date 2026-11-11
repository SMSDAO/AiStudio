import React, { useEffect } from 'react';
import { 
  X, 
  Home, 
  LayoutDashboard, 
  Code2, 
  FolderKanban, 
  Award, 
  Settings, 
  User, 
  ChevronRight, 
  Sparkles, 
  Shield, 
  Zap,
  Coins,
  Flame,
  Layers,
  Cpu,
  Compass
} from 'lucide-react';
import { UserProfile } from '../types';

export type EnterpriseTab = 
  | 'landing' 
  | 'workspace'
  | 'explore'
  | 'factory'
  | 'agents'
  | 'workflows'
  | 'web3'
  | 'assets'
  | 'router'
  | 'admin'
  | 'dashboard' 
  | 'projects' 
  | 'templates'
  | 'pricing'
  | 'rewards' 
  | 'settings' 
  | 'profile';

interface SliderMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: EnterpriseTab;
  onSelectTab: (tab: EnterpriseTab) => void;
  user: UserProfile;
}

export const SliderMenu: React.FC<SliderMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  user,
}) => {
  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navItems: { id: EnterpriseTab; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'landing',
      label: 'Home & Prompt',
      icon: <Home className="w-4 h-4 text-purple-400" />,
      desc: 'Clean Prompt Landing & AI Studio',
    },
    {
      id: 'workspace',
      label: 'AI Studio Workspace',
      icon: <Code2 className="w-4 h-4 text-[#00FF9D]" />,
      desc: 'Gemini Workspace: Multiline prompt, AST, Simulator',
    },
    {
      id: 'explore',
      label: 'Explore Miniapps',
      icon: <Compass className="w-4 h-4 text-cyan-400" />,
      desc: 'Curated public miniapps & Just Shipped feed',
    },
    {
      id: 'factory',
      label: 'Universal Factory',
      icon: <Zap className="w-4 h-4 text-orange-400" />,
      desc: '3 Archetypes: Trucking, SaaS & 3D Game',
    },
    {
      id: 'agents',
      label: 'Agent Factory',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      desc: 'Capability Registry, Specialist Creation & Testing',
    },
    {
      id: 'workflows',
      label: 'Workflow Engine',
      icon: <Layers className="w-4 h-4 text-amber-400" />,
      desc: 'DAG Pipeline, Triggers & Human Approvals',
    },
    {
      id: 'web3',
      label: 'Web3 & Swap',
      icon: <Coins className="w-4 h-4 text-yellow-400" />,
      desc: 'Base L2 Uniswap v4 & 60% Creator Royalty',
    },
    {
      id: 'assets',
      label: 'Asset Studio',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      desc: 'Vector SVGs, UI Badges & 14 File Operations',
    },
    {
      id: 'router',
      label: 'Model Mesh Router',
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
      desc: 'Gemini, Claude, OpenAI, DeepSeek & Ollama',
    },
    {
      id: 'admin',
      label: 'Operations Center',
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      desc: 'Parallel Observability, Agent Registry & 17 Gates',
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 text-[#3A8DFF]" />,
      desc: 'Enterprise widgets, logs & metrics',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FolderKanban className="w-4 h-4 text-orange-400" />,
      desc: 'Miniapp catalog & quick actions',
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      desc: 'AppTemplateManager & Agentic Blueprints',
    },
    {
      id: 'pricing',
      label: 'Commercial & SLA',
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      desc: 'Pricing Tiers, 99.99% SLA & Token Estimator',
    },
    {
      id: 'rewards',
      label: 'Rewards',
      icon: <Award className="w-4 h-4 text-yellow-400" />,
      desc: 'XP, badges, streaks & fee claims',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4 text-slate-300" />,
      desc: 'API keys, models & RBAC controls',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4 text-pink-400" />,
      desc: 'Account credentials & wallet',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
      {/* Dark Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-In Drawer: Fullscreen on mobile, 340px on desktop */}
      <div className="relative w-full sm:w-84 max-w-full bg-[#0a0e1e] border-r border-white/[0.1] h-full flex flex-col justify-between z-10 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-black/20">
          <div className="flex items-center space-x-2.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#A020F0] to-[#3A8DFF] shadow-[0_0_10px_#A020F0]" />
            <div>
              <span className="font-display font-bold text-base text-white tracking-wide block">
                AI STUDIO
              </span>
              <span className="text-[10px] font-mono text-slate-400 block">
                Enterprise v2.0.0
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Summary Widget */}
        <div className="p-4 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A020F0] to-[#3A8DFF] flex items-center justify-center font-display font-bold text-white text-sm shadow-[0_0_12px_rgba(160,32,240,0.5)] shrink-0">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-semibold text-white truncate">{user.username}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold uppercase">
                  {user.role}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate">
                {user.address.slice(0, 6)}...{user.address.slice(-4)}
              </p>
            </div>
          </div>

          {/* Quick Metrics in Slider */}
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
            <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block">Credits</span>
              <span className="text-xs font-mono font-bold text-[#00FF9D]">{user.creditBalance}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block">Streak</span>
              <span className="text-xs font-mono font-bold text-orange-400 flex items-center justify-center space-x-0.5">
                <Flame className="w-3 h-3 text-orange-500" />
                <span>14d</span>
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block">Tier</span>
              <span className="text-xs font-mono font-bold text-purple-300">Level 8</span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <span className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
            Navigation
          </span>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/30 border border-purple-500/50 shadow-[0_0_15px_rgba(160,32,240,0.2)] text-white'
                    : 'hover:bg-white/[0.05] text-slate-300 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-purple-600/30' : 'bg-white/5'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-sm font-medium block">{item.label}</span>
                    <span className="text-[11px] text-slate-400 block">{item.desc}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-purple-300' : 'text-slate-500'}`} />
              </button>
            );
          })}
        </div>

        {/* Bottom Drawer Actions */}
        <div className="p-4 border-t border-white/[0.08] bg-black/30 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Base L2 Smart Account</span>
            <span className="text-[#00FF9D] font-bold">CONNECTED</span>
          </div>
          <p className="text-[10px] text-slate-500 font-sans">
            AI STUDIO Engine • Zero latency edge execution with automated 60% creator fee distribution.
          </p>
        </div>
      </div>
    </div>
  );
};
