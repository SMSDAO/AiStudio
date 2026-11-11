import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Smile, 
  Coins, 
  Palette, 
  Cpu, 
  Layers, 
  Code2, 
  Check, 
  Rocket, 
  RefreshCw,
  FolderPlus,
  BookOpen
} from 'lucide-react';
import { AppItem, AppTemplate, UserProfile } from '../types';
import { translatePlainEnglishRequirements, TranslatedAppPlan, buildAppFromPlainEnglish } from '../services/agentTranslatorService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  availableTemplates: AppTemplate[];
  user: UserProfile;
  onLaunchWorkspaceWithApp: (app: AppItem) => void;
  onSaveAsTemplate?: (template: AppTemplate) => void;
  initialPrompt?: string;
}

const INSPIRATION_IDEAS = [
  {
    title: 'Lemonade Stand Tip Jar',
    desc: 'I want a digital tip jar where friends or followers can send me $1 or $5 and see their name on a thank-you board.',
    icon: '🍋',
  },
  {
    title: 'Community Pizza Vote',
    desc: 'A simple voting app where our social group votes on what toppings to order, with live percentage bars.',
    icon: '🍕',
  },
  {
    title: 'Cat Meme Generator',
    desc: 'An app where users upload or pick silly cat pictures, add funny captions, and share them directly on social media.',
    icon: '🐱',
  },
  {
    title: 'Retro Space Dodger Game',
    desc: 'A simple tap-to-fly game where players dodge asteroids and the highest score wins bragging rights.',
    icon: '🚀',
  },
];

export const AgenticPlainEnglishModal: React.FC<Props> = ({
  isOpen,
  onClose,
  availableTemplates,
  user,
  onLaunchWorkspaceWithApp,
  onSaveAsTemplate,
  initialPrompt = '',
}) => {
  const [plainInput, setPlainInput] = useState(initialPrompt);
  const [audience, setAudience] = useState('Friends & Social Media Followers');
  const [monetizationPreference, setMonetizationPreference] = useState('Automatic 60% creator earnings on tips & plays');
  const [themeStyle, setThemeStyle] = useState('Cyberpunk Neon (Dark with glow accents)');
  
  const [isTranslating, setIsTranslating] = useState(false);
  const [plan, setPlan] = useState<TranslatedAppPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'plain' | 'technical'>('plain');
  const [isBuildingApp, setIsBuildingApp] = useState(false);

  if (!isOpen) return null;

  const handleTranslate = () => {
    if (!plainInput.trim()) return;
    setIsTranslating(true);
    setTimeout(() => {
      const translated = translatePlainEnglishRequirements(plainInput, availableTemplates, {
        audience,
        revenueGoal: monetizationPreference,
        lookAndFeel: themeStyle,
      });
      setPlan(translated);
      setIsTranslating(false);
    }, 600);
  };

  const handleBuildAndLaunch = () => {
    if (!plan) return;
    setIsBuildingApp(true);
    setTimeout(() => {
      const builtApp = buildAppFromPlainEnglish(
        plan,
        user.address,
        user.name,
        user.handle
      );
      setIsBuildingApp(false);
      onClose();
      onLaunchWorkspaceWithApp(builtApp);
    }, 800);
  };

  const handleSaveAsTemplate = () => {
    if (!plan || !onSaveAsTemplate) return;
    const newTemplate: AppTemplate = {
      id: `tmpl_${Date.now()}`,
      title: plan.suggestedName,
      slug: plan.suggestedName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      icon: '✨',
      tagline: plan.plainTagline,
      description: plan.plainGoal,
      type: plan.detectedType,
      category: plan.technicalCategory,
      difficulty: 'Beginner',
      status: 'published',
      plainEnglishSummary: plan.howItWorksSimply[0] || 'A beginner-friendly miniapp blueprint.',
      tags: ['agentic-generated', 'no-code-friendly', plan.detectedType],
      author: { name: user.name, handle: user.handle },
      instantiations: 1,
      suggestedFeatures: plan.suggestedFeatures,
      suggestedPlatforms: plan.targetPlatforms,
      monetizationModel: plan.monetizationModel,
      previewColor: '#A020F0',
      neonGlow: 'purple',
      codePreset: plan.starterFiles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSaveAsTemplate(newTemplate);
    alert(`Success! Template "${plan.suggestedName}" saved to AppTemplateManager.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0a0e1e] border border-purple-500/30 rounded-3xl shadow-[0_0_50px_rgba(160,32,240,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <Smile className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold font-display text-white">
                  Agentic Plain-English Builder
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
                  NO TECH TERMS NEEDED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Describe your dream app in everyday words. The AI handles smart contracts, frameworks, and code.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {!plan ? (
            /* STEP 1: Plain English Prompting & Guided Questions */
            <div className="space-y-5">
              {/* Inspiration Chips */}
              <div>
                <span className="text-xs font-mono text-slate-400 block mb-2">
                  Need inspiration? Tap an example:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INSPIRATION_IDEAS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPlainInput(item.desc)}
                      className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-purple-500/30 text-left transition-all group flex items-start space-x-2.5"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-white block group-hover:text-purple-300">
                          {item.title}
                        </span>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Natural Language Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold font-mono text-purple-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>1. What do you want your app to do? (In plain words)</span>
                </label>
                <textarea
                  value={plainInput}
                  onChange={(e) => setPlainInput(e.target.value)}
                  placeholder="e.g. I run a neighborhood basketball club. I want a page where players vote for MVP each week, see the leader ranking, and tip the referee in small coins..."
                  rows={4}
                  className="w-full p-3.5 bg-black/50 border border-white/15 focus:border-purple-500 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none font-sans"
                />
              </div>

              {/* Guided Plain English Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 flex items-center space-x-1">
                    <HelpCircle className="w-3 h-3 text-cyan-400" />
                    <span>Who is it for?</span>
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Friends & Social Media Followers">Friends & Social Followers</option>
                    <option value="Gaming Clan & Competitors">Gamers & Clan Members</option>
                    <option value="Customers & Shop Patrons">Customers & Fans</option>
                    <option value="Club or Community Group">Local Club or Community</option>
                    <option value="Anyone Online">Public & Web</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 flex items-center space-x-1">
                    <Coins className="w-3 h-3 text-emerald-400" />
                    <span>How do you want to make money?</span>
                  </label>
                  <select
                    value={monetizationPreference}
                    onChange={(e) => setMonetizationPreference(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Automatic 60% creator earnings on tips & plays">60% Creator Earnings (Recommended)</option>
                    <option value="One-tap digital tip jar ($1, $5, $20)">Tip Jar ($1, $5, $20)</option>
                    <option value="Sell digital admission tickets / passes">Sell Admission Passes</option>
                    <option value="100% Free for everyone (Zero fees)">100% Free / Just for fun</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 flex items-center space-x-1">
                    <Palette className="w-3 h-3 text-pink-400" />
                    <span>Visual Vibe</span>
                  </label>
                  <select
                    value={themeStyle}
                    onChange={(e) => setThemeStyle(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="Cyberpunk Neon (Dark with glow accents)">Cyberpunk Neon</option>
                    <option value="Clean Minimalist (Soft slate & modern)">Clean Minimalist</option>
                    <option value="Retro Pixel (Playful 8-bit gaming)">Retro Pixel Arcade</option>
                    <option value="Emerald Solar Punk (Green & futuristic)">Emerald Solar Punk</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleTranslate}
                disabled={!plainInput.trim() || isTranslating}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(160,32,240,0.4)] disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                {isTranslating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Translating plain English into app architecture...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Translate & Generate My App Architecture</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* STEP 2: Translated Architecture & Ready-to-Build View */
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* App Summary Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-blue-950/30 to-black/60 border border-purple-500/40 shadow-[0_0_30px_rgba(160,32,240,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">✨</span>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                      {plan.suggestedName}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 uppercase font-bold">
                      {plan.technicalCategory}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {plan.plainTagline}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setPlan(null)}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
                  >
                    Edit Wish
                  </button>
                  <button
                    onClick={handleBuildAndLaunch}
                    disabled={isBuildingApp}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00FF9D] to-emerald-500 text-black font-bold text-xs shadow-[0_0_20px_rgba(0,255,157,0.4)] flex items-center space-x-1.5 hover:scale-105 transition-all"
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    <span>{isBuildingApp ? 'Building...' : 'Launch in Workspace'}</span>
                  </button>
                </div>
              </div>

              {/* Toggle Plain vs Technical View */}
              <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
                <button
                  onClick={() => setActiveTab('plain')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    activeTab === 'plain'
                      ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                >
                  <Smile className="w-3.5 h-3.5" />
                  <span>Plain-English Breakdown (How It Works)</span>
                </button>
                <button
                  onClick={() => setActiveTab('technical')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    activeTab === 'technical'
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Under-The-Hood Technical Specs</span>
                </button>
              </div>

              {activeTab === 'plain' ? (
                /* Plain English View */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <h4 className="text-xs font-bold font-mono text-purple-300 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#00FF9D]" />
                      <span>How Your Users Will Experience It</span>
                    </h4>
                    <ul className="space-y-2">
                      {plan.howItWorksSimply.map((step, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20">
                      <span className="text-[11px] font-mono text-emerald-400 font-bold block flex items-center space-x-1">
                        <Coins className="w-3.5 h-3.5" />
                        <span>How You Get Paid</span>
                      </span>
                      <p className="text-xs text-slate-300 mt-1">{plan.howYouMakeMoney}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/40 border border-blue-500/20">
                      <span className="text-[11px] font-mono text-blue-400 font-bold block flex items-center space-x-1">
                        <Palette className="w-3.5 h-3.5" />
                        <span>Visual Style Applied</span>
                      </span>
                      <p className="text-xs text-slate-300 mt-1">{plan.recommendedTheme}</p>
                    </div>
                  </div>

                  {/* Matched Template Notice */}
                  {plan.matchedTemplateId && (
                    <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-purple-300" />
                        <span className="text-slate-300">
                          Matched with Template Blueprint: <strong className="text-white">{plan.matchedTemplateId}</strong>
                        </span>
                      </div>
                      <span className="font-mono text-[#00FF9D] text-[11px] font-bold">100% COMPATIBLE</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Technical Breakdown View */
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Smart Contract Engine</span>
                        <span className="text-green-400 font-bold">{plan.smartContractModel}.sol</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Frontend Stack</span>
                        <span className="text-cyan-400 font-bold">{plan.frameworkStack.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Monetization Engine</span>
                        <span className="text-yellow-400 font-bold">{plan.monetizationModel}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Target Ecosystems</span>
                        <span className="text-purple-400 font-bold">{plan.targetPlatforms.join(' • ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* File Preview */}
                  <div className="p-4 rounded-2xl bg-black/80 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase mb-2">Synthesized page.tsx starter preview</span>
                    <pre className="p-3 bg-black/50 rounded-xl text-[11px] text-slate-300 overflow-x-auto max-h-40 border border-white/5">
                      {plan.starterFiles['page.tsx']}
                    </pre>
                  </div>
                </div>
              )}

              {/* Bottom Quick Actions */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                {onSaveAsTemplate && (
                  <button
                    onClick={handleSaveAsTemplate}
                    className="px-4 py-2.5 rounded-xl border border-white/20 hover:border-purple-500/50 text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-1.5 transition-colors"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-purple-400" />
                    <span>Save Blueprint into AppTemplateManager</span>
                  </button>
                )}

                <div className="flex items-center space-x-3 ml-auto">
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleBuildAndLaunch}
                    disabled={isBuildingApp}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-xs shadow-[0_0_25px_rgba(160,32,240,0.5)] flex items-center space-x-2 hover:scale-105 transition-transform"
                  >
                    <Rocket className="w-4 h-4 text-yellow-300" />
                    <span>{isBuildingApp ? 'Building App...' : 'Launch App Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
