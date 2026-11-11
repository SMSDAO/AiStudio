import { GranularPermission, UserRole, RolePermissionConfig } from '../types';

export const GRANULAR_PERMISSIONS_CONFIG: RolePermissionConfig[] = [
  {
    permission: 'create_app',
    name: 'Create Miniapps',
    description: 'Use the AI Agentic Builder to create, prompt, and generate new onchain miniapps',
    category: 'build',
    allowedRoles: ['PLATFORM_SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'APP_OWNER', 'BUILDER'],
  },
  {
    permission: 'edit_code',
    name: 'Edit Code & Chat Iterations',
    description: 'Modify codebase, files, smart contracts, and send prompts to AI agent',
    category: 'build',
    allowedRoles: ['PLATFORM_SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'APP_OWNER', 'BUILDER'],
  },
  {
    permission: 'manage_templates',
    name: 'Manage App Templates',
    description: 'Create, edit, or customize reusable miniapp architectural blueprints',
    category: 'build',
    allowedRoles: ['PLATFORM_SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN'],
  },
  {
    permission: 'deploy_app',
    name: 'Deploy to Vercel & Blockchains',
    description: 'Trigger production edge deployments and onchain contract initializations',
    category: 'deployment',
    allowedRoles: ['PLATFORM_SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'APP_OWNER'],
  },
  {
    permission: 'claim_fees',
    name: 'Claim Trading Fees',
    description: 'Withdraw accrued 60% creator fees from Uniswap v4 bonding curve pools',
    category: 'finance',
    allowedRoles: ['PLATFORM_SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'APP_OWNER'],
  },
  {
    permission: 'manage_billing',
    name: 'Manage Billing & Credits',
    description: 'Purchase credit bundles, manage Stripe billing, and review treasury transactions',
    category: 'finance',
    allowedRoles: ['PLATFORM_SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN'],
  },
  {
    permission: 'manage_team',
    name: 'Manage Team & Collaborators',
    description: 'Invite collaborators, manage real-time presence rooms, and reassign roles',
    category: 'admin',
    allowedRoles: ['PLATFORM_SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN'],
  },
  {
    permission: 'view_analytics',
    name: 'View Deep Analytics',
    description: 'Access visitor retention, active Farcaster frames, volume, and token metrics',
    category: 'admin',
    allowedRoles: ['PLATFORM_SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'APP_OWNER', 'BUILDER', 'VIEWER'],
  },
  {
    permission: 'feature_app',
    name: 'Curate Featured Apps',
    description: 'Pin high-vibe miniapps to the homepage and Explore featured carousels',
    category: 'admin',
    allowedRoles: ['PLATFORM_SUPER_ADMIN', 'ORG_OWNER'],
  },
  {
    permission: 'view_feedback',
    name: 'Inspect Community Feedback',
    description: 'Review 1-5 star ratings and reviews submitted by miniapp users',
    category: 'admin',
    allowedRoles: ['PLATFORM_SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'APP_OWNER'],
  },
  {
    permission: 'manage_onboarding',
    name: 'Reset / Manage Onboarding',
    description: 'Configure and test the interactive guided onboarding tutorial walkthrough',
    category: 'admin',
    allowedRoles: ['PLATFORM_SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'APP_OWNER', 'BUILDER', 'VIEWER'],
  },
];

export function usePermission(userRole: UserRole, permission: GranularPermission): boolean {
  const config = GRANULAR_PERMISSIONS_CONFIG.find((p) => p.permission === permission);
  if (!config) return false;
  return config.allowedRoles.includes(userRole);
}

export function checkPermission(userRole: UserRole, permission: GranularPermission): boolean {
  const config = GRANULAR_PERMISSIONS_CONFIG.find((p) => p.permission === permission);
  if (!config) return false;
  return config.allowedRoles.includes(userRole);
}
