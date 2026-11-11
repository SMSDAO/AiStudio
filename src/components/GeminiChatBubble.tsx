/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS AI STUDIO — Gemini Chat Bubble Component
 * Matches the official Gemini Web & Mobile Chat aesthetic:
 * - 4-Point Gemini Sparkle Gradient Avatar (Google DeepMind aesthetic)
 * - Model & Provider Header with latency, consensus score & timestamp
 * - Collapsible "Thought / Reasoning Process" drawer (Gemini 2.0 / 2.5 Thinking)
 * - GeminiEnterpriseMarkdownRenderer body
 * - Mobile-first floating action toolbar (Copy, Thumbs Up/Down, Share, Code Export, Refine)
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  BrainCircuit, 
  ShieldCheck, 
  Cpu, 
  Clock, 
  Wand2, 
  RefreshCw,
  Terminal
} from 'lucide-react';
import { GeminiEnterpriseMarkdownRenderer } from './GeminiEnterpriseMarkdownRenderer';

export interface GeminiChatMessageProps {
  id: string;
  role: 'user' | 'assistant' | 'agent';
  authorName?: string;
  modelName?: string;
  avatarUrl?: string;
  content: string;
  timestamp?: string;
  thoughtProcess?: {
    durationMs?: number;
    steps?: string[];
    summary?: string;
  };
  consensusAccuracy?: number;
  tokensUsed?: number;
  latencyMs?: number;
  onRefinePrompt?: (refinement: string) => void;
  className?: string;
}

export const GeminiChatBubble: React.FC<GeminiChatMessageProps> = ({
  id,
  role,
  authorName = 'Gemini 2.5 Flash',
  modelName = 'Gemini 2.5 Flash',
  avatarUrl,
  content,
  timestamp = 'Just now',
  thoughtProcess,
  consensusAccuracy = 99.8,
  tokensUsed,
  latencyMs,
  onRefinePrompt,
  className = '',
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(null);
  const [isThinkingOpen, setIsThinkingOpen] = useState<boolean>(false);
  const isAssistant = role === 'assistant' || role === 'agent';

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${authorName} Response`,
        text: content,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  if (!isAssistant) {
    // User Message Bubble (Gemini Web Mobile User Style)
    return (
      <div className={`flex justify-end my-4 animate-fade-in ${className}`}>
        <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl rounded-br-md px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-slate-900 to-[#101726] border border-slate-700/60 shadow-xl text-slate-100 text-xs sm:text-sm font-sans leading-relaxed">
          <p className="whitespace-pre-wrap">{content}</p>
          <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] font-mono text-slate-400">
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
    );
  }

  // Assistant / Agent Message Bubble (Gemini Web Mobile Style)
  return (
    <div className={`my-6 space-y-3 animate-fade-in ${className}`}>
      {/* 1. Header with Gemini Star & Model Tag */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2.5">
          {/* Gemini 4-Point Star Gradient Icon */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#1B273F] via-[#201D35] to-[#2B1B2A] border border-white/10 flex items-center justify-center relative shadow-[0_0_15px_rgba(78,130,238,0.25)] shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4 sm:w-4.5 sm:h-4.5 drop-shadow-[0_0_6px_rgba(155,114,207,0.8)]"
            >
              <path
                d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4771 12 22C12 16.4771 16.4771 12 22 12C16.4771 12 12 7.52285 12 2Z"
                fill="url(#geminiGradient)"
              />
              <defs>
                <linearGradient id="geminiGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4E82EE" />
                  <stop offset="0.5" stopColor="#9B72CF" />
                  <stop offset="1" stopColor="#E2536A" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-bold text-xs sm:text-sm text-white tracking-tight flex items-center gap-1.5">
              <span>{authorName}</span>
              <span className="text-[10px] font-mono font-bold text-cyan-300 px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-500/30">
                {modelName}
              </span>
            </span>

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
              {consensusAccuracy && (
                <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  {consensusAccuracy}% Accuracy
                </span>
              )}
              {latencyMs && (
                <>
                  <span>·</span>
                  <span>{latencyMs}ms</span>
                </>
              )}
            </div>
          </div>
        </div>

        <span className="text-[10px] font-mono text-slate-500">{timestamp}</span>
      </div>

      {/* 2. Collapsible Gemini Thinking / Reasoning Drawer */}
      {thoughtProcess && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0A0E17]/80 backdrop-blur-md overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setIsThinkingOpen(!isThinkingOpen)}
            className="w-full px-3.5 sm:px-4 py-2.5 flex items-center justify-between text-left text-xs font-mono text-purple-300 hover:text-purple-200 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="font-bold">
                Reasoning Process {thoughtProcess.durationMs ? `(${Math.round(thoughtProcess.durationMs)}ms)` : ''}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span>{isThinkingOpen ? 'Hide thoughts' : 'View thoughts'}</span>
              {isThinkingOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {isThinkingOpen && (
            <div className="px-4 py-3 border-t border-white/[0.06] bg-black/40 text-[11px] font-mono text-slate-300 space-y-2 leading-relaxed">
              {thoughtProcess.summary && (
                <p className="text-purple-300/90 font-semibold">{thoughtProcess.summary}</p>
              )}
              {thoughtProcess.steps && thoughtProcess.steps.length > 0 && (
                <div className="space-y-1 pl-2 border-l border-purple-500/30">
                  {thoughtProcess.steps.map((st, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-1.5 text-slate-400">
                      <span className="text-purple-400 select-none">›</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. Main Message Body: Enterprise Markdown Renderer */}
      <div className="rounded-3xl p-4 sm:p-6 bg-[#0B101A]/90 border border-white/[0.08] shadow-2xl space-y-2 backdrop-blur-xl relative overflow-hidden group">
        {/* Subtle top edge lighting gradient */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#4E82EE]/40 via-[#9B72CF]/40 to-transparent" />

        <GeminiEnterpriseMarkdownRenderer content={content} />
      </div>

      {/* 4. Gemini Web Mobile Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-1 text-xs">
        {/* Left Actions: Copy, Thumbs, Share */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy response"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-emerald-400 font-mono font-bold hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-mono hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFeedback(feedback === 'liked' ? null : 'liked')}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl border transition-colors cursor-pointer flex items-center gap-1 ${
              feedback === 'liked'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Good response"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setFeedback(feedback === 'disliked' ? null : 'disliked')}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl border transition-colors cursor-pointer flex items-center gap-1 ${
              feedback === 'disliked'
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Needs improvement"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Share response"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-mono hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Right Info: Token Counter */}
        {tokensUsed && (
          <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>{tokensUsed.toLocaleString()} tokens</span>
          </div>
        )}
      </div>

      {/* 5. Quick Prompt Refinement Chips (Gemini Mobile Style) */}
      {onRefinePrompt && (
        <div className="flex flex-wrap items-center gap-1.5 px-2 pt-1">
          <span className="text-[10px] font-mono text-slate-500">Refine:</span>
          {[
            'Explain code step-by-step',
            'Add comprehensive unit tests',
            'Optimize for 60FPS mobile performance',
            'Generate Base L2 deployment script'
          ].map((promptChip, chipIdx) => (
            <button
              key={chipIdx}
              type="button"
              onClick={() => onRefinePrompt(promptChip)}
              className="text-[11px] font-sans px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-purple-500/20 text-slate-300 hover:text-purple-200 border border-white/10 hover:border-purple-500/40 transition-all flex items-center gap-1 active:scale-95"
            >
              <Wand2 className="w-3 h-3 text-purple-400" />
              <span>{promptChip}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
