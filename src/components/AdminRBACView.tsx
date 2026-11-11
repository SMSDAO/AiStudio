import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  Coins, 
  Key, 
  Check, 
  X, 
  ToggleLeft, 
  ToggleRight, 
  History, 
  Sliders, 
  Cpu, 
  Lock,
  Zap,
  DollarSign,
  Star,
  LayoutTemplate,
  MessageSquare
} from 'lucide-react';
import { GRANULAR_PERMISSIONS_CONFIG } from '../hooks/usePermission';
import { AppFeedback, AppTemplate, UserRole, UserSession } from '../types';
import { INITIAL_FEEDBACKS } from '../data/mockData';
import { APP_TEMPLATES } from '../data/templates';

interface Props {
  user: UserSession;
  onUpdateRole: (role: UserRole) => void;
  templates?: AppTemplate[];
  onOpenTemplateManager?: () => void;
}

const AUDIT_LOGS = [
  { id: 'log_1', time: '10 mins ago', actor: '@alex_builds', action: 'DEPLOY_VERCEL_EDGE', target: 'neondash-2088', status: 'SUCCESS', hash: '0x94fe...82b1' },
  { id: 'log_2', time: '24 mins ago', actor: '@elena_eth', action: 'CLAIM_CREATOR_FEES', target: 'tipcaster-pro (0.62 ETH)', status: 'SUCCESS', hash: '0x32ba...11cd' },
  { id: 'log_3', time: '1 hour ago', actor: '@kai_crypto', action: 'LAUNCH_CLANKER_TOKEN', target: '$FORGE (10M Supply)', status: 'SUCCESS', hash: '0x77aa...ff21' },
  { id: 'log_4', time: '2 hours ago', actor: 'SYSTEM_BOT', action: 'PURCHASE_CREDITS', target: '100 Credits (+0.05 ETH)', status: 'SUCCESS', hash: '0x5544...291a' },
  { id: 'log_5', time: '4 hours ago', actor: '@marcus_v', action: 'UPDATE_TEAM_ROLE', target: 'Builder -> Org Admin', status: 'SUCCESS', hash: '0x8899...00dd' },
];

export function AdminRBACView({ user, onUpdateRole, templates, onOpenTemplateManager }: Props) {
  const [activeTab, setActiveTab] = useState<'matrix' | 'economy' | 'audit' | 'feedback' | 'templates' | 'flags'>('matrix');
  const [feedbacks, setFeedbacks] = useState<AppFeedback[]>(INITIAL_FEEDBACKS);
  const [flags, setFlags] = useState({
    clankerPools: true,
    vercelEdgeDeploy: true,
    zeroGasPrivy: true,
    twitterFreeBuild: true,
    e2bSandboxIsolation: true,
    farcasterHubsSync: true,
  });

  const roles: { id: UserRole; name: string; color: string }[] = [
    { id: 'PLATFORM_SUPER_ADMIN', name: 'Super Admin', color: 'text-purple-400' },
    { id: 'ORG_OWNER', name: 'Org Owner', color: 'text-cyan-400' },
    { id: 'ORG_ADMIN', name: 'Org Admin', color: 'text-blue-400' },
    { id: 'APP_OWNER', name: 'App Owner', color: 'text-green-400' },
    { id: 'BUILDER', name: 'Builder', color: 'text-orange-400' },
    { id: 'VIEWER', name: 'Viewer', color: 'text-slate-400' },
  ];

  const toggleFlag = (key: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>VINIAPP 2.0 ADVANCED RBAC & GOVERNANCE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-white">
            Enterprise RBAC & Admin Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Granular permission matrix, credit economy metrics, community feedback reviews, and security audit logs.
          </p>
        </div>

        {/* Current Active Role Switcher */}
        <div className="p-3 rounded-2xl glass-card border border-white/10 flex items-center space-x-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-mono">Active Role</div>
            <div className="text-xs font-bold font-mono text-cyan-300">{user.role}</div>
          </div>
          <select
            value={user.role}
            onChange={(e) => onUpdateRole(e.target.value as UserRole)}
            className="bg-slate-900 border border-purple-500/40 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
          >
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'matrix', label: 'Granular Permissions', icon: Key },
          { id: 'economy', label: 'Credit Economy', icon: Coins },
          { id: 'feedback', label: 'User Feedback', icon: Star },
          { id: 'templates', label: 'Template Blueprints', icon: LayoutTemplate },
          { id: 'audit', label: 'Security Audit Logs', icon: History },
          { id: 'flags', label: 'Feature Flags', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'text-slate-400 hover:text-white bg-slate-900/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Granular Permissions Matrix */}
      {activeTab === 'matrix' && (
        <div className="glass-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4 min-w-[240px]">Permission</th>
                  <th className="py-3 px-4">Category</th>
                  {roles.map(r => (
                    <th key={r.id} className="py-3 px-3 text-center">
                      <span className={r.color}>{r.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono">
                {GRANULAR_PERMISSIONS_CONFIG.map((perm) => (
                  <tr key={perm.permission} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-sans">
                      <div className="font-bold text-white text-xs">{perm.name}</div>
                      <div className="text-[11px] text-slate-400">{perm.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-900 border border-slate-700 text-slate-300 uppercase">
                        {perm.category}
                      </span>
                    </td>
                    {roles.map(r => {
                      const isAllowed = perm.allowedRoles.includes(r.id);
                      return (
                        <td key={r.id} className="py-3 px-3 text-center">
                          {isAllowed ? (
                            <div className="w-5 h-5 mx-auto rounded-full bg-green-500/20 text-green-400 border border-green-500/40 flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 mx-auto rounded-full bg-red-500/10 text-red-500/60 border border-red-500/20 flex items-center justify-center">
                              <X className="w-3 h-3" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Credit Economy */}
      {activeTab === 'economy' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="glass-card p-4 border border-purple-500/30 rounded-2xl">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Total Credits Minted</div>
              <div className="text-2xl font-black font-display text-white mt-1">45,800 CR</div>
              <div className="text-[10px] text-purple-300">Stripe & Coinbase Onramp</div>
            </div>
            <div className="glass-card p-4 border border-cyan-500/30 rounded-2xl">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Burn Rate (24h)</div>
              <div className="text-2xl font-black font-display text-cyan-400 mt-1">1,420 CR</div>
              <div className="text-[10px] text-slate-400">10 CR per Full Agent Build</div>
            </div>
            <div className="glass-card p-4 border border-green-500/30 rounded-2xl">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Gross Treasury Revenue</div>
              <div className="text-2xl font-black font-display text-green-400 mt-1">$22,900 USD</div>
              <div className="text-[10px] text-green-300">Pay-per-use Model</div>
            </div>
            <div className="glass-card p-4 border border-orange-500/30 rounded-2xl">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Avg Build Latency</div>
              <div className="text-2xl font-black font-display text-orange-400 mt-1">5.8s</div>
              <div className="text-[10px] text-slate-400">Next.js 15 SSR bundle</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: User Feedback Reviews */}
      {activeTab === 'feedback' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>COMMUNITY BUILD RATINGS ({feedbacks.length} REVIEWS)</span>
            <span className="text-yellow-400">Average: 4.9 ★</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="p-4 rounded-2xl glass-card border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src={fb.userAvatar} alt={fb.userName} className="w-5 h-5 rounded-full" />
                    <span className="text-xs font-bold text-white">{fb.userName}</span>
                    <span className="text-[10px] text-purple-300 font-mono">on {fb.appName}</span>
                  </div>
                  <div className="flex items-center text-yellow-400 text-xs">
                    {'★'.repeat(fb.rating)}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  "{fb.comment}"
                </p>

                <div className="text-[10px] text-slate-500 font-mono">{fb.createdAt}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Templates Blueprint Explorer */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-white text-sm">AppTemplateManager Suite</h3>
              <p className="text-xs text-purple-200 mt-0.5">
                Full administrative capability to upload, edit, categorize, and deploy templates with agentic plain-English translation.
              </p>
            </div>
            {onOpenTemplateManager && (
              <button
                onClick={onOpenTemplateManager}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 shadow-lg shadow-purple-500/30 transition-transform active:scale-95 flex items-center space-x-1.5"
              >
                <span>Launch AppTemplateManager</span>
                <span className="text-sm">➔</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(templates || APP_TEMPLATES).map((tmpl) => (
              <div key={tmpl.id} className="p-4 rounded-2xl glass-card border border-white/10 space-y-2.5">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl">{tmpl.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold font-display text-white">{tmpl.title}</h4>
                    <span className="text-[10px] text-cyan-400 font-mono">{tmpl.category || tmpl.type}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">{tmpl.plainEnglishSummary || tmpl.tagline}</p>
                <div className="text-[10px] font-mono text-purple-300 bg-purple-950/40 p-2 rounded-xl border border-purple-500/20">
                  Revenue: {tmpl.monetizationModel}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Security Audit Logs */}
      {activeTab === 'audit' && (
        <div className="glass-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
            <div className="text-xs font-mono font-bold text-slate-200">IMMUTABLE ONCHAIN AUDIT TRAIL</div>
            <span className="text-[10px] font-mono text-green-400">Base L2 Verified</span>
          </div>
          <div className="divide-y divide-white/5 text-xs font-mono">
            {AUDIT_LOGS.map(log => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02]">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <div>
                    <span className="text-purple-300 font-bold">{log.actor}</span>
                    <span className="text-slate-400 mx-2">executed</span>
                    <span className="text-cyan-300 font-bold">{log.action}</span>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">{log.target}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="text-slate-500">{log.time}</span>
                  <span className="text-cyan-400/80 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {log.hash}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Feature Flags */}
      {activeTab === 'flags' && (
        <div className="glass-card p-6 border border-white/10 rounded-3xl space-y-4">
          <h3 className="text-base font-bold font-display text-white mb-2">Platform Capability Flags</h3>
          <div className="space-y-3">
            {[
              { key: 'clankerPools', title: 'Clanker Uniswap v4 Bonding Curves', desc: 'Deploy automatic token liquidity pools on Base with 60% creator fee distribution.' },
              { key: 'vercelEdgeDeploy', title: 'Automated Vercel Edge Deployment', desc: 'Auto-publish generated Next.js 15 miniapps to *.vini.run domains.' },
              { key: 'zeroGasPrivy', title: 'Gasless Base Smart Wallets', desc: 'Sponsor user gas fees using Base paymasters for seamless onchain UX.' },
              { key: 'twitterFreeBuild', title: 'X (Twitter) Free Build Verification', desc: 'Allow 1 free app generation upon connecting verified X handle.' },
              { key: 'e2bSandboxIsolation', title: 'Sandboxed Code Runner Isolation', desc: 'Execute generated client and contract code in isolated virtual containers.' },
              { key: 'farcasterHubsSync', title: 'Farcaster Hubs Direct Sync', desc: 'Broadcast live miniapp casts and Frames v2 manifests across Nemes hub nodes.' },
            ].map(f => (
              <div key={f.key} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">{f.title}</div>
                  <div className="text-[11px] text-slate-400">{f.desc}</div>
                </div>
                <button
                  onClick={() => toggleFlag(f.key as any)}
                  className={`p-1.5 rounded-xl border transition-all ${
                    (flags as any)[f.key]
                      ? 'bg-purple-600/30 border-purple-400 text-purple-300'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  {(flags as any)[f.key] ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
