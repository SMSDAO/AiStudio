import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  Server, 
  ShieldAlert, 
  Check, 
  Copy, 
  Globe, 
  Cpu, 
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { FlashGlowCard } from './FlashGlowCard';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateRole: (role: UserRole) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateRole,
}) => {
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [rpcNetwork, setRpcNetwork] = useState('base-mainnet');
  const [webhookUrl, setWebhookUrl] = useState('https://api.yourdomain.com/webhooks/farcaster');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'PLATFORM_SUPER_ADMIN', label: 'Platform Super Admin', desc: 'Full authority, credit minting, protocol parameters.' },
    { role: 'ORG_OWNER', label: 'Organization Owner', desc: 'Team billing, member seats, organizational audit logs.' },
    { role: 'ORG_ADMIN', label: 'Organization Admin', desc: 'Manage builder quotas and project access permissions.' },
    { role: 'APP_OWNER', label: 'App Owner / Creator', desc: 'Claim 60% Uniswap fees, configure custom domains.' },
    { role: 'BUILDER', label: 'Builder / Developer', desc: 'Deploy miniapps, edit code in workspace, run simulations.' },
    { role: 'VIEWER', label: 'Viewer / Read-Only', desc: 'Inspect source code and run miniapps without write access.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              AI STUDIO Configuration
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white mt-1">
            Enterprise Settings & Access Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Manage AI synthesis models, blockchain RPC endpoints, webhook delivery, and simulate active RBAC roles.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-[12px] bg-gradient-to-r from-[#A020F0] to-[#3A8DFF] hover:from-[#b030ff] hover:to-[#4a9dff] text-white text-xs font-semibold shadow-[0_0_12px_rgba(160,32,240,0.4)] flex items-center space-x-1.5 transition-all"
        >
          {saved ? <Check className="w-4 h-4 text-green-300" /> : <Settings className="w-4 h-4" />}
          <span>{saved ? 'Saved Successfully' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Model & Engine Configuration */}
      <FlashGlowCard variant="purple" intensity="medium" className="p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-[#3A8DFF]" />
          <span>Synthesis Engine & AI Model Routing</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', latency: '110ms', desc: 'Ultra-low latency code synthesis & AST generation.' },
            { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', latency: '240ms', desc: 'Deep architectural reasoning & Solidity formal proofs.' },
            { id: 'hybrid-auto', name: 'AI STUDIO Auto-Router', latency: 'Adaptive', desc: 'Dynamically routes between Gemini & Claude for peak efficiency.' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedModel === m.id
                  ? 'border-purple-500/60 bg-purple-950/30 text-white shadow-[0_0_15px_rgba(160,32,240,0.25)]'
                  : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono">{m.name}</span>
                <span className="text-[10px] font-mono text-[#00FF9D]">{m.latency}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{m.desc}</p>
            </button>
          ))}
        </div>
      </FlashGlowCard>

      {/* Network & RPC Setup */}
      <FlashGlowCard variant="green" intensity="medium" className="p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
          <Server className="w-4 h-4 text-[#00FF9D]" />
          <span>Onchain Deployment RPC & Webhooks</span>
        </h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Active Network RPC
            </label>
            <select
              value={rpcNetwork}
              onChange={(e) => setRpcNetwork(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-purple-500/50"
            >
              <option value="base-mainnet">Base L2 Mainnet (Chain ID 8453) — Alchemy High-Speed Tier</option>
              <option value="base-sepolia">Base Sepolia Testnet (Chain ID 84532)</option>
              <option value="farcaster-hubs">Farcaster Hubs Direct Sync (gRPC / HTTP)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Farcaster & Telegram Event Webhook URL
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-purple-500/50"
            />
          </div>
        </div>
      </FlashGlowCard>

      {/* RBAC Role Switcher */}
      <FlashGlowCard variant="cyan" intensity="medium" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>Granular RBAC Simulator (Current: {user.role})</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-400">
            Switch role to test live UI enforcement
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => onUpdateRole(r.role)}
              className={`p-3 rounded-xl border text-left transition-all ${
                user.role === r.role
                  ? 'border-[#00FF9D]/60 bg-green-950/30 text-white shadow-[0_0_15px_rgba(0,255,157,0.2)]'
                  : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-200">{r.label}</span>
                {user.role === r.role && (
                  <span className="text-[10px] font-mono font-bold text-[#00FF9D]">ACTIVE</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{r.desc}</p>
            </button>
          ))}
        </div>
      </FlashGlowCard>
    </div>
  );
};
