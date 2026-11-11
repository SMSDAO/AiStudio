import React, { useState } from 'react';
import { Zap, Check, ShieldCheck, CreditCard, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddCredits: (amount: number) => void;
  currentBalance: number;
}

const BUNDLES = [
  { id: 'b1', credits: 50, priceUsd: 10, ethPrice: '0.003 ETH', tag: 'Starter' },
  { id: 'b2', credits: 150, priceUsd: 25, ethPrice: '0.0075 ETH', tag: 'Popular ⚡', highlight: true },
  { id: 'b3', credits: 500, priceUsd: 75, ethPrice: '0.022 ETH', tag: 'Studio / Agency' },
];

export function CreditModal({ isOpen, onClose, onAddCredits, currentBalance }: Props) {
  const [selectedBundle, setSelectedBundle] = useState(BUNDLES[1]);
  const [paymentMethod, setPaymentMethod] = useState<'base_eth' | 'base_usdc' | 'coinbase'>('base_eth');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onAddCredits(selectedBundle.credits);
      setIsProcessing(false);
      onClose();
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel border border-purple-500/40 rounded-3xl p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500 flex items-center justify-center text-purple-300">
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-white">Top Up ViniApp Credits</h3>
            <p className="text-xs text-slate-400 font-mono">Current Balance: <strong className="text-purple-300">{currentBalance} CR</strong></p>
          </div>
        </div>

        {/* Bundles */}
        <div className="space-y-2.5 my-4">
          {BUNDLES.map((bundle) => (
            <button
              key={bundle.id}
              onClick={() => setSelectedBundle(bundle)}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                selectedBundle.id === bundle.id
                  ? 'bg-purple-600/30 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold font-display text-white">{bundle.credits} Credits</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-purple-300 font-mono">
                    {bundle.tag}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 font-mono">{bundle.ethPrice} on Base L2</div>
              </div>

              <div className="text-right">
                <div className="text-base font-black font-display text-white">${bundle.priceUsd}</div>
                <div className="text-[10px] text-green-400 font-mono">Instant delivery</div>
              </div>
            </button>
          ))}
        </div>

        {/* Payment selector */}
        <div className="mb-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase mb-1.5">Payment Method</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'base_eth', label: 'ETH (Base)' },
              { id: 'base_usdc', label: 'USDC (Base)' },
              { id: 'coinbase', label: 'Coinbase Pay' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id as any)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                  paymentMethod === m.id
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Purchase button */}
        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-98 transition-all"
        >
          {isProcessing ? (
            <span>Processing Base Transaction...</span>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>PAY ${selectedBundle.priceUsd} & RECEIVE {selectedBundle.credits} CR</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
