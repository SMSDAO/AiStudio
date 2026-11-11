import React, { useState } from 'react';
import { Send, CheckCircle2, DollarSign, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppItem } from '../../types';

interface Props {
  app: AppItem;
  onTxSuccess?: (txHash: string) => void;
}

export function TippingSimulator({ app, onTxSuccess }: Props) {
  const [amount, setAmount] = useState<number>(5);
  const [recipient, setRecipient] = useState<string>('@dwr.eth');
  const [customMsg, setCustomMsg] = useState<string>('Keep vibe coding! 🔥');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<{
    txHash: string;
    creatorFee: number;
    amount: number;
    timestamp: string;
  } | null>(null);

  const handleTip = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const tx = '0x' + Math.random().toString(16).slice(2) + 'e3f1';
      const creatorFee = amount * 0.6; // 60% fee
      setReceipt({
        txHash: tx,
        creatorFee,
        amount,
        timestamp: 'Just now',
      });
      setIsProcessing(false);
      if (onTxSuccess) onTxSuccess(tx);
      try {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }, 1100);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto p-3 text-slate-200">
      {/* Farcaster Frame Header */}
      <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
            FC
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center space-x-1">
              <span>{app.name}</span>
              <span className="text-[10px] px-1 rounded bg-purple-500/20 text-purple-300">Frames v2</span>
            </div>
            <div className="text-[10px] text-slate-400">Gasless on Base L2</div>
          </div>
        </div>
        <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded-full border border-cyan-500/30">
          60% Fee Split Active
        </div>
      </div>

      {/* Tipping Card */}
      <div className="w-full glass-card p-4 border border-blue-500/30 rounded-2xl relative overflow-hidden">
        <div className="text-xs text-slate-400 font-medium mb-1">Target Farcaster Recipient</div>
        <input 
          type="text" 
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 mb-3 font-mono"
        />

        <div className="text-xs text-slate-400 font-medium mb-1.5">Select Tip Amount (USDC)</div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[1, 5, 20].map((val) => (
            <button
              key={val}
              onClick={() => setAmount(val)}
              className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                amount === val
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              ${val} USDC
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-medium mb-1">Note / Vibe message</div>
        <input 
          type="text" 
          value={customMsg}
          onChange={(e) => setCustomMsg(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 mb-4"
        />

        {/* Tip Button */}
        <button
          onClick={handleTip}
          disabled={isProcessing}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-98 transition-all"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Routing Base L2 Escrow...</span>
            </div>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>SEND ${amount} USDC TIP</span>
            </>
          )}
        </button>

        {/* Receipt view */}
        {receipt && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-green-500/40 text-left animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-green-400 font-bold mb-1">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Tip Settled on Base</span>
              </span>
              <span className="text-[10px] text-slate-400">{receipt.timestamp}</span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-0.5 font-mono">
              <div>Amount: <strong className="text-white">${receipt.amount} USDC</strong></div>
              <div className="text-purple-300">Creator 60% Cut: <strong>${receipt.creatorFee.toFixed(2)} USDC</strong></div>
              <div className="text-slate-500 text-[10px] truncate flex items-center space-x-1">
                <span>Tx: {receipt.txHash}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
