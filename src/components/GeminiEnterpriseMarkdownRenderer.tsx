/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS AI STUDIO — Gemini Enterprise Markdown Renderer
 * Designed for Gemini Web & Mobile aesthetic:
 * - Fluid typography hierarchy (H1, H2, H3, H4) with subtle accents
 * - Code blocks with language tags, line numbers, and instant copy
 * - Callout blocks (> [!NOTE], > [!TIP], > [!WARNING], > [!SECURITY])
 * - Responsive tables with clean borders and subtle zebra stripes
 * - Nested task lists (- [x], - [ ]) and ordered/unordered lists
 * - Inline code, bold, italics, links, and blockquotes
 */

import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Code2, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface GeminiEnterpriseMarkdownRendererProps {
  content: string;
  className?: string;
  compact?: boolean;
}

export const GeminiEnterpriseMarkdownRenderer: React.FC<GeminiEnterpriseMarkdownRendererProps> = ({
  content,
  className = '',
  compact = false,
}) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Helper for language badges and accent colors
  const getLanguageMeta = (lang: string) => {
    const l = (lang || '').toLowerCase().trim();
    switch (l) {
      case 'typescript':
      case 'ts':
        return { label: 'TypeScript', color: 'text-amber-300', bg: 'bg-amber-950/40', border: 'border-amber-500/40', dot: 'bg-amber-400' };
      case 'javascript':
      case 'js':
        return { label: 'JavaScript', color: 'text-yellow-300', bg: 'bg-yellow-950/40', border: 'border-yellow-500/40', dot: 'bg-yellow-400' };
      case 'python':
      case 'py':
        return { label: 'Python', color: 'text-sky-300', bg: 'bg-sky-950/40', border: 'border-sky-500/40', dot: 'bg-sky-400' };
      case 'solidity':
      case 'sol':
        return { label: 'Solidity (Base L2)', color: 'text-emerald-300', bg: 'bg-emerald-950/40', border: 'border-emerald-500/40', dot: 'bg-emerald-400' };
      case 'bash':
      case 'sh':
      case 'shell':
      case 'zsh':
        return { label: 'Bash / Shell', color: 'text-rose-300', bg: 'bg-rose-950/40', border: 'border-rose-500/40', dot: 'bg-rose-400' };
      case 'json':
        return { label: 'JSON', color: 'text-purple-300', bg: 'bg-purple-950/40', border: 'border-purple-500/40', dot: 'bg-purple-400' };
      case 'sql':
      case 'postgresql':
        return { label: 'SQL (PostgreSQL)', color: 'text-cyan-300', bg: 'bg-cyan-950/40', border: 'border-cyan-500/40', dot: 'bg-cyan-400' };
      case 'yaml':
      case 'yml':
        return { label: 'YAML', color: 'text-indigo-300', bg: 'bg-indigo-950/40', border: 'border-indigo-500/40', dot: 'bg-indigo-400' };
      default:
        return { label: (lang || 'CODE').toUpperCase(), color: 'text-slate-300', bg: 'bg-slate-800/60', border: 'border-slate-700/60', dot: 'bg-slate-400' };
    }
  };

  // Inline formatting helper (bold, italic, inline code, links)
  const formatInlineText = (text: string): React.ReactNode => {
    // Regex splits text into tokens: `code`, **bold**, *italic*, [link](url)
    const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, idx) => {
      if (!part) return null;

      // Inline code
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded-md bg-[#131B29] border border-cyan-500/30 text-cyan-300 font-mono text-[12px] font-semibold mx-0.5"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Bold
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={idx} className="font-bold text-white tracking-wide">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Italic
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return (
          <em key={idx} className="italic text-slate-200">
            {part.slice(1, -1)}
          </em>
        );
      }

      // Link
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={idx}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/40 hover:decoration-cyan-300 inline-flex items-center gap-0.5 transition-colors"
          >
            <span>{linkMatch[1]}</span>
            <ExternalLink className="w-3 h-3 inline ml-0.5 opacity-70" />
          </a>
        );
      }

      return <span key={idx}>{part}</span>;
    });
  };

  // Top-level block parser
  const renderBlocks = () => {
    const rawLines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    let blockIdCounter = 0;

    while (i < rawLines.length) {
      const line = rawLines[i];

      // 1. Code blocks: ```lang ... ```
      if (line.trim().startsWith('```')) {
        const lang = line.trim().replace(/^```/, '').trim();
        const codeLines: string[] = [];
        i++;
        while (i < rawLines.length && !rawLines[i].trim().startsWith('```')) {
          codeLines.push(rawLines[i]);
          i++;
        }
        // Skip closing ```
        if (i < rawLines.length) i++;

        const codeString = codeLines.join('\n');
        const codeId = `code_block_${blockIdCounter++}`;
        const meta = getLanguageMeta(lang);
        const isCopied = copiedCodeId === codeId;

        elements.push(
          <div
            key={codeId}
            className={`my-3.5 rounded-2xl overflow-hidden border ${meta.border} bg-[#06090F] shadow-xl transition-all`}
          >
            {/* Code Block Header (Gemini Style) */}
            <div className="flex items-center justify-between px-3.5 sm:px-4 py-2 bg-[#0C121D] border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${meta.dot} shadow-[0_0_8px_currentColor]`} />
                <span className={`text-[11px] font-mono font-bold tracking-wider uppercase ${meta.color}`}>
                  {meta.label}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyCode(codeId, codeString)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                title="Copy code to clipboard"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Text with Line Numbers */}
            <div className="p-3.5 sm:p-4 overflow-x-auto text-[12px] sm:text-[13px] font-mono text-slate-200 leading-relaxed max-h-[460px] overflow-y-auto">
              <pre className="flex flex-col">
                {codeLines.map((cLine, lineIdx) => (
                  <div key={lineIdx} className="table-row group hover:bg-white/[0.03]">
                    <span className="table-cell select-none pr-3 text-right text-slate-600 font-mono text-[11px] w-8">
                      {lineIdx + 1}
                    </span>
                    <span className="table-cell whitespace-pre">{cLine || ' '}</span>
                  </div>
                ))}
              </pre>
            </div>
          </div>
        );
        continue;
      }

      // 2. Callout / Alert Blockquote (> [!NOTE] or general > )
      if (line.trim().startsWith('>')) {
        const quoteLines: string[] = [];
        let calloutType: 'note' | 'tip' | 'warning' | 'security' | 'standard' = 'standard';

        while (i < rawLines.length && rawLines[i].trim().startsWith('>')) {
          const cleanLine = rawLines[i].trim().replace(/^>\s?/, '');
          if (cleanLine.startsWith('[!NOTE]') || cleanLine.startsWith('[!INFO]')) {
            calloutType = 'note';
          } else if (cleanLine.startsWith('[!TIP]') || cleanLine.startsWith('[!SUCCESS]')) {
            calloutType = 'tip';
          } else if (cleanLine.startsWith('[!WARNING]') || cleanLine.startsWith('[!CAUTION]')) {
            calloutType = 'warning';
          } else if (cleanLine.startsWith('[!SECURITY]') || cleanLine.startsWith('[!CONSENSUS]')) {
            calloutType = 'security';
          } else {
            quoteLines.push(cleanLine);
          }
          i++;
        }

        const calloutStyles = {
          note: {
            border: 'border-l-4 border-cyan-500 bg-cyan-950/20 text-cyan-200',
            icon: <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />,
            title: 'NOTE'
          },
          tip: {
            border: 'border-l-4 border-emerald-500 bg-emerald-950/20 text-emerald-200',
            icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />,
            title: 'TIP'
          },
          warning: {
            border: 'border-l-4 border-amber-500 bg-amber-950/20 text-amber-200',
            icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />,
            title: 'WARNING'
          },
          security: {
            border: 'border-l-4 border-purple-500 bg-purple-950/20 text-purple-200',
            icon: <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />,
            title: 'ENTERPRISE CONSENSUS'
          },
          standard: {
            border: 'border-l-4 border-slate-600 bg-slate-900/40 text-slate-300',
            icon: null,
            title: null
          }
        }[calloutType];

        elements.push(
          <div
            key={`quote_${blockIdCounter++}`}
            className={`my-3 p-3.5 sm:p-4 rounded-r-xl rounded-l-sm ${calloutStyles.border} space-y-1 text-xs sm:text-sm leading-relaxed`}
          >
            {calloutStyles.title && (
              <div className="flex items-center gap-2 font-mono font-bold text-[11px] tracking-wider uppercase mb-1">
                {calloutStyles.icon}
                <span>{calloutStyles.title}</span>
              </div>
            )}
            {quoteLines.map((qLine, qIdx) => (
              <p key={qIdx}>{formatInlineText(qLine)}</p>
            ))}
          </div>
        );
        continue;
      }

      // 3. Tables: | Col 1 | Col 2 |
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines: string[] = [];
        while (i < rawLines.length && rawLines[i].trim().startsWith('|') && rawLines[i].trim().endsWith('|')) {
          tableLines.push(rawLines[i]);
          i++;
        }

        if (tableLines.length >= 2) {
          const headerRow = tableLines[0].split('|').slice(1, -1).map((c) => c.trim());
          // Skip divider row (row 1 if it contains dashes)
          const dataRows = tableLines.slice(tableLines[1].includes('---') ? 2 : 1).map((row) =>
            row.split('|').slice(1, -1).map((c) => c.trim())
          );

          elements.push(
            <div key={`table_${blockIdCounter++}`} className="my-3.5 overflow-x-auto rounded-xl border border-slate-800 bg-[#070A0F]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#0D131F] text-slate-300 font-mono text-[11px] sm:text-xs border-b border-slate-800 uppercase tracking-wider">
                  <tr>
                    {headerRow.map((h, hIdx) => (
                      <th key={hIdx} className="p-3 font-bold text-white">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-sans">
                  {dataRows.map((dRow, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors">
                      {dRow.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 text-slate-200">
                          {formatInlineText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // 4. Horizontal Rules: --- or ***
      if (/^(\*\*\*|---|___)$/.test(line.trim())) {
        elements.push(
          <div key={`hr_${blockIdCounter++}`} className="my-5 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        );
        i++;
        continue;
      }

      // 5. Headings: # H1, ## H2, ### H3, #### H4
      const h1Match = line.match(/^#\s+(.+)$/);
      if (h1Match) {
        elements.push(
          <h1
            key={`h1_${blockIdCounter++}`}
            className="text-lg sm:text-xl font-bold font-display text-white tracking-tight mt-5 mb-2.5 pb-2 border-b border-white/[0.08] flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#4E82EE] via-[#9B72CF] to-[#E2536A] shadow-[0_0_8px_#9B72CF]" />
            <span>{formatInlineText(h1Match[1])}</span>
          </h1>
        );
        i++;
        continue;
      }

      const h2Match = line.match(/^##\s+(.+)$/);
      if (h2Match) {
        elements.push(
          <h2
            key={`h2_${blockIdCounter++}`}
            className="text-base sm:text-lg font-bold text-slate-100 tracking-tight mt-4 mb-2 flex items-center gap-2"
          >
            <span className="text-cyan-400 font-mono text-xs font-bold">#</span>
            <span>{formatInlineText(h2Match[1])}</span>
          </h2>
        );
        i++;
        continue;
      }

      const h3Match = line.match(/^###\s+(.+)$/);
      if (h3Match) {
        elements.push(
          <h3
            key={`h3_${blockIdCounter++}`}
            className="text-sm sm:text-base font-semibold text-purple-200 mt-3.5 mb-1.5 flex items-center gap-1.5"
          >
            <span className="text-purple-400 font-mono text-xs font-bold">##</span>
            <span>{formatInlineText(h3Match[1])}</span>
          </h3>
        );
        i++;
        continue;
      }

      const h4Match = line.match(/^####\s+(.+)$/);
      if (h4Match) {
        elements.push(
          <h4
            key={`h4_${blockIdCounter++}`}
            className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono mt-3 mb-1"
          >
            {formatInlineText(h4Match[1])}
          </h4>
        );
        i++;
        continue;
      }

      // 6. Lists (Unordered - or *, Ordered 1., Task lists - [x])
      if (/^\s*([*\-]|\d+\.)\s+/.test(line)) {
        const listItems: { raw: string; isTask: boolean; isChecked: boolean; text: string }[] = [];
        const isOrdered = /^\s*\d+\.\s+/.test(line);

        while (i < rawLines.length && /^\s*([*\-]|\d+\.)\s+/.test(rawLines[i])) {
          const lItem = rawLines[i];
          const taskMatch = lItem.match(/^\s*[*\-]\s+\[([ xX])\]\s+(.+)$/);
          if (taskMatch) {
            listItems.push({
              raw: lItem,
              isTask: true,
              isChecked: taskMatch[1].toLowerCase() === 'x',
              text: taskMatch[2]
            });
          } else {
            const cleanText = lItem.replace(/^\s*([*\-]|\d+\.)\s+/, '');
            listItems.push({
              raw: lItem,
              isTask: false,
              isChecked: false,
              text: cleanText
            });
          }
          i++;
        }

        elements.push(
          <div key={`list_${blockIdCounter++}`} className="my-2.5 space-y-1.5 text-xs sm:text-sm text-slate-200">
            {listItems.map((item, lIdx) => {
              if (item.isTask) {
                return (
                  <div key={lIdx} className="flex items-start gap-2.5 pl-1 py-0.5">
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      readOnly
                      className="mt-1 h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-default"
                    />
                    <span className={item.isChecked ? 'line-through text-slate-400' : 'text-slate-200'}>
                      {formatInlineText(item.text)}
                    </span>
                  </div>
                );
              }

              if (isOrdered) {
                return (
                  <div key={lIdx} className="flex items-start gap-2.5 pl-1 py-0.5 leading-relaxed">
                    <span className="font-mono text-cyan-400 font-bold text-xs select-none min-w-[18px]">
                      {lIdx + 1}.
                    </span>
                    <span className="text-slate-200">{formatInlineText(item.text)}</span>
                  </div>
                );
              }

              return (
                <div key={lIdx} className="flex items-start gap-2.5 pl-1 py-0.5 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)] mt-2 shrink-0" />
                  <span className="text-slate-200">{formatInlineText(item.text)}</span>
                </div>
              );
            })}
          </div>
        );
        continue;
      }

      // 7. Regular paragraph / empty line
      if (line.trim() === '') {
        i++;
        continue;
      }

      elements.push(
        <p key={`p_${blockIdCounter++}`} className="my-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          {formatInlineText(line)}
        </p>
      );
      i++;
    }

    return elements;
  };

  return (
    <div className={`gemini-enterprise-markdown ${compact ? 'text-xs' : 'text-sm'} ${className}`}>
      {renderBlocks()}
    </div>
  );
};
