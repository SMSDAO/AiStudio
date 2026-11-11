export type UserRole = 
  | 'PLATFORM_SUPER_ADMIN' 
  | 'ORG_OWNER' 
  | 'ORG_ADMIN' 
  | 'APP_OWNER' 
  | 'BUILDER' 
  | 'VIEWER';

export type GranularPermission = 
  | 'create_app'
  | 'deploy_app'
  | 'manage_billing'
  | 'view_analytics'
  | 'claim_fees'
  | 'manage_team'
  | 'edit_code'
  | 'manage_templates'
  | 'feature_app'
  | 'view_feedback'
  | 'manage_onboarding';

export interface RolePermissionConfig {
  permission: GranularPermission;
  name: string;
  description: string;
  category: 'build' | 'deployment' | 'finance' | 'admin';
  allowedRoles: UserRole[];
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  handle: string;
  avatarUrl: string;
  bio: string;
  socialLinks: {
    twitter?: string;
    farcaster?: string;
    website?: string;
    github?: string;
  };
  farcasterFid?: number;
  farcasterConnected: boolean;
  address: string;
  creditBalance: number;
  xVerified: boolean;
  role: UserRole;
  workspaceName: string;
  onboardingCompleted: boolean;
}

export interface AppWallet {
  address: string;
  ethBalance: number;
  tokenBalance: number;
  usdcBalance: number;
  unclaimedFeesEth: number;
  totalFeesClaimedEth: number;
  privateKeyMasked: string;
}

export interface AppToken {
  name: string;
  symbol: string;
  contractAddress: string;
  priceUsd: number;
  marketCapUsd: number;
  volume24hUsd: number;
  totalSupply: number;
  creatorFeePercentage: number; // default 60%
  totalFeesGeneratedUsd: number;
  creatorFeesAccruedUsd: number;
  holdersCount: number;
  priceChange24h: number;
}

export interface FarcasterManifest {
  name: string;
  iconUrl: string;
  homeUrl: string;
  imageUrl: string;
  buttonTitle: string;
  splashImageUrl: string;
  splashBackgroundColor: string;
  webhookUrl: string;
}

export interface PlatformSupport {
  web: boolean;
  farcaster: boolean;
  telegram: boolean;
  world: boolean;
  celo: boolean;
  base: boolean;
}

export type BuildJobStatus = 
  | 'queued' 
  | 'clarifying' 
  | 'generating' 
  | 'debugging'
  | 'optimizing'
  | 'creating_wallet' 
  | 'deploying' 
  | 'live' 
  | 'failed';

export interface BuildJob {
  id: string;
  appId: string;
  appName: string;
  status: BuildJobStatus;
  progress: number;
  currentStep?: string;
  steps: BuildStep[];
  logs: string[]; // Real-time streaming logs from build_logs channel
  githubWorkflowInjected?: boolean;
  vercelDeployUrl?: string;
  createdAt: string;
  updatedAt: string;
  error?: string;
}

export type BrandAssetStyle = 
  | 'cyber_minimalist'
  | 'neo_retro_pixel'
  | 'holographic_3d'
  | 'gradient_emblem';

export interface BrandColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bgDark: string;
  glowClass: string;
}

export interface BrandKit {
  logoStyle: BrandAssetStyle;
  paletteName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  svgLogo: string;
  badgeIcon: string;
  bannerSvg: string;
}

export interface CodeDebugIssue {
  severity: 'info' | 'warning' | 'error';
  file: string;
  line: number;
  message: string;
  suggestion: string;
}

export interface SecurityCheckItem {
  check: string;
  status: 'passed' | 'warning';
  detail: string;
}

export interface CodeDebugResult {
  clean: boolean;
  lintScore: number;
  issues: CodeDebugIssue[];
  securityChecks: SecurityCheckItem[];
  stateMutationsAudit: {
    purityCheck: string;
    hookDependencies: string;
    memoryLeaks: string;
  };
  timestamp: string;
}

export interface PerformanceOptimizationTip {
  component: string;
  recommendation: string;
  estimatedSavings: string;
}

export interface PerformanceOptimizationResult {
  bundleScore: number;
  bundleEstimatedKb: number;
  estimatedGasGwei: number;
  renderOptimizationTips: PerformanceOptimizationTip[];
  webVitals: {
    fcp: string;
    lcp: string;
    cls: string;
    tbt: string;
  };
  treeShakingStatus: string;
  timestamp: string;
}

export interface BuildStep {
  id: string;
  toolName: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  outputPreview?: string;
  logs: string[];
  durationMs?: number;
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  subtext: string;
  options: string[];
  selectedOption?: string;
  customInput?: string;
}

export type MiniappType = 
  | 'arcade' 
  | 'tipping' 
  | 'meme' 
  | 'casino' 
  | 'prediction' 
  | 'blog' 
  | 'poll' 
  | 'nft_gallery' 
  | 'calendar' 
  | 'ai_agent' 
  | 'custom';

export interface AppFeedback {
  id: string;
  appId: string;
  appName: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface AppTemplate {
  id: string;
  title: string;
  slug: string;
  icon: string;
  tagline: string;
  description: string;
  type: MiniappType;
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  status?: 'published' | 'draft' | 'archived';
  plainEnglishSummary?: string;
  tags?: string[];
  author?: {
    name: string;
    handle: string;
  };
  instantiations?: number;
  suggestedFeatures: string[];
  keyFeatures?: string[];
  suggestedPlatforms: string[];
  monetizationModel: string;
  previewColor: string;
  neonGlow: 'purple' | 'blue' | 'green' | 'orange' | 'yellow' | 'cyan';
  codePreset: Record<string, string>;
  githubRepoUrl?: string;
  liveDemoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollaboratorPresence {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  status: 'active' | 'idle' | 'typing';
  currentField?: string;
  cursorColor: string;
  joinedAt: string;
}

export interface CollaborationChatMessage {
  id: string;
  sender: {
    name: string;
    avatarUrl: string;
    handle: string;
  };
  text: string;
  timestamp: string;
}

export interface AppItem {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  keyFeatures?: string[];
  type: MiniappType;
  category: string;
  featured: boolean;
  author: {
    name: string;
    handle: string;
    avatarUrl: string;
    verifiedX: boolean;
    farcasterFid?: number;
    address: string;
  };
  createdAt: string;
  status: BuildJobStatus;
  accentColor: string;
  neonBorderColor: 'purple' | 'blue' | 'cyan' | 'green' | 'orange' | 'red' | 'yellow';
  metrics: {
    opens: number;
    uniqueUsers: number;
    totalTransactions: number;
    rating: number;
    feedbackCount: number;
  };
  wallet: AppWallet;
  token?: AppToken;
  platforms: PlatformSupport;
  farcasterManifest: FarcasterManifest;
  githubRepoUrl: string;
  vercelDeployUrl: string;
  files: Record<string, string>;
  buildSteps: BuildStep[];
  brandKit?: BrandKit;
  debugReport?: CodeDebugResult;
  perfReport?: PerformanceOptimizationResult;
  chatHistory?: { sender: 'user' | 'agent'; text: string; timestamp: string }[];
  feedbacks?: AppFeedback[];
}

export interface ShippedEvent {
  id: string;
  timestamp: string;
  type: 'app_launched' | 'token_created' | 'fees_claimed' | 'build_completed' | 'app_featured';
  appName: string;
  appSlug: string;
  detail: string;
  badge: string;
  badgeColor: 'purple' | 'blue' | 'green' | 'orange' | 'yellow';
  txHash?: string;
}

export interface CreditTransaction {
  id: string;
  timestamp: string;
  amount: number;
  type: 'bonus' | 'purchase' | 'spend';
  description: string;
}

export type UserSession = UserProfile;
