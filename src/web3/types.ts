/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * NEXUSYIELD DEFI ENGINE — Web3 & DeFi Core Type Definitions
 * Complete strict TypeScript interfaces for Multi-Chain Connectors,
 * Viem/Wagmi bindings, Vault positions, Flash loan arbitrage, and RPC state.
 */

export type SupportedChainId = 
  | 1       // Ethereum Mainnet
  | 42161   // Arbitrum One
  | 8453    // Base L2
  | 137     // Polygon PoS
  | 101;    // Solana Mainnet (Virtual Cluster ID)

export type WalletProviderType = 
  | 'metamask' 
  | 'coinbase' 
  | 'phantom' 
  | 'walletconnect' 
  | 'injected';

export interface ChainMetadata {
  id: SupportedChainId;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: { http: string[] };
    public: { http: string[] };
  };
  blockExplorers: {
    default: { name: string; url: string };
  };
  contracts: {
    vaultAddress: `0x${string}`;
    flashLoanRouter: `0x${string}`;
    usdcAddress: `0x${string}`;
  };
  iconUrl: string;
  isLayer2?: boolean;
  ecosystem: 'evm' | 'solana';
}

export interface ConnectedWalletState {
  address: `0x${string}` | string;
  chainId: SupportedChainId;
  providerType: WalletProviderType;
  ensName: string | null;
  ensAvatar: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  balanceNative: string;
  balanceUsdc: string;
}

export interface DefiVaultState {
  tvlUsd: number;
  baseApyPct: number;
  boostedApyPct: number;
  totalShares: string;
  sharePriceUsd: number;
  lockupPeriodSeconds: number;
  userStakedShares: string;
  userStakedUsd: number;
  userClaimableYieldUsd: number;
  lastDepositTimestamp?: number;
}

export interface FlashLoanArbitrageOpportunity {
  id: string;
  sourceDex: string;
  targetDex: string;
  tokenPair: string;
  assetAddress: `0x${string}`;
  loanAmountUsd: number;
  grossProfitUsd: number;
  estimatedGasCostUsd: number;
  flashLoanFeeUsd: number;
  netProfitUsd: number;
  netRoiPct: number;
  executionPath: string[];
  blockNumber: number;
  timestamp: number;
}

export type TransactionLifecycleStatus = 
  | 'IDLE'
  | 'INPUT_VALIDATION'
  | 'ALLOWANCE_CHECK'
  | 'APPROVING_TOKEN'
  | 'AWAITING_USER_SIGNATURE'
  | 'PENDING_HASH'
  | 'INDEXING_BLOCK'
  | 'CONFIRMED'
  | 'REVERTED'
  | 'USER_REJECTED';

export interface TransactionToastNotification {
  id: string;
  title: string;
  description: string;
  status: TransactionLifecycleStatus;
  txHash?: string;
  blockNumber?: number;
  explorerUrl?: string;
  errorMessage?: string;
  timestamp: number;
}

export interface DecodedWeb3Error {
  code: string;
  title: string;
  message: string;
  isUserRejection: boolean;
  suggestedAction: string;
}
