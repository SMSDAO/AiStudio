import React, { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Code2, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Send, 
  Terminal, 
  Share2, 
  Layers,
  ShieldCheck,
  RefreshCw,
  Bug,
  Gauge,
  Palette,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Cpu,
  RotateCcw,
  Shield
} from 'lucide-react';
import { AppItem, BrandAssetStyle, CodeDebugResult, PerformanceOptimizationResult } from '../types';
import { 
  BRAND_PALETTES, 
  generateDiverseBrandAssets, 
  debugCodeAst, 
  suggestPerformanceOptimizations 
} from '../services/agentService';
import { ArcadeSimulator } from './simulators/ArcadeSimulator';
import { TippingSimulator } from './simulators/TippingSimulator';
import { MemeSimulator } from './simulators/MemeSimulator';
import { CasinoSimulator } from './simulators/CasinoSimulator';
import { PredictionSimulator } from './simulators/PredictionSimulator';
import { MiniappPreviewErrorBoundary } from './ErrorBoundary';
import confetti from 'canvas-confetti';

interface Props {
  app: AppItem;
  onUpdateApp?: (updatedApp: AppItem) => void;
  onClaimFees?: (appId: string) => void;
}

export function InteractiveMiniappSimulator({ app, onUpdateApp, onClaimFees }: Props) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'tools' | 'manifest' | 'wallet'>('preview');
  const [activeToolSubTab, setActiveToolSubTab] = useState<'debugger' | 'perf' | 'brand'>('debugger');
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'desktop'>('mobile');
  const [selectedFile, setSelectedFile] = useState<string>('page.tsx');
  const [copied, setCopied] = useState(false);
  const [chatPrompt, setChatPrompt] = useState('');
  const [isIterating, setIsIterating] = useState(false);

  // Advanced Tools States
  const [isDebugging, setIsDebugging] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [debugResult, setDebugResult] = useState<CodeDebugResult>(
    app.debugReport || debugCodeAst(app.files, app.type)
  );
  const [perfResult, setPerfResult] = useState<PerformanceOptimizationResult>(
    app.perfReport || suggestPerformanceOptimizations(app.files, app.type)
  );

  // Diverse Brand Studio States
  const [brandStyle, setBrandStyle] = useState<BrandAssetStyle>(
    app.brandKit?.logoStyle || 'cyber_minimalist'
  );
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>('cyber_neon');
  const [brandKitPreview, setBrandKitPreview] = useState(
    app.brandKit || generateDiverseBrandAssets(app.name, brandStyle, selectedPaletteId)
  );
  const [brandApplied, setBrandApplied] = useState(false);

  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: `Initialized ${app.name} with Base L2 contracts, Farcaster Frames v2 manifest, and Clanker 60% fee sharing pool. What would you like to refine?`,
      time: 'Ready',
    },
  ]);

  const handleCopyCode = () => {
    const content = app.files[selectedFile] || '// No code found';
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleIterate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt.trim() || isIterating) return;

    const userMsg = chatPrompt.trim();
    setChatPrompt('');
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Just now' },
    ]);
    setIsIterating(true);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let agentReply = `Agent executed prompt: "${userMsg}". `;

      // Dynamic iteration triggers
      if (lower.includes('speed') || lower.includes('faster') || lower.includes('obstacle')) {
        agentReply += `Updated physics tick loop and increased hazard frequency on Base L2 leaderboard.`;
      } else if (lower.includes('fee') || lower.includes('percent') || lower.includes('revenue')) {
        agentReply += `Verified Clanker fee splitter: 60% creator fees strictly locked in Solidity contract.`;
      } else if (lower.includes('brand') || lower.includes('color') || lower.includes('style')) {
        agentReply += `Updated theme palette across responsive web and Farcaster frames.`;
      } else {
        agentReply += `Refined Next.js 15 App Router components and verified Web Vitals.`;
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: 'agent', text: agentReply, time: 'Just now' },
      ]);
      setIsIterating(false);

      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      } catch {
        // ignore
      }
    }, 1200);
  };

  // Re-run AST Code Debugger
  const handleRunDebugger = () => {
    setIsDebugging(true);
    setTimeout(() => {
      const result = debugCodeAst(app.files, app.type);
      setDebugResult(result);
      setIsDebugging(false);
      try {
        confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }, 800);
  };

  // Re-run Performance & Gas Optimizer
  const handleRunOptimizer = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const result = suggestPerformanceOptimizations(app.files, app.type);
      setPerfResult(result);
      setIsOptimizing(false);
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }, 800);
  };

  // Update brand style preview
  const handleSelectBrandStyle = (style: BrandAssetStyle) => {
    setBrandStyle(style);
    const newKit = generateDiverseBrandAssets(app.name, style, selectedPaletteId);
    setBrandKitPreview(newKit);
  };

  // Update brand palette preview
  const handleSelectPalette = (paletteId: string) => {
    setSelectedPaletteId(paletteId);
    const newKit = generateDiverseBrandAssets(app.name, brandStyle, paletteId);
    setBrandKitPreview(newKit);
  };

  // Apply new Brand to the live App
  const handleApplyBrand = () => {
    if (!onUpdateApp) return;

    let neonBorderColor: AppItem['neonBorderColor'] = 'purple';
    if (selectedPaletteId === 'solar_punk') neonBorderColor = 'green';
    else if (selectedPaletteId === 'sunset_vaporwave') neonBorderColor = 'orange';
    else if (selectedPaletteId === 'deep_sea_matrix') neonBorderColor = 'blue';
    else if (selectedPaletteId === 'acid_laser') neonBorderColor = 'yellow';

    const updated: AppItem = {
      ...app,
      brandKit: brandKitPreview,
      accentColor: brandKitPreview.primaryColor,
      neonBorderColor,
      farcasterManifest: {
        ...app.farcasterManifest,
        iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(brandKitPreview.badgeIcon)}`,
        splashBackgroundColor: brandKitPreview.backgroundColor,
      },
    };

    onUpdateApp(updated);
    setBrandApplied(true);
    setTimeout(() => setBrandApplied(false), 2500);

    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
  };

  const renderActiveSimulator = () => {
    switch (app.type) {
      case 'arcade':
        return <ArcadeSimulator app={app} />;
      case 'tipping':
        return <TippingSimulator app={app} />;
      case 'meme':
        return <MemeSimulator app={app} />;
      case 'casino':
        return <CasinoSimulator app={app} />;
      case 'prediction':
        return <PredictionSimulator app={app} />;
      default:
        return <ArcadeSimulator app={app} />;
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Interactive Mobile Phone Simulator Bezel */}
      <div className="lg:col-span-5 flex flex-col items-center">
        {/* Device Mode Switcher */}
        <div className="flex items-center space-x-2 mb-3 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setDeviceFrame('mobile')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 font-semibold transition-all ${
              deviceFrame === 'mobile'
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Frame</span>
          </button>
          <button
            onClick={() => setDeviceFrame('desktop')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 font-semibold transition-all ${
              deviceFrame === 'desktop'
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Web Container</span>
          </button>
        </div>

        {/* The Mobile Bezel Frame */}
        <div 
          className={`relative transition-all duration-300 ${
            deviceFrame === 'mobile' 
              ? 'w-full max-w-[360px] rounded-[42px] p-3.5 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-4 border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(168,85,247,0.2)]'
              : 'w-full rounded-2xl p-2 bg-slate-900/90 border border-slate-700 shadow-2xl'
          }`}
        >
          {/* Dynamic Island / Speaker Notch for Mobile */}
          {deviceFrame === 'mobile' && (
            <div className="w-full flex justify-center mb-2">
              <div className="w-24 h-4 rounded-full bg-black/90 border border-white/10 flex items-center justify-between px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[8px] font-mono text-slate-400">VINI-OS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              </div>
            </div>
          )}

          {/* Screen Content Wrapper */}
          <div className="w-full bg-[#070913] rounded-[32px] overflow-hidden border border-white/10 relative min-h-[580px] flex flex-col justify-between">
            {/* Top Status Bar in Phone */}
            <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-950/40">
              <span className="text-white font-bold">{app.name}</span>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 font-semibold">BASE L2</span>
              </div>
            </div>

            {/* Playable Interactive Core Simulator protected by Error Boundary */}
            <div className="flex-1 flex flex-col p-2">
              <MiniappPreviewErrorBoundary>
                {renderActiveSimulator()}
              </MiniappPreviewErrorBoundary>
            </div>

            {/* Bottom Bar in Simulator */}
            <div className="p-2 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>{app.token?.symbol || '$APP'} • 60% CUT</span>
              <span className="text-cyan-400 font-bold">FARCASTER V2</span>
            </div>
          </div>
        </div>

        {/* Live URL Link */}
        <div className="mt-3 flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span>URL:</span>
          <a 
            href={app.vercelDeployUrl}
            target="_blank" 
            rel="noreferrer"
            className="text-cyan-400 hover:underline flex items-center space-x-1"
          >
            <span>{app.slug}.vini.run</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Right Column: Code Tabs, AI Tools Workbench, Farcaster Manifest, Token Metrics, and Live AI Iteration Chat */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        {/* Top Control Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'preview'
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                  : 'text-slate-400 hover:text-white bg-slate-900/40'
              }`}
            >
              ⚡ AI Iteration Chat
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                activeTab === 'tools'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_14px_rgba(6,182,212,0.6)]'
                  : 'text-slate-300 hover:text-white bg-cyan-950/40 border border-cyan-500/30'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-300" />
              <span>AI Tools & Optimizers</span>
              <span className="text-[9px] px-1 rounded bg-cyan-400/20 text-cyan-300 font-mono">NEW</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'code'
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                  : 'text-slate-400 hover:text-white bg-slate-900/40'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 inline mr-1" />
              Source Code
            </button>
            <button
              onClick={() => setActiveTab('manifest')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'manifest'
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                  : 'text-slate-400 hover:text-white bg-slate-900/40'
              }`}
            >
              Farcaster Manifest
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'wallet'
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                  : 'text-slate-400 hover:text-white bg-slate-900/40'
              }`}
            >
              App Wallet & Fees
            </button>
          </div>

          {activeTab === 'code' && (
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>

        {/* Tab 1: AI Chat Iteration Loop */}
        {activeTab === 'preview' && (
          <div className="glass-card p-4 border border-purple-500/30 rounded-2xl flex flex-col h-[520px]">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-purple-600/30 border border-purple-500 flex items-center justify-center text-purple-300 text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Vibe Coding Agent</div>
                  <div className="text-[10px] text-slate-400">Real-time hot-reloading code synthesizer</div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30">
                Agent v4.2 Active
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <div className="text-xs leading-relaxed">{msg.text}</div>
                    <div className="text-[9px] text-slate-400 mt-1 text-right">{msg.time}</div>
                  </div>
                </div>
              ))}
              {isIterating && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-3 text-xs text-purple-300 flex items-center space-x-2 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>Agent analyzing AST tree, tuning Base smart contracts & rebuilding...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick iteration chips */}
            <div className="flex items-center space-x-1.5 py-2 overflow-x-auto no-scrollbar">
              {[
                'Add Dark Neon Glow FX',
                'Increase multiplier to 2.5x',
                'Verify 60% Creator Fee Split',
                'Optimize Base Gas consumption',
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setChatPrompt(chip)}
                  className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 text-[11px] text-slate-300 hover:text-white transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleIterate} className="flex items-center space-x-2 pt-2 border-t border-white/10">
              <input
                type="text"
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                placeholder="Ask AI agent to modify code, add features, or restyle..."
                className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                disabled={isIterating || !chatPrompt.trim()}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs flex items-center space-x-1 shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Iterate</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: AI Tools & Optimizers Workbench (NEW EXPANDED TOOLSET) */}
        {activeTab === 'tools' && (
          <div className="glass-card p-4 border border-cyan-500/40 rounded-2xl flex flex-col h-[520px] overflow-hidden">
            {/* Sub-tools Tab Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setActiveToolSubTab('debugger')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                    activeToolSubTab === 'debugger'
                      ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                      : 'text-slate-400 hover:text-white bg-slate-900'
                  }`}
                >
                  <Bug className="w-3.5 h-3.5 text-purple-300" />
                  <span>AST Code Debugger</span>
                </button>
                <button
                  onClick={() => setActiveToolSubTab('perf')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                    activeToolSubTab === 'perf'
                      ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                      : 'text-slate-400 hover:text-white bg-slate-900'
                  }`}
                >
                  <Gauge className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Performance & Gas</span>
                </button>
                <button
                  onClick={() => setActiveToolSubTab('brand')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                    activeToolSubTab === 'brand'
                      ? 'bg-green-600 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                      : 'text-slate-400 hover:text-white bg-slate-900'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 text-green-300" />
                  <span>Diverse Brand Assets</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                Agent Chained Tools
              </span>
            </div>

            {/* Sub-tool 1: Code AST Debugger */}
            {activeToolSubTab === 'debugger' && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-purple-500/30">
                  <div>
                    <div className="text-white font-bold flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-green-400" />
                      <span>AST Static Analyzer & Security Verification</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Lint Score: <strong className="text-green-400">{debugResult.lintScore}/100</strong> • Last audited at {debugResult.timestamp}
                    </div>
                  </div>
                  <button
                    onClick={handleRunDebugger}
                    disabled={isDebugging}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs flex items-center space-x-1 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isDebugging ? 'animate-spin' : ''}`} />
                    <span>{isDebugging ? 'Scanning AST...' : 'Re-run Debugger'}</span>
                  </button>
                </div>

                {/* Security Checks */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Smart Contract & Architecture Security:</div>
                  <div className="grid grid-cols-1 gap-2">
                    {debugResult.securityChecks.map((sec, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-slate-200">{sec.check}</div>
                          <div className="text-[11px] text-slate-400">{sec.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* State Mutation & Memory Audit */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
                  <div className="text-[11px] font-mono text-purple-300 font-bold">State Mutation & Lifecycle Audit:</div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <div>• <strong>Component Purity:</strong> {debugResult.stateMutationsAudit.purityCheck}</div>
                    <div>• <strong>Hook Dependencies:</strong> {debugResult.stateMutationsAudit.hookDependencies}</div>
                    <div>• <strong>Memory Safety:</strong> {debugResult.stateMutationsAudit.memoryLeaks}</div>
                  </div>
                </div>

                {/* Code Issue Log */}
                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">AST Syntax Check Details:</div>
                  {debugResult.issues.map((iss, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-2 text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-blue-950 text-cyan-300 font-mono text-[9px] uppercase font-bold">
                        {iss.severity}
                      </span>
                      <div className="flex-1">
                        <span className="font-mono text-purple-300">{iss.file}:{iss.line}</span> — {iss.message}
                        <div className="text-slate-400 text-[10px] mt-0.5">{iss.suggestion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tool 2: Performance & Gas Optimizer */}
            {activeToolSubTab === 'perf' && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30">
                  <div>
                    <div className="text-white font-bold flex items-center space-x-1.5">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>Edge Performance & Base L2 Gas Analyzer</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Bundle Score: <strong className="text-cyan-400">{perfResult.bundleScore}/100</strong> • Est. Size: <strong>{perfResult.bundleEstimatedKb} KB</strong>
                    </div>
                  </div>
                  <button
                    onClick={handleRunOptimizer}
                    disabled={isOptimizing}
                    className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs flex items-center space-x-1 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
                    <span>{isOptimizing ? 'Analyzing...' : 'Re-analyze Gas'}</span>
                  </button>
                </div>

                {/* Web Vitals Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 font-mono">FCP (First Paint)</div>
                    <div className="text-xs font-bold text-green-400 font-mono">{perfResult.webVitals.fcp}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 font-mono">LCP (Contentful)</div>
                    <div className="text-xs font-bold text-green-400 font-mono">{perfResult.webVitals.lcp}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 font-mono">CLS (Shift)</div>
                    <div className="text-xs font-bold text-cyan-400 font-mono">{perfResult.webVitals.cls}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 font-mono">TBT (Blocking)</div>
                    <div className="text-xs font-bold text-purple-400 font-mono">{perfResult.webVitals.tbt}</div>
                  </div>
                </div>

                {/* Render & Gas Optimization Recommendations */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">AI Optimization Advices:</div>
                  {perfResult.renderOptimizationTips.map((tip, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white font-mono text-xs">{tip.component}</span>
                        <span className="px-2 py-0.5 rounded bg-green-950/60 text-green-300 font-mono text-[10px] border border-green-500/30">
                          {tip.estimatedSavings}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{tip.recommendation}</p>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-300 font-mono">
                  ⛽ Base L2 Average Gas Per Transaction: <strong>{perfResult.estimatedGasGwei} ETH</strong> (~$0.0002) with 60% fee accrual.
                </div>
              </div>
            )}

            {/* Sub-tool 3: Diverse Brand Asset Studio */}
            {activeToolSubTab === 'brand' && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {/* Style Selector Chips */}
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    1. Select Vector Logo Style:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'cyber_minimalist', label: 'Cyber Minimalist' },
                      { id: 'neo_retro_pixel', label: 'Neo-Retro Pixel' },
                      { id: 'holographic_3d', label: 'Holographic 3D' },
                      { id: 'gradient_emblem', label: 'Gradient Emblem' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => handleSelectBrandStyle(st.id as BrandAssetStyle)}
                        className={`p-2 rounded-xl text-xs font-semibold transition-all border text-center ${
                          brandStyle === st.id
                            ? 'bg-green-600/30 border-green-400 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Palette Selector */}
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    2. Select Neon Palette:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {BRAND_PALETTES.map((pal) => (
                      <button
                        key={pal.id}
                        onClick={() => handleSelectPalette(pal.id)}
                        className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                          selectedPaletteId === pal.id
                            ? 'bg-slate-900 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex -space-x-1">
                          <span className="w-3.5 h-3.5 rounded-full border border-black" style={{ backgroundColor: pal.primary }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-black" style={{ backgroundColor: pal.secondary }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-black" style={{ backgroundColor: pal.accent }} />
                        </div>
                        <span className="text-[11px] truncate font-mono font-medium">{pal.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live SVG Render Preview */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-white text-xs font-bold">Synthesized Brand Assets Preview:</span>
                    <span className="text-[10px] font-mono text-green-400 font-bold">{brandKitPreview.paletteName}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    {/* Vector Logo */}
                    <div className="p-2 rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center">
                      <div className="w-20 h-20" dangerouslySetInnerHTML={{ __html: brandKitPreview.svgLogo }} />
                      <span className="text-[9px] font-mono text-slate-400 mt-1">SVG Vector Logo</span>
                    </div>

                    {/* App Icon Badge */}
                    <div className="p-2 rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-center">
                      <div className="w-12 h-12" dangerouslySetInnerHTML={{ __html: brandKitPreview.badgeIcon }} />
                      <span className="text-[9px] font-mono text-slate-400 mt-2">Farcaster App Icon</span>
                    </div>

                    {/* Palette Swatches & Actions */}
                    <div className="space-y-2">
                      <div className="space-y-1 text-[11px] font-mono text-slate-300">
                        <div>Primary: <strong style={{ color: brandKitPreview.primaryColor }}>{brandKitPreview.primaryColor}</strong></div>
                        <div>Secondary: <strong style={{ color: brandKitPreview.secondaryColor }}>{brandKitPreview.secondaryColor}</strong></div>
                        <div>Accent: <strong style={{ color: brandKitPreview.accentColor }}>{brandKitPreview.accentColor}</strong></div>
                      </div>

                      <button
                        onClick={handleApplyBrand}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-slate-950 font-bold text-xs uppercase font-mono shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{brandApplied ? 'Brand Applied! 🎉' : 'Apply Brand to App'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Code Explorer */}
        {activeTab === 'code' && (
          <div className="glass-card border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[520px]">
            {/* File List Header */}
            <div className="flex items-center space-x-1 p-2 bg-slate-950/80 border-b border-white/10 overflow-x-auto no-scrollbar">
              {Object.keys(app.files).map((fileName) => (
                <button
                  key={fileName}
                  onClick={() => setSelectedFile(fileName)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    selectedFile === fileName
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {fileName}
                </button>
              ))}
            </div>

            {/* Code Content */}
            <div className="flex-1 p-3 overflow-auto bg-[#070913] font-mono text-xs text-slate-300 leading-relaxed">
              <pre className="whitespace-pre">
                {app.files[selectedFile] || '// No code found in this file'}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Farcaster Manifest */}
        {activeTab === 'manifest' && (
          <div className="glass-card p-4 border border-cyan-500/30 rounded-2xl h-[520px] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="text-xs font-bold text-white flex items-center space-x-2">
                <span className="text-cyan-400 font-mono">farcaster.json</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-[10px] text-cyan-300">
                  Frames v2 Compliant
                </span>
              </div>
              <span className="text-xs text-green-400 font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Domain Verified</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Frame Name</div>
                <div className="font-semibold text-white">{app.farcasterManifest.name}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Button CTA</div>
                <div className="font-semibold text-white">{app.farcasterManifest.buttonTitle}</div>
              </div>
              <div className="col-span-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Home Target URL</div>
                <div className="font-mono text-cyan-300 break-all">{app.farcasterManifest.homeUrl}</div>
              </div>
              <div className="col-span-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Account Association Payload</div>
                <div className="font-mono text-[10px] text-slate-400 break-all">
                  {`{"header":"eyJmaWQiOjk4MiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDYxYjgzIn0","domain":"${app.slug}.vini.run"}`}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-300">
              💡 <strong>Farcaster Mini Apps</strong> open directly in Warpcast feed without leaving the timeline. 60% of all in-frame microtransactions stream to your App Wallet.
            </div>
          </div>
        )}

        {/* Tab 5: App Wallet & Fees */}
        {activeTab === 'wallet' && (
          <div className="glass-card p-4 border border-green-500/30 rounded-2xl h-[520px] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <div className="text-xs font-bold text-white">App Smart Wallet (Base L2)</div>
                <div className="text-[10px] text-slate-400">Dedicated smart contract wallet for {app.name}</div>
              </div>
              <div className="text-xs font-mono text-green-400 bg-green-950/60 px-2 py-0.5 rounded-full border border-green-500/30">
                Gas Sponsored
              </div>
            </div>

            {/* Wallet Address Banner */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400">Contract Address</div>
                <div className="text-xs font-mono text-cyan-300">{app.wallet.address}</div>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(app.wallet.address);
                  alert('Address copied to clipboard!');
                }}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Balance cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">ETH Balance</div>
                <div className="text-sm font-bold font-mono text-white">{app.wallet.ethBalance.toFixed(3)} ETH</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">USDC Balance</div>
                <div className="text-sm font-bold font-mono text-green-400">${app.wallet.usdcBalance.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">{app.token?.symbol || '$APP'}</div>
                <div className="text-sm font-bold font-mono text-purple-400">
                  {app.wallet.tokenBalance.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Accrued Creator Fees 60% */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-green-950/50 border border-green-500/40 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-green-400 font-bold font-mono">
                    UNCLAIMED 60% TRADING FEES
                  </div>
                  <div className="text-xl font-extrabold text-white font-mono">
                    {app.wallet.unclaimedFeesEth.toFixed(4)} ETH{' '}
                    <span className="text-xs text-slate-400 font-normal">
                      (~${(app.wallet.unclaimedFeesEth * 3340).toFixed(2)})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onClaimFees && onClaimFees(app.id)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:brightness-110 active:scale-95 transition-all"
                >
                  CLAIM 60% FEES 💸
                </button>
              </div>
              <div className="text-[10px] text-slate-400">
                Accrued from Clanker Uniswap v4 bonding curve swaps & miniapp micro-transactions.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
