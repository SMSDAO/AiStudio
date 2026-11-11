import React, { useState } from 'react';
import { LucideIcon, Check, Copy, AlertTriangle, RefreshCw, X, Send, Paperclip, ChevronDown } from 'lucide-react';
import { FlashGlowCard, NeonVariant } from './FlashGlowCard';

/* Re-export FlashGlowCard for library convenience */
export { FlashGlowCard };

/* -------------------------------------------------------------------------- */
/* 1. GlassCard                                                               */
/* -------------------------------------------------------------------------- */
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  ...props
}) => (
  <div
    className={`
      bg-[#121927]/75 backdrop-blur-[18px] 
      border border-slate-700/35 rounded-[18px] 
      shadow-[0_8px_30px_rgb(0_0_0/0.4)]
      ${hoverEffect ? 'transition-all duration-300 hover:border-slate-500/50 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]' : ''}
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

/* -------------------------------------------------------------------------- */
/* 2. GlassPanel                                                              */
/* -------------------------------------------------------------------------- */
export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  title,
  badge,
  action,
  className = '',
  ...props
}) => (
  <div
    className={`bg-[#0B1019]/85 backdrop-blur-[18px] border border-slate-800/80 rounded-[20px] p-5 shadow-xl ${className}`}
    {...props}
  >
    {(title || badge || action) && (
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
        <div className="flex items-center space-x-2.5">
          {title && <h3 className="font-display font-semibold text-white text-base">{title}</h3>}
          {badge}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
);

/* -------------------------------------------------------------------------- */
/* 3. GlassHeader & GlassSidebar & GlassNavigation                            */
/* -------------------------------------------------------------------------- */
export const GlassHeader: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <header
    className={`sticky top-0 z-30 w-full backdrop-blur-[20px] bg-[#05070B]/85 border-b border-white/[0.08] shadow-lg ${className}`}
    {...props}
  >
    {children}
  </header>
);

export const GlassSidebar: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <aside
    className={`backdrop-blur-[24px] bg-[#0B1019]/90 border-r border-white/[0.08] shadow-2xl ${className}`}
    {...props}
  >
    {children}
  </aside>
);

export const GlassNavigation: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <nav
    className={`flex items-center p-1 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[14px] ${className}`}
    {...props}
  >
    {children}
  </nav>
);

/* -------------------------------------------------------------------------- */
/* 4. GlassTabs                                                               */
/* -------------------------------------------------------------------------- */
export interface GlassTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface GlassTabsProps {
  tabs: GlassTabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'purple' | 'cyan' | 'blue';
}

export const GlassTabs: React.FC<GlassTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'purple',
}) => {
  const getActiveIndicator = () => {
    switch (variant) {
      case 'cyan': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]';
      case 'blue': return 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]';
      case 'purple':
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]';
    }
  };

  return (
    <div className={`flex items-center space-x-1 p-1 bg-[#0B1019]/80 backdrop-blur-md border border-white/10 rounded-[14px] overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center space-x-2 px-3.5 py-1.5 rounded-[10px] text-xs font-mono font-medium transition-all whitespace-nowrap border
              ${isActive ? `${getActiveIndicator()} border` : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'}
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. Glass Inputs & Controls                                                 */
/* -------------------------------------------------------------------------- */
export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  neonBorder?: boolean;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ icon, neonBorder = true, className = '', ...props }, ref) => (
    <div className="relative flex items-center w-full">
      {icon && (
        <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        className={`
          w-full bg-[#0B1019]/80 backdrop-blur-md border border-white/10 rounded-[14px]
          text-slate-100 text-sm placeholder:text-slate-500
          transition-all duration-200
          focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30
          ${neonBorder ? 'focus:shadow-[0_0_20px_rgba(168,85,247,0.25)]' : ''}
          ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
    </div>
  )
);
GlassInput.displayName = 'GlassInput';

export interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  neonBorder?: boolean;
}

export const GlassTextarea = React.forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ neonBorder = true, className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`
        w-full bg-[#0B1019]/80 backdrop-blur-md border border-white/10 rounded-[16px]
        text-slate-100 text-sm placeholder:text-slate-500
        transition-all duration-200 p-3.5
        focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30
        ${neonBorder ? 'focus:shadow-[0_0_20px_rgba(168,85,247,0.25)]' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  )
);
GlassTextarea.displayName = 'GlassTextarea';

/* -------------------------------------------------------------------------- */
/* 6. NeonButton & NeonIconButton                                             */
/* -------------------------------------------------------------------------- */
export interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: NeonVariant;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  variant = 'purple',
  loading = false,
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'cyan':
        return 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_18px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] border border-cyan-400/40';
      case 'green':
        return 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_18px_rgba(34,197,94,0.35)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] border border-emerald-400/40';
      case 'orange':
        return 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-[0_0_18px_rgba(249,115,22,0.35)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] border border-orange-400/40';
      case 'red':
        return 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.35)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] border border-red-400/40';
      case 'blue':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_18px_rgba(59,130,246,0.35)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] border border-blue-400/40';
      case 'purple':
      default:
        return 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_18px_rgba(168,85,247,0.35)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] border border-purple-400/40';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'px-3 py-1.5 text-xs rounded-[10px]';
      case 'lg': return 'px-6 py-3 text-base rounded-[16px] font-semibold';
      case 'md':
      default: return 'px-4 py-2 text-sm rounded-[12px] font-medium';
    }
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center space-x-2 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#05070B]
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <RefreshCw className="w-4 h-4 animate-spin text-white" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children && <span>{children}</span>}
    </button>
  );
};

export const NeonIconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: NeonVariant }> = ({
  variant = 'purple',
  children,
  className = '',
  ...props
}) => (
  <button
    className={`
      p-2 rounded-[12px] bg-white/[0.04] backdrop-blur-md border border-white/10 text-slate-300
      hover:text-white transition-all duration-200
      hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]
      active:scale-95 disabled:opacity-50
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

/* -------------------------------------------------------------------------- */
/* 7. NeonBadge, NeonStatus, NeonProgress                                     */
/* -------------------------------------------------------------------------- */
export const NeonBadge: React.FC<{
  variant?: NeonVariant;
  children: React.ReactNode;
  className?: string;
}> = ({ variant = 'purple', children, className = '' }) => {
  const getBadgeColors = () => {
    switch (variant) {
      case 'cyan': return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'green': return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'yellow': return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
      case 'orange': return 'bg-orange-500/15 text-orange-300 border-orange-500/30';
      case 'red': return 'bg-red-500/15 text-red-300 border-red-500/30';
      case 'blue': return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'purple':
      default: return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[8px] border text-[11px] font-mono tracking-wider uppercase font-semibold ${getBadgeColors()} ${className}`}>
      {children}
    </span>
  );
};

export const NeonStatus: React.FC<{
  status?: 'active' | 'warning' | 'error' | 'success' | 'idle';
  label?: string;
}> = ({ status = 'active', label }) => {
  const getDotStyles = () => {
    switch (status) {
      case 'success': return 'bg-emerald-400 shadow-[0_0_10px_#22C55E]';
      case 'warning': return 'bg-yellow-400 shadow-[0_0_10px_#EAB308]';
      case 'error': return 'bg-red-400 shadow-[0_0_10px_#EF4444]';
      case 'idle': return 'bg-slate-400 shadow-[0_0_8px_#64748B]';
      case 'active':
      default: return 'bg-cyan-400 shadow-[0_0_10px_#06B6D4]';
    }
  };

  return (
    <div className="inline-flex items-center space-x-2">
      <span className={`w-2 h-2 rounded-full ${getDotStyles()} animate-pulse`} />
      {label && <span className="text-xs font-mono text-slate-300">{label}</span>}
    </div>
  );
};

export const NeonProgress: React.FC<{
  value: number; // 0 to 100
  variant?: NeonVariant;
  className?: string;
}> = ({ value, variant = 'purple', className = '' }) => {
  const clamped = Math.min(100, Math.max(0, value));

  const getBarColor = () => {
    switch (variant) {
      case 'cyan': return 'from-cyan-500 to-blue-500 shadow-[0_0_10px_#06B6D4]';
      case 'green': return 'from-emerald-500 to-teal-400 shadow-[0_0_10px_#22C55E]';
      case 'orange': return 'from-orange-500 to-amber-400 shadow-[0_0_10px_#F97316]';
      case 'purple':
      default: return 'from-purple-500 to-indigo-500 shadow-[0_0_10px_#A855F7]';
    }
  };

  return (
    <div className={`w-full h-2 bg-slate-900/90 rounded-full overflow-hidden border border-white/[0.08] ${className}`}>
      <div
        className={`h-full bg-gradient-to-r ${getBarColor()} transition-all duration-500 rounded-full`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 8. GlassCodePanel                                                          */
/* -------------------------------------------------------------------------- */
export interface GlassCodePanelProps {
  code: string;
  language?: string;
  fileName?: string;
  className?: string;
}

export const GlassCodePanel: React.FC<GlassCodePanelProps> = ({
  code,
  language = 'typescript',
  fileName,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-[#070B12]/95 border border-slate-800/80 rounded-[16px] overflow-hidden shadow-2xl font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          {fileName && <span className="ml-2 text-slate-400 text-xs">{fileName}</span>}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-semibold text-purple-400 px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/30">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-1 rounded-[8px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-all"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto text-slate-200 leading-relaxed max-h-[420px]">
        <pre className="font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 9. GlassComposer                                                           */
/* -------------------------------------------------------------------------- */
export interface GlassComposerProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isGenerating?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const GlassComposer: React.FC<GlassComposerProps> = ({
  value,
  onChange,
  onSubmit,
  onStop,
  isGenerating = false,
  placeholder = 'Describe your enterprise app or feature...',
  disabled = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="relative w-full rounded-[20px] bg-[#0B1019]/85 backdrop-blur-[20px] border border-white/15 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus-within:border-purple-500/70 focus-within:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-white rounded-[12px] hover:bg-white/[0.05] transition-all"
          title="Add Attachment"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isGenerating}
          className="flex-1 bg-transparent border-none text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-0 px-2 py-1"
        />

        {isGenerating ? (
          <button
            type="button"
            onClick={onStop}
            className="px-3 py-1.5 rounded-[12px] bg-red-600/80 hover:bg-red-600 text-white font-mono text-xs font-semibold flex items-center space-x-1 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            <span>Stop</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!value.trim() || disabled}
            className="p-2.5 rounded-[12px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 10. GlassDialog & GlassDrawer                                              */
/* -------------------------------------------------------------------------- */
export interface GlassDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GlassDialog: React.FC<GlassDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  if (!isOpen) return null;

  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-md';
      case 'lg': return 'max-w-3xl';
      case 'xl': return 'max-w-5xl';
      case 'md':
      default: return 'max-w-xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full ${getMaxWidth()} bg-[#0B1019]/95 backdrop-blur-[24px] border border-purple-500/35 rounded-[24px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(168,85,247,0.25)] overflow-hidden`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <h2 className="text-lg font-display font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-[10px] hover:bg-white/[0.06] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 11. GlassEmptyState & GlassErrorState                                      */
/* -------------------------------------------------------------------------- */
export const GlassEmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-[#0B1019]/60 backdrop-blur-md border border-white/[0.06] rounded-[20px] max-w-md mx-auto">
    {icon && <div className="text-purple-400 mb-3">{icon}</div>}
    <h4 className="text-base font-display font-semibold text-white mb-1">{title}</h4>
    <p className="text-xs text-slate-400 mb-4">{description}</p>
    {action}
  </div>
);

export const GlassErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
}> = ({ title = 'Encountered an issue', message, onRetry }) => (
  <div className="flex items-start space-x-3 p-4 bg-red-950/40 border border-red-500/35 rounded-[16px] backdrop-blur-md">
    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-red-200">{title}</h4>
      <p className="text-xs text-red-300/80 mt-0.5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-xs font-mono text-red-300 hover:text-white underline flex items-center space-x-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  </div>
);
