/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * NEXUSYIELD DEFI ENGINE — Supported Chain Configurations & RPC Provider Matrix
 * Real JSON-RPC providers with rate-limit fallback rotation, contract deployments,
 * and EIP-3085 automatic network configuration parameters.
 */

import { ChainMetadata, SupportedChainId } from './types';

export const SUPPORTED_CHAINS: Record<SupportedChainId, ChainMetadata> = {
  8453: {
    id: 8453,
    name: 'Base L2',
    network: 'base',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [
          'https://mainnet.base.org',
          'https://base.llamarpc.com',
          'https://base-rpc.publicnode.com',
        ],
      },
      public: {
        http: [
          'https://mainnet.base.org',
          'https://base.llamarpc.com',
        ],
      },
    },
    blockExplorers: {
      default: {
        name: 'BaseScan',
        url: 'https://basescan.org',
      },
    },
    contracts: {
      vaultAddress: '0x3278787D48E7143330733aA32865d7243637536f',
      flashLoanRouter: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24',
      usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    },
    iconUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=80&h=80&q=80',
    isLayer2: true,
    ecosystem: 'evm',
  },
  42161: {
    id: 42161,
    name: 'Arbitrum One',
    network: 'arbitrum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [
          'https://arb1.arbitrum.io/rpc',
          'https://arbitrum.llamarpc.com',
          'https://arbitrum-one-rpc.publicnode.com',
        ],
      },
      public: {
        http: [
          'https://arb1.arbitrum.io/rpc',
          'https://arbitrum.llamarpc.com',
        ],
      },
    },
    blockExplorers: {
      default: {
        name: 'Arbiscan',
        url: 'https://arbiscan.io',
      },
    },
    contracts: {
      vaultAddress: '0x724DC807b04555b71ed48A6896b6F41593B8C637',
      flashLoanRouter: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
      usdcAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    },
    iconUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=80&h=80&q=80',
    isLayer2: true,
    ecosystem: 'evm',
  },
  1: {
    id: 1,
    name: 'Ethereum Mainnet',
    network: 'homestead',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [
          'https://cloudflare-eth.com',
          'https://eth.llamarpc.com',
          'https://ethereum-rpc.publicnode.com',
        ],
      },
      public: {
        http: [
          'https://cloudflare-eth.com',
          'https://eth.llamarpc.com',
        ],
      },
    },
    blockExplorers: {
      default: {
        name: 'Etherscan',
        url: 'https://etherscan.io',
      },
    },
    contracts: {
      vaultAddress: '0xBa51a66D337F96839353982e5Bfa7F648F1B3E03',
      flashLoanRouter: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', // Aave v3 Pool
      usdcAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    },
    iconUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=80&h=80&q=80',
    isLayer2: false,
    ecosystem: 'evm',
  },
  137: {
    id: 137,
    name: 'Polygon PoS',
    network: 'matic',
    nativeCurrency: {
      name: 'Polygon Ecosystem Token',
      symbol: 'POL',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [
          'https://polygon-rpc.com',
          'https://polygon.llamarpc.com',
          'https://polygon-bor-rpc.publicnode.com',
        ],
      },
      public: {
        http: [
          'https://polygon-rpc.com',
          'https://polygon.llamarpc.com',
        ],
      },
    },
    blockExplorers: {
      default: {
        name: 'PolygonScan',
        url: 'https://polygonscan.com',
      },
    },
    contracts: {
      vaultAddress: '0x1402287cE4A5f2479B4895C989B0FEAb7294B34C',
      flashLoanRouter: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
      usdcAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    },
    iconUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=80&h=80&q=80',
    isLayer2: false,
    ecosystem: 'evm',
  },
  101: {
    id: 101,
    name: 'Solana Mainnet',
    network: 'solana-mainnet',
    nativeCurrency: {
      name: 'SOL',
      symbol: 'SOL',
      decimals: 9,
    },
    rpcUrls: {
      default: {
        http: [
          'https://api.mainnet-beta.solana.com',
          'https://solana-mainnet.rpc.extrnode.com',
        ],
      },
      public: {
        http: [
          'https://api.mainnet-beta.solana.com',
        ],
      },
    },
    blockExplorers: {
      default: {
        name: 'Solana Explorer',
        url: 'https://explorer.solana.com',
      },
    },
    contracts: {
      vaultAddress: '0x0000000000000000000000000000000000000000',
      flashLoanRouter: '0x0000000000000000000000000000000000000000',
      usdcAddress: '0x0000000000000000000000000000000000000000',
    },
    iconUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=80&h=80&q=80',
    isLayer2: false,
    ecosystem: 'solana',
  },
};

export const DEFAULT_CHAIN: ChainMetadata = SUPPORTED_CHAINS[8453]; // Base L2 by default
