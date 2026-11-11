import React, { useState } from 'react';
import { TrendingUp, HelpCircle, Check, ArrowRight, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppItem } from '../../types';

interface Props {
  app: AppItem;
  onTxSuccess?: (txHash: string) => void;
}

export function PredictionSimulator({ app, onTxSuccess }: Props) {
  const [selectedSide, setSelectedSide] = useState<'YES' | 'NO'>('YES');
  const [amountUsdc, setAmountUsdc] = useState<number>(25);
  const [isBetting, setIsBetting] = useState(false);
  const [sharesOwned, setSharesOwned] = useState({ yes: 80, no: 0 });
  const [lastTx, setLastTx] = useState<string | null>(null);

  const yesProbability = 68; // 68%
  const noProbability = 32;

  const handlePredict = () => {
    setIsBetting(true);
    setTimeout(() => {
      const tx = '0x' + Math.random().toString(16).slice(2) + '99aa';
      setLastTx(tx);
      setSharesOwned((prev) => ({
        yes: selectedSide === 'YES' ? prev.yes + Math.floor(amountUsdc * 1.45) : prev.yes,
        no: selectedSide === 'NO' ? prev.no + Math.floor(amountUsdc * 3.1) : prev.no,
      }));
      setIsBetting(false);
      if (onTxSuccess) onTxSuccess(tx);
      try {
        confetti({ particleCount: 65, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto p-3 text-slate-200">
      {/* Market Question */}
      <div className="w-full glass-card p-3 border border-yellow-500/30 rounded-2xl mb-3">
        <div className="flex items-center space-x-1.5 text-[10px] text-yellow-400 font-mono mb-1">
          <Activity className="w-3 h-3 text-yellow-400" />
          <span>AUTONOMOUS ORACLE MARKET</span>
        </div>
        <h3 className="text-xs font-bold text-white mb-2 leading-snug">
          Will Base hit 100M active monthly users before Q4 2026?
        </h3>

        {/* Probability bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-800 flex overflow-hidden mb-2">
          <div 
            className="bg-green-500 h-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"
            style={{ width: `${yesProbability}%` }}
          />
          <div 
            className="bg-red-500 h-full"
            style={{ width: `${noProbability}%` }}
          />
        </div>

        <div className="flex justify-between text-xs font-mono">
          <span className="text-green-400 font-bold">YES: {yesProbability}% ($0.68)</span>
          <span className="text-red-400 font-bold">NO: {noProbability}% ($0.32)</span>
        </div>
      </div>

      {/* Side selector */}
      <div className="grid grid-cols-2 gap-2 w-full mb-3">
        <button
          onClick={() => setSelectedSide('YES')}
          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
            selectedSide === 'YES'
              ? 'bg-green-500/20 border-green-400 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          BUY YES (68¢)
        </button>
        <button
          onClick={() => setSelectedSide('NO')}
          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
            selectedSide === 'NO'
              ? 'bg-red-500/20 border-red-400 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          BUY NO (32¢)
        </button>
      </div>

      {/* Preset Amounts */}
      <div className="w-full grid grid-cols-3 gap-2 mb-3">
        {[10, 25, 100].map((val) => (
          <button
            key={val}
            onClick={() => setAmountUsdc(val)}
            className={`py-1.5 rounded-xl text-xs font-mono border ${
              amountUsdc === val 
                ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            ${val} USDC
          </button>
        ))}
      </div>

      {/* Execute */}
      <button
        onClick={handlePredict}
        disabled={isBetting}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-98 transition-all"
      >
        <span>EXECUTE ${amountUsdc} PREDICTION</span>
      </button>

      {lastTx && (
        <div className="mt-2 text-[10px] text-green-400 font-mono">
          Settled on Base: {lastTx.slice(0, 12)}...
        </div>
      )}
    </div>
  );
}
