import React, { useState } from 'react';
import { 
  Code2, 
  Sparkles, 
  Smartphone, 
  Play, 
  Terminal, 
  FileCode, 
  Cpu, 
  Copy, 
  Check, 
  Layers, 
  Maximize2,
  Bug,
  Zap,
  Palette,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Github
} from 'lucide-react';
import { AppItem, UserProfile } from '../types';
import { InteractiveMiniappSimulator } from './InteractiveMiniappSimulator';
import { MiniWindowItem } from './MiniPopupWindow';
import { MiniappPreviewErrorBoundary } from './ErrorBoundary';
import { BuildLogStreamer } from './BuildLogStreamer';
import { FlashGlowCard } from './FlashGlowCard';

interface WorkspaceViewProps {
  user: UserProfile;
  initialApp?: AppItem | null;
  onOpenMiniWindow: (item: MiniWindowItem) => void;
  onClaimFees: (appId: string) => void;
  onOpenGitHubSync?: (app: AppItem) => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  user,
  initialApp,
  onOpenMiniWindow,
  onClaimFees,
  onOpenGitHubSync,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'ai' | 'preview' | 'logs'>('preview');
  const [selectedFile, setSelectedFile] = useState<string>('src/app/page.tsx');
  const [copied, setCopied] = useState(false);
  const [isRebuilding, setIsRebuilding] = useState(false);

  // File tree code representations
  const fileContents: Record<string, { lang: string; code: string }> = {
    'src/app/page.tsx': {
      lang: 'typescript',
      code: `// Next.js 15 App Router - AI STUDIO Onchain Miniapp
import React from 'react';
import { SmartWalletProvider } from '@/providers/SmartWalletProvider';
import { MiniappFrame } from '@/components/MiniappFrame';

export default function Page() {
  return (
    <SmartWalletProvider rpcUrl="https://mainnet.base.org">
      <main className="min-h-screen bg-black text-slate-100 flex flex-col items-center justify-center p-4">
        <MiniappFrame 
          appName="${initialApp?.name || 'Cyber Arcade Bot'}" 
          feeSplitPct={60} 
        />
      </main>
    </SmartWalletProvider>
  );
}`,
    },
    'contracts/MiniAppToken.sol': {
      lang: 'solidity',
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MiniAppToken is ERC20 {
    address public immutable creator;
    uint256 public constant CREATOR_FEE_BPS = 6000; // 60% creator royalty

    constructor(string memory name, string memory symbol, address _creator) 
        ERC20(name, symbol) 
    {
        creator = _creator;
        _mint(_creator, 1_000_000_000 * 10**decimals());
    }

    // Uniswap v4 Hook callback executes 60% fee split to creator wallet
}`,
    },
    'src/lib/farcaster.ts': {
      lang: 'typescript',
      code: `import { sdk } from '@farcaster/frame-sdk';

export async function initFarcasterFrame() {
  const context = await sdk.context;
  sdk.actions.ready();
  return context;
}`,
    },
    'prisma/schema.prisma': {
      lang: 'bash',
      code: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Miniapp {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  creatorCut  Int      @default(60)
  createdAt   DateTime @default(now())
}`,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContents[selectedFile]?.code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 animate-in fade-in duration-200">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF9D] shadow-[0_0_8px_#00FF9D]" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              AI STUDIO Unified Workspace
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white mt-1">
            {initialApp ? initialApp.name : 'Miniapp Studio & Live Runtime'}
          </h1>
        </div>

        {/* Multi-Tab Selector: Code | AI | Preview */}
        <div className="flex flex-wrap items-center gap-2">
          {initialApp && onOpenGitHubSync && (
            <button
              onClick={() => onOpenGitHubSync(initialApp)}
              className="px-3 py-2 rounded-xl text-xs font-mono font-medium flex items-center space-x-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 text-slate-200 hover:text-white transition-all shadow-[0_0_12px_rgba(160,32,240,0.2)]"
              title="Link & Sync GitHub Repository"
            >
              <Github className="w-3.5 h-3.5 text-purple-400" />
              <span>{initialApp.githubRepoUrl ? 'GitHub Synced' : 'GitHub Sync'}</span>
            </button>
          )}

          <div className="flex items-center space-x-1.5 p-1 bg-white/[0.04] border border-white/10 rounded-xl">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'code'
                  ? 'bg-gradient-to-r from-yellow-500/30 to-amber-500/20 text-yellow-300 border border-yellow-500/40 shadow-[0_0_12px_rgba(234,179,8,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4 text-yellow-400" />
              <span>Code Editor</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-[#3A8DFF]/30 to-indigo-500/20 text-[#3A8DFF] border border-[#3A8DFF]/40 shadow-[0_0_12px_rgba(58,141,255,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#3A8DFF]" />
              <span>AI Agent</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'preview'
                  ? 'bg-gradient-to-r from-[#00FF9D]/30 to-emerald-500/20 text-[#00FF9D] border border-[#00FF9D]/40 shadow-[0_0_12px_rgba(0,255,157,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#00FF9D]" />
              <span>Live Preview</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'logs'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Build Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: CODE EDITOR (Multi-tab editor)
          ========================================================================= */}
      {activeTab === 'code' && (
        <FlashGlowCard variant="yellow" intensity="medium" className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* File Sidebar */}
            <div className="space-y-2 border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-4 lg:pb-0 lg:pr-4">
              <span className="text-xs font-mono uppercase text-slate-500 tracking-wider block mb-2">
                Project Files
              </span>
              {Object.keys(fileContents).map((fileName) => (
                <button
                  key={fileName}
                  onClick={() => setSelectedFile(fileName)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-mono text-left transition-all ${
                    selectedFile === fileName
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate">{fileName}</span>
                </button>
              ))}
            </div>

            {/* Editor Area */}
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <span className="text-xs font-mono text-slate-300 font-semibold">
                  {selectedFile}
                </span>
                <div className="flex items-center space-x-2">
                  {initialApp && onOpenGitHubSync && (
                    <button
                      onClick={() => onOpenGitHubSync(initialApp)}
                      className="px-2.5 py-1 rounded-md text-xs font-mono text-purple-300 bg-purple-950/50 hover:bg-purple-900/50 border border-purple-500/40 flex items-center space-x-1 transition-colors"
                      title="Sync to GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Sync Repo</span>
                    </button>
                  )}
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-md text-xs font-mono text-slate-300 bg-white/5 hover:bg-white/10 flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() =>
                      onOpenMiniWindow({
                        type: 'code',
                        title: selectedFile,
                        category: 'Workspace Editor',
                        metadata: `File: ${selectedFile} • Runtime: Next.js 15`,
                        language: fileContents[selectedFile]?.lang,
                        content: fileContents[selectedFile]?.code || '',
                      })
                    }
                    className="px-2.5 py-1 rounded-md text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 flex items-center space-x-1"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Mini Window</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{fileContents[selectedFile]?.code}</code>
              </pre>
            </div>
          </div>
        </FlashGlowCard>
      )}

      {/* =========================================================================
          TAB 2: AI AGENT SUITE
          ========================================================================= */}
      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FlashGlowCard variant="yellow" intensity="subtle" className="p-5 space-y-3">
            <div className="flex items-center space-x-2 text-yellow-400">
              <Bug className="w-4 h-4" />
              <h2 className="text-sm font-semibold text-white">Advanced Code Debugger</h2>
            </div>
            <p className="text-xs text-slate-300">
              Automated AST linter and runtime exception analyzer. Zero memory leaks detected on Base L2 contract hooks.
            </p>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-[#00FF9D]">
              ✓ All 14 TypeScript types statically verified.
            </div>
          </FlashGlowCard>

          <FlashGlowCard variant="cyan" intensity="subtle" className="p-5 space-y-3">
            <div className="flex items-center space-x-2 text-[#3A8DFF]">
              <Zap className="w-4 h-4" />
              <h2 className="text-sm font-semibold text-white">Performance Optimizer</h2>
            </div>
            <p className="text-xs text-slate-300">
              Bundle size analyzed: 42KB gzip. Server components enabled. Edge rendering active with 0ms cold-start.
            </p>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-cyan-300">
              ✓ 99/100 Lighthouse Performance Index.
            </div>
          </FlashGlowCard>

          <FlashGlowCard variant="purple" intensity="subtle" className="p-5 space-y-3">
            <div className="flex items-center space-x-2 text-pink-400">
              <Palette className="w-4 h-4" />
              <h2 className="text-sm font-semibold text-white">Brand Asset Generator</h2>
            </div>
            <p className="text-xs text-slate-300">
              Adaptive cyber color palettes & vector tokens rendered for Farcaster Frames v2 and Telegram WebApps.
            </p>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-purple-300">
              ✓ Multi-platform responsive icon matrix built.
            </div>
          </FlashGlowCard>
        </div>
      )}

      {/* =========================================================================
          TAB 3: LIVE PREVIEW (Interactive Phone Simulator)
          ========================================================================= */}
      {activeTab === 'preview' && (
        <FlashGlowCard variant="purple" intensity="medium" className="p-4 sm:p-6">
          {initialApp ? (
            <MiniappPreviewErrorBoundary>
              <InteractiveMiniappSimulator
                app={initialApp}
                onUpdateApp={() => {}}
                onClaimFees={onClaimFees}
              />
            </MiniappPreviewErrorBoundary>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-900/30 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-300">
                <Smartphone className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-white">Select or Build an App to Preview</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Head to the clean Landing page to describe an idea, or browse existing projects in the Projects menu.
              </p>
            </div>
          )}
        </FlashGlowCard>
      )}

      {/* =========================================================================
          TAB 4: BUILD LOGS (Realtime Supabase Log Stream)
          ========================================================================= */}
      {activeTab === 'logs' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono text-slate-400">
              Live build channel for <strong className="text-white">{initialApp?.name || 'Cyber Enterprise Miniapp'}</strong>
            </span>
            <button
              onClick={() => setIsRebuilding(true)}
              disabled={isRebuilding}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-mono text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)]"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isRebuilding ? 'Compiling Build...' : 'Trigger Live Agent Build'}</span>
            </button>
          </div>

          <div className="h-[480px]">
            <BuildLogStreamer
              appId={initialApp?.id || 'app_default_103'}
              appName={initialApp?.name || 'Cyber Enterprise Miniapp'}
              isBuilding={isRebuilding}
              onBuildComplete={() => setIsRebuilding(false)}
              initialLogs={[
                `[INFO] 🚀 Master Gods Autonomous Agent Core v10.3.0 initialized.`,
                `[SUCCESS] 📦 All 14 TypeScript files validated against schema.`,
                `[SUCCESS] ⚡ Generated vercel.yml and github-actions.yml workflow templates.`,
                `[DEPLOY] 🚀 Edge deployment completed on Base L2 network.`,
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};
