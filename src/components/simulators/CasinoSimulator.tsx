import React, { useState } from 'react';
import { Dices, Flame, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppItem } from '../../types';

interface Props {
  app: AppItem;
  onTxSuccess?: (txHash: string) => void;
}

export function CasinoSimulator({ app, onTxSuccess }: Props) {
  const [bet, setBet] = useState(0.01);
  const [targetNumber, setTargetNumber] = useState(50);
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [won, setWon] = useState<boolean | null>(null);
  const [stats, setStats] = useState({ plays: 14, wins: 8, netProfit: +0.08 });

  const winChance = 100 - targetNumber;
  const multiplier = Number((98 / winChance).toFixed(2));

  const handleRoll = () => {
    setIsRolling(true);
    setWon(null);

    setTimeout(() => {
      const outcome = Math.floor(Math.random() * 100) + 1;
      setLastRoll(outcome);
      const isWin = outcome > targetNumber;
      setWon(isWin);
      setIsRolling(false);

      setStats((prev) => ({
        plays: prev.plays + 1,
        wins: isWin ? prev.wins + 1 : prev.wins,
        netProfit: isWin ? prev.netProfit + bet * (multiplier - 1) : prev.netProfit - bet,
      }));

      if (isWin) {
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      }

      if (onTxSuccess) {
        onTxSuccess('0x' + Math.random().toString(16).slice(2) + 'd1ce');
      }
    }, 900);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto p-3 text-slate-200">
      {/* Header Stat Bar */}
      <div className="w-full flex items-center justify-between p-2 rounded-xl bg-orange-950/30 border border-orange-500/30 mb-3 text-xs">
        <div className="text-orange-400 font-bold flex items-center space-x-1">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Multiplier: <strong className="text-white">{multiplier}x</strong></span>
        </div>
        <div className="text-green-400 font-mono">
          Win Chance: <strong>{winChance}%</strong>
        </div>
      </div>

      {/* Cyber Dice Result Box */}
      <div className="w-full h-32 rounded-2xl glass-card border-2 border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.3)] flex flex-col items-center justify-center relative overflow-hidden mb-3">
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

        {isRolling ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="text-4xl animate-bounce">🎲</div>
            <div className="text-xs font-mono text-orange-400 animate-pulse">Requesting Base VRF...</div>
          </div>
        ) : lastRoll !== null ? (
          <div className="text-center animate-in zoom-in-50 duration-200">
            <div className={`text-5xl font-black font-display ${won ? 'text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]' : 'text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]'}`}>
              {lastRoll}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider mt-1">
              {won ? (
                <span className="text-green-400">🎉 WON +{(bet * multiplier).toFixed(3)} ETH!</span>
              ) : (
                <span className="text-red-400">FAILED (Rolled under {targetNumber})</span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 text-xs">
            <Dices className="w-8 h-8 text-orange-400 mx-auto mb-1 opacity-80" />
            <span>Roll over {targetNumber} to win {multiplier}x</span>
          </div>
        )}

        <div className="absolute bottom-1 right-2 text-[9px] text-slate-500 font-mono">
          60% of House Cut goes to $ROLL holders
        </div>
      </div>

      {/* Slider & Bet Config */}
      <div className="w-full space-y-3 mb-3">
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Roll Over Target: <strong className="text-white">{targetNumber}</strong></span>
            <span>Win: {100 - targetNumber}%</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="95" 
            value={targetNumber}
            onChange={(e) => setTargetNumber(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[0.005, 0.01, 0.05].map((val) => (
            <button
              key={val}
              onClick={() => setBet(val)}
              className={`py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                bet === val 
                  ? 'bg-orange-500/30 border-orange-400 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {val} ETH
            </button>
          ))}
        </div>
      </div>

      {/* Roll Button */}
      <button
        onClick={handleRoll}
        disabled={isRolling}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-red-500 hover:from-orange-500 hover:to-red-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(249,115,22,0.5)] flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-98 transition-all"
      >
        <Dices className="w-3.5 h-3.5" />
        <span>ROLL DICE ({bet} ETH)</span>
      </button>
    </div>
  );
}
