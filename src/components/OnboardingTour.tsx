import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  X, 
  Layers, 
  Coins, 
  Globe, 
  Users, 
  Zap, 
  Bot,
  Lightbulb,
  Check,
  Copy,
  Terminal,
  HelpCircle,
  Play,
  RotateCcw,
  Smartphone,
  Flame,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onApplyPrompt?: (appName: string, ideaPrompt: string) => void;
}

interface ExamplePrompt {
  name: string;
  category: string;
  prompt: string;
  whyItWorks: string;
}

const PROMPT_EXAMPLES: ExamplePrompt[] = [
  {
    name: 'NeonDash 2088',
    category: 'Arcade Game',
    prompt: 'A fast-paced cyber arcade obstacle runner miniapp for Farcaster frames and mobile browsers. Players jump over laser hazards, earn $DASH tokens, and submit verified high scores to Base L2 leaderboard.',
    whyItWorks: 'Clearly specifies mechanics (jumping obstacles), onchain action (high scores on Base), target platform (Farcaster frames), and token reward ($DASH).',
  },
  {
    name: 'TipCaster Pro',
    category: 'Social & Tipping',
    prompt: 'One-tap Farcaster Frames v2 social micro-tipper using Base USDC. Content creators receive 60% fee splits directly into their smart wallet with instant verifiable receipts and gasless transactions.',
    whyItWorks: 'Defines the exact currency (Base USDC), the economic fee split (60% to creator), the UX (gasless one-tap), and viral social receipts.',
  },
  {
    name: 'MemeForge 3000',
    category: 'Creative & NFT',
    prompt: 'Cyber viral meme generator with custom neon typography, laser sticker overlays, and 1-click Base L2 NFT minting with zero gas fees for collectors and instant social sharing.',
    whyItWorks: 'Specifies creative tooling (typography, stickers), onchain outcome (ERC-721 NFT minting on Base), and user incentive (gasless).',
  },
  {
    name: 'DegenOracle AI',
    category: 'AI & Markets',
    prompt: 'Autonomous cultural prediction market where AI agents scrape viral culture trends and users buy YES/NO shares on bonding curves with instant settlement on Base.',
    whyItWorks: 'Explains the autonomous data feed, the market structure (YES/NO bonding curves), and fast settlement.',
  },
];

export function OnboardingTour({ isOpen, onClose, onComplete, onApplyPrompt }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTabPrompt, setActiveTabPrompt] = useState<number>(0);

  if (!isOpen) return null;

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#06b6d4', '#22c55e', '#eab308', '#f97316'],
        });
      } catch {
        // ignore
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCopyPrompt = (prompt: string, index: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleUsePrompt = (example: ExamplePrompt) => {
    if (onApplyPrompt) {
      onApplyPrompt(example.name, example.prompt);
    }
    onComplete();
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-panel border border-purple-500/40 rounded-3xl p-5 sm:p-8 relative shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        
        {/* Top Header Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-300">
              ViniApp Guided Onboarding
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Skip Tour
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="flex-1 space-y-5">
          
          {/* STEP 0: Welcome Screen */}
          {currentStep === 0 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-[0_0_30px_rgba(168,85,247,0.6)] mx-auto">
                  <div className="w-full h-full bg-[#070913] rounded-[22px] flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-cyan-300" />
                  </div>
                </div>

                <div className="inline-block px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
                  WELCOME TO VINIAPP 2.0
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                  Vibe Coding for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400">Onchain Miniapps</span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Turn your natural language ideas into production-ready onchain miniapps in seconds — complete with Base L2 smart contracts, Farcaster frames, and automatic 60% creator fee sharing.
                </p>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl glass-card border border-purple-500/30 space-y-1">
                  <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold font-mono">
                    <Bot className="w-4 h-4" />
                    <span>AI Agentic Code Synthesis</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Generates clean Next.js 15 App Router code with dynamic forms, state management, and real-time feeds.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl glass-card border border-cyan-500/30 space-y-1">
                  <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold font-mono">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Dedicated App Wallet</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Every app gets an isolated Base Smart Wallet with gas sponsorship and cryptographic security.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl glass-card border border-green-500/30 space-y-1">
                  <div className="flex items-center space-x-2 text-green-400 text-xs font-bold font-mono">
                    <Coins className="w-4 h-4" />
                    <span>60% Creator Fee Split</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Clanker-style Uniswap v4 bonding curves stream 60% of trading fees directly into your wallet.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl glass-card border border-orange-500/30 space-y-1">
                  <div className="flex items-center space-x-2 text-orange-400 text-xs font-bold font-mono">
                    <Globe className="w-4 h-4" />
                    <span>Multi-Platform Edge Deploy</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Deploys simultaneously to Farcaster Frames v2, Telegram WebApps, World App, Base & Vercel.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Core Value Proposition */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500 flex items-center justify-center text-green-400 flex-shrink-0">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                    The Revolutionary Economic Model
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Build once, earn continuous trading fees on Base
                  </p>
                </div>
              </div>

              {/* Comparison box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2">
                  <div className="font-bold font-mono text-red-400 flex items-center space-x-1.5">
                    <X className="w-4 h-4" />
                    <span>Traditional Web3 Dev</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    <li>❌ Weeks writing and auditing Solidity contracts</li>
                    <li>❌ Complex wallet setup and paymaster gas infrastructure</li>
                    <li>❌ Zero automated monetization for builders</li>
                    <li>❌ Separate codebases for Farcaster, Telegram, and Web</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-green-950/30 border border-green-500/40 space-y-2">
                  <div className="font-bold font-mono text-green-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ViniApp 2.0 Vibe Coding</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    <li>⚡ Describe idea in chat ➔ Production app in 30 seconds</li>
                    <li>⚡ Automated Base Smart Wallet + gas sponsorship</li>
                    <li>⚡ <strong>60% of Uniswap trading fees</strong> stream to creator</li>
                    <li>⚡ 1-click sync to Farcaster Frames v2 & Hubs</li>
                  </ul>
                </div>
              </div>

              {/* Visual Flow diagram */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 flex flex-wrap items-center justify-between text-xs font-mono text-center gap-2">
                <div className="flex-1 p-2 rounded-xl bg-purple-950/60 border border-purple-500/40">
                  <div className="text-lg">💡</div>
                  <div className="text-purple-300 font-bold">1. Your Idea</div>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400 hidden sm:block" />
                <div className="flex-1 p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40">
                  <div className="text-lg">🤖</div>
                  <div className="text-cyan-300 font-bold">2. Agent Synthesis</div>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400 hidden sm:block" />
                <div className="flex-1 p-2 rounded-xl bg-blue-950/60 border border-blue-500/40">
                  <div className="text-lg">📦</div>
                  <div className="text-blue-300 font-bold">3. Next.js & Base</div>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400 hidden sm:block" />
                <div className="flex-1 p-2 rounded-xl bg-green-950/60 border border-green-500/40">
                  <div className="text-lg">💰</div>
                  <div className="text-green-300 font-bold">4. 60% Fees Claim</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: The 'Create App' Process Overview */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                    The 'Create App' Studio Process
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    From initial concept to multi-tool execution in 3 intuitive steps
                  </p>
                </div>
              </div>

              {/* Step Breakdown Cards */}
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-xl bg-purple-600/30 text-purple-300 font-bold text-xs flex items-center justify-center font-mono flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase font-display">Pick Template or Start Freeform</h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Choose from 7 production templates (Arcade Game, Tipping Bot, Meme Maker, Poll App, Simple Blog, NFT Gallery, Event Calendar) or hit <strong>"Surprise Me 🎲"</strong> for instant creative sparks.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-xl bg-cyan-600/30 text-cyan-300 font-bold text-xs flex items-center justify-center font-mono flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase font-display">Give it a Punchy Name & Prompt</h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Enter a memorable name (under 30 characters) and describe what the app does in 20 to 65,000 characters. Our agent auto-detects the archetype and tunes the tech stack.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-xl bg-green-600/30 text-green-300 font-bold text-xs flex items-center justify-center font-mono flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase font-display">Select Monetization Strategy</h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Select your preferred revenue model: <strong>Clanker $TICKER (60% trading fee cut)</strong>, Base USDC micro-tips, NFT access pass, or x402 pay-per-use microtransactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Tips for Writing Effective App Ideas & Descriptions (CORE PROMPT REQUIREMENT) */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-500 flex items-center justify-center text-yellow-400 flex-shrink-0">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                    Mastering Prompt Crafting: Tips & Examples
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    How to write descriptions that generate 10x better onchain miniapps
                  </p>
                </div>
              </div>

              {/* 4 Golden Rules */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-purple-500/30 text-center">
                  <span className="text-purple-400 font-bold block mb-0.5">1. CORE LOOP</span>
                  <span className="text-[10px] text-slate-300">Define user actions (jump, tip, vote, roll)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/30 text-center">
                  <span className="text-cyan-400 font-bold block mb-0.5">2. ONCHAIN ACT</span>
                  <span className="text-[10px] text-slate-300">Name contract outcome (Base L2 score, NFT, token)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-green-500/30 text-center">
                  <span className="text-green-400 font-bold block mb-0.5">3. TARGET APP</span>
                  <span className="text-[10px] text-slate-300">Target Farcaster Frames, Telegram, or Web</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-orange-500/30 text-center">
                  <span className="text-orange-400 font-bold block mb-0.5">4. REVENUE</span>
                  <span className="text-[10px] text-slate-300">Include token ticker or 60% fee split</span>
                </div>
              </div>

              {/* Interactive Example Prompts Tabs */}
              <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold font-mono text-white">PROVEN HIGH-IMPACT PROMPTS:</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Click to test or apply</span>
                </div>

                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {PROMPT_EXAMPLES.map((eg, idx) => (
                    <button
                      key={eg.name}
                      onClick={() => setActiveTabPrompt(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        activeTabPrompt === idx
                          ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                          : 'bg-slate-900/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {eg.name} ({eg.category})
                    </button>
                  ))}
                </div>

                {/* Selected Prompt Display Card */}
                {PROMPT_EXAMPLES[activeTabPrompt] && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-2">
                    <div className="text-xs text-slate-200 leading-relaxed font-sans italic">
                      "{PROMPT_EXAMPLES[activeTabPrompt].prompt}"
                    </div>

                    <div className="text-[11px] text-cyan-300 font-mono border-t border-white/5 pt-1.5">
                      💡 <strong>Why this works:</strong> {PROMPT_EXAMPLES[activeTabPrompt].whyItWorks}
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button
                        onClick={() => handleCopyPrompt(PROMPT_EXAMPLES[activeTabPrompt].prompt, activeTabPrompt)}
                        className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center space-x-1 border border-slate-700"
                      >
                        {copiedIndex === activeTabPrompt ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === activeTabPrompt ? 'Copied' : 'Copy Prompt'}</span>
                      </button>

                      <button
                        onClick={() => handleUsePrompt(PROMPT_EXAMPLES[activeTabPrompt])}
                        className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Use In Create Studio ⚡</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: AI Clarifying Loop & Real-Time Build */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500 flex items-center justify-center text-purple-300 flex-shrink-0">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                    AI Clarifying Loop & Sequential Tool Calling
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Fine-tune your vision before the agent writes code
                  </p>
                </div>
              </div>

              {/* Explanations */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
                  <div className="text-purple-400 font-bold font-mono">1. Interactive Clarifying Questions</div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    The agent asks 3–5 targeted questions about your target audience, monetization model, and aesthetic vibe. You can click answers or hit <strong>"Auto-Decide & Build ⚡"</strong> for instant acceleration.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
                  <div className="text-cyan-400 font-bold font-mono">2. Real-Time Tool Calling Pipeline</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[10px] font-mono text-slate-300">
                    <span className="p-1 rounded bg-black/40 border border-white/5 truncate">⚡ generate_brand_assets()</span>
                    <span className="p-1 rounded bg-black/40 border border-white/5 truncate">⚡ generate_nextjs_code()</span>
                    <span className="p-1 rounded bg-black/40 border border-white/5 truncate">⚡ generate_smart_contracts()</span>
                    <span className="p-1 rounded bg-black/40 border border-white/5 truncate">⚡ create_app_wallet()</span>
                    <span className="p-1 rounded bg-black/40 border border-white/5 truncate">⚡ launch_token()</span>
                    <span className="p-1 rounded bg-black/40 border border-white/5 truncate">⚡ deploy_farcaster_manifest()</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
                  <div className="text-green-400 font-bold font-mono">3. Live Supabase Realtime Broadcasting</div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Watch real-time status changes: <span className="text-cyan-300 font-mono">queued ➔ clarifying ➔ generating ➔ creating_wallet ➔ deploying ➔ live</span> with zero browser refreshes required.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Live Simulator & Claiming Fees */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Play className="w-6 h-6 fill-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                    Live Simulator & Claiming 60% Creator Fees
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Test play immediately in mobile view and withdraw trading fee revenue
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl glass-card border border-purple-500/30 space-y-2">
                  <div className="font-bold text-purple-300 font-display flex items-center space-x-1.5">
                    <Smartphone className="w-4 h-4 text-purple-400" />
                    <span>Playable Miniapp Simulator</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Every generated miniapp is 100% playable inside the interactive iPhone/Android frame. Jump obstacles in arcade games, send test USDC tips, mint Base NFTs, or test roll dice!
                  </p>
                  <p className="text-[11px] text-cyan-400 font-mono">
                    💬 Iterate code via AI chat: "Add dark mode", "Increase multiplier".
                  </p>
                </div>

                <div className="p-4 rounded-2xl glass-card border border-green-500/30 space-y-2">
                  <div className="font-bold text-green-300 font-display flex items-center space-x-1.5">
                    <Coins className="w-4 h-4 text-green-400" />
                    <span>Claiming 60% Trading Fees</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    When users trade your app token on Clanker or execute miniapp actions, 60% of all protocol trading fees accumulate automatically in your dedicated App Wallet.
                  </p>
                  <p className="text-[11px] text-green-400 font-mono">
                    💸 Click "Claim 60% Fees" anytime for instant onchain withdrawal.
                  </p>
                </div>
              </div>

              {/* Ready banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/60 border border-cyan-500/40 text-center space-y-1">
                <div className="text-xs font-bold font-display text-white">
                  🎉 You are ready to build on ViniApp!
                </div>
                <div className="text-[11px] text-slate-300">
                  You can revisit this guide anytime by clicking <span className="text-cyan-300 font-mono font-bold">Tour</span> in the top navbar or from your Profile.
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
          {/* Progress dots */}
          <div className="flex items-center space-x-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                title={`Step ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx
                    ? 'w-7 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center space-x-1.5 active:scale-95 transition-all"
            >
              <span>{currentStep === totalSteps - 1 ? 'START CREATING NOW 🚀' : 'NEXT STEP'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
