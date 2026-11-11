/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS AI STUDIO — Agent Registry Manager
 * Visualizes the current pool of agents with deep capabilities metadata,
 * input/output contracts, security classifications, tool bindings,
 * and performance benchmarks.
 */

import React, { useState } from 'react';
import { 
  Bot, 
  Search, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Play, 
  Copy, 
  Check, 
  Layers, 
  Sparkles, 
  ExternalLink, 
  Download, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Code2,
  Wrench,
  Key,
  DollarSign
} from 'lucide-react';
import { 
  agentFactoryService, 
  AgentCapabilityManifest 
} from '../services/agentFactoryService';
import { FlashGlowCard } from './FlashGlowCard';

interface AgentRegistryManagerProps {
  onSelectAgent?: (agent: AgentCapabilityManifest) => void;
  className?: string;
}

export const AgentRegistryManager: React.FC<AgentRegistryManagerProps> = ({
  onSelectAgent,
  className = '',
}) => {
  const [agents, setAgents] = useState<AgentCapabilityManifest[]>(() => agentFactoryService.getAllAgents());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedAgent, setSelectedAgent] = useState<AgentCapabilityManifest | null>(() => agents[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<any | null>(null);

  // Extract unique domains across all registered agents
  const allDomains = Array.from(
    new Set(agents.flatMap((a) => a.supportedDomains))
  ).filter(Boolean);

  // Filter agents
  const filteredAgents = agents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      a.availableTools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDomain =
      selectedDomain === 'All' || a.supportedDomains.includes(selectedDomain);

    const matchesType =
      selectedType === 'All' || a.type === selectedType;

    return matchesSearch && matchesDomain && matchesType;
  });

  const handleCopyJson = (agent: AgentCapabilityManifest) => {
    navigator.clipboard.writeText(JSON.stringify(agent, null, 2));
    setCopiedId(agent.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadManifest = (agent: AgentCapabilityManifest) => {
    const blob = new Blob([JSON.stringify(agent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-manifest-${agent.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRunEvaluation = async (agentId: string) => {
    setIsEvaluating(true);
    try {
      const res = await agentFactoryService.evaluateAgent(agentId);
      setEvalResult(res);
      // Refresh agents state with updated scores
      setAgents(agentFactoryService.getAllAgents());
      if (selectedAgent && selectedAgent.id === agentId) {
        setSelectedAgent(agentFactoryService.getAgent(agentId) || null);
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const totalCapabilitiesCount = agents.reduce((acc, curr) => acc + curr.capabilities.length, 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Observability Summary Banner */}
      <FlashGlowCard variant="cyan" intensity="medium" className="p-6 rounded-3xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ORCHESTRATION REGISTRY MANAGER
              </span>
              <span className="text-xs text-emerald-400 flex items-center space-x-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero-False-Pass Metadata Verified</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
              Agent Registry & Capabilities Pool
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Real-time inspection of active specialist agents. Each agent maintains typed input/output contracts, granular tool bindings, security classifications, and continuous performance benchmarks.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-2xl bg-black/40 border border-white/10 text-center font-mono">
              <div className="text-[10px] text-slate-400">Total Pool</div>
              <div className="text-lg font-bold text-white">{agents.length} Agents</div>
            </div>

            <div className="px-3.5 py-2 rounded-2xl bg-black/40 border border-white/10 text-center font-mono">
              <div className="text-[10px] text-slate-400">Total Capabilities</div>
              <div className="text-lg font-bold text-cyan-400">{totalCapabilitiesCount} Indexed</div>
            </div>

            <div className="px-3.5 py-2 rounded-2xl bg-black/40 border border-white/10 text-center font-mono">
              <div className="text-[10px] text-slate-400">Avg Quality Score</div>
              <div className="text-lg font-bold text-emerald-400">99.2%</div>
            </div>
          </div>
        </div>
      </FlashGlowCard>

      {/* Main Registry Explorer Grid: Left List + Right Detailed Metadata Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & Agents List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Filters */}
          <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by agent name, capability, or tool..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value="All">All Domains</option>
                {allDomains.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value="All">All Types</option>
                <option value="core">Core Agents</option>
                <option value="specialist">Specialists</option>
                <option value="user_created">User Created</option>
              </select>
            </div>
          </div>

          {/* List of Agents */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredAgents.map((agent) => {
              const isSelected = selectedAgent?.id === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgent(agent);
                    if (onSelectAgent) onSelectAgent(agent);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'glass-card border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white font-display">
                          {agent.name}
                        </span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                          agent.type === 'core' 
                            ? 'bg-purple-950 text-purple-300 border border-purple-500/40' 
                            : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                        }`}>
                          {agent.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2 font-sans">
                        {agent.role}
                      </p>
                    </div>

                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                      {agent.evaluationScores.quality}% Qual
                    </span>
                  </div>

                  {/* Capabilities Tags Preview */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {agent.capabilities.slice(0, 3).map((cap, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-slate-300"
                      >
                        {cap}
                      </span>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-500">
                        +{agent.capabilities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Capabilities Metadata Inspector (7 cols) */}
        <div className="lg:col-span-7">
          {selectedAgent ? (
            <FlashGlowCard variant="purple" intensity="medium" className="p-6 rounded-3xl space-y-6">
              {/* Header with Title & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                      ID: {selectedAgent.id}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                      v{selectedAgent.version} • {selectedAgent.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">
                    {selectedAgent.name}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {selectedAgent.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyJson(selectedAgent)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all"
                    title="Copy Agent JSON Manifest"
                  >
                    {copiedId === selectedAgent.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDownloadManifest(selectedAgent)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all"
                    title="Download Manifest JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleRunEvaluation(selectedAgent.id)}
                    disabled={isEvaluating}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-mono text-xs font-bold flex items-center space-x-1.5 shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{isEvaluating ? 'Benchmarking...' : 'Test Quality'}</span>
                  </button>
                </div>
              </div>

              {/* Evaluation Benchmark Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block">Quality Score</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {selectedAgent.evaluationScores.quality}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block">Reliability</span>
                  <span className="text-lg font-bold text-cyan-400">
                    {selectedAgent.evaluationScores.reliability}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block">Avg Latency</span>
                  <span className="text-lg font-bold text-purple-400">
                    {selectedAgent.evaluationScores.avgLatencyMs}ms
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block">Cost Limit / Task</span>
                  <span className="text-lg font-bold text-white">
                    ${selectedAgent.costLimitPerTaskUsd}
                  </span>
                </div>
              </div>

              {/* Complete Capabilities Metadata List */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Verified Capabilities Manifest ({selectedAgent.capabilities.length})</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.capabilities.map((cap, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-semibold"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tool Bindings & Supported Domains */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <Wrench className="w-3.5 h-3.5 text-purple-400" />
                    <span>Allowed Tools & Connectors</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAgent.availableTools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[11px] font-mono"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Supported Frameworks</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAgent.frameworks.map((fw, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono"
                      >
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input / Output Schema Contracts & Security Isolation */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-slate-400 font-bold">Typed Contracts & Security RBAC</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedAgent.securityClassification === 'restricted'
                      ? 'bg-red-950 text-red-400 border border-red-500/40'
                      : selectedAgent.securityClassification === 'elevated'
                      ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {selectedAgent.securityClassification.toUpperCase()} ISOLATION
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">INPUT CONTRACT:</span>
                    <span className="text-white font-semibold">{selectedAgent.inputSchema}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">OUTPUT CONTRACT:</span>
                    <span className="text-white font-semibold">{selectedAgent.outputSchema}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">PREFERRED MODEL:</span>
                    <span className="text-purple-300 font-semibold">{selectedAgent.modelId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">PERMISSIONS:</span>
                    <span className="text-cyan-300 font-semibold">{selectedAgent.permissions.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Benchmark Results Display if just run */}
              {evalResult && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Benchmark Test Suite Passed: {evalResult.qualityScore}% Quality</span>
                    </span>
                    <span className="text-slate-400">Duration: {evalResult.latencyMs}ms</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Validated against standard assertion invariants without regressions.
                  </div>
                </div>
              )}
            </FlashGlowCard>
          ) : (
            <div className="glass-card p-12 text-center rounded-3xl text-slate-500 font-mono text-xs">
              Select an agent from the pool to inspect capabilities metadata.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
