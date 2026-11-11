/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * NEXUSYIELD DEFI ENGINE — Automated Flash Loan Arbitrage & Multi-Chain Yield Vault
 * 
 * Principal Architecture:
 * 1. Multi-Chain Wallet Connector (MetaMask, Coinbase, Phantom, WalletConnect)
 * 2. Real-Time Read-State (TVL, APY, Live Balances, Flash Loan Routes)
 * 3. Full Write-State Execution (Multi-step ERC-20 Approve -> Vault Deposit; Flash Loan Execution)
 * 4. Dynamic Gas Buffer (+15%) & EIP-1559 Priority Fee Management
 * 5. Real-Time Transaction Lifecycle Toast Stream
 * 6. Zod Client-Side Input Sanitization
 * 7. Cyber Obsidian, Molten Gold & Gemstone Casino Cabinet Aesthetic
 */

import React, { useState, useEffect } from 'react';
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
  Lock,
  Layers,
  Sparkles,
  TrendingUp,
  Sliders,
  DollarSign,
  Radio,
  Flame,
  Globe,
  ArrowRight,
  Clock,
  ChevronDown,
  Info,
  Activity,
  Server,
  Database
} from 'lucide-react';
import { multiChainWalletConnector } from '../web3/walletConnector';
import { defiEngine } from '../web3/defiEngine';
import { SUPPORTED_CHAINS } from '../web3/chains';
import { 
  ConnectedWalletState, 
  SupportedChainId, 
  DefiVaultState, 
  FlashLoanArbitrageOpportunity, 
  TransactionToastNotification 
} from '../web3/types';
import { 
  VaultDepositInputSchema, 
  SlippageToleranceSchema, 
  TokenAmountSchema 
} from '../web3/zodSchemas';
import { 
  defiPersistenceService, 
  DefiAnalyticsApiResponse, 
  UserPortfolioApiResponse 
} from '../services/defiPersistenceService';
import { MultiChainWalletModal } from './MultiChainWalletModal';
import { FlashGlowCard } from './FlashGlowCard';

export const NexusYieldDeFiEngine: React.FC = () => {
  const [walletState, setWalletState] = useState<ConnectedWalletState>(() => 
    multiChainWalletConnector.getState()
  );
  const [vaultState, setVaultState] = useState<DefiVaultState | null>(null);
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState<FlashLoanArbitrageOpportunity[]>([]);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [activeEngineTab, setActiveEngineTab] = useState<'vault' | 'arbitrage' | 'analytics'>('vault');
  
  // Analytics and Portfolio persistence state
  const [analyticsData, setAnalyticsData] = useState<DefiAnalyticsApiResponse | null>(null);
  const [portfolioData, setPortfolioData] = useState<UserPortfolioApiResponse | null>(null);
  const [liveBlockNumber, setLiveBlockNumber] = useState<number>(19842050);

  // Vault Form State
  const [depositAmount, setDepositAmount] = useState<string>('500');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('100');
  const [slippage, setSlippage] = useState<number>(0.5);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isTransacting, setIsTransacting] = useState<boolean>(false);
  const [toasts, setToasts] = useState<TransactionToastNotification[]>([]);

  // Subscribe to wallet state changes
  useEffect(() => {
    const unsub = multiChainWalletConnector.subscribe((s) => setWalletState(s));
    return () => unsub();
  }, []);

  // Subscribe to real-time block streaming
  useEffect(() => {
    const unsub = defiPersistenceService.subscribeBlocks((blk) => {
      setLiveBlockNumber(blk.blockNumber);
    });
    return () => unsub();
  }, []);

  // Load persistence analytics data
  const loadPersistenceData = async () => {
    try {
      const analytics = await defiPersistenceService.getAnalyticsApi();
      setAnalyticsData(analytics);
      const targetWallet = walletState.address || '0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B';
      const portfolio = await defiPersistenceService.getUserPortfolioApi(targetWallet);
      setPortfolioData(portfolio);
    } catch (err) {
      console.warn('Failed to load persistence data:', err);
    }
  };

  useEffect(() => {
    loadPersistenceData();
  }, [walletState.address, activeEngineTab]);

  // Subscribe to transaction toasts
  useEffect(() => {
    const unsub = defiEngine.subscribeToasts((t) => {
      setToasts((prev) => [t, ...prev.slice(0, 4)]);
    });
    return () => unsub();
  }, []);

  // Fetch real-time vault & arbitrage state
  const refreshEngineData = async () => {
    const currentChain = walletState.chainId;
    try {
      const vState = await defiEngine.getVaultState(currentChain, walletState.address);
      setVaultState(vState);
      const arbOps = defiEngine.getLiveArbitrageOpportunities(currentChain);
      setArbitrageOpportunities(arbOps);
    } catch (err) {
      console.warn('Failed to refresh DeFi engine state:', err);
    }
  };

  useEffect(() => {
    refreshEngineData();
    const interval = setInterval(refreshEngineData, 15_000); // Polling blocks
    return () => clearInterval(interval);
  }, [walletState.chainId, walletState.address]);

  // Execute Vault Deposit with Zod validation
  const handleExecuteDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!walletState.isConnected || !walletState.address) {
      setIsWalletModalOpen(true);
      return;
    }

    if (walletState.chainId === 101) {
      setValidationError('NexusYield Staking Vault is deployed on EVM chains (Base, Arbitrum, Ethereum, Polygon). Please switch to an EVM network.');
      return;
    }

    // Client-side Zod validation
    const validation = VaultDepositInputSchema.safeParse({
      userAddress: walletState.address,
      chainId: walletState.chainId,
      assetAddress: SUPPORTED_CHAINS[walletState.chainId].contracts.usdcAddress,
      amount: depositAmount,
      slippageTolerance: slippage,
    });

    if (!validation.success) {
      setValidationError(validation.error.issues[0]?.message || 'Input validation failed.');
      return;
    }

    setIsTransacting(true);
    try {
      await defiEngine.executeVaultDeposit(
        walletState.chainId,
        depositAmount,
        walletState.address as `0x${string}`
      );
      await refreshEngineData();
      setDepositAmount('');
    } catch (err: any) {
      setValidationError(err.message || 'Deposit execution failed.');
    } finally {
      setIsTransacting(false);
    }
  };

  // Execute Flash Loan Arbitrage
  const handleExecuteArbitrage = async (opportunity: FlashLoanArbitrageOpportunity) => {
    setValidationError(null);

    if (!walletState.isConnected || !walletState.address) {
      setIsWalletModalOpen(true);
      return;
    }

    if (walletState.chainId === 101) {
      setValidationError('Solana flash loan routing is currently restricted to EVM cross-bridges. Switch to Base L2 or Arbitrum.');
      return;
    }

    setIsTransacting(true);
    try {
      await defiEngine.executeFlashLoanArbitrage(
        walletState.chainId,
        opportunity,
        walletState.address as `0x${string}`
      );
      await refreshEngineData();
    } catch (err: any) {
      setValidationError(err.message || 'Arbitrage execution failed.');
    } finally {
      setIsTransacting(false);
    }
  };

  const chainConfig = SUPPORTED_CHAINS[walletState.chainId] || SUPPORTED_CHAINS[8453];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6">
      {/* =========================================================================
          TOP BANNER: OBSIDIAN, MOLTEN GOLD & DRAGON CASINO CABINET HEADER
          ========================================================================= */}
      <FlashGlowCard variant="yellow" intensity="high" className="p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        {/* Ambient Top Light Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 shadow-[0_0_20px_rgba(234,179,8,0.8)]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 shadow-[0_0_12px_rgba(234,179,8,0.4)] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>NEXUSYIELD DEFI ENGINE V14.0</span>
              </span>

              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Live RPC Ingest: {chainConfig.name}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight">
              Automated Flash Loan Arbitrage & Yield Vault
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Enterprise smart contract execution engine with atomic flash loan arbitrage, EIP-1559 dynamic gas buffering (+15%), multi-chain liquidity vaults, and real-time Viem RPC telemetry.
            </p>
          </div>

          {/* Wallet & Network Control Inset */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-yellow-500/40 text-yellow-300 flex items-center space-x-2 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(234,179,8,0.25)]"
            >
              <img src={chainConfig.iconUrl} alt={chainConfig.name} className="w-4 h-4 rounded-full" />
              <span>{chainConfig.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => setIsWalletModalOpen(true)}
              className={`px-5 py-2.5 rounded-2xl font-mono text-xs font-bold flex items-center space-x-2 transition-all shadow-lg ${
                walletState.isConnected
                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)]'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>
                {walletState.isConnected
                  ? walletState.ensName || `${walletState.address.slice(0, 6)}...${walletState.address.slice(-4)}`
                  : 'Connect Web3 Wallet'}
              </span>
            </button>
          </div>
        </div>
      </FlashGlowCard>

      {/* =========================================================================
          ENGINE MODE TABS (Vault, Arbitrage, Analytics)
          ========================================================================= */}
      <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl w-fit">
        <button
          onClick={() => setActiveEngineTab('vault')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all ${
            activeEngineTab === 'vault'
              ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-[0_0_15px_rgba(234,179,8,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4 text-yellow-300" />
          <span>Multi-Chain Yield Vault</span>
        </button>

        <button
          onClick={() => setActiveEngineTab('arbitrage')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all ${
            activeEngineTab === 'arbitrage'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 text-cyan-300" />
          <span>Flash Loan Arbitrage ({arbitrageOpportunities.length} Active)</span>
        </button>

        <button
          onClick={() => setActiveEngineTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all ${
            activeEngineTab === 'analytics'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-300" />
          <span>On-Chain Telemetry & TVL</span>
        </button>
      </div>

      {/* Validation / Execution Notification Banner */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono flex items-start space-x-2.5 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{validationError}</div>
        </div>
      )}

      {/* =========================================================================
          TAB 1: MULTI-CHAIN YIELD STAKING VAULT
          ========================================================================= */}
      {activeEngineTab === 'vault' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: TVL & APY Metrics (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <FlashGlowCard variant="yellow" intensity="subtle" className="p-6 rounded-3xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  {chainConfig.name} Staking Pool
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">AUDITED SMART CONTRACT</span>
              </div>

              {/* APY Display */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-950/40 via-amber-950/30 to-slate-900 border border-yellow-500/30 space-y-1">
                <span className="text-[11px] font-mono text-yellow-400 uppercase">Compounded APY</span>
                <div className="text-4xl font-black font-display text-white flex items-baseline space-x-2">
                  <span>{vaultState?.boostedApyPct || 14.65}%</span>
                  <span className="text-xs font-mono text-emerald-400 font-normal">Base: {vaultState?.baseApyPct || 9.85}%</span>
                </div>
                <p className="text-xs text-slate-300 pt-1">
                  Automated yield compounding via Base L2 Uniswap v4 fee routing and Aave v3 flash liquidity supply.
                </p>
              </div>

              {/* Pool Telemetry */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Total Value Locked</div>
                  <div className="text-lg font-bold text-white mt-0.5">
                    ${(vaultState?.tvlUsd || 12480500).toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Share Redemption Price</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">
                    ${vaultState?.sharePriceUsd || 1.053} USDC
                  </div>
                </div>
              </div>

              {/* User Position */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Your Staked Position
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Staked USDC Value:</span>
                  <span className="text-white font-bold text-sm">
                    ${vaultState?.userStakedUsd || 0.00}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Accrued Harvest Yield:</span>
                  <span className="text-emerald-400 font-bold">
                    +${vaultState?.userClaimableYieldUsd || 0.00}
                  </span>
                </div>
              </div>
            </FlashGlowCard>
          </div>

          {/* Right: Deposit & Withdraw Console (7 Cols) */}
          <div className="lg:col-span-7">
            <FlashGlowCard variant="cyan" intensity="subtle" className="p-6 sm:p-7 rounded-3xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold font-display text-white">
                  Execute Staking & Yield Deposit
                </h3>
                <span className="text-xs font-mono text-cyan-400">
                  Multi-Step Flow: Approve &rarr; Deposit
                </span>
              </div>

              <form onSubmit={handleExecuteDeposit} className="space-y-5">
                {/* Amount Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span>Deposit Amount (USDC)</span>
                    <span>
                      Balance: <span className="text-emerald-400 font-bold">${walletState.balanceUsdc} USDC</span>
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-lg font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => setDepositAmount(walletState.balanceUsdc)}
                      className="absolute right-3 top-3 px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-mono text-cyan-400 hover:bg-slate-700"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Slippage Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="flex items-center space-x-1">
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Slippage Tolerance</span>
                    </span>
                    <span className="text-cyan-400 font-bold">{slippage}%</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[0.1, 0.5, 1.0, 2.0].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setSlippage(val)}
                        className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                          slippage === val
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fee Breakdown & Gas Buffer */}
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 space-y-1.5 text-xs font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>Protocol Performance Fee:</span>
                    <span className="text-white">0.00% (Zero Fee on Staking)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dynamic Gas Buffer:</span>
                    <span className="text-emerald-400">+15% EIP-1559 Priority Fee</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Vault Contract:</span>
                    <span className="text-slate-300 truncate max-w-[200px]">
                      {chainConfig.contracts.vaultAddress}
                    </span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isTransacting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-cyan-500 hover:from-yellow-400 hover:to-cyan-400 text-black font-black text-sm uppercase tracking-wider font-mono shadow-[0_0_25px_rgba(234,179,8,0.4)] active:scale-98 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                >
                  {isTransacting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>Executing Onchain Sequence...</span>
                    </>
                  ) : walletState.isConnected ? (
                    <>
                      <Coins className="w-4 h-4 fill-black" />
                      <span>Stake {depositAmount || '0'} USDC into Vault</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      <span>Connect Wallet to Deposit</span>
                    </>
                  )}
                </button>
              </form>
            </FlashGlowCard>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: FLASH LOAN ARBITRAGE ENGINE
          ========================================================================= */}
      {activeEngineTab === 'arbitrage' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-900/50 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Live Cross-DEX Flash Loan Arbitrage Scanner
                </h3>
                <p className="text-xs text-slate-300">
                  Zero-capital atomic execution via Aave v3 & Balancer flash loan liquidity pools.
                </p>
              </div>
            </div>

            <button
              onClick={refreshEngineData}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 font-mono text-xs flex items-center space-x-1.5 transition-all self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rescan DEX Pools</span>
            </button>
          </div>

          {/* Arbitrage Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {arbitrageOpportunities.map((op) => (
              <div
                key={op.id}
                className="glass-card p-5 rounded-3xl border border-white/10 hover:border-cyan-500/50 flex flex-col justify-between space-y-4 group transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {op.tokenPair}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      +{op.netRoiPct}% Net
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold font-display text-white">
                      {op.sourceDex} &rarr; {op.targetDex}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Loan: ${(op.loanAmountUsd).toLocaleString()} USDC
                    </p>
                  </div>

                  {/* Profit breakdown */}
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Gross Spread:</span>
                      <span className="text-white">${op.grossProfitUsd.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Flash Fee (0.05%):</span>
                      <span className="text-slate-300">-${op.flashLoanFeeUsd.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Est. Gas (+15% buf):</span>
                      <span className="text-slate-300">-${op.estimatedGasCostUsd.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-400 pt-1 border-t border-white/5">
                      <span>Estimated Net Yield:</span>
                      <span>+${op.netProfitUsd.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Path */}
                  <div className="text-[10px] font-mono text-slate-400 space-y-1">
                    <div className="uppercase tracking-wider text-slate-500">Execution Steps:</div>
                    {op.executionPath.map((step, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 truncate">
                        <span className="text-cyan-400">&gt;</span>
                        <span className="truncate">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleExecuteArbitrage(op)}
                  disabled={isTransacting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95 transition-all disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Execute Flash Loan</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ON-CHAIN TELEMETRY, REST APIS & TRANSACTION STREAM
          ========================================================================= */}
      {activeEngineTab === 'analytics' && (
        <div className="space-y-6">
          {/* Header Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="text-slate-400">Live RPC Listener:</span>
                <span className="text-cyan-300 font-bold">Base L2 Block #{liveBlockNumber}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-500">Endpoints:</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/20">/api/analytics</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 border border-emerald-500/20">/api/user/portfolio</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-500">Avg Gas:</span>
                <span className="text-amber-300 font-bold">{analyticsData?.avgGasPriceGwei || 0.082} Gwei</span>
              </div>
            </div>
          </div>

          {/* Global KPI Flash Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FlashGlowCard variant="orange" intensity="subtle" className="p-5 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Multi-Chain TVL</span>
                <Layers className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-display text-white">
                ${(analyticsData?.totalTvlUsd || 68800500).toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                <span>+12.4% past 30 days</span>
              </div>
            </FlashGlowCard>

            <FlashGlowCard variant="green" intensity="subtle" className="p-5 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>24h Flash Volume</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-display text-white">
                ${(analyticsData?.volume24hUsd || 14920400).toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                <span>Active 5-chain routing</span>
              </div>
            </FlashGlowCard>

            <FlashGlowCard variant="yellow" intensity="subtle" className="p-5 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Arbitrage Yield Settle</span>
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold font-display text-white">
                ${(analyticsData?.totalArbitrageProfitCapturedUsd || 142890.5).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] font-mono text-cyan-300">
                Zero-capital flash loan atomicity
              </div>
            </FlashGlowCard>

            <FlashGlowCard variant="red" intensity="subtle" className="p-5 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Transactions Indexed</span>
                <Database className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-display text-white">
                {(analyticsData?.totalTransactionsCount || 184520).toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Prisma PostgreSQL backing
              </div>
            </FlashGlowCard>
          </div>

          {/* Chain Breakdown & Portfolio Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Multi-Chain TVL Breakdown */}
            <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-display text-white">Multi-Chain Protocol Liquidity</h3>
                  <p className="text-xs text-slate-400 font-mono">Real-time TVL distribution and flash loan yield by chain</p>
                </div>
                <span className="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/30">
                  5 Chains Connected
                </span>
              </div>

              <div className="space-y-3">
                {(analyticsData?.chainBreakdown || []).map((c) => (
                  <div key={c.chainId} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{c.chainName}</span>
                        {c.isLayer2 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                            L2
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-400">Yield: <span className="text-emerald-400 font-bold">+${c.arbitrageProfitUsd.toLocaleString()}</span></span>
                        <span className="text-white font-bold">${(c.tvlUsd / 1_000_000).toFixed(2)}M ({c.shareOfTvlPct.toFixed(1)}%)</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-400"
                        style={{ width: `${c.shareOfTvlPct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected User / Super Admin Portfolio */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-display text-white">User Yield Portfolio</h3>
                  <p className="text-xs text-slate-400 font-mono">Prisma mapped portfolio positions</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/20 space-y-3">
                <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Wallet / Identity:</span>
                  <span className="text-amber-300 font-bold truncate max-w-[150px]">
                    {portfolioData?.ensName || (walletState.address ? `${walletState.address.slice(0, 6)}...${walletState.address.slice(-4)}` : 'gxqstudio.eth')}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-mono text-slate-400">Total Portfolio Value</div>
                  <div className="text-2xl font-bold font-display text-white">
                    ${(portfolioData?.totalPortfolioValueUsd || 40613.7).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs font-mono">
                  <div>
                    <span className="text-slate-400">Staked USDC:</span>
                    <div className="text-white font-bold">
                      ${(portfolioData?.totalStakedUsd || 40000).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Accrued Yield:</span>
                    <div className="text-emerald-400 font-bold">
                      +${(portfolioData?.totalYieldEarnedUsd || 613.7).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Positions */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Staking Positions</div>
                {(portfolioData?.positions || []).length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-900/60 text-center text-xs font-mono text-slate-400">
                    No active positions yet. Deposit USDC above to start compounding.
                  </div>
                ) : (
                  (portfolioData?.positions || []).map((pos) => (
                    <div key={pos.id} className="p-3 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="font-bold text-white">Chain ID #{pos.chainId}</div>
                        <div className="text-[10px] text-slate-400">Shares: {pos.stakedShares}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">${pos.depositedUsdc.toLocaleString()} USDC</div>
                        <div className="text-emerald-400 text-[10px]">Yield: +${pos.accruedYieldUsd.toFixed(2)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Real-Time Transaction Lifecycle Log & Toast Stream */}
          <FlashGlowCard variant="green" intensity="subtle" className="p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-display text-white">
                  Real-Time Block Listeners & Execution Stream
                </h3>
                <p className="text-xs text-slate-300 font-mono">
                  Live transaction lifecycle subscriber tracking EIP-1559 mempool inclusions and log confirmations.
                </p>
              </div>
              <button
                onClick={() => {
                  loadPersistenceData();
                  refreshEngineData();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono flex items-center space-x-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync DB & RPC</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {toasts.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-slate-400 border border-dashed border-slate-800 rounded-2xl">
                  No active transaction events. Execute a vault deposit or flash loan to view live lifecycle events.
                </div>
              ) : (
                toasts.map((toast) => (
                  <div
                    key={toast.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex items-start justify-between gap-4 font-mono text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          toast.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          toast.status === 'INDEXING_BLOCK' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                          toast.status === 'USER_REJECTED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {toast.status}
                        </span>
                        <span className="font-bold text-white">{toast.title}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] font-sans">{toast.description}</p>
                      {toast.txHash && (
                        <div className="text-[10px] text-slate-400">
                          Tx Hash: <span className="text-cyan-400">{toast.txHash}</span>
                        </div>
                      )}
                    </div>

                    {toast.explorerUrl && (
                      <a
                        href={toast.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:text-white flex items-center space-x-1 shrink-0 text-xs"
                      >
                        <span>Block Explorer</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </FlashGlowCard>
        </div>
      )}

      {/* Multi-Chain Wallet Connection Modal */}
      <MultiChainWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  );
};
