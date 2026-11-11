/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * NEXUSYIELD DEFI ENGINE — Zod Input Validation & Verification Schemas
 * Enforces strict typing, numeric bounds, hex sanitization, and security
 * bounds for all client-side inputs and server-side API verification.
 */

import { z } from 'zod';

export const EvmAddressSchema = z
  .string()
  .trim()
  .regex(/^0x[a-fA-F0-9]{40}$/, {
    message: 'Invalid EVM checksummed hexadecimal address format',
  })
  .transform((val) => val.toLowerCase() as `0x${string}`);

export const SolanaAddressSchema = z
  .string()
  .trim()
  .regex(/^[1-9A-HJ-NP-za-km-z]{32,44}$/, {
    message: 'Invalid base58 Solana public key format',
  });

export const UniversalAddressSchema = z.union([
  EvmAddressSchema,
  SolanaAddressSchema,
]);

export const TokenAmountSchema = z
  .string()
  .trim()
  .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive decimal number greater than zero',
  })
  .refine((val) => {
    const parts = val.split('.');
    return !parts[1] || parts[1].length <= 18;
  }, {
    message: 'Maximum decimal precision cannot exceed 18 decimals',
  });

export const SlippageToleranceSchema = z
  .number()
  .min(0.05, { message: 'Minimum slippage tolerance is 0.05%' })
  .max(5.0, { message: 'Maximum slippage tolerance cannot exceed 5.0% to prevent MEV sandwiching' })
  .default(0.5);

export const VaultDepositInputSchema = z.object({
  userAddress: EvmAddressSchema,
  chainId: z.union([z.literal(1), z.literal(42161), z.literal(8453), z.literal(137)]),
  assetAddress: EvmAddressSchema,
  amount: TokenAmountSchema,
  slippageTolerance: SlippageToleranceSchema,
});

export const VaultWithdrawInputSchema = z.object({
  userAddress: EvmAddressSchema,
  chainId: z.union([z.literal(1), z.literal(42161), z.literal(8453), z.literal(137)]),
  sharesAmount: TokenAmountSchema,
});

export const FlashLoanExecutionSchema = z.object({
  opportunityId: z.string().min(1),
  assetAddress: EvmAddressSchema,
  loanAmount: TokenAmountSchema,
  minExpectedProfitUsd: z.number().min(0.1, { message: 'Minimum net profit threshold must be >= $0.10' }),
  maxGasPriceGwei: z.number().min(0.001).max(500),
  recipient: EvmAddressSchema,
});

export type VaultDepositInput = z.infer<typeof VaultDepositInputSchema>;
export type VaultWithdrawInput = z.infer<typeof VaultWithdrawInputSchema>;
export type FlashLoanExecutionInput = z.infer<typeof FlashLoanExecutionSchema>;
