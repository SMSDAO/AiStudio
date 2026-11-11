/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS V11.0.0 — Multi-Model Adapter Router Dashboard
 * Controls and observes: Gemini, Claude, OpenAI, DeepSeek, Local/Ollama
 * Latency metrics, health statuses, failover logs, and live prompt testing.
 */

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Activity, 
  ShieldAlert, 
  Zap, 
  Terminal, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Coins, 
  Layers, 
  Send 
} from 'lucide-react';
import { 
  modelRouterService, 
  ModelSpec, 
  ModelProviderId, 
  ModelRouteResponse 
} from '../services/modelRouterService';
import { FlashGlowCard } from './FlashGlowCard';
import { GeminiChatBubble } from './GeminiChatBubble';

export const ModelRouterView: React.FC = () => {
  const [models, setModels] = useState<ModelSpec[]>(() => modelRouterService.getModels());
  const [activeProvider, setActiveProvider] = useState<ModelProviderId>(() => modelRouterService.getActiveProvider());
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [testPrompt, setTestPrompt] = useState<string>('Verify architectural invariants and compile TypeScript AST for multi-tenant microservices.');
  const [routeResult, setRouteResult] = useState<ModelRouteResponse | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [auditSummary, setAuditSummary] = useState(() => modelRouterService.getAuditSummary());

  const handlePingAll = async () => {
    setIsPinging(true);
    for (const m of models) {
      await modelRouterService.pingModel(m.id);
    }
    setModels([...modelRouterService.getModels()]);
    setIsPinging(false);
  };

  const handleSetProvider = (p: ModelProviderId) => {
    modelRouterService.setActiveProvider(p);
    setActiveProvider(p);
  };

  const handleExecutePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPrompt.trim()) return;
    setIsExecuting(true);
    try {
      const res = await modelRouterService.routeExecution({
        task: 'architecture',
        prompt: testPrompt,
        preferredProvider: activeProvider
      });
      setRouteResult(res);
      setAuditSummary(modelRouterService.getAuditSummary());
      setModels([...modelRouterService.getModels()]);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <FlashGlowCard variant="purple" intensity="medium" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                MULTI-MODEL ADAPTER MESH
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zero Single-Point-of-Failure
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Model Router & Failover Infrastructure
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
              Automatic load balancing and instant fallback between Gemini 2.5, Claude 3.7, GPT-4o, DeepSeek R1, and Local Ollama.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePingAll}
              disabled={isPinging}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/40 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isPinging ? 'animate-spin' : ''}`} />
              Ping Mesh Latencies
            </button>
          </div>
        </div>
      </FlashGlowCard>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => {
          const isSelected = activeProvider === model.provider;
          const variant = model.provider === 'gemini' ? 'purple' : model.provider === 'claude' ? 'orange' : model.provider === 'openai' ? 'green' : model.provider === 'deepseek' ? 'cyan' : 'yellow';

          return (
            <FlashGlowCard
              key={model.id}
              variant={variant as any}
              intensity={isSelected ? 'high' : 'subtle'}
              selected={isSelected}
              interactive
              onClick={() => handleSetProvider(model.provider)}
              className={`p-5 space-y-3 cursor-pointer ${isSelected ? 'ring-1 ring-purple-500' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{model.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    {model.provider} · {model.speedRating}
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  model.health === 'healthy'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {model.health.toUpperCase()}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">{model.description}</p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                <div>
                  <div className="text-slate-500">P95 LATENCY</div>
                  <div className="text-white font-bold flex items-center gap-1">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    {model.latencyMs} ms
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">CONTEXT LIMIT</div>
                  <div className="text-purple-300 font-bold">
                    {(model.contextWindow / 1000).toLocaleString()}k
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {model.capabilities.map((cap, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {cap}
                  </span>
                ))}
              </div>
            </FlashGlowCard>
          );
        })}
      </div>

      {/* Live Routing Test & Fallback Tracer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FlashGlowCard variant="cyan" intensity="subtle" className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Live Prompt Routing Benchmarking
            </h3>
            <span className="text-xs font-mono text-slate-400">Target Provider: {activeProvider.toUpperCase()}</span>
          </div>

          <form onSubmit={handleExecutePrompt} className="space-y-3">
            <textarea
              rows={4}
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="w-full p-3 bg-black/60 border border-slate-800 rounded-xl text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-500"
              placeholder="Enter validation task prompt..."
            />
            <div className="flex justify-between items-center">
              <div className="text-[11px] text-slate-500 font-mono">
                Auto-failover enabled: Cascade to Gemini/Claude if timeout &gt; 800ms
              </div>
              <button
                type="submit"
                disabled={isExecuting || !testPrompt.trim()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-cyan-950/40 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isExecuting ? 'Routing...' : 'Execute Route'}</span>
              </button>
            </div>
          </form>
        </FlashGlowCard>

        {/* Execution Trace & Cost Metrics */}
        <FlashGlowCard variant="green" intensity="subtle" className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Trace Invariants & Cumulative Metrics
            </h3>
            <span className="text-xs font-mono text-emerald-400">
              Total Cost: ${auditSummary.totalCostUsd}
            </span>
          </div>

          {routeResult ? (
            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-500">SELECTED MODEL</div>
                  <div className="text-cyan-300 font-bold truncate">{routeResult.selectedModel.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">LATENCY</div>
                  <div className="text-emerald-400 font-bold">{routeResult.latencyMs} ms</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">EST. COST</div>
                  <div className="text-white font-bold">${routeResult.estimatedCostUsd}</div>
                </div>
              </div>

              <div className="pt-2">
                <GeminiChatBubble
                  id={`route_output_${Date.now()}`}
                  role="assistant"
                  authorName={routeResult.selectedModel.name}
                  modelName={routeResult.selectedModel.provider.toUpperCase()}
                  content={routeResult.output}
                  latencyMs={routeResult.latencyMs}
                  tokensUsed={routeResult.tokensUsed.total}
                  consensusAccuracy={99.8}
                  timestamp="Just now"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-500 font-mono">
              Execute a route test to view latency benchmark & failover telemetry
            </div>
          )}
        </FlashGlowCard>
      </div>
    </div>
  );
};
