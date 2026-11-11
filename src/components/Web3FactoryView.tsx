/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS AI STUDIO V12.0.0 — Web3 & Blockchain Factory View
 * Section 13 Specification:
 * - Base L2 Wallet balances & connection
 * - Uniswap v4 quote calculation & swap engine
 * - Explicit user confirmation gate (no unauthorized autonomous signing)
 * - BaseScan explorer link read-back
 */

import React, { useState } from 'react';
import { 
  Coins, 
  ArrowDownUp, 
  Wallet, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  AlertTriangle,
  Lock
} from 'lucide-react';
import { web3SwapService, SUPPORTED_TOKENS, SwapQuote, ExecutedSwapRecord } from '../services/web3SwapService';
import { FlashGlowCard } from './FlashGlowCard';

export const Web3FactoryView: React.FC = () => {
  const [tokens] = useState(() => web3SwapService.getTokens());
  const [fromSymbol, setFromSymbol] = useState<string>('ETH');
  const [toSymbol, setToSymbol] = useState<string>('CLANKER');
  const [fromAmount, setFromAmount] = useState<number>(0.1);
  const [userConfirmed, setUserConfirmed] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [executedTx, setExecutedTx] = useState<ExecutedSwapRecord | null>(null);

  const quote: SwapQuote = web3SwapService.getQuote(fromSymbol, toSymbol, fromAmount);
  const history = web3SwapService.getSwapHistory();

  const handleExecuteSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userConfirmed || isSwapping) return;

    setIsSwapping(true);
    try {
      const rec = await web3SwapService.executeSwap(quote, userConfirmed);
      setExecutedTx(rec);
      setUserConfirmed(false);
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <FlashGlowCard variant="yellow" intensity="medium" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                WEB3 & BLOCKCHAIN FACTORY V12.0.0
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                Base L2 Smart Account Connected
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Onchain Token & Swap Engine
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
              Uniswap v4 liquidity routing on Base L2, automated 60% creator royalty distribution, and verifiable transaction telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-yellow-500/30 text-yellow-300 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" />
              0x71C...49A1 (Base)
            </span>
          </div>
        </div>
      </FlashGlowCard>

      {/* Main Grid: Wallet Balances & Swap Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Token Balances */}
        <div className="space-y-4">
          <FlashGlowCard variant="yellow" intensity="subtle" className="p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-yellow-400" />
                Token Reserves (Base L2)
              </span>
            </div>

            <div className="space-y-2">
              {tokens.map((token) => (
                <div key={token.symbol} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center text-xs font-mono">
                  <div>
                    <div className="font-bold text-white">{token.symbol}</div>
                    <div className="text-[10px] text-slate-500">${token.priceUsd.toLocaleString()} USD</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold">{token.balance.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">${(token.balance * token.priceUsd).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </FlashGlowCard>
        </div>

        {/* Center / Right: Interactive Swap Engine */}
        <div className="lg:col-span-2 space-y-4">
          <FlashGlowCard variant="yellow" intensity="medium" className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowDownUp className="w-4 h-4 text-yellow-400" />
                Uniswap v4 Instant Quote & Swap
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                60% Creator Fee Split Enabled
              </span>
            </div>

            <form onSubmit={handleExecuteSwap} className="space-y-4">
              {/* From Row */}
              <div className="p-3 bg-black/60 border border-slate-800 rounded-xl space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Pay Amount</span>
                  <span>Balance: {tokens.find((t) => t.symbol === fromSymbol)?.balance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.001"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(Number(e.target.value))}
                    className="flex-1 bg-transparent text-xl font-bold font-mono text-white focus:outline-none"
                  />
                  <select
                    value={fromSymbol}
                    onChange={(e) => setFromSymbol(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
                  >
                    {tokens.map((t) => (
                      <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* To Row */}
              <div className="p-3 bg-black/60 border border-slate-800 rounded-xl space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Receive (Estimated)</span>
                  <span>1 {fromSymbol} = {quote.exchangeRate} {toSymbol}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 text-xl font-bold font-mono text-cyan-300">
                    {quote.toAmount.toLocaleString()}
                  </div>
                  <select
                    value={toSymbol}
                    onChange={(e) => setToSymbol(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
                  >
                    {tokens.map((t) => (
                      <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Route & Fee Telemetry */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Route:</span>
                  <span className="text-slate-300">{quote.route}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Price Impact:</span>
                  <span className="text-emerald-400 font-bold">{quote.priceImpactPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Base Gas:</span>
                  <span className="text-white">${quote.estimatedGasUsd} USD</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span className="text-yellow-400">Creator Royalty (60%):</span>
                  <span className="text-yellow-300 font-bold">${quote.creatorFeeSplitUsd} USD</span>
                </div>
              </div>

              {/* Mandatory User Authorization Gate */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-yellow-950/20 border border-yellow-500/30 text-xs">
                <input
                  type="checkbox"
                  id="userConfirm"
                  checked={userConfirmed}
                  onChange={(e) => setUserConfirmed(e.target.checked)}
                  className="mt-0.5 accent-yellow-400 cursor-pointer"
                />
                <label htmlFor="userConfirm" className="text-slate-300 cursor-pointer">
                  <strong className="text-yellow-300 font-mono">Explicit Authorization:</strong> I verify the quote and authorize smart contract transaction execution via Base L2 signer.
                </label>
              </div>

              <button
                type="submit"
                disabled={!userConfirmed || isSwapping}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-yellow-950/40 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSwapping ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Broadcasting to Base L2...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign & Execute Swap</span>
                  </>
                )}
              </button>
            </form>
          </FlashGlowCard>

          {/* Read-Back Transaction Confirmation Banner */}
          {executedTx && (
            <FlashGlowCard variant="green" intensity="medium" className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Transaction Confirmed on Base L2
                </span>
                <span className="font-mono">{executedTx.status}</span>
              </div>
              <div className="text-xs text-slate-300 font-mono flex items-center justify-between">
                <span>Swapped {executedTx.fromAmount} {executedTx.fromSymbol} for {executedTx.toAmount} {executedTx.toSymbol}</span>
                <a
                  href={executedTx.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>BaseScan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </FlashGlowCard>
          )}
        </div>
      </div>
    </div>
  );
};
