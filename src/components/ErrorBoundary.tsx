import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Copy, Check, Terminal, Bug, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  scope?: 'workspace' | 'miniapp' | 'global';
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
  showStack: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showStack: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Safe console logging for AI Studio debugging
    console.error(`[AI STUDIO ${this.props.scope || 'UI'} ErrorBoundary Caught]:`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showStack: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleCopyError = () => {
    const errorDetails = `AI STUDIO Error Report\nScope: ${this.props.scope || 'General'}\nError: ${this.state.error?.message || 'Unknown error'}\nStack: ${this.state.error?.stack || ''}\nComponentStack: ${this.state.errorInfo?.componentStack || ''}`;
    navigator.clipboard.writeText(errorDetails);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  render() {
    if (this.state.hasError) {
      const isMiniappScope = this.props.scope === 'miniapp';

      if (isMiniappScope) {
        return (
          <div className="w-full h-full min-h-[360px] p-4 flex flex-col justify-between bg-[#0b0c16] rounded-2xl border border-red-500/40 text-left font-sans shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-red-500/20">
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase">
                    Miniapp Runtime Exception
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-red-300">
                  CRASH RECOVERED
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">
                  {this.props.fallbackTitle || 'Miniapp execution paused'}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {this.props.fallbackSubtitle || 'A runtime error occurred inside the preview sandbox during AI iteration. The rest of your workspace is protected.'}
                </p>
              </div>

              {/* Error Message Snippet */}
              <div className="p-2.5 rounded-xl bg-black/60 border border-red-500/20 font-mono text-[11px] text-red-300 overflow-x-auto">
                <div className="text-slate-500 text-[10px] uppercase font-bold mb-0.5">Exception details:</div>
                <code>{this.state.error?.message || 'Unexpected state mutation or null pointer reference.'}</code>
              </div>

              {/* Stack trace toggle */}
              {this.state.errorInfo && (
                <div>
                  <button
                    onClick={() => this.setState((prev) => ({ showStack: !prev.showStack }))}
                    className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                  >
                    <span>{this.state.showStack ? 'Hide component trace' : 'View component trace'}</span>
                    {this.state.showStack ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {this.state.showStack && (
                    <pre className="mt-1.5 p-2 rounded-lg bg-black/80 border border-white/5 text-[10px] font-mono text-slate-400 max-h-32 overflow-y-auto whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>

            {/* Recovery actions */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
              <button
                onClick={this.handleCopyError}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center space-x-1"
              >
                {this.state.copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{this.state.copied ? 'Copied' : 'Copy Error'}</span>
              </button>

              <button
                onClick={this.handleReset}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center space-x-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Sandbox</span>
              </button>
            </div>
          </div>
        );
      }

      // Workspace-level or Global Fallback
      return (
        <div className="w-full max-w-4xl mx-auto my-6 p-6 sm:p-8 rounded-2xl bg-[#090d1c] border border-red-500/40 text-left shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(239,68,68,0.25)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold block">
                  AI STUDIO Graceful Crash Shield
                </span>
                <h3 className="text-lg font-bold text-white">
                  {this.props.fallbackTitle || 'Workspace execution interrupted'}
                </h3>
              </div>
            </div>

            <span className="text-xs font-mono px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 font-semibold">
              ISOLATED RECOVERY
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {this.props.fallbackSubtitle || 
              'A runtime error occurred during component synthesis or execution. The Error Boundary prevented your active session from terminating.'}
          </p>

          <div className="p-3.5 rounded-xl bg-black/70 border border-red-500/30 font-mono text-xs text-red-300 overflow-x-auto space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Error trace:</span>
            <code>{this.state.error?.message || 'Unknown runtime error'}</code>
          </div>

          {this.state.errorInfo && (
            <div className="space-y-1">
              <button
                onClick={() => this.setState((prev) => ({ showStack: !prev.showStack }))}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center space-x-1"
              >
                <span>{this.state.showStack ? 'Hide component trace' : 'View component trace'}</span>
                {this.state.showStack ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {this.state.showStack && (
                <pre className="p-3 rounded-xl bg-black/80 border border-white/10 text-[11px] font-mono text-slate-400 max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={this.handleCopyError}
              className="px-3 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center space-x-1.5 transition-colors"
            >
              {this.state.copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              <span>{this.state.copied ? 'Copied Error Report' : 'Copy Diagnostics Report'}</span>
            </button>

            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-[12px] text-xs font-semibold text-white bg-gradient-to-r from-[#A020F0] to-[#3A8DFF] hover:from-[#b030ff] hover:to-[#4a9dff] shadow-[0_0_20px_rgba(160,32,240,0.5)] flex items-center space-x-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset & Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function MiniappPreviewErrorBoundary({ children, onReset }: { children: ReactNode; onReset?: () => void }) {
  return (
    <ErrorBoundary
      scope="miniapp"
      fallbackTitle="Miniapp Preview Error"
      fallbackSubtitle="An isolated error occurred inside this miniapp simulator. Reload the preview without affecting the code editor or dashboard."
      onReset={onReset}
    >
      {children}
    </ErrorBoundary>
  );
}

export function WorkspaceErrorBoundary({ children, onReset }: { children: ReactNode; onReset?: () => void }) {
  return (
    <ErrorBoundary
      scope="workspace"
      fallbackTitle="AI STUDIO Workspace Shield"
      fallbackSubtitle="A component exception was intercepted. Your code changes, smart contract addresses, and session state are preserved."
      onReset={onReset}
    >
      {children}
    </ErrorBoundary>
  );
}
