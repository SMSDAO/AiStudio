/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GitHubAccount {
  username: string;
  name: string;
  avatarUrl: string;
  email: string;
  profileUrl: string;
  installations: {
    id: number;
    account: string;
    appSlug: string;
    targetType: 'User' | 'Organization';
    repositoriesCount: number;
  }[];
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  htmlUrl: string;
  description: string;
  defaultBranch: string;
  updatedAt: string;
  language: string;
  hasWorkflows: boolean;
  installedApp: boolean;
}

export interface GitHubAppConfig {
  appId: string;
  appSlug: string;
  clientSecretConfigured: boolean;
  privateKeyConfigured: boolean;
  installationId: string;
}

// Retrieve GitHub App credentials from Vite env or default config
export function getGitHubAppConfig(): GitHubAppConfig {
  const env = import.meta.env;
  return {
    appId: env.VITE_GITHUB_APP_ID || '892147',
    appSlug: env.VITE_GITHUB_APP_SLUG || 'ai-studio-miniapp-deployer',
    clientSecretConfigured: true,
    privateKeyConfigured: true,
    installationId: env.VITE_GITHUB_INSTALLATION_ID || '4892019',
  };
}

export const MOCK_GITHUB_USER: GitHubAccount = {
  username: 'gxqstudio',
  name: 'GXQ Studio Engineering',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  email: 'gxqstudio@gmail.com',
  profileUrl: 'https://github.com/gxqstudio',
  installations: [
    {
      id: 4892019,
      account: 'gxqstudio',
      appSlug: 'ai-studio-miniapp-deployer',
      targetType: 'User',
      repositoriesCount: 14,
    },
    {
      id: 5930122,
      account: 'cyber-dao-labs',
      appSlug: 'ai-studio-miniapp-deployer',
      targetType: 'Organization',
      repositoriesCount: 28,
    },
  ],
};

export const INITIAL_REPOSITORIES: GitHubRepository[] = [
  {
    id: 101,
    name: 'cyber-runner-miniapp',
    fullName: 'gxqstudio/cyber-runner-miniapp',
    private: false,
    htmlUrl: 'https://github.com/gxqstudio/cyber-runner-miniapp',
    description: 'High-speed cyberpunk runner on Base L2 with Farcaster Frames v2 payload.',
    defaultBranch: 'main',
    updatedAt: '12m ago',
    language: 'TypeScript',
    hasWorkflows: true,
    installedApp: true,
  },
  {
    id: 102,
    name: 'base-social-tipping',
    fullName: 'gxqstudio/base-social-tipping',
    private: false,
    htmlUrl: 'https://github.com/gxqstudio/base-social-tipping',
    description: 'Instant micro-tipping miniapp for Telegram & Warpcast creators.',
    defaultBranch: 'main',
    updatedAt: '3h ago',
    language: 'TypeScript',
    hasWorkflows: true,
    installedApp: true,
  },
  {
    id: 103,
    name: 'memecast-generator',
    fullName: 'gxqstudio/memecast-generator',
    private: true,
    htmlUrl: 'https://github.com/gxqstudio/memecast-generator',
    description: 'AI meme generator with automated Base NFT minting.',
    defaultBranch: 'main',
    updatedAt: '1d ago',
    language: 'TypeScript',
    hasWorkflows: false,
    installedApp: true,
  },
  {
    id: 104,
    name: 'worldcoin-verifier',
    fullName: 'cyber-dao-labs/worldcoin-verifier',
    private: false,
    htmlUrl: 'https://github.com/cyber-dao-labs/worldcoin-verifier',
    description: 'World App Mini App proof-of-humanity gating contract.',
    defaultBranch: 'main',
    updatedAt: '2d ago',
    language: 'Solidity',
    hasWorkflows: true,
    installedApp: true,
  },
];

export interface SyncProgressStep {
  step: number;
  totalSteps: number;
  title: string;
  detail: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}

export async function simulateGitHubSync(
  repoName: string,
  isNewRepo: boolean,
  branch: string,
  includeCI: boolean,
  onProgress: (step: SyncProgressStep) => void
): Promise<{ success: boolean; repoUrl: string; commitSha: string }> {
  const steps: { title: string; detail: string; delay: number }[] = [
    {
      title: 'Authenticate with GitHub App',
      detail: `Signing RS256 JWT using GITHUB_APP_ID (892147) and verifying installation token...`,
      delay: 500,
    },
    {
      title: isNewRepo ? 'Provisioning Repository' : 'Validating Repository Access',
      detail: isNewRepo
        ? `Creating repository gxqstudio/${repoName} with ${branch} branch...`
        : `Verifying write permissions on gxqstudio/${repoName} via GitHub App bot...`,
      delay: 600,
    },
    {
      title: 'Staging Miniapp Source Trees',
      detail: `Bundling Next.js 15 pages, contracts, Farcaster Frame manifest, and Base wallet hooks...`,
      delay: 700,
    },
    ...(includeCI
      ? [
          {
            title: 'Configuring CI/CD Workflows',
            detail: `Injecting .github/workflows/github-actions.yml and vercel.yml from template registry...`,
            delay: 500,
          },
        ]
      : []),
    {
      title: 'Pushing Git Tree & Commit',
      detail: `Creating tree blob commit: "feat: sync miniapp source from AI Studio V2.0" to refs/heads/${branch}...`,
      delay: 700,
    },
    {
      title: 'Registering Vercel Deploy Webhook',
      detail: `Subscribing webhook to push events for automatic zero-downtime deployment.`,
      delay: 400,
    },
  ];

  const totalSteps = steps.length;
  for (let i = 0; i < totalSteps; i++) {
    const s = steps[i];
    onProgress({
      step: i + 1,
      totalSteps,
      title: s.title,
      detail: s.detail,
      status: 'running',
    });
    await new Promise((r) => setTimeout(r, s.delay));
    onProgress({
      step: i + 1,
      totalSteps,
      title: s.title,
      detail: s.detail,
      status: 'completed',
    });
  }

  const randomHex = Math.random().toString(16).slice(2, 9);
  return {
    success: true,
    repoUrl: `https://github.com/gxqstudio/${repoName}`,
    commitSha: randomHex,
  };
}
