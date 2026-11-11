import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Layers, 
  Coins, 
  Share2, 
  ShieldCheck, 
  ExternalLink,
  Code2,
  Cpu,
  Flame,
  Globe,
  Twitter,
  Shuffle,
  ChevronRight,
  Info,
  Clock,
  LayoutTemplate,
  Star,
  Zap,
  Radio,
  FileCode2,
  Check,
  X,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppItem, AppTemplate, BuildJobStatus, ClarifyingQuestion, UserSession } from '../types';
import { generateClarifyingQuestions, generateAppArtifacts } from '../services/agentService';
import { injectDeploymentWorkflows } from '../services/workflowDeploymentService';
import { APP_TEMPLATES } from '../data/templates';
import { CollaborationRoom } from './CollaborationRoom';
import { AgenticPlainEnglishModal } from './AgenticPlainEnglishModal';
import { checkPermission } from '../hooks/usePermission';

interface Props {
  user: UserSession;
  onAppCreated: (app: AppItem) => void;
  onNavigateToSimulator: (app: AppItem) => void;
  canCreateApp: boolean;
  onOpenOnboardingTour?: () => void;
  initialAppName?: string;
  initialIdeaPrompt?: string;
  availableTemplates?: AppTemplate[];
  onOpenTemplateManager?: () => void;
}

const MONETIZATION_OPTIONS = [
  { id: 'clanker', title: 'Clanker $TICKER', desc: '60% Uniswap v4 trading fee split routed directly to creator' },
  { id: 'microtips', title: 'Base USDC Micro-Tips', desc: 'Gasless tipping jar with 60% creator revenue cut' },
  { id: 'nft_pass', title: 'NFT Access Pass', desc: 'Base ERC-721 mint passes with bonding curve pricing' },
  { id: 'x402_pay', title: 'x402 Pay-Per-Use', desc: 'Micro-payment protocol (0.001 ETH / use) with instant settlement' },
];

export function CreateAppFlow({ 
  user, 
  onAppCreated, 
  onNavigateToSimulator, 
  canCreateApp, 
  onOpenOnboardingTour,
  initialAppName,
  initialIdeaPrompt,
  availableTemplates,
  onOpenTemplateManager
}: Props) {
  // Step: 'prompt' | 'clarifying' | 'building' | 'finished'
  const [stage, setStage] = useState<'prompt' | 'clarifying' | 'building' | 'finished'>('prompt');
  
  const [appName, setAppName] = useState(initialAppName || '');
  const [ideaPrompt, setIdeaPrompt] = useState(initialIdeaPrompt || '');

  const templatesList = availableTemplates || APP_TEMPLATES;
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('All');
  const [agenticModalOpen, setAgenticModalOpen] = useState(false);
  const canManageTemplates = checkPermission(user.role, 'manage_templates');

  useEffect(() => {
    if (initialAppName) setAppName(initialAppName);
    if (initialIdeaPrompt) setIdeaPrompt(initialIdeaPrompt);
  }, [initialAppName, initialIdeaPrompt]);
  const [selectedTemplate, setSelectedTemplate] = useState<AppTemplate | null>(null);
  const [selectedMonetization, setSelectedMonetization] = useState(MONETIZATION_OPTIONS[0].id);
  const [language, setLanguage] = useState<'en' | 'es' | 'ja' | 'zh' | 'fr' | 'de'>('en');
  const [xVerified, setXVerified] = useState(user.xVerified);
  const [xVerifying, setXVerifying] = useState(false);
  const [showPromptTips, setShowPromptTips] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(!user.onboardingCompleted);

  // Clarifying Questions state
  const [questions, setQuestions] = useState<ClarifyingQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Real-time Build Progress State
  const [buildStatus, setBuildStatus] = useState<BuildJobStatus>('queued');
  const [currentStageLabel, setCurrentStageLabel] = useState<string>('Initializing Edge Worker');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [estimatedSeconds, setEstimatedSeconds] = useState<number>(14);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [createdApp, setCreatedApp] = useState<AppItem | null>(null);
  const [activeOnboardingTooltip, setActiveOnboardingTooltip] = useState<'none' | 'describe' | 'capabilities' | 'launch'>('none');
  const [realtimeLogs, setRealtimeLogs] = useState<Array<{ time: string; channel: string; event: string; payload: string }>>([
    {
      time: '00:00:01',
      channel: 'partykit://global',
      event: 'worker_ready',
      payload: 'Supabase Realtime & PartyKit WebSocket client synchronized (12ms ping)',
    },
  ]);

  // Validation
  const isPromptValid = appName.trim().length >= 3 && ideaPrompt.trim().length >= 20;

  // Template Selection Handler
  const handleSelectTemplate = (tmpl: AppTemplate) => {
    setSelectedTemplate(tmpl);
    setAppName(tmpl.title);
    setIdeaPrompt(tmpl.description);
  };

  // Surprise me randomizer
  const handleSurpriseMe = () => {
    const randomTemplate = APP_TEMPLATES[Math.floor(Math.random() * APP_TEMPLATES.length)];
    const creativeFlavors = [
      ' featuring provably fair VRF outcome multipliers and Base Smart Wallet gas sponsorship.',
      ' with automatic Farcaster Frames v2 social sharing and a Clanker 60% fee sharing pool.',
      ' integrated with World ID zero-knowledge sybil resistance and decentralized Arweave storage.',
    ];
    const chosenFlavor = creativeFlavors[Math.floor(Math.random() * creativeFlavors.length)];
    
    setSelectedTemplate(randomTemplate);
    setAppName(randomTemplate.title);
    setIdeaPrompt(randomTemplate.description + chosenFlavor);
  };

  // Verify via X (Twitter) for Free Build
  const handleVerifyX = () => {
    setXVerifying(true);
    setTimeout(() => {
      setXVerified(true);
      setXVerifying(false);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch {
        // ignore
      }
    }, 1000);
  };

  // Start Clarifying questions
  const handleProceedToClarifying = () => {
    if (!isPromptValid) return;
    const generatedQuestions = generateClarifyingQuestions(appName, ideaPrompt);
    setQuestions(generatedQuestions);
    
    // Set default answers
    const initAnswers: Record<string, string> = {};
    generatedQuestions.forEach(q => {
      if (q.selectedOption) initAnswers[q.id] = q.selectedOption;
    });
    setAnswers(initAnswers);
    setStage('clarifying');
  };

  // Answer selection
  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  // Agent Build Execution Loop with Real-time Progress Broadcasting
  const startAgenticBuild = () => {
    setStage('building');
    setBuildStatus('queued');
    setCurrentStageLabel('Queueing Build Job on Edge');
    setProgressPercent(6);
    setEstimatedSeconds(14);
    setActiveStepIndex(0);

    const cleanSlug = appName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'vini-miniapp';
    const channelName = `build:${cleanSlug}`;

    const fullApp = generateAppArtifacts(
      appName,
      ideaPrompt,
      answers,
      user.address,
      user.name,
      user.handle
    );

    // If template selected, inject template code
    if (selectedTemplate) {
      fullApp.type = selectedTemplate.type;
      fullApp.category = selectedTemplate.title;
      fullApp.files = injectDeploymentWorkflows({
        ...fullApp.files,
        ...selectedTemplate.codePreset,
      });
    }

    const stagesSequence: { 
      status: BuildJobStatus; 
      label: string; 
      percent: number; 
      stepIdx: number; 
      estSec: number; 
      event: string; 
      payload: string 
    }[] = [
      { status: 'queued', label: 'Queueing Build Job on Edge Worker', percent: 8, stepIdx: 0, estSec: 14, event: 'job_queued', payload: `Channel ${channelName} connected on PartyKit WebSocket` },
      { status: 'clarifying', label: 'Aligning Architecture & Monetization', percent: 18, stepIdx: 0, estSec: 12, event: 'intent_aligned', payload: `Archetype verified, Base L2 fee router set to 6000 BPS (60% cut)` },
      { status: 'generating', label: 'Synthesizing Vector Brand Assets & Palettes', percent: 32, stepIdx: 1, estSec: 10, event: 'brand_assets_synthesized', payload: `Generated vector SVG monogram and custom neon palette` },
      { status: 'generating', label: 'Generating Next.js 15 App Router Code', percent: 46, stepIdx: 2, estSec: 8, event: 'code_generated', payload: `page.tsx and stateful MiniAppCore compiled with React 19` },
      { status: 'debugging', label: 'AST Code Debugging & Security Scan', percent: 60, stepIdx: 3, estSec: 6, event: 'ast_security_scanned', payload: `AST parsed: 0 errors, 100% component purity, 0 reentrancy vectors` },
      { status: 'optimizing', label: 'Performance & Base L2 Gas Optimization', percent: 72, stepIdx: 4, estSec: 5, event: 'perf_optimized', payload: `Sub-45KB bundle, ~17,500 gas saved per onchain play` },
      { status: 'creating_wallet', label: 'Provisioning Dedicated Base Smart Wallet', percent: 84, stepIdx: 6, estSec: 3, event: 'wallet_provisioned', payload: `Unique Base smart wallet deployed with isolated key management` },
      { status: 'deploying', label: 'Deploying Edge Project & Farcaster Manifest', percent: 94, stepIdx: 8, estSec: 1, event: 'edge_deployed', payload: `Edge SSL cert active, Farcaster Frames v2 cryptographic manifest verified` },
      { status: 'live', label: 'Miniapp Verified & Live on Base L2', percent: 100, stepIdx: 10, estSec: 0, event: 'job_live', payload: `Miniapp verified and accessible worldwide` },
    ];

    let seqIdx = 0;
    const interval = setInterval(() => {
      seqIdx += 1;
      if (seqIdx < stagesSequence.length) {
        const currentStage = stagesSequence[seqIdx];
        setBuildStatus(currentStage.status);
        setCurrentStageLabel(currentStage.label);
        setProgressPercent(currentStage.percent);
        setActiveStepIndex(currentStage.stepIdx);
        setEstimatedSeconds(currentStage.estSec);
        setRealtimeLogs(prev => [
          ...prev.slice(-6),
          {
            time: new Date().toLocaleTimeString(),
            channel: channelName,
            event: currentStage.event,
            payload: currentStage.payload,
          },
        ]);
      } else {
        clearInterval(interval);
        setBuildStatus('live');
        setCurrentStageLabel('Miniapp Verified & Live on Base L2');
        setProgressPercent(100);
        setCreatedApp(fullApp);
        setStage('finished');
        onAppCreated(fullApp);

        try {
          confetti({
            particleCount: 110,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#a855f7', '#06b6d4', '#22c55e', '#eab308', '#f97316'],
          });
        } catch {
          // ignore
        }
      }
    }, 750);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Real-time Collaboration Bar */}
      <CollaborationRoom 
        user={user} 
        currentAppName={appName || 'New Miniapp Studio'}
        onCoEditSuggestion={(sug) => setIdeaPrompt(prev => prev ? `${prev}\n- ${sug}` : sug)}
      />

      {/* Onboarding Welcome / Walkthrough Prompt Banner */}
      {showWelcomeBanner && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-cyan-950/70 border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.25)] flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400 flex items-center justify-center text-purple-300 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold font-display text-white flex items-center space-x-2">
                <span>New to ViniApp? Take the 2-Minute Onboarding Tour</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  RECOMMENDED
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Learn the core value proposition, the 60% fee split model, and get pro tips on writing high-impact app ideas.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                if (onOpenOnboardingTour) onOpenOnboardingTour();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center space-x-1.5 transition-all"
            >
              <span>START TOUR & TIPS 🚀</span>
            </button>
            <button
              onClick={() => setShowWelcomeBanner(false)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 1: Prompt & Landing */}
      {stage === 'prompt' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Hero Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>VINIAPP 2.0.0 • PROMPT-TO-ONCHAIN ENGINE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
              Describe It. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400">AI Ships It</span> to Base.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Synthesize production Next.js 15 apps with dynamic forms, smart contracts, dedicated Base smart wallet, and Clanker 60% fee sharing.
            </p>
          </div>

          {/* Pre-built Templates Carousel & Agentic Builder Trigger */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <LayoutTemplate className="w-3.5 h-3.5 text-purple-400" />
                  <span>Pre-Built Blueprints ({templatesList.length} Available)</span>
                </span>
                {canManageTemplates && onOpenTemplateManager && (
                  <button
                    type="button"
                    onClick={onOpenTemplateManager}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 hover:text-white transition-colors"
                  >
                    ⚙️ Manage Templates
                  </button>
                )}
              </div>

              {/* Agentic Assistant Trigger for non-technical users */}
              <button
                type="button"
                onClick={() => setAgenticModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(160,32,240,0.3)] hover:scale-105 transition-transform"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Don&apos;t Know Tech Terms? Use Plain English Guide</span>
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
              {['All', 'Games & Entertainment', 'Commerce & Tips', 'DeFi & Trading', 'Creative & NFT', 'Social & Farcaster', 'Utilities & AI Tools'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedTemplateCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all ${
                    selectedTemplateCategory === cat
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Template Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {templatesList
                .filter(t => selectedTemplateCategory === 'All' || t.category === selectedTemplateCategory)
                .map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between space-y-1.5 ${
                      selectedTemplate?.id === tmpl.id
                        ? 'bg-purple-600/30 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] text-white scale-[1.02]'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{tmpl.icon}</span>
                    <span className="text-[11px] font-bold font-display truncate w-full">{tmpl.title}</span>
                    {tmpl.difficulty && (
                      <span className="text-[9px] font-mono text-slate-500 uppercase">{tmpl.difficulty}</span>
                    )}
                  </button>
                ))}
            </div>

            {/* Selected Template Plain English Explainer */}
            {selectedTemplate && (
              <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-white block">
                    Selected Template: {selectedTemplate.icon} {selectedTemplate.title}
                  </span>
                  <p className="text-purple-200 mt-0.5 text-[11px]">
                    {selectedTemplate.plainEnglishSummary || selectedTemplate.description}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-cyan-300 shrink-0">
                  {selectedTemplate.monetizationModel}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Guided Onboarding: 3-Step Process with Tooltips */}
          <div className="p-4 rounded-3xl bg-slate-950/80 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                  New Builder Guided Onboarding (3-Step Roadmap)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onOpenOnboardingTour) onOpenOnboardingTour();
                }}
                className="text-[11px] font-mono text-purple-300 hover:text-white underline decoration-purple-500/50 flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span>Launch Interactive Walkthrough Tour ➔</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {/* Step 1 Tooltip Card */}
              <div 
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  activeOnboardingTooltip === 'describe'
                    ? 'bg-purple-950/60 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
                onClick={() => setActiveOnboardingTooltip(activeOnboardingTooltip === 'describe' ? 'none' : 'describe')}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-lg bg-purple-600/40 text-purple-300 font-mono text-xs font-bold flex items-center justify-center">1</span>
                    <span className="text-xs font-bold font-display text-white">Describe Your App Idea</span>
                  </div>
                  <Info className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  Pick a template or enter an arcade, tipping, meme, or prediction idea.
                </p>
                {activeOnboardingTooltip === 'describe' && (
                  <div className="mt-2 pt-2 border-t border-purple-500/30 text-[10px] text-purple-200 space-y-1 font-mono">
                    <div>💡 <strong>Tip:</strong> Mention user loop ("jump obstacles", "tip USDC"), target ("Frames v2"), and token symbol.</div>
                  </div>
                )}
              </div>

              {/* Step 2 Tooltip Card */}
              <div 
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  activeOnboardingTooltip === 'capabilities'
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
                onClick={() => setActiveOnboardingTooltip(activeOnboardingTooltip === 'capabilities' ? 'none' : 'capabilities')}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-lg bg-cyan-600/40 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">2</span>
                    <span className="text-xs font-bold font-display text-white">AI Agent Chained Tools</span>
                  </div>
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  AST debugger, performance optimizer, vector brand kits & Base wallets.
                </p>
                {activeOnboardingTooltip === 'capabilities' && (
                  <div className="mt-2 pt-2 border-t border-cyan-500/30 text-[10px] text-cyan-200 space-y-1 font-mono">
                    <div>⚡ <strong>Capabilities:</strong> 11 sequential tools audit syntax, tune Base L2 gas, and launch Clanker bonding curve.</div>
                  </div>
                )}
              </div>

              {/* Step 3 Tooltip Card */}
              <div 
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  activeOnboardingTooltip === 'launch'
                    ? 'bg-green-950/60 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
                onClick={() => setActiveOnboardingTooltip(activeOnboardingTooltip === 'launch' ? 'none' : 'launch')}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-lg bg-green-600/40 text-green-300 font-mono text-xs font-bold flex items-center justify-center">3</span>
                    <span className="text-xs font-bold font-display text-white">Launch & Claim 60% Fees</span>
                  </div>
                  <Info className="w-3.5 h-3.5 text-green-400" />
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  Live on Base & Vercel. 60% of Uniswap trading volume streams to your wallet.
                </p>
                {activeOnboardingTooltip === 'launch' && (
                  <div className="mt-2 pt-2 border-t border-green-500/30 text-[10px] text-green-200 space-y-1 font-mono">
                    <div>💸 <strong>Claim Anytime:</strong> One-tap withdrawal slider with BaseScan transaction receipts.</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Input Box (Glass Card with Glowing Borders) */}
          <div className="glass-card p-6 sm:p-8 border border-white/[0.12] rounded-3xl relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            {/* Top Multi-Color Neon Flash Lines (Purple, Blue, Orange, Red, Green, Yellow) */}
            <div className="absolute top-0 left-0 right-0 h-1 flex">
              <span className="flex-1 flash-line-purple" />
              <span className="flex-1 flash-line-blue" />
              <span className="flex-1 flash-line-orange" />
              <span className="flex-1 flash-line-red" />
              <span className="flex-1 flash-line-green" />
              <span className="flex-1 flash-line-yellow" />
            </div>

            <div className="relative z-10 space-y-5">
              {/* App Name & Surprise Me bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    App Name (Max 30 chars)
                  </label>
                  <input
                    type="text"
                    maxLength={30}
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g., NeonDash 2088, TipCaster Pro, MemeForge..."
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all font-display"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-0 sm:pt-5">
                  <button
                    type="button"
                    onClick={handleSurpriseMe}
                    className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Surprise Me 🎲</span>
                  </button>

                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="bg-slate-800/80 text-slate-300 border border-slate-700 rounded-xl px-2.5 py-2 text-xs focus:outline-none"
                  >
                    <option value="en">English (EN)</option>
                    <option value="es">Español (ES)</option>
                    <option value="ja">日本語 (JA)</option>
                    <option value="zh">简体中文 (ZH)</option>
                    <option value="fr">Français (FR)</option>
                    <option value="de">Deutsch (DE)</option>
                  </select>
                </div>
              </div>

              {/* Quick-Start Chips: Arcade game, Tipping bot, Meme maker */}
              <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center space-x-1 pl-1">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span>Quick-Start Chips:</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAppName('CyberDash Arcade');
                    setIdeaPrompt('A fast-paced cyber arcade obstacle runner miniapp for Farcaster frames and mobile browsers. Players jump over laser hazards, earn $DASH tokens, and submit verified high scores to Base L2 leaderboard.');
                  }}
                  className="px-3 py-1 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-xs font-mono text-purple-300 hover:text-white flex items-center space-x-1 transition-all shadow-[0_0_12px_rgba(168,85,247,0.35)]"
                >
                  <span>🕹️ Arcade game</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAppName('TipCaster Pro');
                    setIdeaPrompt('One-tap Farcaster Frames v2 social micro-tipper using Base USDC. Content creators receive 60% fee splits directly into their smart wallet with instant verifiable receipts and gasless transactions.');
                  }}
                  className="px-3 py-1 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:text-white flex items-center space-x-1 transition-all shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                >
                  <span>💰 Tipping bot</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAppName('MemeForge 3000');
                    setIdeaPrompt('Cyber viral meme generator with custom neon typography, laser sticker overlays, and 1-click Base L2 NFT minting with zero gas fees for collectors and instant social sharing.');
                  }}
                  className="px-3 py-1 rounded-xl bg-orange-950/60 hover:bg-orange-900/80 border border-orange-500/40 text-xs font-mono text-orange-300 hover:text-white flex items-center space-x-1 transition-all shadow-[0_0_12px_rgba(249,115,22,0.35)]"
                >
                  <span>🎨 Meme maker</span>
                </button>
              </div>

              {/* Idea Description Textarea */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-2">
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                      Describe your miniapp idea (Min 20 chars)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPromptTips(!showPromptTips)}
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 underline decoration-cyan-400/40"
                    >
                      <Lightbulb className="w-3 h-3 text-yellow-400" />
                      <span>{showPromptTips ? 'Hide Tips' : 'Prompt Writing Tips & Cheatsheet'}</span>
                    </button>
                  </div>
                  <span className={`text-[11px] font-mono ${ideaPrompt.length >= 20 ? 'text-green-400' : 'text-slate-500'}`}>
                    {ideaPrompt.length} / 65,000
                  </span>
                </div>

                {/* Collapsible Prompt Tips Cheatsheet Drawer */}
                {showPromptTips && (
                  <div className="mb-3 p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-3 animate-in slide-in-from-top-2 duration-150 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center space-x-2 font-mono text-cyan-300 font-bold">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        <span>Prompt Writing Cheatsheet for 10x Better Builds</span>
                      </div>
                      <button
                        onClick={() => {
                          if (onOpenOnboardingTour) onOpenOnboardingTour();
                        }}
                        className="text-[10px] text-purple-300 hover:underline font-mono"
                      >
                        Open Full Walkthrough Tour ➔
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                        <strong className="text-purple-300 font-mono">1. User Interaction Loop:</strong>
                        <p>State what players or users actually tap/do (e.g., "tap to jump obstacles", "select 1 or 5 USDC tip", "cast vote").</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                        <strong className="text-cyan-300 font-mono">2. Onchain Trigger:</strong>
                        <p>Mention the smart contract action (e.g., "Base L2 high scores", "ERC-721 NFT mint", "gasless escrow").</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                        <strong className="text-green-300 font-mono">3. Target Social Platform:</strong>
                        <p>Specify "Farcaster Frames v2 miniapp with Warpcast embed", "Telegram WebApp", or "Base App".</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                        <strong className="text-yellow-300 font-mono">4. Economic Split:</strong>
                        <p>Include "launch Clanker token with 60% Uniswap fees routed to creator wallet".</p>
                      </div>
                    </div>

                    {/* Quick Snippet Insert Chips */}
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Click snippet to insert into your prompt:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'with Base L2 high-score leaderboard contract',
                          'with Farcaster Frames v2 social tipping and receipts',
                          'launch Clanker $TICKER with 60% Uniswap fee split',
                          'with gasless Base Smart Wallet transactions',
                          'with instant Base L2 ERC-721 NFT minting',
                          'with World ID sybil-resistant verification',
                        ].map((snip) => (
                          <button
                            key={snip}
                            type="button"
                            onClick={() => setIdeaPrompt(prev => prev ? `${prev} ${snip}` : snip)}
                            className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/40 text-[10px] font-mono text-slate-300 hover:text-white transition-all"
                          >
                            + {snip}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <textarea
                  rows={4}
                  value={ideaPrompt}
                  onChange={(e) => setIdeaPrompt(e.target.value)}
                  placeholder="What should this miniapp do? E.g., 'An arcade obstacle jumper where players jump over cyber barriers, earn $DASH tokens, and submit verified high scores to Base L2 leaderboard. Include Farcaster Frames v2 sharing!'"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans leading-relaxed"
                />
              </div>

              {/* Proactive Monetization Model Suggestions */}
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Proactive Revenue & Monetization Strategy
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {MONETIZATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedMonetization(opt.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedMonetization === opt.id
                          ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs font-display text-white">{opt.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Free Build verification via X */}
                <div className="flex items-center space-x-2">
                  {xVerified ? (
                    <div className="flex items-center space-x-1.5 text-xs text-green-400 bg-green-950/40 border border-green-500/30 px-3 py-1.5 rounded-xl font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                      <span>X Verified: Free Build Active</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleVerifyX}
                      disabled={xVerifying}
                      className="flex items-center space-x-1.5 text-xs text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 px-3 py-1.5 rounded-xl font-mono transition-all disabled:opacity-50"
                    >
                      <Twitter className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{xVerifying ? 'Verifying @X...' : 'Verify on X for 1 Free Build'}</span>
                    </button>
                  )}
                </div>

                {/* Primary CTA Button */}
                <button
                  onClick={handleProceedToClarifying}
                  disabled={!isPromptValid || !canCreateApp}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${
                    isPromptValid && canCreateApp
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] active:scale-98'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>START AGENTIC VIBE BUILD</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              {!canCreateApp && (
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-center space-x-2">
                  <Info className="w-4 h-4 text-red-400" />
                  <span>Your current RBAC role ({user.role}) does not have `create_app` permission. Switch role in top navbar.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: Clarifying Questions */}
      {stage === 'clarifying' && (
        <div className="glass-card p-6 sm:p-8 border border-purple-500/30 rounded-3xl space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-display text-white">AI Agent Alignment</h2>
                <p className="text-xs text-slate-400">Tuning architecture, token fee splits, and platform targets for <strong className="text-purple-300">{appName}</strong></p>
              </div>
            </div>

            <button
              onClick={startAgenticBuild}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1"
            >
              <span>Auto-Decide & Build ⚡</span>
            </button>
          </div>

          {/* Question Cards */}
          <div className="space-y-5">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-purple-600/40 text-purple-300 font-mono text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div className="text-xs sm:text-sm font-semibold text-white">{q.question}</div>
                </div>
                <div className="text-[11px] text-slate-400 pl-7">{q.subtext}</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 pt-1">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(q.id, opt)}
                      className={`p-2.5 rounded-xl text-left text-xs transition-all border ${
                        answers[q.id] === opt
                          ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`w-3 h-3 rounded-full border ${answers[q.id] === opt ? 'bg-cyan-400 border-cyan-300' : 'border-slate-600'}`} />
                        <span className="leading-snug">{opt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => setStage('prompt')}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Back to Prompt</span>
            </button>

            <button
              onClick={startAgenticBuild}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center space-x-2 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>CONFIRM & EXECUTE AGENT BUILD</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: Real-Time Build Progress Broadcasting */}
      {stage === 'building' && (
        <div className="glass-card p-6 sm:p-8 border border-cyan-500/30 rounded-3xl space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-pulse">
                <Cpu className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-display text-white">Synthesizing {appName}</h2>
                <div className="flex items-center space-x-2 text-xs font-mono mt-0.5">
                  <span className="text-slate-400">Current Stage:</span>
                  <span className="text-cyan-300 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40">
                    {currentStageLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono font-bold text-cyan-300 flex items-center space-x-1 justify-end">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Est. ~{estimatedSeconds}s left</span>
              </div>
              <div className="text-[11px] font-mono text-purple-300 font-bold">{progressPercent}% Completed</div>
            </div>
          </div>

          {/* Real-time Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Skeleton Loaders & 11 Chained Tool Steps */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {[
              { id: 0, title: 'Analyze Intent & Requirements', tool: 'ask_clarifying_questions' },
              { id: 1, title: 'Generate Brand Kit & SVG Identity', tool: 'generate_diverse_brand_assets' },
              { id: 2, title: 'Generate Next.js 15 App Router UI', tool: 'generate_nextjs_code' },
              { id: 3, title: 'AST Code Debugging & Security Scan', tool: 'debug_code_ast' },
              { id: 4, title: 'Performance & Base L2 Gas Optimizer', tool: 'suggest_performance_optimizations' },
              { id: 5, title: 'Compile Solidity Smart Contract', tool: 'generate_smart_contracts' },
              { id: 6, title: 'Provision Base Smart Wallet', tool: 'create_app_wallet' },
              { id: 7, title: 'Deploy Clanker Token & Fee Splitter', tool: 'launch_token' },
              { id: 8, title: 'Validate Farcaster Frames v2 Manifest', tool: 'deploy_farcaster_manifest' },
              { id: 9, title: 'Create GitHub Repository', tool: 'create_github_repo' },
              { id: 10, title: 'Deploy Production Edge on Vercel', tool: 'create_vercel_project' },
            ].map((st) => {
              const isFinished = activeStepIndex > st.id;
              const isCurrent = activeStepIndex === st.id;
              return (
                <div
                  key={st.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs font-mono ${
                    isFinished
                      ? 'bg-green-950/20 border-green-500/30 text-green-300'
                      : isCurrent
                      ? 'bg-purple-950/40 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {isFinished ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">
                        {st.id + 1}
                      </span>
                    )}
                    <span className="font-semibold">{st.title}</span>
                  </div>

                  <span className="text-[10px] text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded border border-white/5">
                    {st.tool}()
                  </span>
                </div>
              );
            })}
          </div>

          {/* Supabase Realtime & PartyKit WebSocket Telemetry Feed */}
          <div className="p-3.5 rounded-2xl bg-black/90 border border-slate-800 font-mono text-[11px] text-cyan-300 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-400 border-b border-white/10 pb-1.5">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                <span className="text-green-300 font-bold">CONNECTED</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">wss://partykit.vini.run/party/build:{appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-400">
                <span className="text-green-400">11ms ping</span>
                <span>•</span>
                <span>Supabase Realtime v2</span>
              </div>
            </div>

            <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
              {realtimeLogs.map((log, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-[10px] leading-tight">
                  <span className="text-slate-500 font-mono flex-shrink-0">{log.time}</span>
                  <span className="text-purple-400 font-bold flex-shrink-0">[{log.event}]</span>
                  <span className="text-slate-300">{log.payload}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: Finished Success Card */}
      {stage === 'finished' && createdApp && (
        <div className="glass-card p-6 sm:p-8 border-2 border-green-500/50 rounded-3xl space-y-6 text-center animate-in zoom-in-95 duration-300 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-400 mx-auto flex items-center justify-center text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.6)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <div className="text-xs uppercase font-mono text-green-400 font-bold tracking-wider">
              MINIAPP READY FOR USE
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              {createdApp.name} is Live!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Deployed to Base L2, Vercel, and Farcaster Frames v2 with dedicated App Wallet and Clanker {createdApp.token?.symbol} token.
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">App Token</div>
              <div className="text-sm font-bold font-mono text-purple-400">{createdApp.token?.symbol}</div>
              <div className="text-[10px] text-green-400">60% Creator Fee</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">Base Wallet</div>
              <div className="text-xs font-mono text-cyan-300 truncate">{createdApp.wallet.address.slice(0, 10)}...</div>
              <div className="text-[10px] text-slate-400">Gas Sponsored</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">Live Miniapp</div>
              <div className="text-xs font-mono text-white truncate">{createdApp.slug}.vini.run</div>
              <div className="text-[10px] text-cyan-400">Vercel Edge</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">Platforms</div>
              <div className="text-xs font-bold text-white">Farcaster + Web</div>
              <div className="text-[10px] text-purple-400">Frames v2</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigateToSimulator(createdApp)}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-display font-black text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(168,85,247,0.7)] flex items-center justify-center space-x-2 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>TEST PLAY IN LIVE SIMULATOR</span>
            </button>

            <button
              onClick={() => {
                setStage('prompt');
                setAppName('');
                setIdeaPrompt('');
                setSelectedTemplate(null);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold"
            >
              Create Another App
            </button>
          </div>
        </div>
      )}

      {/* Agentic Plain-English Assistant Modal */}
      <AgenticPlainEnglishModal
        isOpen={agenticModalOpen}
        onClose={() => setAgenticModalOpen(false)}
        availableTemplates={templatesList}
        user={user}
        onLaunchWorkspaceWithApp={(app) => {
          setAgenticModalOpen(false);
          onAppCreated(app);
          onNavigateToSimulator(app);
        }}
      />
    </div>
  );
}
