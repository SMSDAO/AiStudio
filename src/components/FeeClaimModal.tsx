import React, { useState } from 'react';
import { Coins, CheckCircle, ExternalLink, X, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppItem, UserSession } from '../types';

interface Props {
  app: AppItem | null;
  user: UserSession;
  isOpen: boolean;
  onClose: () => void;
  onConfirmClaim: (appId: string, claimedAmount: number) => void;
}

export function FeeClaimModal({ app, user, isOpen, onClose, onConfirmClaim }: Props) {
  const [claimPercent, setClaimPercent] = useState<number>(100);
  const [isClaiming, setIsClaiming] = useState(false);
  const [txReceipt, setTxReceipt] = useState<string | null>(null);

  if (!isOpen || !app) return null;

  const totalUnclaimed = app.wallet.unclaimedFeesEth;
  const amountToClaim = (totalUnclaimed * (claimPercent / 100));
  const usdValue = amountToClaim * 3340;

  const handleClaim = () => {
    setIsClaiming(true);
    setTimeout(() => {
      const tx = '0x' + Math.random().toString(16).slice(2) + 'fee7';
      setTxReceipt(tx);
      setIsClaiming(false);
      onConfirmClaim(app.id, amountToClaim);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#a855f7', '#06b6d4'],
        });
      } catch {
        // ignore
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel border border-green-500/40 rounded-3xl p-6 relative shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-green-500/20 border border-green-500 flex items-center justify-center text-green-400">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-white">Claim 60% Creator Fees</h3>
            <p className="text-xs text-slate-400 font-mono">{app.name} ({app.token?.symbol || '$APP'})</p>
          </div>
        </div>

        {/* Claim Amount Display */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-950/40 to-slate-900 border border-green-500/30 text-center space-y-1">
          <div className="text-[10px] text-green-400 uppercase font-mono tracking-wider">
            Total Accrued Creator Fees
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {amountToClaim.toFixed(4)} ETH
          </div>
          <div className="text-xs text-green-300 font-mono">
            ~${usdValue.toFixed(2)} USD
          </div>
        </div>

        {/* Slider for partial withdrawal */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
            <span>Withdrawal Percentage</span>
            <span className="text-white font-bold">{claimPercent}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="10"
            value={claimPercent}
            onChange={(e) => setClaimPercent(Number(e.target.value))}
            className="w-full accent-green-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100% (Max)</span>
          </div>
        </div>

        {/* Recipient info */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
          <div className="text-[10px] text-slate-400">Destination Wallet</div>
          <div className="text-cyan-300 truncate font-bold mt-0.5">{user.address}</div>
          <div className="text-[10px] text-slate-400 mt-1">Direct Base L2 transfer • Zero gas fees</div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleClaim}
          disabled={isClaiming || !!txReceipt || totalUnclaimed <= 0}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(34,197,94,0.6)] flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-98 transition-all"
        >
          {isClaiming ? (
            <span>Routing Settlement on Base...</span>
          ) : txReceipt ? (
            <span>FEES CLAIMED SUCCESSFULLY!</span>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>CONFIRM WITHDRAWAL OF {amountToClaim.toFixed(3)} ETH</span>
            </>
          )}
        </button>

        {txReceipt && (
          <div className="p-3 rounded-2xl bg-green-950/60 border border-green-500/40 text-xs font-mono text-green-300 space-y-1">
            <div className="flex items-center space-x-1 font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Transferred to your Base wallet!</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Tx: {txReceipt}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
