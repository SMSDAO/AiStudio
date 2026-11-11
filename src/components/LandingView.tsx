import React, { useState } from 'react';
import { Sparkles, ArrowRight, Menu, Code2, ShieldAlert, Cpu, Zap, CornerDownLeft, Compass } from 'lucide-react';
import { EnterpriseResponseData, EnterpriseResponseTemplate } from './EnterpriseResponseTemplate';
import { MiniWindowItem } from './MiniPopupWindow';
import { FlashGlowCard } from './FlashGlowCard';

interface LandingViewProps {
  onOpenSliderMenu: () => void;
  onOpenWorkspaceWithPrompt: (promptText: string) => void;
  onOpenMiniWindow: (item: MiniWindowItem) => void;
  onOpenWorkspace: () => void;
  onOpenAgenticGuide?: () => void;
  onOpenTemplates?: () => void;
  onOpenExplore?: () => void;
}

const SAMPLE_STARTER_PROMPTS = [
  "Build a DeFi staking miniapp on Base L2 with smart wallet & 60% fee split",
  "Create a viral Farcaster Frames v2 meme generator with Telegram bot sync",
  "Design a gasless AI prediction market with Solidity settlement and live odds",
  "Generate a cross-platform Web3 game with onchain inventory & token bonding curve",
];

export const LandingView: React.FC<LandingViewProps> = ({
  onOpenSliderMenu,
  onOpenWorkspaceWithPrompt,
  onOpenMiniWindow,
  onOpenWorkspace,
  onOpenAgenticGuide,
  onOpenTemplates,
  onOpenExplore,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState<EnterpriseResponseData | null>(null);

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulate AI Studio Enterprise Response Generation
    setTimeout(() => {
      const isSolidity = prompt.toLowerCase().includes('contract') || prompt.toLowerCase().includes('defi') || prompt.toLowerCase().includes('token') || prompt.toLowerCase().includes('solidity');
      const isPython = prompt.toLowerCase().includes('bot') || prompt.toLowerCase().includes('python') || prompt.toLowerCase().includes('data') || prompt.toLowerCase().includes('analytics');

      const response: EnterpriseResponseData = {
        id: `gen_${Date.now()}`,
        query: prompt,
        categoryTags: ['FULLSTACK ONCHAIN', 'ENTERPRISE AI', 'BASE L2 READY'],
        modelTag: 'Gemini 2.5 Flash + Claude 3.7 Hybrid',
        confidenceTag: '99.4% Verified Accuracy',
        enterpriseMode: true,
        h1Title: 'ENTERPRISE PRODUCTION SUITE',
        h2Subtitle: prompt.length > 50 ? `${prompt.slice(0, 48)}...` : prompt,
        h3Metadata: 'TypeScript 5.6 • Next.js 15 App Router • Base L2 Smart Wallet • Supabase Realtime • Clanker 60% Split',
        sections: [
          {
            heading: 'Architectural Blueprint & Logic',
            description: `Engineered an enterprise-grade onchain miniapp based on your brief: "${prompt}". Architecture incorporates deterministic state management, smart contract integration, client validation, and automated continuous deployment.`,
            codeBlocks: [
              {
                language: 'typescript',
                fileName: 'src/app/miniapp/page.tsx',
                code: `// JS / TypeScript -> Yellow Accent
import React, { useState } from 'react';
import { useSmartWallet } from '@/hooks/useSmartWallet';
import { ClankerBondingCurve } from '@/lib/clanker';

export default function EnterpriseMiniApp() {
  const { address, isConnected, executeGaslessTx } = useSmartWallet();
  const [stakedAmount, setStakedAmount] = useState<number>(0);

  const handleMintOrStake = async () => {
    await executeGaslessTx({
      target: ClankerBondingCurve.address,
      data: ClankerBondingCurve.encodeStake(stakedAmount),
      creatorFeeBps: 6000, // 60% fee split to creator
    });
  };

  return (
    <div className="p-6 bg-slate-950 text-white rounded-2xl border border-purple-500/30">
      <h1 className="text-xl font-bold font-display">AI STUDIO Onchain Miniapp</h1>
      <p className="text-sm text-slate-400 mt-1">Connected: {address || 'Guest Wallet'}</p>
      <button 
        onClick={handleMintOrStake}
        className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold"
      >
        Execute 60% Split Transaction
      </button>
    </div>
  );
}`,
              },
              {
                language: 'solidity',
                fileName: 'contracts/EnterpriseVault.sol',
                code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Solidity -> Green Accent
contract EnterpriseMiniappVault {
    address public immutable creator;
    uint256 public constant CREATOR_FEE_BPS = 6000; // 60%
    uint256 public constant PROTOCOL_FEE_BPS = 4000; // 40%

    event FeesDistributed(address indexed recipient, uint256 amount);

    constructor(address _creator) {
        creator = _creator;
    }

    receive() external payable {
        uint256 creatorCut = (msg.value * CREATOR_FEE_BPS) / 10000;
        uint256 protocolCut = msg.value - creatorCut;
        
        (bool ok1, ) = creator.call{value: creatorCut}("");
        require(ok1, "Creator transfer failed");
        emit FeesDistributed(creator, creatorCut);
    }
}`,
              },
              {
                language: 'python',
                fileName: 'scripts/realtime_indexer.py',
                code: `# Python -> Blue Accent
import asyncio
from web3 import AsyncWeb3
from dataclasses import dataclass

@dataclass
class MiniappTelemetry:
    active_users: int
    unclaimed_creator_fees: float
    base_l2_tx_count: int

async def stream_miniapp_health(app_id: str):
    w3 = AsyncWeb3(AsyncWeb3.AsyncHTTPProvider("https://mainnet.base.org"))
    print(f"[AI STUDIO Telemetry] Streaming live metrics for {app_id}...")
    # Real-time event subscription for Farcaster & Base L2
    return MiniappTelemetry(active_users=1420, unclaimed_creator_fees=1.84, base_l2_tx_count=9820)`,
              },
              {
                language: 'bash',
                fileName: 'deploy-edge.sh',
                code: `# Bash -> Red Accent
#!/usr/bin/env bash
set -euo pipefail

echo "==> Deploying AI STUDIO miniapp to Vercel Edge & Base L2..."
npx hardhat compile --network base
vercel deploy --prod --yes
echo "==> Production deployment verified at edge. Syncing Farcaster Hubs..."`,
              },
            ],
          },
        ],
        previewAppId: 'app_custom_preview',
        appTitle: prompt,
      };

      setGeneratedResponse(response);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden">
      {/* =========================================================================
          MINIMAL HEADER: Only hamburger slider menu button & AI STUDIO logo.
          No menus visible except hamburger slider.
          No enterprise widgets. No analytics. No clutter.
          ========================================================================= */}
      <header className="w-full px-4 sm:px-8 py-5 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          {/* Hamburger Slider Trigger */}
          <button
            onClick={onOpenSliderMenu}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 hover:text-white transition-all shadow-[0_0_15px_rgba(160,32,240,0.2)]"
            title="Open Enterprise Slider Menu"
            aria-label="Open Slider Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* AI STUDIO Brand */}
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#A020F0] to-[#3A8DFF] shadow-[0_0_10px_#A020F0]" />
            <span className="font-display font-bold text-lg tracking-wider text-white">
              AI STUDIO
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 hidden sm:inline-block">
              v2.0.0
            </span>
          </div>
        </div>

        {/* Subtle quick indicator */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenSliderMenu}
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors hidden sm:flex items-center space-x-1"
          >
            <span>Enterprise Suite</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#3A8DFF]" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          CENTERED PROMPT BOX SECTION (LANDING)
          - Centered prompt box
          - Soft blurred glow behind prompt (purple → red → blue → green animated at 2-4% subtle pulse)
          - Full-width on mobile (90% viewport), max-width 600px on desktop
          - Rounded corners (12-18px, here 16px)
          - Shadow: soft, diffused, neon-tinted
          - Text size auto-scales clamp(16px, 2.5vw, 22px)
          ========================================================================= */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 z-10 w-full">
        {!generatedResponse ? (
          <div className="w-full flex flex-col items-center space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {/* Minimal Sub-Headline */}
            <div className="text-center space-y-2 max-w-md px-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                What will you create?
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-sans">
                Describe an idea. The enterprise engine generates full-stack code, Base smart contracts, and interactive live previews.
              </p>
            </div>

            {/* Prompt Box with FlashGlowCard & Neon Illumination */}
            <div className="relative flex items-center justify-center w-full">
              {/* Soft Blurred Glow Layer behind the prompt */}
              <div 
                className="absolute inset-0 max-w-[620px] mx-auto rounded-[28px] prompt-glow-backdrop pointer-events-none opacity-40 sm:opacity-55"
                style={{
                  filter: 'blur(38px)',
                  transform: 'scale(1.03)',
                }}
              />

              {/* Centered Prompt Box Container with FlashGlowCard */}
              <FlashGlowCard
                variant="rainbow-subtle"
                intensity="high"
                borderRadius="xl"
                blur="18px"
                className="w-[90%] max-w-[600px] relative z-10 p-3 sm:p-4"
              >
                <form
                  onSubmit={handleGenerate}
                  className="flex flex-col space-y-3"
                >
                  <div className="relative w-full">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleGenerate();
                        }
                      }}
                      placeholder="Describe your miniapp or software idea..."
                      rows={3}
                      className="w-full bg-transparent border-0 outline-none resize-none text-white placeholder-slate-500 font-sans leading-relaxed focus:ring-0 p-1"
                      style={{
                        fontSize: 'clamp(16px, 2.5vw, 20px)',
                      }}
                    />
                  </div>

                  {/* Bottom Bar inside Prompt Box */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                    <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-ping" />
                      <span className="hidden sm:inline">Engine Ready • Press Enter to run</span>
                      <span className="sm:hidden">Engine Ready</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="submit"
                        disabled={!prompt.trim() || isGenerating}
                        className="px-4 py-2 rounded-[12px] bg-gradient-to-r from-[#A020F0] to-[#3A8DFF] hover:from-[#b030ff] hover:to-[#4a9dff] text-white text-xs sm:text-sm font-semibold flex items-center space-x-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(160,32,240,0.4)]"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <span>Build</span>
                            <CornerDownLeft className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </FlashGlowCard>
            </div>

            {/* Quick Starter Chips */}
            <div className="w-full max-w-[600px] flex flex-wrap items-center justify-center gap-2 pt-2 px-3">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block w-full text-center sm:w-auto">
                Try:
              </span>
              {SAMPLE_STARTER_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(item);
                  }}
                  className="text-[11px] font-sans px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/20 text-slate-300 hover:text-white transition-all text-left truncate max-w-full sm:max-w-xs"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Non-Technical / Agentic User Guidance Action */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              {onOpenAgenticGuide && (
                <button
                  type="button"
                  onClick={onOpenAgenticGuide}
                  className="px-4 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-mono flex items-center space-x-1.5 transition-all shadow-[0_0_15px_rgba(160,32,240,0.2)]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Don&apos;t know tech terms? Build in Plain English</span>
                </button>
              )}
              {onOpenTemplates && (
                <button
                  type="button"
                  onClick={onOpenTemplates}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-1.5 transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Browse Templates</span>
                </button>
              )}
              {onOpenExplore && (
                <button
                  type="button"
                  onClick={onOpenExplore}
                  className="px-3.5 py-2 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-mono flex items-center space-x-1.5 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Explore Miniapps</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* When Response is Generated, display the Enterprise AI Response Template */
          <div className="w-full max-w-5xl space-y-6">
            <div className="flex items-center justify-between pb-2">
              <button
                onClick={() => setGeneratedResponse(null)}
                className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center space-x-1 transition-colors"
              >
                <span>← New Prompt</span>
              </button>
              <span className="text-xs font-mono text-purple-300">
                AI STUDIO Enterprise AI Response Format
              </span>
            </div>

            <EnterpriseResponseTemplate
              data={generatedResponse}
              onOpenMiniWindow={onOpenMiniWindow}
              onOpenWorkspace={() => {
                if (generatedResponse) {
                  onOpenWorkspaceWithPrompt(generatedResponse.query);
                } else {
                  onOpenWorkspace();
                }
              }}
            />
          </div>
        )}
      </main>

      {/* Minimal Footer on Landing */}
      <footer className="w-full py-4 text-center text-[11px] font-mono text-slate-500 z-10 border-t border-white/[0.04]">
        <span>AI STUDIO Enterprise Engine • Base L2 • Farcaster Frames v2 • High-Performance Workspaces</span>
      </footer>
    </div>
  );
};
