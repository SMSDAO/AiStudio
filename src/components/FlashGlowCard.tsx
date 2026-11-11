import React from 'react';

export type NeonVariant = 
  | 'purple' 
  | 'orange' 
  | 'red' 
  | 'green' 
  | 'yellow' 
  | 'cyan' 
  | 'blue' 
  | 'rainbow-subtle'
  | 'rainbow'; // alias for rainbow-subtle

export type GlowIntensity = 'subtle' | 'medium' | 'high';
export type BlurLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '18px';
export type BorderRadius = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface FlashGlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: NeonVariant;
  intensity?: GlowIntensity;
  animated?: boolean;
  hoverGlow?: boolean;
  selected?: boolean;
  interactive?: boolean;
  blur?: BlurLevel;
  borderRadius?: BorderRadius;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  role?: string;
  tabIndex?: number;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
}

export const FlashGlowCard: React.FC<FlashGlowCardProps> = ({
  variant = 'purple',
  intensity = 'medium',
  animated = true,
  hoverGlow = true,
  selected = false,
  interactive = false,
  blur = '18px',
  borderRadius = 'lg',
  className = '',
  children,
  onClick,
  header,
  footer,
  role,
  tabIndex,
  onKeyDown,
  ...rest
}) => {
  const normalizedVariant = variant === 'rainbow' ? 'rainbow-subtle' : variant;

  // Base background and border styling based on variant & intensity
  const getVariantStyles = () => {
    const bgOpacity = intensity === 'high' ? 'bg-[#0B1019]/90' : intensity === 'subtle' ? 'bg-[#121927]/60' : 'bg-[#121927]/75';

    switch (normalizedVariant) {
      case 'orange':
        return {
          base: `${bgOpacity} border-orange-500/35 text-slate-100`,
          shadow: intensity === 'subtle' 
            ? 'shadow-[0_4px_20px_-4px_rgba(249,115,22,0.12)]' 
            : intensity === 'high' 
            ? 'shadow-[0_8px_32px_rgba(249,115,22,0.28)]' 
            : 'shadow-[0_6px_24px_-2px_rgba(249,115,22,0.18)]',
          hover: hoverGlow ? 'hover:border-orange-400/70 hover:shadow-[0_0_30px_rgba(249,115,22,0.35)]' : '',
          focus: 'focus-visible:ring-orange-500',
          selected: 'ring-2 ring-orange-500 border-orange-400 shadow-[0_0_35px_rgba(249,115,22,0.45)]',
          sweep: 'from-orange-500/0 via-orange-400/25 to-orange-500/0',
          topLine: 'bg-gradient-to-r from-transparent via-orange-500/60 to-transparent',
        };
      case 'red':
        return {
          base: `${bgOpacity} border-red-500/35 text-slate-100`,
          shadow: intensity === 'subtle' 
            ? 'shadow-[0_4px_20px_-4px_rgba(239,68,68,0.12)]' 
            : intensity === 'high' 
            ? 'shadow-[0_8px_32px_rgba(239,68,68,0.28)]' 
            : 'shadow-[0_6px_24px_-2px_rgba(239,68,68,0.18)]',
          hover: hoverGlow ? 'hover:border-red-400/70 hover:shadow-[0_0_30px_rgba(239,68,68,0.35)]' : '',
          focus: 'focus-visible:ring-red-500',
          selected: 'ring-2 ring-red-500 border-red-400 shadow-[0_0_35px_rgba(239,68,68,0.45)]',
          sweep: 'from-red-500/0 via-red-400/25 to-red-500/0',
          topLine: 'bg-gradient-to-r from-transparent via-red-500/60 to-transparent',
        };
      case 'green':
        return {
          base: `${bgOpacity} border-emerald-500/35 text-slate-100`,
          shadow: intensity === 'subtle' 
            ? 'shadow-[0_4px_20px_-4px_rgba(34,197,94,0.12)]' 
            : intensity === 'high' 
            ? 'shadow-[0_8px_32px_rgba(34,197,94,0.28)]' 
            : 'shadow-[0_6px_24px_-2px_rgba(34,197,94,0.18)]',
          hover: hoverGlow ? 'hover:border-emerald-400/70 hover:shadow-[0_0_30px_rgba(34,197,94,0.35)]' : '',
          focus: 'focus-visible:ring-emerald-500',
          selected: 'ring-2 ring-emerald-500 border-emerald-400 shadow-[0_0_35px_rgba(34,197,94,0.45)]',
          sweep: 'from-emerald-500/0 via-emerald-400/25 to-emerald-500/0',
          topLine: 'bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent',
        };
      case 'yellow':
        return {
          base: `${bgOpacity} border-yellow-500/35 text-slate-100`,
          shadow: intensity === 'subtle' 
            ? 'shadow-[0_4px_20px_-4px_rgba(234,179,8,0.12)]' 
            : intensity === 'high' 
            ? 'shadow-[0_8px_32px_rgba(234,179,8,0.28)]' 
            : 'shadow-[0_6px_24px_-2px_rgba(234,179,8,0.18)]',
          hover: hoverGlow ? 'hover:border-yellow-400/70 hover:shadow-[0_0_30px_rgba(234,179,8,0.35)]' : '',
          focus: 'focus-visible:ring-yellow-500',
          selected: 'ring-2 ring-yellow-500 border-yellow-400 shadow-[0_0_35px_rgba(234,179,8,0.45)]',
          sweep: 'from-yellow-500/0 via-yellow-400/25 to-yellow-500/0',
          topLine: 'bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent',
        };
      case 'cyan':
        return {
          base: `${bgOpacity} border-cyan-500/35 text-slate-100`,
          shadow: intensity === 'subtle' 
            ? 'shadow-[0_4px_20px_-4px_rgba(6,182,212,0.12)]' 
            : intensity === 'high' 
            ? 'shadow-[0_8px_32px_rgba(6,182,212,0.28)]' 
            : 'shadow-[0_6px_24px_-2px_rgba(6,182,212,0.18)]',
          hover: hoverGlow ? 'hover:border-cyan-400/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.35)]' : '',
          focus: 'focus-visible:ring-cyan-500',
          selected: 'ring-2 ring-cyan-500 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.45)]',
          sweep: 'from-cyan-500/0 via-cyan-400/25 to-cyan-500/0',
          topLine: 'bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent',
        };
      case 'blue':
        return {
          base: `${bgOpacity} border-blue-500/35 text-slate-100`,
          shadow: intensity === 'subtle' 
            ? 'shadow-[0_4px_20px_-4px_rgba(59,130,246,0.12)]' 
            : intensity === 'high' 
            ? 'shadow-[0_8px_32px_rgba(59,130,246,0.28)]' 
            : 'shadow-[0_6px_24px_-2px_rgba(59,130,246,0.18)]',
          hover: hoverGlow ? 'hover:border-blue-400/70 hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]' : '',
          focus: 'focus-visible:ring-blue-500',
          selected: 'ring-2 ring-blue-500 border-blue-400 shadow-[0_0_35px_rgba(59,130,246,0.45)]',
          sweep: 'from-blue-500/0 via-blue-400/25 to-blue-500/0',
          topLine: 'bg-gradient-to-r from-transparent via-blue-500/60 to-transparent',
        };
      case 'rainbow-subtle':
        return {
          base: `${bgOpacity} border-purple-500/35 text-slate-100`,
          shadow: intensity === 'subtle' 
            ? 'shadow-[0_4px_20px_-4px_rgba(168,85,247,0.15)]' 
            : intensity === 'high' 
            ? 'shadow-[0_8px_36px_rgba(168,85,247,0.32)]' 
            : 'shadow-[0_6px_28px_-2px_rgba(168,85,247,0.22)]',
          hover: hoverGlow ? 'hover:border-cyan-400/60 hover:shadow-[0_0_35px_rgba(168,85,247,0.4)]' : '',
          focus: 'focus-visible:ring-purple-400',
          selected: 'ring-2 ring-purple-500 border-cyan-400 shadow-[0_0_40px_rgba(168,85,247,0.5)]',
          sweep: 'from-purple-500/0 via-cyan-400/30 to-purple-500/0',
          topLine: 'bg-gradient-to-r from-purple-500/50 via-cyan-400/60 via-yellow-400/50 to-orange-500/50',
        };
      case 'purple':
      default:
        return {
          base: `${bgOpacity} border-purple-500/35 text-slate-100`,
          shadow: intensity === 'subtle' 
            ? 'shadow-[0_4px_20px_-4px_rgba(168,85,247,0.12)]' 
            : intensity === 'high' 
            ? 'shadow-[0_8px_32px_rgba(168,85,247,0.28)]' 
            : 'shadow-[0_6px_24px_-2px_rgba(168,85,247,0.18)]',
          hover: hoverGlow ? 'hover:border-purple-400/70 hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]' : '',
          focus: 'focus-visible:ring-purple-500',
          selected: 'ring-2 ring-purple-500 border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.45)]',
          sweep: 'from-purple-500/0 via-purple-400/25 to-purple-500/0',
          topLine: 'bg-gradient-to-r from-transparent via-purple-500/60 to-transparent',
        };
    }
  };

  const getBlurStyle = () => {
    switch (blur) {
      case 'none': return 'backdrop-blur-none';
      case 'sm': return 'backdrop-blur-sm';
      case 'md': return 'backdrop-blur-md';
      case 'lg': return 'backdrop-blur-lg';
      case 'xl': return 'backdrop-blur-xl';
      case '18px':
      default: return 'backdrop-blur-[18px]';
    }
  };

  const getRadiusStyle = () => {
    switch (borderRadius) {
      case 'sm': return 'rounded-[12px]';
      case 'md': return 'rounded-[18px]';
      case 'lg': return 'rounded-[24px]';
      case 'xl': return 'rounded-[30px]';
      case '2xl': return 'rounded-2xl';
      case '3xl': return 'rounded-[2rem]';
      default: return 'rounded-[24px]';
    }
  };

  const variantStyles = getVariantStyles();

  const isClickable = Boolean(onClick || interactive);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    } else if (isClickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={role || (isClickable ? 'button' : undefined)}
      tabIndex={tabIndex ?? (isClickable ? 0 : undefined)}
      className={`
        relative border transition-all duration-300 overflow-hidden
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070B]
        ${variantStyles.base}
        ${variantStyles.shadow}
        ${variantStyles.hover}
        ${variantStyles.focus}
        ${selected ? variantStyles.selected : ''}
        ${getBlurStyle()}
        ${getRadiusStyle()}
        ${isClickable ? 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0 select-none' : ''}
        motion-reduce:transition-none motion-reduce:transform-none
        ${className}
      `}
      {...rest}
    >
      {/* Top Border Glow Accent Line */}
      <div 
        className={`absolute top-0 inset-x-0 h-[1.5px] ${variantStyles.topLine} pointer-events-none z-10`} 
      />

      {/* Subtle Light Sweep Effect (Pointer-Events-None & Motion-Reduce Safe) */}
      {animated && (
        <div 
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden z-0 motion-reduce:hidden"
        >
          <div 
            className={`w-[60%] h-full bg-gradient-to-r ${variantStyles.sweep} -skew-x-12 animate-light-sweep`}
          />
        </div>
      )}

      {/* Inner Content Structure */}
      <div className="relative z-10 w-full h-full">
        {header && <div className="mb-3">{header}</div>}
        {children}
        {footer && <div className="mt-3 pt-3 border-t border-white/[0.06]">{footer}</div>}
      </div>
    </div>
  );
};

export default FlashGlowCard;
