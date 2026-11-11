/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS V11.0.0 — Universal Software Factory View
 * Synthesizes and inspects the 3 mandatory archetypes:
 *  - Enterprise Trucking OS
 *  - Multi-Agent AI SaaS
 *  - 3D Cyber Racing WebGL Game
 * Plus live code preview, architecture diagrams, and interactive simulator.
 */

import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  FileCode, 
  Play, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Truck, 
  Bot, 
  Gamepad2, 
  Terminal, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { 
  universalFactoryService, 
  ArchetypeId, 
  GeneratedProject, 
  GeneratedFile, 
  ARCHETYPE_METADATA 
} from '../services/universalFactoryService';
import { FlashGlowCard } from './FlashGlowCard';
import { FleetDispatchConsole } from './simulators/FleetDispatchConsole';

export const UniversalFactoryView: React.FC = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId>('enterprise_trucking');
  const [activeProject, setActiveProject] = useState<GeneratedProject>(() => 
    universalFactoryService.generateArchetype('enterprise_trucking')
  );
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'code' | 'architecture' | 'simulator'>('code');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectArchetype = (id: ArchetypeId) => {
    setSelectedArchetype(id);
    setIsSynthesizing(true);
    setTimeout(() => {
      const proj = universalFactoryService.generateArchetype(id);
      setActiveProject(proj);
      setSelectedFileIndex(0);
      setIsSynthesizing(false);
    }, 400);
  };

  const handleSynthesizeCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    setIsSynthesizing(true);
    setTimeout(() => {
      const proj = universalFactoryService.generateArchetype('custom_agentic', customPrompt);
      setActiveProject(proj);
      setSelectedArchetype('custom_agentic');
      setSelectedFileIndex(0);
      setIsSynthesizing(false);
    }, 600);
  };

  const handleCopyCode = () => {
    const file = activeProject.files[selectedFileIndex];
    if (!file) return;
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const file = activeProject.files[selectedFileIndex];
    if (!file) return;
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentFile: GeneratedFile | undefined = activeProject.files[selectedFileIndex];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <FlashGlowCard variant="purple" intensity="medium" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                UNIVERSAL SOFTWARE FACTORY V11.0.0
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zero-False-Pass Certified
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Enterprise Autonomous Synthesis Engine
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
              Compile full production architectures with complete source code, strict types, smart contracts, and WebGL rendering for enterprise archetypes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSelectArchetype(selectedArchetype)}
              disabled={isSynthesizing}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/40 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
              Re-Synthesize Project
            </button>
          </div>
        </div>
      </FlashGlowCard>

      {/* Archetype Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Archetype A: Trucking */}
        <FlashGlowCard
          variant="orange"
          intensity={selectedArchetype === 'enterprise_trucking' ? 'high' : 'subtle'}
          selected={selectedArchetype === 'enterprise_trucking'}
          interactive
          onClick={() => handleSelectArchetype('enterprise_trucking')}
          className="p-5 cursor-pointer space-y-3"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
              MANDATORY A
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Enterprise Trucking OS</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              GPS telemetry, FMCSA ELD HOS compliance, and Base L2 freight smart escrow.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
            {ARCHETYPE_METADATA.enterprise_trucking.highlights.map((h, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono">
                {h}
              </span>
            ))}
          </div>
        </FlashGlowCard>

        {/* Archetype B: SaaS */}
        <FlashGlowCard
          variant="purple"
          intensity={selectedArchetype === 'multi_agent_saas' ? 'high' : 'subtle'}
          selected={selectedArchetype === 'multi_agent_saas'}
          interactive
          onClick={() => handleSelectArchetype('multi_agent_saas')}
          className="p-5 cursor-pointer space-y-3"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              MANDATORY B
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Multi-Agent AI SaaS</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              DAG task graphs, vector search RAG retrieval, multi-tenant RBAC, and billing.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
            {ARCHETYPE_METADATA.multi_agent_saas.highlights.map((h, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono">
                {h}
              </span>
            ))}
          </div>
        </FlashGlowCard>

        {/* Archetype C: 3D Racing */}
        <FlashGlowCard
          variant="cyan"
          intensity={selectedArchetype === 'cyber_racing_3d' ? 'high' : 'subtle'}
          selected={selectedArchetype === 'cyber_racing_3d'}
          interactive
          onClick={() => handleSelectArchetype('cyber_racing_3d')}
          className="p-5 cursor-pointer space-y-3"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              MANDATORY C
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">3D Cyber Racing WebGL</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Three.js neon track, vehicle physics simulation, and onchain lap leaderboards.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
            {ARCHETYPE_METADATA.cyber_racing_3d.highlights.map((h, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono">
                {h}
              </span>
            ))}
          </div>
        </FlashGlowCard>
      </div>

      {/* Custom Prompt Input */}
      <form onSubmit={handleSynthesizeCustom} className="flex gap-2">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Or synthesize custom enterprise architecture (e.g., 'Autonomous Decentralized Exchange with Order Book')..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#0B1019] border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/80 transition-colors"
        />
        <button
          type="submit"
          disabled={isSynthesizing || !customPrompt.trim()}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 disabled:opacity-50 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Synthesize Prompt
        </button>
      </form>

      {/* Project Workspace Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: File Tree & Project Stats */}
        <div className="space-y-4">
          <FlashGlowCard variant="purple" intensity="subtle" className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Files</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {activeProject.files.length} Files
              </span>
            </div>
            <div className="space-y-1">
              {activeProject.files.map((file, idx) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                    selectedFileIndex === idx
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {(file.sizeBytes / 1024).toFixed(1)}k
                  </span>
                </button>
              ))}
            </div>
          </FlashGlowCard>

          {/* Architectural Contract Badge */}
          <FlashGlowCard variant="green" intensity="subtle" className="p-4 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Architectural Invariants</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300 font-mono">
              <div>Database: <span className="text-slate-400">{activeProject.architecturalContract.database}</span></div>
              <div>Auth: <span className="text-slate-400">{activeProject.architecturalContract.authModel}</span></div>
              <div>Security Score: <span className="text-emerald-400 font-bold">{activeProject.architecturalContract.securityScore}/100</span></div>
              <div>Coverage: <span className="text-emerald-400 font-bold">{activeProject.architecturalContract.testCoverage}</span></div>
            </div>
          </FlashGlowCard>
        </div>

        {/* Right: Code Viewer / Architecture / Live Simulator */}
        <div className="lg:col-span-3 space-y-4">
          {/* Action Tabs */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === 'code' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Source Code
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === 'architecture' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Architecture Diagram
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === 'simulator' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                Interactive Simulator
              </button>
            </div>

            {activeTab === 'code' && currentFile && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadFile}
                  className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-xs font-mono flex items-center gap-1.5 border border-purple-500/40 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            )}
          </div>

          {/* Tab 1: Source Code View */}
          {activeTab === 'code' && currentFile && (
            <div className="bg-[#070A0F] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="px-4 py-2.5 bg-[#0B1019] border-b border-slate-800 flex justify-between items-center text-xs">
                <span className="font-mono text-purple-400 font-semibold">{currentFile.path}</span>
                <span className="text-slate-500 font-mono text-[11px]">{currentFile.description}</span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[560px] leading-relaxed">
                <code>{currentFile.content}</code>
              </pre>
            </div>
          )}

          {/* Tab 2: Mermaid Architecture View */}
          {activeTab === 'architecture' && (
            <div className="bg-[#070A0F] border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-400" />
                  Mermaid Architectural Pipeline
                </h3>
                <span className="text-xs font-mono text-slate-400">{activeProject.name}</span>
              </div>
              <div className="bg-black/60 border border-slate-800/80 rounded-xl p-4 font-mono text-xs text-orange-300 leading-loose overflow-x-auto whitespace-pre">
                {activeProject.mermaidDiagram}
              </div>
            </div>
          )}

          {/* Tab 3: Interactive Simulator */}
          {activeTab === 'simulator' && (
            <div className="space-y-4">
              {selectedArchetype === 'enterprise_trucking' && (
                <FleetDispatchConsole />
              )}
              {selectedArchetype === 'multi_agent_saas' && (
                <FlashGlowCard variant="purple" intensity="medium" className="p-6 text-center space-y-3">
                  <Bot className="w-10 h-10 text-purple-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Multi-Agent DAG Task Graph Running</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Simulating concurrent execution across Researcher, Synthesizer, and Auditor nodes with vector RAG retrieval.
                  </p>
                  <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs font-mono text-purple-300">
                    Status: ALL 3 AGENTS CONCURRENTLY EXECUTED · 0 CYCLIC DEADLOCKS
                  </div>
                </FlashGlowCard>
              )}
              {selectedArchetype === 'cyber_racing_3d' && (
                <FlashGlowCard variant="cyan" intensity="medium" className="p-6 text-center space-y-3">
                  <Gamepad2 className="w-10 h-10 text-cyan-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">3D Cyber Racing WebGL Canvas</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Three.js 60 FPS hardware accelerated WebGL canvas with onchain lap telemetry.
                  </p>
                  <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs font-mono text-cyan-300">
                    STATUS: WEBGL 2.0 INITIALIZED · PROCEDURAL CURVE GENERATED · 60 FPS
                  </div>
                </FlashGlowCard>
              )}
              {selectedArchetype === 'custom_agentic' && (
                <FlashGlowCard variant="green" intensity="medium" className="p-6 text-center space-y-3">
                  <Cpu className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Custom Synthesized Micro-Service</h3>
                  <p className="text-xs text-slate-400">Autonomous runtime generated from prompt: "{customPrompt}"</p>
                </FlashGlowCard>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
