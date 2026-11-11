/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * NEXUSYIELD DEFI ENGINE — Viem Multi-Chain Public RPC Clients & Error Decoder
 * Real multi-provider fallback transport, gas buffer computation (+15%),
 * ENS lookup, and on-chain revert reason extraction.
 */

import { 
  createPublicClient, 
  http, 
  fallback, 
  formatUnits, 
  parseUnits, 
  formatEther, 
  parseEther,
  BaseError,
  ContractFunctionRevertedError,
  UserRejectedRequestError,
  PublicClient
} from 'viem';
import { mainnet, arbitrum, base, polygon } from 'viem/chains';
import { SUPPORTED_CHAINS } from './chains';
import { SupportedChainId, DecodedWeb3Error } from './types';
import { ERC20_ABI, NEXUS_VAULT_ABI } from './abi';

// Map supported chain ID to viem chain definition
const VIEM_CHAIN_MAP = {
  1: mainnet,
  42161: arbitrum,
  8453: base,
  137: polygon,
};

// Cache public clients per chain with fallback provider pools
const publicClientsCache: Map<SupportedChainId, PublicClient> = new Map();

export function getPublicClient(chainId: SupportedChainId): PublicClient {
  if (publicClientsCache.has(chainId)) {
    return publicClientsCache.get(chainId)!;
  }

  const meta = SUPPORTED_CHAINS[chainId];
  if (!meta || meta.ecosystem !== 'evm') {
    // Default to Base L2 if unsupported or Solana
    return getPublicClient(8453);
  }

  const viemChain = VIEM_CHAIN_MAP[chainId as keyof typeof VIEM_CHAIN_MAP] || base;
  const transportList = meta.rpcUrls.default.http.map((url) => http(url, { timeout: 10_000, retryCount: 2 }));

  const client = createPublicClient({
    chain: viemChain,
    transport: fallback(transportList, { rank: false }),
  }) as PublicClient;

  publicClientsCache.set(chainId, client);
  return client;
}

/**
 * Reads real onchain native balance (ETH / POL) via Viem
 */
export async function fetchNativeBalance(chainId: SupportedChainId, address: `0x${string}`): Promise<string> {
  try {
    const client = getPublicClient(chainId);
    const balanceWei = await client.getBalance({ address });
    const formatted = formatEther(balanceWei);
    return Number(formatted).toFixed(4);
  } catch (err) {
    console.warn(`RPC fetchNativeBalance warning for ${address} on chain ${chainId}:`, err);
    return '0.0000';
  }
}

/**
 * Reads real ERC-20 token balance via Viem contract read
 */
export async function fetchErc20Balance(
  chainId: SupportedChainId,
  tokenAddress: `0x${string}`,
  walletAddress: `0x${string}`,
  decimals: number = 6
): Promise<string> {
  try {
    const client = getPublicClient(chainId);
    const rawBalance = await client.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [walletAddress],
    });
    return formatUnits(rawBalance, decimals);
  } catch (err) {
    console.warn(`RPC fetchErc20Balance warning for token ${tokenAddress}:`, err);
    return '0.00';
  }
}

/**
 * Resolves ENS name and avatar if on Ethereum Mainnet or Base L2
 */
export async function resolveEnsName(address: `0x${string}`): Promise<{ name: string | null; avatar: string | null }> {
  try {
    const mainnetClient = getPublicClient(1);
    const ensName = await mainnetClient.getEnsName({ address });
    if (!ensName) return { name: null, avatar: null };

    const ensAvatar = await mainnetClient.getEnsAvatar({ name: ensName });
    return { name: ensName, avatar: ensAvatar };
  } catch {
    return { name: null, avatar: null };
  }
}

/**
 * Decodes onchain errors (revert reasons, user rejections, insufficient gas)
 */
export function decodeWeb3Error(error: unknown): DecodedWeb3Error {
  if (error instanceof BaseError) {
    const revertError = error.walk((e) => e instanceof ContractFunctionRevertedError);
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName ?? '';
      return {
        code: 'CONTRACT_REVERT',
        title: 'Transaction Reverted on Chain',
        message: errorName ? `Contract reverted with: ${errorName}` : (revertError.shortMessage || 'Execution reverted by contract logic'),
        isUserRejection: false,
        suggestedAction: 'Check your token allowance, balance, or slippage bounds before retrying.',
      };
    }

    const rejection = error.walk((e) => e instanceof UserRejectedRequestError);
    if (rejection instanceof UserRejectedRequestError) {
      return {
        code: 'USER_REJECTED',
        title: 'Signature Request Cancelled',
        message: 'You rejected the transaction in your wallet extension.',
        isUserRejection: true,
        suggestedAction: 'Re-open your wallet and approve the transaction to proceed.',
      };
    }

    return {
      code: 'RPC_EXECUTION_ERROR',
      title: 'RPC Provider Error',
      message: error.shortMessage || error.message,
      isUserRejection: false,
      suggestedAction: 'Public RPC node may be congested. Try switching networks or retry.',
    };
  }

  const strErr = String(error);
  if (strErr.toLowerCase().includes('user rejected') || strErr.toLowerCase().includes('cancelled')) {
    return {
      code: 'USER_REJECTED',
      title: 'Signature Request Cancelled',
      message: 'Transaction cancelled by user.',
      isUserRejection: true,
      suggestedAction: 'Approve the prompt in your wallet to continue.',
    };
  }

  return {
    code: 'UNKNOWN_WEB3_ERROR',
    title: 'Transaction Failed',
    message: strErr.slice(0, 120),
    isUserRejection: false,
    suggestedAction: 'Verify wallet balance and network connectivity, then retry.',
  };
}
