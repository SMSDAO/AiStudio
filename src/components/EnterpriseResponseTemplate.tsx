import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Maximize2, 
  Play, 
  Terminal, 
  Code2, 
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  FileCode,
  Eye
} from 'lucide-react';
import { MiniWindowItem } from './MiniPopupWindow';
import { GeminiChatBubble } from './GeminiChatBubble';

export interface EnterpriseResponseData {
  id: string;
  query: string;
  categoryTags: string[];
  modelTag: string;
  confidenceTag: string;
  enterpriseMode: boolean;
  h1Title: string;
  h2Subtitle: string;
  h3Metadata: string;
  sections: {
    heading: string;
    description: string;
    codeBlocks?: {
      language: 'javascript' | 'typescript' | 'python' | 'solidity' | 'bash';
      fileName: string;
      code: string;
    }[];
  }[];
  previewAppId?: string;
  appTitle?: string;
}

interface EnterpriseResponseTemplateProps {
  data: EnterpriseResponseData;
  onOpenMiniWindow: (item: MiniWindowItem) => void;
  onOpenWorkspace: () => void;
}

export const EnterpriseResponseTemplate: React.FC<EnterpriseResponseTemplateProps> = ({
  data,
  onOpenMiniWindow,
  onOpenWorkspace,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getLanguageDetails = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'javascript':
      case 'typescript':
      case 'js':
      case 'ts':
        return {
          label: lang.toUpperCase(),
          blockClass: 'code-block-js',
          badgeClass: 'code-badge-js',
          dotColor: 'bg-yellow-400',
          borderColor: 'border-yellow-500/40',
        };
      case 'python':
      case 'py':
        return {
          label: 'PYTHON',
          blockClass: 'code-block-python',
          badgeClass: 'code-badge-python',
          dotColor: 'bg-[#3A8DFF]',
          borderColor: 'border-[#3A8DFF]/40',
        };
      case 'solidity':
      case 'sol':
        return {
          label: 'SOLIDITY (BASE L2)',
          blockClass: 'code-block-solidity',
          badgeClass: 'code-badge-solidity',
          dotColor: 'bg-[#00FF9D]',
          borderColor: 'border-[#00FF9D]/40',
        };
      case 'bash':
      case 'sh':
      case 'shell':
        return {
          label: 'BASH / CLI',
          blockClass: 'code-block-bash',
          badgeClass: 'code-badge-bash',
          dotColor: 'bg-[#FF2A55]',
          borderColor: 'border-[#FF2A55]/40',
        };
      default:
        return {
          label: lang.toUpperCase(),
          blockClass: 'border-purple-500/40 bg-purple-950/20',
          badgeClass: 'bg-purple-500/20 text-purple-300',
          dotColor: 'bg-purple-400',
          borderColor: 'border-purple-500/40',
        };
    }
  };

  const [viewMode, setViewMode] = useState<'gemini_chat' | 'structured'>('gemini_chat');

  const synthesizedMarkdown = `# ${data.h1Title}: ${data.h2Subtitle}

### ${data.h3Metadata}

> [!NOTE]
> **Verified Accuracy**: ${data.confidenceTag} · **Routing**: ${data.modelTag} · Enterprise Mode Active

${data.sections
  .map(
    (s) => `## ${s.heading}

${s.description}

${(s.codeBlocks || [])
  .map(
    (cb) => `\`\`\`${cb.language}
// File: ${cb.fileName}
${cb.code}
\`\`\``
  )
  .join('\n\n')}`
  )
  .join('\n\n')}

---
*Synthesized by Master Gods Gemini AI Studio with Zero-False-Pass verified contracts.*
`;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Top Controls & View Mode Bar */}
      <div className="glass-card p-3 sm:p-4 border border-white/[0.08] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 bg-black/40 rounded-xl border border-white/10 mr-1">
            <button
              onClick={() => setViewMode('gemini_chat')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'gemini_chat'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gemini Chat Style
            </button>
            <button
              onClick={() => setViewMode('structured')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'structured'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Classic Cards
            </button>
          </div>

          {/* Model Tag */}
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#3A8DFF]/15 border border-[#3A8DFF]/30 text-[#3A8DFF] flex items-center space-x-1 font-semibold">
            <Cpu className="w-3 h-3" />
            <span>{data.modelTag}</span>
          </span>

          {/* Confidence Tag */}
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#00FF9D]/15 border border-[#00FF9D]/30 text-[#00FF9D] flex items-center space-x-1 font-semibold">
            <ShieldCheck className="w-3 h-3" />
            <span>{data.confidenceTag}</span>
          </span>
        </div>

        {/* Action Button to Launch Workspace */}
        <button
          onClick={onOpenWorkspace}
          className="text-xs font-semibold px-3 py-1.5 rounded-[12px] bg-gradient-to-r from-[#A020F0] to-[#3A8DFF] hover:from-[#b030ff] hover:to-[#4a9dff] text-white flex items-center space-x-1.5 transition-all shadow-[0_0_12px_rgba(160,32,240,0.35)] shrink-0 cursor-pointer"
        >
          <span>Open in Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main View Display */}
      {viewMode === 'gemini_chat' ? (
        <GeminiChatBubble
          id={data.id}
          role="assistant"
          authorName="Gemini 2.5 Flash"
          modelName={data.modelTag}
          content={synthesizedMarkdown}
          consensusAccuracy={99.4}
          thoughtProcess={{
            durationMs: 740,
            summary: `Decomposed prompt "${data.query}" into fullstack onchain architecture with Base L2 verification and 60% creator fee split.`,
            steps: [
              'Synthesized TypeScript Next.js 15 App Router component tree',
              'Audited Base L2 Solidity contracts for Uniswap v4 Hook compliance',
              'Configured telemetry indexers and gasless smart wallet executions'
            ]
          }}
          timestamp="Just now"
          onRefinePrompt={() => onOpenWorkspace()}
        />
      ) : (
        <div className="glass-card p-6 sm:p-8 space-y-6 border border-white/[0.1] relative overflow-hidden">
          {/* Subtle top neon accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#A020F0] via-[#FF2A55] via-[#3A8DFF] to-[#00FF9D]" />

        {/* Structured Headings: H1, H2, H3 */}
        <div className="space-y-1.5 border-b border-white/[0.08] pb-4">
          {/* H1: Category */}
          <h1 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#A020F0] shadow-[0_0_8px_#A020F0]" />
            <span>{data.h1Title}</span>
          </h1>

          {/* H2: Item Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {data.h2Subtitle}
          </h2>

          {/* H3: Metadata & Specifications */}
          <h3 className="text-xs sm:text-sm font-mono text-slate-400">
            {data.h3Metadata}
          </h3>
        </div>

        {/* Sections Content & Colored Code Blocks */}
        <div className="space-y-6">
          {data.sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-3">
              <h3 className="text-base font-semibold text-slate-100 flex items-center space-x-2">
                <span className="text-[#3A8DFF]">#</span>
                <span>{section.heading}</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {section.description}
              </p>

              {/* Code Blocks */}
              {section.codeBlocks?.map((block, bIdx) => {
                const blockKey = `${sIdx}-${bIdx}`;
                const langConfig = getLanguageDetails(block.language);

                return (
                  <div
                    key={bIdx}
                    className={`rounded-xl overflow-hidden border ${langConfig.borderColor} ${langConfig.blockClass} transition-all`}
                  >
                    {/* Code Header Bar */}
                    <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-black/40 border-b border-white/[0.06]">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${langConfig.dotColor} shadow-[0_0_8px_currentColor]`} />
                        <span className="text-xs font-mono font-medium text-slate-200">
                          {block.fileName}
                        </span>
                        <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${langConfig.badgeClass}`}>
                          {langConfig.label}
                        </span>
                      </div>

                      {/* Code Block Action Buttons */}
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleCopyCode(blockKey, block.code)}
                          className="px-2 py-1 rounded-md text-xs font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 flex items-center space-x-1 transition-colors"
                          title="Copy snippet"
                        >
                          {copiedIndex === blockKey ? (
                            <>
                              <Check className="w-3 h-3 text-green-400" />
                              <span className="text-green-400 text-[10px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="text-[10px]">Copy</span>
                            </>
                          )}
                        </button>

                        {/* Open inside Mini Pop-Up Window */}
                        <button
                          onClick={() =>
                            onOpenMiniWindow({
                              type: 'code',
                              title: block.fileName,
                              category: data.h1Title,
                              metadata: `${langConfig.label} • ${data.h2Subtitle}`,
                              language: block.language,
                              content: block.code,
                            })
                          }
                          className="px-2 py-1 rounded-md text-xs font-mono text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 flex items-center space-x-1 transition-colors"
                          title="Fast Mini-Window Preview"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span className="text-[10px]">Mini Window</span>
                        </button>
                      </div>
                    </div>

                    {/* Code Content */}
                    <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                      <code>{block.code}</code>
                    </pre>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Quick Launch & Fast Preview Action Bar */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                onOpenMiniWindow({
                  type: 'page_preview',
                  title: data.h2Subtitle,
                  category: data.h1Title,
                  metadata: 'Full Application Preview & Architecture Specs',
                  content: `Application Specs for ${data.h2Subtitle}:\n\n` +
                    `- Framework: Next.js 15 App Router + Tailwind CSS\n` +
                    `- Smart Contract: Base L2 Uniswap v4 Hook with 60% Creator Royalty\n` +
                    `- Social Engine: Farcaster Frames v2 & Telegram WebApp SDK\n` +
                    `- State: Supabase Realtime + PartyKit Collaboration\n` +
                    `- Verified Execution: 100% TypeSafe & Audit-Ready`,
                })
              }
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center space-x-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <span>Fast Page Preview</span>
            </button>

            <button
              onClick={() =>
                onOpenMiniWindow({
                  type: 'file',
                  title: 'architecture.json',
                  category: 'Enterprise Specs',
                  metadata: 'Schema & Contract Deployment Config',
                  language: 'json',
                  content: JSON.stringify(
                    {
                      appName: data.h2Subtitle,
                      version: '2.0.0',
                      network: 'Base L2 (Mainnet / Sepolia)',
                      agentLoop: 'LangGraph-style Tool Calling',
                      creatorFeeSplitPct: 60,
                      modelsSupported: ['Gemini 2.5 Pro', 'Claude 3.7 Sonnet'],
                      deploymentTarget: 'Vercel Edge Network',
                    },
                    null,
                    2
                  ),
                })
              }
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center space-x-1.5 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Inspect Config</span>
            </button>
          </div>

          <button
            onClick={onOpenWorkspace}
            className="w-full sm:w-auto px-4 py-2 rounded-[12px] bg-gradient-to-r from-[#A020F0] to-[#3A8DFF] hover:from-[#b030ff] hover:to-[#4a9dff] text-white text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-[0_0_15px_rgba(160,32,240,0.4)] transition-all"
          >
            <span>Launch Live Miniapp in Workspace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          </div>
        </div>
      )}
    </div>
  );
};
