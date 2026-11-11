/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS AI STUDIO V12.0.0 — Agent Factory & Capability Registry View
 * Section 4 Specification:
 * - Persistent Capability Registry browser with search & filter
 * - Specialist Agent Creator (System prompt, inputs/outputs, model routing)
 * - Evaluation Test Runner (quality, reliability, latency)
 * - Agent lifecycle controls (duplicate, retire, status toggle)
 */

import React, { useState } from 'react';
import { 
  Bot, 
  Plus, 
  Search, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Play, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Globe
} from 'lucide-react';
import { agentFactoryService, AgentCapabilityManifest } from '../services/agentFactoryService';
import { FlashGlowCard } from './FlashGlowCard';
import { GlobalAgentFleetView } from './GlobalAgentFleetView';

export const AgentFactoryView: React.FC = () => {
  const [agents, setAgents] = useState<AgentCapabilityManifest[]>(() => agentFactoryService.getAllAgents());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<AgentCapabilityManifest | null>(() => agents[0] || null);
  const [activeViewMode, setActiveViewMode] = useState<'global_swarm' | 'specialist_factory'>('global_swarm');
  
  // Modals & Evaluation State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('');
  const [newCapabilities, setNewCapabilities] = useState<string>('Custom Domain Analysis, Security Invariants');
  const [newProvider, setNewProvider] = useState<AgentCapabilityManifest['providerPreference']>('gemini');
  
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<any | null>(null);

  const refreshList = () => {
    const list = agentFactoryService.getAllAgents();
    setAgents(list);
    if (selectedAgent) {
      setSelectedAgent(list.find((a) => a.id === selectedAgent.id) || list[0]);
    }
  };

  const filteredAgents = agents.filter((a) => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) return;

    const created = agentFactoryService.createSpecialistAgent({
      name: newName.trim(),
      role: newRole.trim(),
      capabilities: newCapabilities.split(',').map((c) => c.trim()).filter(Boolean),
      supportedDomains: ['Specialist', 'Enterprise'],
      tools: ['synthesize_code', 'verify_types'],
      provider: newProvider,
      modelId: newProvider === 'gemini' ? 'gemini-2.5-flash' : 'claude-3-7-sonnet',
      author: 'gxqstudio@gmail.com'
    });

    setShowCreateModal(false);
    setNewName('');
    setNewRole('');
    setSelectedAgent(created);
    refreshList();
  };

  const handleRunEvaluation = async () => {
    if (!selectedAgent) return;
    setIsEvaluating(true);
    try {
      const res = await agentFactoryService.evaluateAgent(selectedAgent.id);
      setEvalResult(res);
      refreshList();
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleDuplicate = () => {
    if (!selectedAgent) return;
    const dup = agentFactoryService.duplicateAgent(selectedAgent.id, 'gxqstudio@gmail.com');
    setSelectedAgent(dup);
    refreshList();
  };

  const handleRetire = () => {
    if (!selectedAgent) return;
    if (window.confirm(`Retire agent ${selectedAgent.name}?`)) {
      agentFactoryService.retireAgent(selectedAgent.id);
      refreshList();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <FlashGlowCard variant="purple" intensity="medium" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                DYNAMIC AGENT FACTORY V12.0.0
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Persistent Capability Registry Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Agent Registry & Specialist Factory
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
              Create, test, version, and deploy custom specialist agents. Evaluate agent quality, reliability, and execution latency.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Switcher */}
            <div className="flex items-center space-x-1 p-1 bg-white/[0.04] border border-white/10 rounded-2xl">
              <button
                onClick={() => setActiveViewMode('global_swarm')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                  activeViewMode === 'global_swarm'
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>1,000+ Global Swarm</span>
              </button>

              <button
                onClick={() => setActiveViewMode('specialist_factory')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                  activeViewMode === 'specialist_factory'
                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Specialist Studio</span>
              </button>
            </div>

            {activeViewMode === 'specialist_factory' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Synthesize Agent
              </button>
            )}
          </div>
        </div>
      </FlashGlowCard>

      {/* View Mode 1: 1,000+ Global Agent Swarm */}
      {activeViewMode === 'global_swarm' && (
        <GlobalAgentFleetView />
      )}

      {/* View Mode 2: Main Specialist Workspace: Left List + Right Inspector */}
      {activeViewMode === 'specialist_factory' && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Capability Registry List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents by capability, role..."
              className="w-full pl-9 pr-4 py-2 bg-[#0B1019] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto">
            {filteredAgents.map((agent) => (
              <FlashGlowCard
                key={agent.id}
                variant={agent.id === selectedAgent?.id ? 'purple' : 'cyan'}
                intensity={agent.id === selectedAgent?.id ? 'high' : 'subtle'}
                selected={agent.id === selectedAgent?.id}
                interactive
                onClick={() => {
                  setSelectedAgent(agent);
                  setEvalResult(null);
                }}
                className={`p-4 space-y-2 cursor-pointer ${agent.id === selectedAgent?.id ? 'ring-1 ring-purple-500' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    <span>{agent.name}</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    agent.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {agent.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{agent.role}</p>
                <div className="flex justify-between items-center text-[10px] font-mono pt-1 text-slate-500 border-t border-slate-800">
                  <span>Quality: <strong className="text-emerald-400">{agent.evaluationScores.quality}%</strong></span>
                  <span>v{agent.version}</span>
                </div>
              </FlashGlowCard>
            ))}
          </div>
        </div>

        {/* Right: Selected Agent Deep Inspector & Evaluation Controls */}
        <div className="lg:col-span-2 space-y-4">
          {selectedAgent ? (
            <FlashGlowCard variant="purple" intensity="subtle" className="p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedAgent.name}</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      v{selectedAgent.version}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{selectedAgent.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunEvaluation}
                    disabled={isEvaluating}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    <Play className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
                    <span>{isEvaluating ? 'Evaluating...' : 'Run Test Suite'}</span>
                  </button>
                  <button
                    onClick={handleDuplicate}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Duplicate
                  </button>
                  {selectedAgent.type === 'user_created' && (
                    <button
                      onClick={handleRetire}
                      className="px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Evaluation Metrics Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-500">QUALITY SCORE</div>
                  <div className="text-emerald-400 text-base font-bold">{selectedAgent.evaluationScores.quality}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">RELIABILITY</div>
                  <div className="text-cyan-400 text-base font-bold">{selectedAgent.evaluationScores.reliability}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">AVG LATENCY</div>
                  <div className="text-white text-base font-bold">{selectedAgent.evaluationScores.avgLatencyMs} ms</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">TESTS PASSED</div>
                  <div className="text-purple-300 text-base font-bold">
                    {selectedAgent.evaluationScores.testsPassed} / {selectedAgent.evaluationScores.testsPassed + selectedAgent.evaluationScores.testsFailed}
                  </div>
                </div>
              </div>

              {/* Capabilities & Tools */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-300 block mb-1">Capabilities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAgent.capabilities.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono text-[11px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-300 block mb-1">Allowed Tools:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAgent.availableTools.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-500">Input Schema:</span>
                    <div className="text-slate-300">{selectedAgent.inputSchema}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Output Schema:</span>
                    <div className="text-slate-300">{selectedAgent.outputSchema}</div>
                  </div>
                </div>
              </div>

              {/* Evaluation Results Banner if run */}
              {evalResult && (
                <div className="p-4 bg-black/60 border border-emerald-500/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Test Suite Verification Passed
                    </span>
                    <span className="font-mono">Quality: {evalResult.qualityScore}%</span>
                  </div>
                  <div className="space-y-1">
                    {evalResult.testResults.map((t: any, i: number) => (
                      <div key={i} className="flex justify-between text-[11px] font-mono text-slate-300">
                        <span>• {t.testName}</span>
                        <span className="text-emerald-400">{t.latencyMs} ms (PASSED)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FlashGlowCard>
          ) : (
            <div className="text-center py-20 text-slate-500">Select an agent from the registry</div>
          )}
        </div>
      </div>
      )}

      {/* Create Specialist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleCreateAgent} className="w-full max-w-md bg-[#0B1019] border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Synthesize Specialist Agent
            </h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Agent Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Smart Contract Auditor"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Role Description</label>
              <textarea
                rows={2}
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="e.g. Scans Solidity AST for reentrancy bugs and enforces Slither invariants"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Capabilities (Comma-separated)</label>
              <input
                type="text"
                value={newCapabilities}
                onChange={(e) => setNewCapabilities(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Preferred Model Provider</label>
              <select
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
              >
                <option value="gemini">Google Gemini 2.5 Flash</option>
                <option value="claude">Anthropic Claude 3.7 Sonnet</option>
                <option value="openai">OpenAI GPT-4o</option>
                <option value="deepseek">DeepSeek R1</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold"
              >
                Deploy to Registry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
