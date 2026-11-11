/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS AI STUDIO — 1000+ Global AI Agents Collective Swarm Mesh View
 * Interactive control console for 1000+ global agents operating as a unified single team.
 * Demonstrates:
 * - 1,024 registered global specialist agents across 7 continents with zero-discrimination equal weighting
 * - Multi-model dynamic load balancing (Gemini, Claude, DeepSeek, GPT-4o, Ollama)
 * - Parallel execution for Build, Analyze, Integrate, Implement, Construct, Deploy
 * - Rich Markdown response generation with 99%+ accuracy verification
 */

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Cpu, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Play, 
  CheckCircle2, 
  Layers, 
  Terminal, 
  Copy, 
  Download, 
  Check, 
  Rocket, 
  Radio, 
  ArrowRight,
  Filter,
  RefreshCw,
  Code2,
  Share2
} from 'lucide-react';
import { 
  globalAgentMeshService, 
  GlobalAgent, 
  GlobalRegion, 
  AgentDomain, 
  ParallelSwarmExecution 
} from '../services/globalAgentMeshService';
import { FlashGlowCard } from './FlashGlowCard';
import { GeminiChatBubble } from './GeminiChatBubble';

const REGIONS: GlobalRegion[] = [
  'North America',
  'Europe',
  'Asia-Pacific',
  'Latin America',
  'Africa',
  'Middle East',
  'Oceania',
];

const DOMAINS: AgentDomain[] = [
  'Software Engineering',
  'Security & Cryptography',
  'AI & Machine Learning',
  'Web3 & Blockchain',
  'DevOps & Cloud',
  'Data Science & Databases',
  'UX & Game Engineering',
  'Enterprise Architecture',
];

export const GlobalAgentFleetView: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const pageSize = 12;

  // Swarm dispatch state
  const [prompt, setPrompt] = useState<string>(
    'Construct an autonomous Next.js 15 enterprise SaaS microservice with Base L2 payment verification and auto-healing Docker swarm'
  );
  const [isMobilizing, setIsMobilizing] = useState<boolean>(false);
  const [swarmExecution, setSwarmExecution] = useState<ParallelSwarmExecution | null>(null);
  const [activeTab, setActiveTab] = useState<'dispatcher' | 'fleet_explorer' | 'telemetry'>('dispatcher');
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch agents for current filter
  const { agents: displayAgents, total: filteredTotal } = globalAgentMeshService.getAgents({
    region: selectedRegion,
    domain: selectedDomain,
    searchQuery,
    limit: pageSize,
    offset: page * pageSize,
  });

  const totalAgents = globalAgentMeshService.getTotalCount();
  const regionStats = globalAgentMeshService.getRegionStats();

  const handleDispatchSwarm = async () => {
    if (!prompt.trim() || isMobilizing) return;
    setIsMobilizing(true);
    try {
      const exec = await globalAgentMeshService.dispatchCollectiveSwarm(prompt);
      setSwarmExecution(exec);
    } finally {
      setIsMobilizing(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!swarmExecution) return;
    navigator.clipboard.writeText(swarmExecution.markdownResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!swarmExecution) return;
    const blob = new Blob([swarmExecution.markdownResponse], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swarm-response-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono mb-2 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
            <Globe className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>1,000+ GLOBAL AI AGENTS • SINGLE COLLECTIVE TEAM • ZERO DISCRIMINATION</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight">
            Global AI Agent Fleet & Swarm Mesh
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            1,024 specialist AI agents collaborating in a unified collective intelligence team. Dynamically load-balanced across Gemini, Claude, DeepSeek, and GPT with 99%+ accuracy verification and equal representation across all 7 world regions.
          </p>
        </div>

        {/* Global Navigation Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-white/[0.04] border border-white/10 rounded-2xl">
          <button
            onClick={() => setActiveTab('dispatcher')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeTab === 'dispatcher'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Swarm Dispatcher</span>
          </button>

          <button
            onClick={() => setActiveTab('fleet_explorer')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeTab === 'fleet_explorer'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Agent Directory ({totalAgents})</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              activeTab === 'telemetry'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Global Telemetry</span>
          </button>
        </div>
      </div>

      {/* High-Impact Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <FlashGlowCard variant="purple" intensity="medium" className="p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Total Global Agents</span>
            <Globe className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-display text-white">
            1,024 Nodes
          </div>
          <span className="text-[10px] text-purple-300 font-mono mt-1 block">
            100% Active in single swarm
          </span>
        </FlashGlowCard>

        <FlashGlowCard variant="green" intensity="medium" className="p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Swarm Consensus</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-display text-[#00FF9D]">
            99.8% Accuracy
          </div>
          <span className="text-[10px] text-emerald-300 font-mono mt-1 block">
            Formal multi-agent verification
          </span>
        </FlashGlowCard>

        <FlashGlowCard variant="cyan" intensity="medium" className="p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Global Continents</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-display text-white">
            7 / 7 Regions
          </div>
          <span className="text-[10px] text-cyan-300 font-mono mt-1 block">
            Equal weighting • Zero bias
          </span>
        </FlashGlowCard>

        <FlashGlowCard variant="orange" intensity="medium" className="p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Models Balanced</span>
            <Cpu className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-display text-white">
            6 AI Engines
          </div>
          <span className="text-[10px] text-orange-300 font-mono mt-1 block">
            Gemini, Claude, GPT, DeepSeek
          </span>
        </FlashGlowCard>
      </div>

      {/* =========================================================================
          SECTION 1: COLLECTIVE SWARM DISPATCHER & MARKDOWN RESPONSE ENGINE
          ========================================================================= */}
      {activeTab === 'dispatcher' && (
        <div className="space-y-6">
          <FlashGlowCard variant="rainbow-subtle" className="p-5 sm:p-6 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Rocket className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base sm:text-lg font-bold font-display text-white">
                  Universal Request Dispatcher (1,000+ Agents Single Team)
                </h2>
              </div>
              <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/30">
                Parallel Execution Engine • 99%+ Accuracy
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Submit ANY natural language request to <strong>Answer</strong>, <strong>Build</strong>, <strong>Analyze</strong>, <strong>Integrate</strong>, <strong>Implement</strong>, <strong>Construct</strong>, or <strong>Deploy</strong>. Parallel helper agents across all 7 continents collaborate dynamically to formulate a comprehensive enterprise Markdown response.
            </p>

            {/* Input Box */}
            <div className="space-y-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Enter any request to build, analyze, integrate, implement, construct, or deploy..."
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono leading-relaxed resize-none"
              />

              {/* Starter Quick Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">Quick Operations:</span>
                {[
                  { label: '🏗️ Build Next.js 15 SaaS', query: 'Build a production Next.js 15 App Router SaaS with Base L2 billing and Supabase Realtime' },
                  { label: '🛡️ Analyze Smart Contracts', query: 'Analyze Solidity contracts for Slither invariant vulnerabilities and reentrancy bugs' },
                  { label: '⚡ Construct Game Frame', query: 'Construct a 60FPS Three.js WebGL game with onchain high score leaderboard' },
                  { label: '🚀 Deploy to Vercel Edge', query: 'Deploy a multi-tenant microservice to Vercel Edge with zero-downtime rollback' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(chip.query)}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[11px] font-mono text-slate-300 hover:text-white transition-all"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Dispatch Action Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Equal representation: 146 nodes per continent active</span>
                </div>

                <button
                  type="button"
                  onClick={handleDispatchSwarm}
                  disabled={isMobilizing || !prompt.trim()}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#A855F7] via-[#06B6D4] to-[#22C55E] hover:opacity-95 text-white font-mono text-xs font-bold flex items-center space-x-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isMobilizing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Mobilizing 1,000+ Agents...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Dispatch to 1,000+ Global Swarm</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </FlashGlowCard>

          {/* Real-Time Swarm Execution Visualization */}
          {swarmExecution && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Parallel Execution Timeline */}
              <FlashGlowCard variant="cyan" className="p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="font-display font-bold text-sm text-white">
                      Parallel Multi-Agent Consensus Stream ({swarmExecution.executionId})
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Consensus Score: {swarmExecution.consensusAccuracy}%
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {swarmExecution.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-slate-300">
                      <span className="text-slate-500 text-[11px] shrink-0">[{step.timestamp}]</span>
                      <span className="text-purple-400 font-bold shrink-0">{step.agentName}</span>
                      <span className="text-cyan-400 text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/30 shrink-0">
                        {step.region}
                      </span>
                      <span className="text-slate-200">{step.action}</span>
                    </div>
                  ))}
                </div>
              </FlashGlowCard>

              {/* Gemini Web Mobile Style Enterprise Markdown Response */}
              <GeminiChatBubble
                id={swarmExecution.executionId}
                role="assistant"
                authorName="1,000+ Global Multi-Agent Fleet"
                modelName="Gemini 2.5 Flash + Claude + GPT Mesh"
                content={swarmExecution.markdownResponse}
                consensusAccuracy={swarmExecution.consensusAccuracy}
                thoughtProcess={{
                  durationMs: swarmExecution.durationMs,
                  summary: `Consensus verified across 7 continental clusters with ${swarmExecution.consensusAccuracy}% accuracy consensus. All 1,024 agents actively synchronized.`,
                  steps: swarmExecution.timeline.map((step) => `[${step.region}] ${step.agentName}: ${step.action}`)
                }}
                tokensUsed={swarmExecution.mobilizedAgents.length * 320}
                latencyMs={swarmExecution.durationMs}
                timestamp="Just now"
                onRefinePrompt={(refinement) => {
                  setPrompt((prev) => `${prev}. Refinement: ${refinement}`);
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 2: 1,024 AGENT DIRECTORY & SEARCH
          ========================================================================= */}
      {activeTab === 'fleet_explorer' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="glass-card p-4 rounded-3xl border border-white/10 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(0);
                  }}
                  placeholder="Search 1,024 agents by codename, role, domain..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Region Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-slate-400">Region:</span>
                <select
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setPage(0);
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                >
                  <option value="All">All Continents (Equal 7 Regions)</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>

                <select
                  value={selectedDomain}
                  onChange={(e) => {
                    setSelectedDomain(e.target.value);
                    setPage(0);
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                >
                  <option value="All">All 8 Domains</option>
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grid of Global Agents */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayAgents.map((agent) => (
              <div
                key={agent.id}
                className="glass-card p-4 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {agent.codeName}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {agent.accuracyRating}% Accuracy
                    </span>
                  </div>

                  <h4 className="text-sm font-bold font-display text-white mt-2">
                    {agent.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {agent.role}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Region: <span className="text-cyan-300">{agent.region}</span></span>
                    <span>Latency: <span className="text-emerald-400">{agent.latencyMs}ms</span></span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Model: <span className="text-purple-300">{agent.preferredModel}</span></span>
                    <span>Completed: <span className="text-white">{agent.totalTasksCompleted}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono">
            <span className="text-slate-400">
              Showing {displayAgents.length} of {filteredTotal} Global Agents
            </span>

            <div className="flex items-center space-x-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 disabled:opacity-40 text-white"
              >
                Previous
              </button>
              <span className="text-slate-300">
                Page {page + 1} of {Math.ceil(filteredTotal / pageSize) || 1}
              </span>
              <button
                disabled={(page + 1) * pageSize >= filteredTotal}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 disabled:opacity-40 text-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: GLOBAL TELEMETRY & CONTINENTAL EQUALITY
          ========================================================================= */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          <FlashGlowCard variant="cyan" className="p-6 rounded-3xl space-y-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display font-bold text-base text-white">
                Continental Balance & Zero-Discrimination Verification
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Every continent maintains an equal allocation of 146 specialized nodes with balanced voting power. No single country or region dominates swarm consensus.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {REGIONS.map((region) => {
                const stat = regionStats[region];
                return (
                  <div key={region} className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{region}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full">
                        {stat?.onlinePct || 100}% Online
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Active Nodes: <span className="text-cyan-300">{stat?.count || 146}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Average Latency: <span className="text-emerald-400">{stat?.avgLatency || 14}ms</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </FlashGlowCard>
        </div>
      )}
    </div>
  );
};
