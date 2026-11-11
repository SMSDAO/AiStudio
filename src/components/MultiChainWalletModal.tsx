/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * NEXUSYIELD DEFI ENGINE — Unified Multi-Chain Wallet Modal
 * Supports MetaMask, Coinbase Wallet, Phantom (Solana), and WalletConnect v2.
 * Features dynamic chain switching, automatic network prompt, ENS lookup,
 * and persistent session state.
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wallet, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight,
  Globe,
  Radio,
  AlertTriangle
} from 'lucide-react';
import { multiChainWalletConnector } from '../web3/walletConnector';
import { ConnectedWalletState, SupportedChainId, WalletProviderType } from '../web3/types';
import { SUPPORTED_CHAINS } from '../web3/chains';
import { FlashGlowCard } from './FlashGlowCard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiChainWalletModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [walletState, setWalletState] = useState<ConnectedWalletState>(() => 
    multiChainWalletConnector.getState()
  );
  const [connectingProvider, setConnectingProvider] = useState<WalletProviderType | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = multiChainWalletConnector.subscribe((s) => setWalletState(s));
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleConnect = async (provider: WalletProviderType) => {
    setConnectingProvider(provider);
    setErrorMsg(null);
    try {
      await multiChainWalletConnector.connectWallet(provider);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect wallet.');
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleSwitchChain = async (chainId: SupportedChainId) => {
    try {
      await multiChainWalletConnector.switchChain(chainId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to switch network.');
    }
  };

  const copyAddress = () => {
    if (!walletState.address) return;
    navigator.clipboard.writeText(walletState.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const providers = [
    {
      id: 'metamask' as WalletProviderType,
      name: 'MetaMask',
      subtitle: 'Desktop extension & mobile in-app browser',
      icon: '🦊',
      isEcosystem: 'EVM (Base, Ethereum, Arbitrum, Polygon)',
    },
    {
      id: 'coinbase' as WalletProviderType,
      name: 'Coinbase Smart Wallet',
      subtitle: 'Passkey & browser self-custody wallet',
      icon: '🔵',
      isEcosystem: 'EVM & Base L2 Native',
    },
    {
      id: 'phantom' as WalletProviderType,
      name: 'Phantom (Solana & Multi-Chain)',
      subtitle: 'High-speed Solana & cross-chain extension',
      icon: '👻',
      isEcosystem: 'Solana & Ethereum Engine',
    },
    {
      id: 'walletconnect' as WalletProviderType,
      name: 'WalletConnect v2',
      subtitle: 'Scan QR code with 300+ mobile wallets',
      icon: '⚡',
      isEcosystem: 'Universal Multi-Chain Protocol',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-lg rounded-3xl border border-white/20 p-6 sm:p-7 space-y-6 relative shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Top ambient glow line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-emerald-400 to-cyan-400 opacity-80" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-yellow-500/40 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">
                Multi-Chain Wallet Connector
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Real hardware, extension, & mobile wallet bridge
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification if any */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMsg}</div>
          </div>
        )}

        {/* State: Connected View */}
        {walletState.isConnected && walletState.address ? (
          <div className="space-y-4">
            <FlashGlowCard variant="green" intensity="subtle" className="p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Wallet Connected</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {walletState.providerType.toUpperCase()}
                </span>
              </div>

              {/* Address & ENS */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-white/5">
                <div>
                  {walletState.ensName && (
                    <div className="text-sm font-bold text-cyan-300 font-display">
                      {walletState.ensName}
                    </div>
                  )}
                  <div className="text-xs font-mono text-white">
                    {walletState.address.slice(0, 10)}...{walletState.address.slice(-8)}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={copyAddress}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center space-x-1"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  {SUPPORTED_CHAINS[walletState.chainId]?.blockExplorers.default.url && (
                    <a
                      href={`${SUPPORTED_CHAINS[walletState.chainId].blockExplorers.default.url}/address/${walletState.address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="View on Explorer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Real Balances */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Native Balance</span>
                  <span className="font-bold text-white text-sm">
                    {walletState.balanceNative} {SUPPORTED_CHAINS[walletState.chainId]?.nativeCurrency.symbol || 'ETH'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">USDC Balance</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    ${walletState.balanceUsdc}
                  </span>
                </div>
              </div>
            </FlashGlowCard>

            {/* Network Switcher Section */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-yellow-400" />
                <span>Switch Connected Network</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {Object.values(SUPPORTED_CHAINS).map((chain) => {
                  const isCurrent = walletState.chainId === chain.id;
                  return (
                    <button
                      key={chain.id}
                      onClick={() => handleSwitchChain(chain.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center space-x-2.5 transition-all ${
                        isCurrent
                          ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.3)]'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <img src={chain.iconUrl} alt={chain.name} className="w-5 h-5 rounded-full" />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{chain.name}</div>
                        <div className="text-[9px] font-mono text-slate-400">{chain.nativeCurrency.symbol}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Disconnect Button */}
            <button
              onClick={() => {
                multiChainWalletConnector.disconnectWallet();
                onClose();
              }}
              className="w-full py-2.5 rounded-2xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-300 font-mono text-xs font-bold transition-all"
            >
              Disconnect Session
            </button>
          </div>
        ) : (
          /* State: Disconnected List of Providers */
          <div className="space-y-2.5">
            {providers.map((p) => {
              const isLoading = connectingProvider === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleConnect(p.id)}
                  disabled={Boolean(connectingProvider)}
                  className="w-full p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-white/10 hover:border-yellow-500/50 flex items-center justify-between text-left transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold font-display text-white group-hover:text-yellow-300 transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-sans">
                        {p.subtitle}
                      </p>
                      <div className="text-[10px] font-mono text-cyan-400 mt-0.5">
                        {p.isEcosystem}
                      </div>
                    </div>
                  </div>

                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
