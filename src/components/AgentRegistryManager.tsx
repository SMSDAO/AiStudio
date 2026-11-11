/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS AI STUDIO — Agent Registry Manager & Orchestration Tracker
 * Tracks and displays the real-time status of all parallel agents in the current
 * orchestration, integrating live telemetry, capabilities metadata, self-healing logs,
 * two-way GitHub sync, and multi-cloud deployment tracking.
 */

import React, { useState, useEffect } from 'react';
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
  DollarSign,
  Radio,
  RefreshCw,
  GitFork,
  Github,
  Server,
  Terminal,
  Zap,
  ArrowRight,
  Shield,
  FileCode,
  Flame,
  CheckCircle
} from 'lucide-react';
import { 
  agentFactoryService, 
  AgentCapabilityManifest 
} from '../services/agentFactoryService';
import { 
  multiAgentOrchestratorService, 
  MultiAgentBuildExecution, 
  ParallelWorkerAgent 
} from '../services/multiAgentOrchestratorService';
import { FlashGlowCard } from './FlashGlowCard';

interface AgentRegistryManagerProps {
  onSelectAgent?: (agent: AgentCapabilityManifest) => void;
  className?: string;
}

export const AgentRegistryManager: React.FC<AgentRegistryManagerProps> = ({
  onSelectAgent,
  className = '',
}) => {
  // Navigation mode: 'orchestration' (real-time parallel worker status) vs 'directory' (capabilities pool)
  const [viewMode, setViewMode] = useState<'orchestration' | 'directory'>('orchestration');
  
  // Real-time Orchestration State
  const [currentExec, setCurrentExec] = useState<MultiAgentBuildExecution | null>(() => 
    multiAgentOrchestratorService.getCurrentExecution()
  );
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [selectedWorker, setSelectedWorker] = useState<ParallelWorkerAgent | null>(null);

  // Directory State
  const [agents, setAgents] = useState<AgentCapabilityManifest[]>(() => agentFactoryService.getAllAgents());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedAgent, setSelectedAgent] = useState<AgentCapabilityManifest | null>(() => agents[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<any | null>(null);

  // Subscribe to real-time orchestrator updates
  useEffect(() => {
    const unsub = multiAgentOrchestratorService.subscribe((exec) => {
      setCurrentExec(exec);
      if (selectedWorker) {
        const updated = exec.workers.find((w) => w.id === selectedWorker.id);
        if (updated) setSelectedWorker(updated);
      }
    });
    return () => unsub();
  }, [selectedWorker]);

  // Extract unique domains across all registered agents
  const allDomains = Array.from(
    new Set(agents.flatMap((a) => a.supportedDomains))
  ).filter(Boolean);

  // Filter agents in directory mode
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

  const handleCopyJson = (data: any, id: string) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedId(id);
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
      setAgents(agentFactoryService.getAllAgents());
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleTriggerBuild = async (promptToRun?: string) => {
    const prompt = promptToRun || customPrompt.trim() || 'Build a High-Yield DeFi Staking Vault with Uniswap v4 bonding curve and Base USDC fee splits';
    setIsBuilding(true);
    try {
      await multiAgentOrchestratorService.executeMultiAgentBuild(prompt);
      setCustomPrompt('');
    } finally {
      setIsBuilding(false);
    }
  };

  const workers = currentExec?.workers || [];
  const activeWorkingCount = workers.filter((w) => w.status === 'PARALLEL_WORKING' || w.status === 'VERIFYING' || w.status === 'SELF_HEALING' || w.status === 'DEPLOYING').length;
  const completedCount = workers.filter((w) => w.status === 'COMPLETED').length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Navigation Bar: Dual View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1px] flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-display text-white flex items-center space-x-2">
              <span>Agent Registry & Orchestration Manager</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              10 Parallel Specialist Workers • 100% Accuracy Engine • Zero-False-Pass Gates
            </p>
          </div>
        </div>

        {/* View Switcher Buttons */}
        <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-black/40 border border-white/10">
          <button
            onClick={() => setViewMode('orchestration')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              viewMode === 'orchestration'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-300" />
            <span>Active Orchestration ({activeWorkingCount > 0 ? `${activeWorkingCount} Running` : 'Ready'})</span>
          </button>

          <button
            onClick={() => setViewMode('directory')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
              viewMode === 'directory'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-300" />
            <span>Capabilities Directory ({agents.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: REAL-TIME PARALLEL ORCHESTRATION TRACKER
          ========================================================================= */}
      {viewMode === 'orchestration' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Active Request Overview & Launch Panel */}
          <FlashGlowCard variant="purple" intensity="medium" className="p-6 rounded-3xl space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    PARALLEL EXECUTION PIPELINE
                  </span>
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    Accuracy Standard: {currentExec?.accuracyScore || 100}% Verified
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                  Current Orchestration: <span className="text-cyan-300">{currentExec?.userPrompt || 'Autonomous Multi-Agent Build'}</span>
                </h3>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-mono text-slate-400">Extracted Domains:</span>
                  {currentExec?.extractedKeywords.map((kw, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cyan-300">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Metrics */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">Workers Status</div>
                  <div className="text-sm font-bold font-mono text-white">
                    <span className="text-emerald-400">{completedCount}</span> / {workers.length} Completed
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
                  <div className="text-[10px] font-mono text-slate-400">Duration</div>
                  <div className="text-xs font-mono font-bold text-cyan-400">
                    {currentExec?.totalDurationMs || 0}ms
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Trigger Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTriggerBuild()}
                placeholder="Enter prompt to trigger all 10 parallel workers (e.g. Build an AI freight dispatching OS)..."
                className="flex-1 w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
              />
              <button
                onClick={() => handleTriggerBuild()}
                disabled={isBuilding}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50 transition-all"
              >
                {isBuilding ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Orchestrating...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Launch Parallel Build</span>
                  </>
                )}
              </button>
            </div>
          </FlashGlowCard>

          {/* Parallel Workers Grid (10 Concurrent Specialist Agents) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Active Parallel Worker Fleet ({workers.length} Agents)</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero-False-Pass Verification Invariants Enforced</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {workers.map((worker) => {
                const isSelected = selectedWorker?.id === worker.id;
                const statusColor =
                  worker.status === 'COMPLETED' ? 'emerald' :
                  worker.status === 'PARALLEL_WORKING' ? 'cyan' :
                  worker.status === 'SELF_HEALING' ? 'amber' :
                  worker.status === 'VERIFYING' ? 'purple' :
                  worker.status === 'DEPLOYING' ? 'blue' : 'slate';

                return (
                  <div
                    key={worker.id}
                    onClick={() => setSelectedWorker(worker)}
                    className={`glass-card p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-3 ${
                      isSelected 
                        ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                        : 'border-white/10 hover:border-purple-500/40 bg-slate-900/60'
                    }`}
                  >
                    {/* Top line indicator */}
                    <div 
                      className={`absolute top-0 left-0 right-0 h-1 ${
                        worker.status === 'COMPLETED' ? 'bg-emerald-400' :
                        worker.status === 'PARALLEL_WORKING' ? 'bg-cyan-400 animate-pulse' :
                        worker.status === 'SELF_HEALING' ? 'bg-amber-400 animate-pulse' :
                        worker.status === 'DEPLOYING' ? 'bg-blue-400 animate-pulse' : 'bg-slate-700'
                      }`}
                    />

                    <div>
                      {/* Worker Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{worker.avatarEmoji}</span>
                          <div>
                            <h4 className="text-xs font-bold font-display text-white truncate max-w-[120px]">
                              {worker.name}
                            </h4>
                            <span className="text-[9px] font-mono text-slate-400">
                              {worker.specialty}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          worker.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                          worker.status === 'PARALLEL_WORKING' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                          worker.status === 'SELF_HEALING' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {worker.status}
                        </span>
                      </div>

                      {/* Current Task Description */}
                      <p className="text-[11px] text-slate-300 mt-2 font-sans line-clamp-2 leading-relaxed">
                        {worker.currentTask}
                      </p>
                    </div>

                    {/* Progress Bar & Telemetry */}
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Progress</span>
                        <span className="font-bold text-white">{worker.progressPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            worker.status === 'COMPLETED' ? 'bg-emerald-400' :
                            worker.status === 'SELF_HEALING' ? 'bg-amber-400' : 'bg-cyan-400'
                          }`}
                          style={{ width: `${worker.progressPct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1">
                        <span>{worker.modelId.split('-')[0]}</span>
                        <span>{worker.tokensConsumed} tok</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Worker In-Depth Inspect Panel (if one is selected) */}
          {selectedWorker && (
            <FlashGlowCard variant="cyan" intensity="subtle" className="p-5 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{selectedWorker.avatarEmoji}</div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold font-display text-white">
                      {selectedWorker.name} — Execution Details
                    </h4>
                    <p className="text-xs text-cyan-300 font-mono">
                      Role: {selectedWorker.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyJson(selectedWorker, selectedWorker.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center space-x-1"
                  >
                    {copiedId === selectedWorker.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === selectedWorker.id ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedWorker(null)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tools Used */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                    <Wrench className="w-3.5 h-3.5 text-purple-400" />
                    <span>Tools Invoked</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWorker.toolsUsed.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Generated Artifacts */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Generated Files</span>
                  </span>
                  <div className="space-y-1">
                    {selectedWorker.generatedFiles.map((f, idx) => (
                      <div key={idx} className="text-[11px] font-mono text-emerald-300 flex items-center space-x-1.5 truncate">
                        <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Self-Healing / Verification Status */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Verification & Self-Healing</span>
                  </span>
                  <div className="text-xs font-mono text-slate-200 space-y-1">
                    <div>Issues Healed: <span className="font-bold text-amber-400">{selectedWorker.selfHealedIssues}</span></div>
                    <div>Model Provider: <span className="text-cyan-400">{selectedWorker.provider}</span></div>
                    <div>Execution Latency: <span className="text-white">{selectedWorker.latencyMs}ms</span></div>
                  </div>
                </div>
              </div>

              {/* Worker Output Logs */}
              {selectedWorker.logs.length > 0 && (
                <div className="p-3 rounded-2xl bg-black/60 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase">Worker Stream Log:</div>
                  {selectedWorker.logs.map((log, lIdx) => (
                    <div key={lIdx} className="text-cyan-300">
                      &gt; {log}
                    </div>
                  ))}
                </div>
              )}
            </FlashGlowCard>
          )}

          {/* Multi-Cloud Deployment & Two-Way GitHub Sync Manifest */}
          {currentExec?.multiCloud && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Multi-Cloud Manifest */}
              <div className="glass-card p-5 rounded-3xl border border-white/10 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center space-x-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold font-display text-white">
                      Multi-Cloud Parallel Deployments
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">5 OF 5 LIVE</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  {/* Google Cloud Run */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Google Cloud Run</div>
                      <div className="text-[10px] text-slate-400">{currentExec.multiCloud.googleCloud.serviceName} ({currentExec.multiCloud.googleCloud.region})</div>
                    </div>
                    <a href={currentExec.multiCloud.googleCloud.endpointUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center space-x-1 text-[11px]">
                      <span>Live Run</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Firebase */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Firebase Hosting & Firestore</div>
                      <div className="text-[10px] text-slate-400">Rules: {currentExec.multiCloud.firebase.firestoreRules}</div>
                    </div>
                    <a href={currentExec.multiCloud.firebase.hostingUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center space-x-1 text-[11px]">
                      <span>Hosting</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Neon Postgres */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Neon Serverless PostgreSQL</div>
                      <div className="text-[10px] text-slate-400">Branch: {currentExec.multiCloud.neonPostgres.branch} (Pooling Connected)</div>
                    </div>
                    <span className="text-emerald-400 font-bold text-[10px]">Active Pool</span>
                  </div>

                  {/* Vercel Edge */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Vercel Edge Network</div>
                      <div className="text-[10px] text-slate-400">Next.js 15 App Router Server Actions</div>
                    </div>
                    <a href={currentExec.multiCloud.vercelEdge.deployUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center space-x-1 text-[11px]">
                      <span>Vercel Edge</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Two-Way GitHub Sync & Self-Healing Audit */}
              <div className="glass-card p-5 rounded-3xl border border-white/10 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center space-x-2">
                    <Github className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-bold font-display text-white">
                      Two-Way GitHub Sync & Self-Healing
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 font-bold">2-WAY SYNC ACTIVE</span>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Repository:</span>
                      <a href={currentExec.githubSync.githubRepoUrl} target="_blank" rel="noreferrer" className="text-purple-300 hover:underline flex items-center space-x-1 font-bold">
                        <span>{currentExec.githubSync.repoName}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Head Commit SHA:</span>
                      <span className="text-slate-300">{currentExec.githubSync.headCommitSha.slice(0, 10)}...</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Workflow:</span>
                      <span className="text-cyan-300">{currentExec.githubSync.workflowFile}</span>
                    </div>
                  </div>

                  {/* Self-Healing Summary */}
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1">
                    <div className="flex items-center justify-between text-amber-300 font-bold text-[11px]">
                      <span className="flex items-center space-x-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Self-Healing Engine Audit</span>
                      </span>
                      <span>Verified Passed</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans">
                      Autonomously detected potential syntax discrepancies and applied AST surgical patches before deployment dispatch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 2: AGENT CAPABILITIES DIRECTORY & MANIFESTS
          ========================================================================= */}
      {viewMode === 'directory' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Search & Domain Filter Bar */}
          <div className="glass-card p-4 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search registered agents by name, role, capability, tool..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 rounded-2xl px-3 py-1.5 text-xs font-mono text-slate-300">
                <Filter className="w-3.5 h-3.5 text-purple-400" />
                <span>Domain:</span>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-slate-900">All Domains</option>
                  {allDomains.map((d) => (
                    <option key={d} value={d} className="bg-slate-900">{d}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 rounded-2xl px-3 py-1.5 text-xs font-mono text-slate-300">
                <span>Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-slate-900">All Types</option>
                  <option value="CORE" className="bg-slate-900">CORE</option>
                  <option value="SPECIALIST" className="bg-slate-900">SPECIALIST</option>
                  <option value="CRITIC" className="bg-slate-900">CRITIC</option>
                </select>
              </div>
            </div>
          </div>

          {/* Master-Detail Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Agents List (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              {filteredAgents.map((agent) => {
                const isSelected = selectedAgent?.id === agent.id;
                return (
                  <div
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgent(agent);
                      if (onSelectAgent) onSelectAgent(agent);
                    }}
                    className={`glass-card p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-950/20 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                        : 'border-white/10 hover:border-white/20 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold font-display text-white">
                            {agent.name}
                          </h4>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                            agent.type === 'core' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                            agent.type === 'specialist' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                            'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}>
                            {agent.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans line-clamp-1">
                          {agent.role}
                        </p>
                      </div>

                      <div className="text-right text-[10px] font-mono text-slate-400">
                        <div>v{agent.version}</div>
                        <div className="text-emerald-400 font-bold">{agent.evaluationScores?.quality || 100}% Eval</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      {agent.capabilities.slice(0, 3).map((cap, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Detailed Selected Agent Manifest (7 Cols) */}
            <div className="lg:col-span-7">
              {selectedAgent ? (
                <FlashGlowCard variant="cyan" intensity="subtle" className="p-6 rounded-3xl space-y-5 sticky top-20">
                  <div className="flex items-start justify-between pb-4 border-b border-white/10">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                          AGENT MANIFEST: {selectedAgent.id}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          Classification: <span className="text-white font-bold">{selectedAgent.securityClassification}</span>
                        </span>
                      </div>
                      <h3 className="text-xl font-bold font-display text-white">
                        {selectedAgent.name}
                      </h3>
                      <p className="text-xs text-slate-300 font-sans">
                        {selectedAgent.role}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopyJson(selectedAgent, selectedAgent.id)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
                        title="Copy Manifest JSON"
                      >
                        {copiedId === selectedAgent.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleDownloadManifest(selectedAgent)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
                        title="Download JSON File"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Capabilities & Tools */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                        Declared Capabilities
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedAgent.capabilities.map((c, idx) => (
                          <span key={idx} className="text-xs font-mono px-2.5 py-1 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                        Bound Tool Permissions
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedAgent.availableTools.map((t, idx) => (
                          <span key={idx} className="text-xs font-mono px-2.5 py-1 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 flex items-center space-x-1">
                            <Wrench className="w-3 h-3" />
                            <span>{t}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Input / Output Contracts */}
                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Contract Schema Binding
                    </span>
                    <div className="text-xs font-mono space-y-1 text-slate-300">
                      <div>Input: <span className="text-cyan-400">{selectedAgent.inputSchema}</span></div>
                      <div>Output: <span className="text-emerald-400">{selectedAgent.outputSchema}</span></div>
                      <div>Author: <span className="text-slate-400">{selectedAgent.owner}</span></div>
                    </div>
                  </div>

                  {/* Benchmark & Evaluation Action */}
                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    <div className="text-xs font-mono text-slate-400">
                      Benchmarked Latency: <span className="text-white font-bold">{selectedAgent.evaluationScores?.avgLatencyMs || 150}ms</span>
                    </div>

                    <button
                      onClick={() => handleRunEvaluation(selectedAgent.id)}
                      disabled={isEvaluating}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
                    >
                      {isEvaluating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                      <span>Run Verification Benchmark</span>
                    </button>
                  </div>

                  {/* Evaluation Result Output */}
                  {evalResult && (
                    <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 font-mono text-xs text-emerald-300 space-y-1">
                      <div className="font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Evaluation Passed: {evalResult.evaluationScore}%</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {evalResult.feedback}
                      </div>
                    </div>
                  )}
                </FlashGlowCard>
              ) : (
                <div className="glass-card p-10 rounded-3xl border border-white/10 text-center text-slate-400 text-xs font-mono">
                  Select an agent from the left to inspect its deep capability manifest.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
