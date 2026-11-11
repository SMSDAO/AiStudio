import React, { useState } from 'react';
import { 
  Award, 
  Flame, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  Coins, 
  ShieldCheck, 
  Zap, 
  Users, 
  Trophy,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';
import { FlashGlowCard, NeonVariant } from './FlashGlowCard';

interface RewardsViewProps {
  user: UserProfile;
  onAddCredits: (amount: number) => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  user,
  onAddCredits,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const referralLink = `https://aistudio.build/join?ref=${user.address.slice(2, 8)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const badges = [
    {
      title: 'Enterprise Pioneer',
      category: 'ACHIEVEMENT',
      desc: 'Launched first enterprise-grade miniapp on Base L2.',
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      earned: true,
      date: 'Earned 3d ago',
      color: 'border-yellow-500/40 bg-yellow-950/20 text-yellow-300',
    },
    {
      title: 'Solidity Formal Verifier',
      category: 'SMART CONTRACT',
      desc: 'Passed 100% formal verification with zero security alerts.',
      icon: <ShieldCheck className="w-5 h-5 text-[#00FF9D]" />,
      earned: true,
      date: 'Earned 1w ago',
      color: 'border-[#00FF9D]/40 bg-[#00FF9D]/10 text-[#00FF9D]',
    },
    {
      title: '60% Fee Whale',
      category: 'TREASURY',
      desc: 'Claimed over 10.0 ETH in automated creator fee royalties.',
      icon: <Coins className="w-5 h-5 text-purple-400" />,
      earned: true,
      date: 'Earned 2w ago',
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
    },
    {
      title: 'Farcaster Frame v2 Master',
      category: 'SOCIAL WEB3',
      desc: 'Synced 10+ frames directly to Farcaster Hubs network.',
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      earned: true,
      date: 'Earned 4d ago',
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
    },
    {
      title: 'Viral Sensation (100k Users)',
      category: 'GROWTH',
      desc: 'Miniapp reached 100,000 unique onchain active wallets.',
      icon: <Users className="w-5 h-5 text-pink-400" />,
      earned: false,
      date: 'In Progress (64,200/100,000)',
      color: 'border-white/10 bg-white/[0.02] text-slate-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              AI STUDIO Builder Loyalty
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white mt-1">
            Rewards, XP & Badges
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Earn experience points, maintain daily builder streaks, unlock enterprise badges, and collect referral bonuses.
          </p>
        </div>
      </div>

      {/* =========================================================================
          XP & STREAKS SUMMARY
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* XP Level Card */}
        <FlashGlowCard variant="purple" intensity="medium" className="p-6 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Experience Level
              </span>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300">
              LEVEL 8 ARCHITECT
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">XP Progress</span>
              <span className="text-white font-bold">4,850 / 5,000 XP (97%)</span>
            </div>
            {/* XP Progress Bar */}
            <div className="w-full h-3 rounded-full bg-black/50 border border-white/10 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#A020F0] via-[#3A8DFF] to-[#00FF9D] shadow-[0_0_15px_rgba(160,32,240,0.8)]"
                style={{ width: '97%' }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400 block">
              Only 150 XP needed to unlock Level 9: Unlimited Vercel Edge compute & zero-fee token minting.
            </span>
          </div>
        </FlashGlowCard>

        {/* Builder Streak Card */}
        <FlashGlowCard variant="orange" intensity="medium" className="p-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Active Streak
            </span>
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
          </div>

          <div>
            <div className="text-3xl font-bold font-display text-white flex items-center space-x-2">
              <span>14 Days</span>
            </div>
            <p className="text-xs text-orange-400 font-mono mt-1">
              +25% XP multiplier active
            </p>
          </div>

          <span className="text-[10px] font-mono text-slate-400 block pt-2 border-t border-white/[0.06]">
            Deploy 1 prompt today to preserve your streak shield.
          </span>
        </FlashGlowCard>
      </div>

      {/* =========================================================================
          BADGES GRID
          ========================================================================= */}
      <div className="space-y-4">
        <h2 className="text-base font-bold font-display text-white flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>Earned Enterprise Badges</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((b, idx) => {
            const badgeVariants: NeonVariant[] = ['yellow', 'green', 'purple', 'cyan', 'red'];
            const variant = badgeVariants[idx % badgeVariants.length];

            return (
              <FlashGlowCard
                key={idx}
                variant={variant}
                intensity="subtle"
                className="p-4 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                    {b.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider opacity-80">
                    {b.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{b.title}</h3>
                  <p className="text-xs text-slate-300 mt-1">{b.desc}</p>
                </div>

                <div className="text-[10px] font-mono opacity-60 pt-2 border-t border-white/10">
                  {b.date}
                </div>
              </FlashGlowCard>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          REFERRAL BONUSES
          ========================================================================= */}
      <FlashGlowCard variant="cyan" intensity="medium" className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold font-display text-white flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-[#3A8DFF]" />
              <span>Enterprise Referral Program</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Invite other engineers. Earn 100 XP + 50 AI STUDIO credits + 5% of their miniapp fee volume.
            </p>
          </div>

          <button
            onClick={() => onAddCredits(50)}
            className="px-4 py-2 rounded-[12px] bg-gradient-to-r from-[#A020F0] to-[#3A8DFF] hover:from-[#b030ff] hover:to-[#4a9dff] text-white text-xs font-semibold shadow-[0_0_12px_rgba(160,32,240,0.4)] transition-all shrink-0"
          >
            Claim 50 Bonus Credits
          </button>
        </div>

        {/* Referral Link Box */}
        <div className="flex items-center space-x-2 p-2 rounded-xl bg-black/40 border border-white/10">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 bg-transparent border-0 outline-none text-xs font-mono text-purple-300 px-2 select-all"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg text-xs font-mono text-white bg-white/10 hover:bg-white/20 flex items-center space-x-1 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-3 gap-3 pt-2 text-center">
          <div className="p-3 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[10px] font-mono text-slate-400 block">Invited Builders</span>
            <span className="text-base font-mono font-bold text-white">8 Builders</span>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[10px] font-mono text-slate-400 block">Credits Earned</span>
            <span className="text-base font-mono font-bold text-[#00FF9D]">400 Credits</span>
          </div>
          <div className="p-3 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[10px] font-mono text-slate-400 block">Fee Royalty Bonus</span>
            <span className="text-base font-mono font-bold text-purple-300">0.42 ETH</span>
          </div>
        </div>
      </FlashGlowCard>
    </div>
  );
};
