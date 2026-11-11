import React, { useState } from 'react';
import { 
  Activity, 
  Terminal, 
  Cpu, 
  Coins, 
  Clock, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  Server, 
  ArrowUpRight, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import { AppItem, AppToken, ShippedEvent, UserProfile } from '../types';
import { MiniWindowItem } from './MiniPopupWindow';
import { FlashGlowCard } from './FlashGlowCard';
import { LiveBuildProgressWidget } from './LiveBuildProgressWidget';

interface EnterpriseDashboardViewProps {
  apps: AppItem[];
  tokens: AppToken[];
  events: ShippedEvent[];
  user: UserProfile;
  onOpenMiniWindow: (item: MiniWindowItem) => void;
  onOpenWorkspace: () => void;
}

export const EnterpriseDashboardView: React.FC<EnterpriseDashboardViewProps> = ({
  apps,
  tokens,
  events,
  user,
  onOpenMiniWindow,
  onOpenWorkspace,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'logs' | 'history' | 'models' | 'tokens'>('analytics');
  const [filterLogLevel, setFilterLogLevel] = useState<'ALL' | 'INFO' | 'SUCCESS' | 'WARN'>('ALL');

  // Realistic mock live telemetry logs
  const [logs, setLogs] = useState([
    { id: '1', time: '12:44:02', level: 'SUCCESS', message: 'Base L2 Clanker token contract deployed with 60% creator fee distribution hook.' },
    { id: '2', time: '12:43:58', level: 'INFO', message: 'Vercel Edge compilation passed with Next.js 15 App Router standard.' },
    { id: '3', time: '12:43:40', level: 'INFO', message: 'Farcaster Hubs direct sync completed: Frame v2 metadata validated.' },
    { id: '4', time: '12:42:15', level: 'AUDIT', message: 'RBAC audit check verified: user role APP_OWNER authorized fee withdrawal.' },
    { id: '5', time: '12:40:10', level: 'SUCCESS', message: 'Interactive Miniapp Simulator initialized: PartyKit room sync online.' },
    { id: '6', time: '12:38:22', level: 'WARN', message: 'L2 RPC latency spike detected (182ms). Switched to secondary Alchemy node.' },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3A8DFF] shadow-[0_0_8px_#3A8DFF]" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              AI STUDIO Enterprise Control
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white mt-1">
            Enterprise Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Exclusive enterprise widgets: real-time telemetry, live execution logs, build history, model fleet & token bonding curves.
          </p>
        </div>

        {/* Sub-navigation tabs: Analytics, Logs, History, Models, Tokens */}
        <div className="flex items-center space-x-1.5 p-1 bg-white/[0.04] border border-white/10 rounded-xl overflow-x-auto">
          {[
            { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { id: 'logs', label: 'Live Logs', icon: <Terminal className="w-3.5 h-3.5" /> },
            { id: 'history', label: 'Build History', icon: <Clock className="w-3.5 h-3.5" /> },
            { id: 'models', label: 'Model Fleet', icon: <Cpu className="w-3.5 h-3.5" /> },
            { id: 'tokens', label: 'Tokens & Fees', icon: <Coins className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'bg-gradient-to-r from-[#A020F0] to-[#3A8DFF] text-white shadow-[0_0_12px_rgba(160,32,240,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Progress Updates for AI Build Process (PartyKit / Supabase Realtime) */}
      <LiveBuildProgressWidget />

      {/* =========================================================================
          WIDGET 1: ANALYTICS
          ========================================================================= */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Stat Cards with FlashGlowCard Multi-Color Accents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FlashGlowCard variant="green" intensity="medium" className="p-5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono uppercase tracking-wider">Total Volume Generated</span>
                <DollarSign className="w-4 h-4 text-[#00FF9D]" />
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-display text-white">$2,842,910</span>
                <span className="text-xs font-mono text-[#00FF9D] flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> +18.4%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Across Base L2 & Uniswap v4 pools</span>
            </FlashGlowCard>

            <FlashGlowCard variant="purple" intensity="medium" className="p-5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono uppercase tracking-wider">60% Creator Cut Paid</span>
                <Coins className="w-4 h-4 text-purple-400" />
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-display text-purple-300">184.25 ETH</span>
                <span className="text-xs font-mono text-purple-400">~$615,000</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Auto-split directly to miniapp wallets</span>
            </FlashGlowCard>

            <FlashGlowCard variant="cyan" intensity="medium" className="p-5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono uppercase tracking-wider">Active Miniapps Live</span>
                <Layers className="w-4 h-4 text-[#3A8DFF]" />
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-display text-white">{apps.length + 142}</span>
                <span className="text-xs font-mono text-[#3A8DFF]">100% Uptime</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Farcaster + Telegram + Web</span>
            </FlashGlowCard>

            <FlashGlowCard variant="yellow" intensity="medium" className="p-5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono uppercase tracking-wider">Average Generation Time</span>
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-display text-white">4.2s</span>
                <span className="text-xs font-mono text-yellow-400">Zero Cold Start</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Vercel Edge + Agent Loop</span>
            </FlashGlowCard>
          </div>

          {/* System Performance & Telemetry Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FlashGlowCard variant="blue" intensity="medium" className="p-5 lg:col-span-2 space-y-4">
              <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[#3A8DFF]" />
                <span>Base L2 Transaction Throughput & Creator Fee Accrual</span>
              </h2>

              <div className="h-48 rounded-xl bg-black/40 border border-white/5 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Base L2 Gas (Gwei): 0.002</span>
                  <span className="text-[#00FF9D]">TPS: 84.2</span>
                </div>
                {/* Visual bar graph representation */}
                <div className="h-28 flex items-end space-x-2 pt-2">
                  {[45, 60, 52, 75, 88, 64, 92, 85, 96, 78, 100, 89, 94].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                      <div
                        style={{ height: `${val}%` }}
                        className="w-full rounded-t bg-gradient-to-t from-[#3A8DFF] to-[#A020F0] opacity-80 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_rgba(160,32,240,0.5)]"
                      />
                      <span className="text-[9px] font-mono text-slate-500 hidden sm:inline">
                        t-{13 - idx}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                <span>Contract Security: Formal Slither Audit Passed</span>
                <span className="text-purple-300">Uniswap v4 Dynamic Hook Active</span>
              </div>
            </FlashGlowCard>

            {/* Platform Health and Verification Card */}
            <FlashGlowCard variant="purple" intensity="medium" className="p-5 space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#00FF9D]" />
                  <span>Platform Security & Audits</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Automated security policies and cryptographic proof verification.
                </p>

                <div className="mt-4 space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-slate-400">Slither Analyzer:</span>
                    <span className="text-[#00FF9D]">0 High / 0 Critical</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-slate-400">Smart Wallet Security:</span>
                    <span className="text-[#00FF9D]">ERC-4337 Compliant</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-slate-400">Farcaster Signer:</span>
                    <span className="text-[#00FF9D]">Ed25519 Validated</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-slate-400">60% Creator Enforcement:</span>
                    <span className="text-purple-300">Hardcoded in Clanker</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenWorkspace}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#A020F0] to-[#3A8DFF] hover:from-[#b030ff] hover:to-[#4a9dff] text-white font-mono text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(160,32,240,0.3)]"
              >
                <span>Launch Enterprise Builder</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </FlashGlowCard>
          </div>
        </div>
      )}

      {/* =========================================================================
          WIDGET 2: LIVE TELEMETRY LOGS
          ========================================================================= */}
      {activeSubTab === 'logs' && (
        <FlashGlowCard variant="rainbow-subtle" intensity="medium" className="p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-[#00FF9D]" />
              <span>Real-Time Enterprise Execution Logs</span>
            </h2>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setLogs((prev) => [
                    {
                      id: `${Date.now()}`,
                      time: new Date().toLocaleTimeString(),
                      level: 'INFO',
                      message: `Manual diagnostics trigger: WebSocket heartbeat ACK in 12ms.`,
                    },
                    ...prev,
                  ])
                }
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Ping Node</span>
              </button>
            </div>
          </div>

          {/* Terminal Box */}
          <div className="rounded-xl bg-[#05070f] border border-white/10 p-4 font-mono text-xs space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start space-x-2 leading-relaxed">
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                    log.level === 'SUCCESS'
                      ? 'bg-green-950/60 text-green-400 border border-green-500/40'
                      : log.level === 'WARN'
                      ? 'bg-red-950/60 text-red-400 border border-red-500/40'
                      : log.level === 'AUDIT'
                      ? 'bg-purple-950/60 text-purple-400 border border-purple-500/40'
                      : 'bg-blue-950/60 text-blue-400 border border-blue-500/40'
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
          </div>
        </FlashGlowCard>
      )}

      {/* =========================================================================
          WIDGET 3: BUILD HISTORY
          ========================================================================= */}
      {activeSubTab === 'history' && (
        <FlashGlowCard variant="purple" intensity="medium" className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Recent Enterprise Build Jobs & Deployments</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400">
                  <th className="py-2.5 px-3">JOB ID</th>
                  <th className="py-2.5 px-3">APPLICATION</th>
                  <th className="py-2.5 px-3">TARGET</th>
                  <th className="py-2.5 px-3">CREATOR SHARE</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-300">
                {apps.slice(0, 6).map((app, idx) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 text-slate-400">#BLD-00{idx + 10}</td>
                    <td className="py-3 px-3 font-semibold text-white">{app.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                        Base L2 + Farcaster
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#00FF9D] font-bold">60% Split</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold text-green-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>LIVE AT EDGE</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() =>
                          onOpenMiniWindow({
                            type: 'page_preview',
                            title: app.name,
                            category: 'Build Specs',
                            metadata: `Contract: ${app.wallet.address} • Unclaimed Fees: ${app.wallet.unclaimedFeesEth} ETH`,
                            content: `Live Specs for ${app.name}:\n\n` +
                              `Description: ${app.description}\n` +
                              `Token Symbol: ${app.token?.symbol || 'N/A'}\n` +
                              `Base Smart Account: ${app.wallet.address}\n` +
                              `Creator Fee Allocation: 60%\n` +
                              `Deploy Hash: ${app.wallet.address.slice(0, 16)}...`,
                          })
                        }
                        className="px-2.5 py-1 rounded-md text-[11px] bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FlashGlowCard>
      )}

      {/* =========================================================================
          WIDGET 4: MODEL FLEET
          ========================================================================= */}
      {activeSubTab === 'models' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: 'Gemini 2.5 Flash',
              provider: 'Google AI Studio',
              role: 'Primary Synthesizer',
              latency: '110ms',
              context: '1,000,000 tokens',
              status: 'ONLINE',
              variant: 'green' as const,
              badgeClass: 'border-[#00FF9D]/40 bg-[#00FF9D]/10 text-[#00FF9D]',
            },
            {
              name: 'Claude 3.7 Sonnet',
              provider: 'Anthropic',
              role: 'Deep Code Reasoning',
              latency: '240ms',
              context: '200,000 tokens',
              status: 'ONLINE',
              variant: 'blue' as const,
              badgeClass: 'border-[#3A8DFF]/40 bg-[#3A8DFF]/10 text-[#3A8DFF]',
            },
            {
              name: 'Solidity Verifier v4',
              provider: 'AI STUDIO Onchain Node',
              role: 'Smart Contract Formal Verification',
              latency: '85ms',
              context: 'Bytecode & ABI',
              status: 'READY',
              variant: 'purple' as const,
              badgeClass: 'border-purple-500/40 bg-purple-950/40 text-purple-300',
            },
          ].map((m, idx) => (
            <FlashGlowCard key={idx} variant={m.variant} intensity="subtle" className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">{m.provider}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${m.badgeClass}`}>
                  {m.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{m.name}</h3>
              <p className="text-xs text-slate-300">{m.role}</p>

              <div className="pt-2 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                <div>
                  <span className="block text-slate-500">Latency:</span>
                  <span className="text-white font-semibold">{m.latency}</span>
                </div>
                <div>
                  <span className="block text-slate-500">Context:</span>
                  <span className="text-white font-semibold">{m.context}</span>
                </div>
              </div>
            </FlashGlowCard>
          ))}
        </div>
      )}

      {/* =========================================================================
          WIDGET 5: TOKENS & BONDING CURVES
          ========================================================================= */}
      {activeSubTab === 'tokens' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tokens.map((tok, idx) => {
              const progressPct = Math.min(100, Math.floor((tok.totalFeesGeneratedUsd / 5000) * 100)) || 68;
              const cardVariants: Array<'orange' | 'purple' | 'cyan'> = ['orange', 'purple', 'cyan'];
              const currentVariant = cardVariants[idx % cardVariants.length];

              return (
                <FlashGlowCard key={tok.contractAddress} variant={currentVariant} intensity="medium" className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-300">${tok.symbol}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-950/60 border border-green-500/40 text-green-300 font-bold">
                      {tok.creatorFeePercentage}% CREATOR CUT
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{tok.name}</h3>
                  <div className="text-xs font-mono space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Market Cap:</span>
                      <span className="text-white font-semibold">${tok.marketCapUsd.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">24h Volume:</span>
                      <span className="text-white font-semibold">${tok.volume24hUsd.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Holders:</span>
                      <span className="text-[#00FF9D] font-semibold">{tok.holdersCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bonding Curve:</span>
                      <span className="text-purple-300 font-semibold">{progressPct}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onOpenMiniWindow({
                        type: 'search_result',
                        title: `${tok.name} ($${tok.symbol})`,
                        category: 'Clanker Bonding Curve Token',
                        metadata: `Contract: ${tok.contractAddress} • Liquidity: Uniswap v4 on Base`,
                        content: `Token Economics & Fee Structure:\n\n` +
                          `- Token Name: ${tok.name}\n` +
                          `- Symbol: $${tok.symbol}\n` +
                          `- Creator Split: ${tok.creatorFeePercentage}% of all swap fees on Base L2\n` +
                          `- Total Fees Generated: $${tok.totalFeesGeneratedUsd.toLocaleString()}\n` +
                          `- Contract Address: ${tok.contractAddress}\n` +
                          `- Bonding Curve Status: ${progressPct}% complete toward Uniswap v4 graduation pool.`,
                      })
                    }
                    className="w-full mt-2 py-1.5 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10"
                  >
                    Inspect Clanker Curve
                  </button>
                </FlashGlowCard>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
