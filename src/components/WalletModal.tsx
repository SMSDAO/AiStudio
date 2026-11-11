import React, { useState } from 'react';
import { Wallet, Copy, Check, ExternalLink, ShieldCheck, X, RefreshCw } from 'lucide-react';
import { UserSession } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession;
  onSwitchAddress: (newAddress: string) => void;
}

export function WalletModal({ isOpen, onClose, user, onSwitchAddress }: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(user.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRandomize = () => {
    const chars = '0123456789abcdef';
    let addr = '0x';
    for (let i = 0; i < 40; i++) {
      addr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    onSwitchAddress(addr);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel border border-cyan-500/40 rounded-3xl p-6 relative shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-white">Base Smart Wallet</h3>
            <p className="text-xs text-slate-400 font-mono">Gasless Privy / Coinbase Embedded Wallet</p>
          </div>
        </div>

        {/* Address Box */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-mono">Connected Address (Base L2)</div>
            <div className="text-xs font-mono text-cyan-300 font-bold break-all">{user.address}</div>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white ml-2 flex-shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Balance preview */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-slate-400">ETH Balance</div>
            <div className="text-sm font-bold text-white mt-0.5">1.450 ETH</div>
            <div className="text-[10px] text-cyan-400">Base Sepolia & Mainnet</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] text-slate-400">USDC Balance</div>
            <div className="text-sm font-bold text-green-400 mt-0.5">$3,420.00</div>
            <div className="text-[10px] text-slate-400">Native Circle USDC</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleRandomize}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center justify-center space-x-2 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Switch to Another Base Account</span>
          </button>

          <a
            href={`https://basescan.org/address/${user.address}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 text-xs font-mono flex items-center justify-center space-x-1.5 transition-all"
          >
            <span>View on BaseScan Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
