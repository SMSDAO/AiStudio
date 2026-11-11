import React, { useState } from 'react';
import { 
  Coins, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Search, 
  Flame, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppToken } from '../types';

interface Props {
  tokens: AppToken[];
  onFeeClaimNotice?: (appName: string, amount: string) => void;
}

export function TokensView({ tokens, onFeeClaimNotice }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTokenForSwap, setSelectedTokenForSwap] = useState<AppToken | null>(null);
  
  // Swap state
  const [swapDirection, setSwapDirection] = useState<'buy' | 'sell'>('buy');
  const [ethAmount, setEthAmount] = useState('0.05');
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccessTx, setSwapSuccessTx] = useState<string | null>(null);

  const filteredTokens = tokens.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalVol = tokens.reduce((acc, t) => acc + t.volume24hUsd, 0);
  const totalFees = tokens.reduce((acc, t) => acc + t.totalFeesGeneratedUsd, 0);
  const creatorFees = tokens.reduce((acc, t) => acc + t.creatorFeesAccruedUsd, 0);

  const handleExecuteSwap = () => {
    if (!selectedTokenForSwap) return;
    setIsSwapping(true);
    setSwapSuccessTx(null);

    setTimeout(() => {
      const tx = '0x' + Math.random().toString(16).slice(2) + 'swap';
      setSwapSuccessTx(tx);
      setIsSwapping(false);
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }, 1200);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2">
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span>CLANKER-STYLE BONDING CURVES • BASE L2</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-white">
            Miniapp Token Markets
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Every miniapp launched on ViniApp creates a Uniswap v4 pool where <strong>60% of all trading volume fees</strong> automatically route to the creator's App Wallet.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tokens or symbols..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* Aggregate Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card p-4 border border-purple-500/30 rounded-2xl">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>24H Aggregated Volume</span>
          </div>
          <div className="text-2xl font-black font-display text-white mt-1">
            ${totalVol.toLocaleString()} USD
          </div>
          <div className="text-[10px] text-cyan-400 mt-0.5">Uniswap v4 Pools on Base</div>
        </div>

        <div className="glass-card p-4 border border-cyan-500/30 rounded-2xl">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Total Trading Fees Generated</span>
          </div>
          <div className="text-2xl font-black font-display text-white mt-1">
            ${totalFees.toLocaleString()} USD
          </div>
          <div className="text-[10px] text-purple-300 mt-0.5">1% Liquidity Pool Fee</div>
        </div>

        <div className="glass-card p-4 border border-green-500/40 rounded-2xl bg-gradient-to-br from-green-950/20 to-slate-900">
          <div className="text-[10px] text-green-400 font-mono uppercase tracking-wider flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-green-400" />
            <span>Creator 60% Fee Distribution</span>
          </div>
          <div className="text-2xl font-black font-display text-green-400 mt-1">
            ${creatorFees.toLocaleString()} USD
          </div>
          <div className="text-[10px] text-green-300 mt-0.5">Direct to App Wallets</div>
        </div>
      </div>

      {/* Tokens Table */}
      <div className="glass-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-white/10 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Token & Symbol</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">24h Change</th>
                <th className="py-3 px-4">Market Cap</th>
                <th className="py-3 px-4">24h Volume</th>
                <th className="py-3 px-4">Creator 60% Fees</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-mono">
              {filteredTokens.map((token) => (
                <tr key={token.symbol} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-xs font-bold font-mono text-purple-300">
                        {token.symbol.slice(1, 3)}
                      </div>
                      <div>
                        <div className="font-bold text-white leading-tight">{token.name}</div>
                        <div className="text-[10px] text-cyan-400 font-mono">{token.symbol}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-white font-bold">
                    ${token.priceUsd.toFixed(4)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      token.priceChange24h >= 0 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {token.priceChange24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      <span>{Math.abs(token.priceChange24h)}%</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    ${token.marketCapUsd.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    ${token.volume24hUsd.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-green-400 font-bold">
                    ${token.creatorFeesAccruedUsd.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedTokenForSwap(token)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-[11px] uppercase tracking-wider shadow-[0_0_12px_rgba(168,85,247,0.4)] active:scale-95 transition-all"
                    >
                      TRADE ⚡
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Swap Modal / Drawer */}
      {selectedTokenForSwap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md glass-panel border border-purple-500/40 rounded-3xl p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedTokenForSwap(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-mono"
            >
              ESC / CLOSE
            </button>

            <div className="flex items-center space-x-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                🦄
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-white">
                  Uniswap v4 Swap on Base
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Trading {selectedTokenForSwap.name} ({selectedTokenForSwap.symbol})
                </p>
              </div>
            </div>

            {/* Swap direction toggle */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setSwapDirection('buy')}
                className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                  swapDirection === 'buy'
                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                BUY {selectedTokenForSwap.symbol}
              </button>
              <button
                onClick={() => setSwapDirection('sell')}
                className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                  swapDirection === 'sell'
                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                SELL {selectedTokenForSwap.symbol}
              </button>
            </div>

            {/* Input amount */}
            <div className="space-y-3 mb-4">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono mb-1">You Pay</div>
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    step="0.01"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    className="bg-transparent text-lg font-bold font-mono text-white focus:outline-none w-36"
                  />
                  <span className="text-xs font-bold font-mono text-cyan-300 px-2 py-1 bg-cyan-950/60 rounded-lg border border-cyan-500/30">
                    ETH (Base)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono mb-1">You Receive (Estimated)</div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-mono text-purple-300">
                    {(Number(ethAmount || 0) * (3340 / selectedTokenForSwap.priceUsd)).toFixed(0)}{' '}
                    {selectedTokenForSwap.symbol}
                  </span>
                  <span className="text-xs font-bold font-mono text-purple-300 px-2 py-1 bg-purple-950/60 rounded-lg border border-purple-500/30">
                    {selectedTokenForSwap.symbol}
                  </span>
                </div>
              </div>
            </div>

            {/* 60% Creator Fee Breakdown */}
            <div className="p-3 rounded-2xl bg-green-950/30 border border-green-500/30 text-xs font-mono text-green-300 mb-4 space-y-1">
              <div className="flex justify-between">
                <span>Total Pool Fee (1%):</span>
                <span>${(Number(ethAmount || 0) * 33.4).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-white">
                <span>Creator 60% Cut:</span>
                <span className="text-green-400">+${(Number(ethAmount || 0) * 33.4 * 0.6).toFixed(2)} USD</span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-green-500/20">
                Automatically routed into miniapp smart wallet: {selectedTokenForSwap.contractAddress.slice(0, 10)}...
              </div>
            </div>

            {/* Action */}
            <button
              onClick={handleExecuteSwap}
              disabled={isSwapping}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-98 transition-all"
            >
              {isSwapping ? (
                <span>Executing Uniswap Swap on Base...</span>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>SWAP ON BASE L2</span>
                </>
              )}
            </button>

            {swapSuccessTx && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-green-500/40 text-[11px] text-green-400 font-mono text-center">
                Swap confirmed! Tx: {swapSuccessTx.slice(0, 16)}...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
