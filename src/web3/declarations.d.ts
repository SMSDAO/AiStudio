/**
 * Global Web3 Window Declarations for EIP-1193 and Solana Window Providers
 */

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
    request: (args: { method: string; params?: any[] | Record<string, any> }) => Promise<any>;
    on: (eventName: string, handler: (...args: any[]) => void) => void;
    removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
  };
  solana?: {
    isPhantom?: boolean;
    connect: () => Promise<{ publicKey: { toString: () => string } }>;
    disconnect: () => Promise<void>;
    signMessage?: (message: Uint8Array, encoding: string) => Promise<{ signature: Uint8Array }>;
  };
  phantom?: {
    solana?: Window['solana'];
  };
}
