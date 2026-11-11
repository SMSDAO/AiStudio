/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppItem, AppTemplate, MiniappType } from '../types';
import { generateAppArtifacts } from './agentService';

export interface TranslatedAppPlan {
  // Plain English for the non-technical user
  plainGoal: string;
  userAudience: string;
  howItWorksSimply: string[];
  howYouMakeMoney: string;
  recommendedTheme: string;
  suggestedName: string;
  plainTagline: string;

  // Technical specs for the main engine
  technicalCategory: string;
  detectedType: MiniappType;
  smartContractModel: string;
  frameworkStack: string[];
  suggestedFeatures: string[];
  targetPlatforms: string[];
  monetizationModel: string;
  matchedTemplateId?: string;

  // Generated ready-to-run files & code
  starterFiles: Record<string, string>;
  prefilledClarifications: Record<string, string>;
}

/**
 * Analyzes non-technical plain English desires and converts them into
 * complete architectural specifications, template recommendation, and main engine instructions.
 */
export function translatePlainEnglishRequirements(
  rawInput: string,
  availableTemplates: AppTemplate[],
  options?: {
    audience?: string;
    revenueGoal?: string;
    lookAndFeel?: string;
  }
): TranslatedAppPlan {
  const lower = rawInput.toLowerCase();
  const audience = options?.audience || 'General public / social followers';
  const revenueGoal = options?.revenueGoal || 'Automatic 60% creator earnings';
  const lookAndFeel = options?.lookAndFeel || 'Cyberpunk Neon';

  // 1. Detect Intent & Type
  let detectedType: MiniappType = 'custom';
  let category = 'Utilities & AI Tools';
  let matchedTemplate = availableTemplates.find(t => t.id === 'tmpl_ai_agent');

  if (
    lower.includes('game') ||
    lower.includes('play') ||
    lower.includes('arcade') ||
    lower.includes('score') ||
    lower.includes('jump') ||
    lower.includes('runner')
  ) {
    detectedType = 'arcade';
    category = 'Games & Entertainment';
    matchedTemplate = availableTemplates.find(t => t.id === 'tmpl_arcade');
  } else if (
    lower.includes('tip') ||
    lower.includes('donate') ||
    lower.includes('jar') ||
    lower.includes('coffee') ||
    lower.includes('support') ||
    lower.includes('money')
  ) {
    detectedType = 'tipping';
    category = 'Commerce & Tips';
    matchedTemplate = availableTemplates.find(t => t.id === 'tmpl_tipping');
  } else if (
    lower.includes('vote') ||
    lower.includes('poll') ||
    lower.includes('decide') ||
    lower.includes('choice') ||
    lower.includes('survey')
  ) {
    detectedType = 'poll';
    category = 'Social & Farcaster';
    matchedTemplate = availableTemplates.find(t => t.id === 'tmpl_poll');
  } else if (
    lower.includes('meme') ||
    lower.includes('funny') ||
    lower.includes('picture') ||
    lower.includes('sticker') ||
    lower.includes('photo')
  ) {
    detectedType = 'meme';
    category = 'Creative & NFT';
    matchedTemplate = availableTemplates.find(t => t.id === 'tmpl_meme');
  } else if (
    lower.includes('stake') ||
    lower.includes('invest') ||
    lower.includes('vault') ||
    lower.includes('defi') ||
    lower.includes('yield') ||
    lower.includes('interest')
  ) {
    detectedType = 'casino';
    category = 'DeFi & Trading';
    matchedTemplate = availableTemplates.find(t => t.id === 'tmpl_defi_staking');
  } else if (
    lower.includes('blog') ||
    lower.includes('write') ||
    lower.includes('article') ||
    lower.includes('news') ||
    lower.includes('story')
  ) {
    detectedType = 'blog';
    category = 'Creative & NFT';
    matchedTemplate = availableTemplates.find(t => t.id === 'tmpl_blog');
  } else if (
    lower.includes('event') ||
    lower.includes('meet') ||
    lower.includes('party') ||
    lower.includes('calendar') ||
    lower.includes('rsvp') ||
    lower.includes('date')
  ) {
    detectedType = 'calendar';
    category = 'Social & Farcaster';
    matchedTemplate = availableTemplates.find(t => t.id === 'tmpl_calendar');
  } else if (
    lower.includes('gallery') ||
    lower.includes('art') ||
    lower.includes('show') ||
    lower.includes('nft') ||
    lower.includes('collectible')
  ) {
    detectedType = 'nft_gallery';
    category = 'Creative & NFT';
    matchedTemplate = availableTemplates.find(t => t.id === 'tmpl_nft_gallery');
  }

  // 2. Derive Catchy Non-Technical Name & Tagline
  const words = rawInput
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !['want', 'need', 'make', 'build', 'like', 'with', 'that', 'this', 'have'].includes(w.toLowerCase()));
  
  const leadWord = words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : 'Vibe';
  const secondWord = words[1] ? words[1].charAt(0).toUpperCase() + words[1].slice(1) : 'Hub';
  const suggestedName = `${leadWord} ${secondWord}`;

  const plainTagline = `The easiest way to ${rawInput.slice(0, 50).trim()} with instant mobile sharing.`;

  // 3. Plain English Explanations (Zero Jargon)
  const howItWorksSimply = [
    `1. Visitors tap a link on mobile or Farcaster to open your app instantly—no app store downloads needed.`,
    `2. They interact directly (e.g. vote, play, make memes, or browse) with smooth touch controls.`,
    `3. Every transaction or tip sends 60% of earnings straight to your personal creator wallet automatically.`,
    `4. Verified anti-cheating and secure rules run in the background so you never have to manage servers.`
  ];

  const howYouMakeMoney = revenueGoal.includes('Free') 
    ? 'Free for users to play & engage, with optional appreciation micro-tips.'
    : 'Automated 60% creator fee split: every time someone tips, plays, or transacts, 60% streams to your wallet in real time.';

  // 4. Smart Contract & Tech Model (Mapped for the Engine)
  const smartContractModel = detectedType === 'tipping' 
    ? 'BaseUSDCVaultWith60PctCreatorSplit'
    : detectedType === 'arcade'
    ? 'BaseLeaderboardWithBondingCurveScore'
    : detectedType === 'poll'
    ? 'WorldIDSybilResistantBallot'
    : detectedType === 'meme'
    ? 'ERC721MemeMinterWithRoyaltySplit'
    : 'ClankerFeeDistributorV2';

  const starterFiles: Record<string, string> = {
    'page.tsx': matchedTemplate?.codePreset['page.tsx'] || `// AI STUDIO Generated Miniapp\n'use client';\nimport React from 'react';\n\nexport default function Page() {\n  return (\n    <main className="min-h-screen bg-[#070913] text-white p-6 flex flex-col items-center justify-center">\n      <h1 className="text-3xl font-bold font-display text-purple-400">${suggestedName}</h1>\n      <p className="text-sm text-slate-300 mt-2 text-center max-w-sm">${plainTagline}</p>\n      <div className="p-6 bg-white/5 border border-purple-500/30 rounded-2xl mt-6 max-w-sm w-full backdrop-blur-md text-center">\n        <p className="text-xs text-slate-400">Ready for instant mobile deployment & 60% creator split.</p>\n        <button className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white shadow-lg">\n          Get Started 🚀\n        </button>\n      </div>\n    </main>\n  );\n}`,
    'contracts/Contract.sol': `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.24;\n\ncontract ${smartContractModel} {\n    address public immutable creator;\n    uint256 public constant CREATOR_FEE_BPS = 6000; // 60% creator cut\n\n    event ActionExecuted(address indexed user, uint256 amount);\n\n    constructor(address _creator) {\n        creator = _creator;\n    }\n\n    receive() external payable {\n        uint256 cut = (msg.value * CREATOR_FEE_BPS) / 10000;\n        (bool sent, ) = creator.call{value: cut}("");\n        require(sent, "Creator payment failed");\n        emit ActionExecuted(msg.sender, msg.value);\n    }\n}`,
  };

  const prefilledClarifications: Record<string, string> = {
    'q_target_platform': 'Farcaster Mini App (Frames v2 - Recommended)',
    'q_monetization': 'Clanker $TICKER launch with 60% Uniswap v4 trading fee split',
    'q_brand_style': lookAndFeel.toLowerCase().includes('pixel') ? 'Neo-Retro Pixel' : 'Cyber Minimalist',
    'q_brand_palette': lookAndFeel.toLowerCase().includes('green') ? 'Solar Punk Emerald' : 'Cyber Neon Matrix',
  };

  return {
    plainGoal: rawInput,
    userAudience: audience,
    howItWorksSimply,
    howYouMakeMoney,
    recommendedTheme: lookAndFeel,
    suggestedName,
    plainTagline,
    technicalCategory: category,
    detectedType,
    smartContractModel,
    frameworkStack: ['Next.js 15 App Router', 'Tailwind CSS', 'Base L2 Smart Wallet', 'Supabase Realtime'],
    suggestedFeatures: matchedTemplate?.suggestedFeatures || [
      'Touch-friendly mobile UI',
      'Base gasless transactions',
      'Real-time data synchronization',
      'Automated 60% revenue split'
    ],
    targetPlatforms: matchedTemplate?.suggestedPlatforms || ['Farcaster Frames v2', 'Base App', 'Web Mobile'],
    monetizationModel: matchedTemplate?.monetizationModel || '60% creator revenue split via Base Smart Wallet',
    matchedTemplateId: matchedTemplate?.id,
    starterFiles,
    prefilledClarifications,
  };
}

/**
 * Directly synthesizes a complete AppItem runnable in the workspace using the main engine.
 */
export function buildAppFromPlainEnglish(
  plan: TranslatedAppPlan,
  authorAddress: string,
  authorName: string,
  authorHandle: string
): AppItem {
  return generateAppArtifacts(
    plan.suggestedName,
    `${plan.plainGoal} - Category: ${plan.technicalCategory}, Target: ${plan.targetPlatforms.join(', ')}`,
    plan.prefilledClarifications,
    authorAddress,
    authorName,
    authorHandle
  );
}
