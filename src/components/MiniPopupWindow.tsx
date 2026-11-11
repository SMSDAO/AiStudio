import React from 'react';
import { X, ExternalLink, Copy, Check, Code, FileText, Image as ImageIcon, Sparkles, Layers } from 'lucide-react';
import { MiniappPreviewErrorBoundary } from './ErrorBoundary';

export interface MiniWindowItem {
  type: 'code' | 'page_preview' | 'search_result' | 'file' | 'image';
  title: string;
  category?: string;
  metadata?: string;
  language?: 'javascript' | 'typescript' | 'python' | 'solidity' | 'bash' | string;
  content: string;
  imageUrl?: string;
  previewUrl?: string;
  appId?: string;
}

interface MiniPopupWindowProps {
  item: MiniWindowItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenFullPage: (item: MiniWindowItem) => void;
}

export const MiniPopupWindow: React.FC<MiniPopupWindowProps> = ({
  item,
  isOpen,
  onClose,
  onOpenFullPage,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !item) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(item.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageBorder = (lang?: string) => {
    switch (lang?.toLowerCase()) {
      case 'javascript':
      case 'typescript':
      case 'js':
      case 'ts':
        return 'border-yellow-500/60 shadow-[0_0_20px_rgba(234,179,8,0.2)]';
      case 'python':
      case 'py':
        return 'border-[#3A8DFF]/60 shadow-[0_0_20px_rgba(58,141,255,0.2)]';
      case 'solidity':
      case 'sol':
        return 'border-[#00FF9D]/60 shadow-[0_0_20px_rgba(0,255,157,0.2)]';
      case 'bash':
      case 'sh':
      case 'shell':
        return 'border-[#FF2A55]/60 shadow-[0_0_20px_rgba(255,42,85,0.2)]';
      default:
        return 'border-[#A020F0]/60 shadow-[0_0_20px_rgba(160,32,240,0.2)]';
    }
  };

  const getLanguageBadge = (lang?: string) => {
    switch (lang?.toLowerCase()) {
      case 'javascript':
      case 'typescript':
      case 'js':
      case 'ts':
        return 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30';
      case 'python':
      case 'py':
        return 'bg-[#3A8DFF]/15 text-[#3A8DFF] border border-[#3A8DFF]/30';
      case 'solidity':
      case 'sol':
        return 'bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30';
      case 'bash':
      case 'sh':
      case 'shell':
        return 'bg-[#FF2A55]/15 text-[#FF2A55] border border-[#FF2A55]/30';
      default:
        return 'bg-[#A020F0]/15 text-[#A020F0] border border-[#A020F0]/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Mini Window Modal Container: Full-screen on mobile, compact floating on desktop */}
      <div 
        className={`w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-2xl bg-[#0a0e1c] sm:rounded-2xl border ${getLanguageBorder(item.language)} flex flex-col relative overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.9)]`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/[0.08] bg-[#0c1224]/90 backdrop-blur-md">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300">
              {item.type === 'code' && <Code className="w-4 h-4 text-cyan-400" />}
              {item.type === 'file' && <FileText className="w-4 h-4 text-purple-400" />}
              {item.type === 'image' && <ImageIcon className="w-4 h-4 text-pink-400" />}
              {item.type === 'search_result' && <Sparkles className="w-4 h-4 text-yellow-400" />}
              {item.type === 'page_preview' && <Layers className="w-4 h-4 text-green-400" />}
            </div>
            <div className="truncate">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block truncate">
                AI STUDIO Fast Preview {item.category ? `• ${item.category}` : ''}
              </span>
              <h2 className="text-sm sm:text-base font-semibold text-white truncate">
                {item.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {item.language && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md uppercase font-semibold ${getLanguageBadge(item.language)}`}>
                {item.language}
              </span>
            )}
            {/* Close Button Top-Right */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area protected by Error Boundary */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-sm text-slate-300">
          <MiniappPreviewErrorBoundary>
            {item.metadata && (
              <div className="text-xs font-mono text-slate-400 bg-black/30 p-2.5 rounded-lg border border-white/5">
                <h3 className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-0.5">Metadata & Specs</h3>
                <p>{item.metadata}</p>
              </div>
            )}

            {item.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 p-2 flex justify-center">
                <img src={item.imageUrl} alt={item.title} className="max-h-64 object-contain rounded-lg" />
              </div>
            )}

            {item.type === 'code' || item.type === 'file' ? (
              <div className="relative rounded-xl overflow-hidden bg-[#070913] border border-white/10">
                <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5 text-xs text-slate-400 font-mono">
                  <span>{item.language || 'Plain Text'}</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed whitespace-pre">
                  {item.content}
                </pre>
              </div>
            ) : (
              <div className="space-y-3 leading-relaxed whitespace-pre-line text-slate-300">
                {item.content}
              </div>
            )}
          </MiniappPreviewErrorBoundary>
        </div>

        {/* Footer with "Open Full Page" Button Bottom-Right */}
        <div className="px-4 sm:px-6 py-3 border-t border-white/[0.08] bg-[#0c1224]/90 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
            <span>Powered by AI STUDIO Enterprise Engine</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onOpenFullPage(item);
                onClose();
              }}
              className="px-4 py-2 rounded-[12px] text-xs font-semibold text-white bg-gradient-to-r from-[#A020F0] to-[#3A8DFF] hover:from-[#b030ff] hover:to-[#4a9dff] shadow-[0_0_15px_rgba(160,32,240,0.4)] flex items-center space-x-1.5 transition-all"
            >
              <span>Open Full Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
