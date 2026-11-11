/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  INITIAL_APPS, 
  INITIAL_TOKENS, 
  INITIAL_SHIPPED_EVENTS, 
  INITIAL_USER, 
  INITIAL_FEEDBACKS
} from './data/mockData';
import { 
  AppFeedback, 
  AppItem, 
  AppToken, 
  ShippedEvent, 
  UserRole, 
  UserProfile 
} from './types';
import { usePermission } from './hooks/usePermission';
import { Navbar } from './components/Navbar';
import { SliderMenu, EnterpriseTab } from './components/SliderMenu';
import { LandingView } from './components/LandingView';
import { EnterpriseDashboardView } from './components/EnterpriseDashboardView';
import { WorkspaceView } from './components/WorkspaceView';
import { ProjectsView } from './components/ProjectsView';
import { RewardsView } from './components/RewardsView';
import { SettingsView } from './components/SettingsView';
import { MiniPopupWindow, MiniWindowItem } from './components/MiniPopupWindow';
import { MobileBottomDock } from './components/MobileBottomDock';
import { WorkspaceErrorBoundary } from './components/ErrorBoundary';

// Modals
import { CreditModal } from './components/CreditModal';
import { WalletModal } from './components/WalletModal';
import { FeeClaimModal } from './components/FeeClaimModal';
import { OnboardingTour } from './components/OnboardingTour';
import { UserProfileModal } from './components/UserProfileModal';
import { SocialShareModal } from './components/SocialShareModal';
import { FarcasterHubsModal } from './components/FarcasterHubsModal';
import { FeedbackModal } from './components/FeedbackModal';
import { GitHubSyncModal } from './components/GitHubSyncModal';
import { AppTemplate } from './types';
import { APP_TEMPLATES } from './data/templates';
import { AppTemplateManager } from './components/AppTemplateManager';
import { AgenticPlainEnglishModal } from './components/AgenticPlainEnglishModal';
import { UniversalFactoryView } from './components/UniversalFactoryView';
import { ArtifactManagerView } from './components/ArtifactManagerView';
import { ModelRouterView } from './components/ModelRouterView';
import { CommercialLegalModal } from './components/CommercialLegalModal';
import { GeminiStudioWorkspace } from './components/GeminiStudioWorkspace';
import { AgentFactoryView } from './components/AgentFactoryView';
import { WorkflowFactoryView } from './components/WorkflowFactoryView';
import { Web3FactoryView } from './components/Web3FactoryView';
import { AssetStudioView } from './components/AssetStudioView';
import { GodsOperationsCenter } from './components/GodsOperationsCenter';
import { ExploreView } from './components/ExploreView';

export default function App() {
  // Navigation State: Landing is the default clean interface
  const [activeTab, setActiveTab] = useState<EnterpriseTab>('landing');
  const [sliderMenuOpen, setSliderMenuOpen] = useState(false);

  // Core Data
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);
  const [tokens, setTokens] = useState<AppToken[]>(INITIAL_TOKENS);
  const [shippedEvents, setShippedEvents] = useState<ShippedEvent[]>(INITIAL_SHIPPED_EVENTS);
  const [feedbacks, setFeedbacks] = useState<AppFeedback[]>(INITIAL_FEEDBACKS);

  // Active Workspace / Simulator App Selection
  const [selectedWorkspaceApp, setSelectedWorkspaceApp] = useState<AppItem | null>(INITIAL_APPS[0]);

  // Fast Mini Pop-Up Window State
  const [miniWindowItem, setMiniWindowItem] = useState<MiniWindowItem | null>(null);

  // Global Modals
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [claimModalApp, setClaimModalApp] = useState<AppItem | null>(null);
  const [shareModalApp, setShareModalApp] = useState<AppItem | null>(null);
  const [farcasterModalApp, setFarcasterModalApp] = useState<AppItem | null>(null);
  const [feedbackModalApp, setFeedbackModalApp] = useState<AppItem | null>(null);
  const [githubSyncApp, setGithubSyncApp] = useState<AppItem | null>(null);
  const [templates, setTemplates] = useState<AppTemplate[]>(APP_TEMPLATES);
  const [agenticModalOpen, setAgenticModalOpen] = useState(false);
  const [commercialModalOpen, setCommercialModalOpen] = useState(false);

  // Granular RBAC Permissions
  const canCreateApp = usePermission(user.role, 'create_app');
  const canClaimFees = usePermission(user.role, 'claim_fees');
  const canFeatureApp = usePermission(user.role, 'feature_app');

  // Handle adding credits
  const handleAddCredits = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      creditBalance: prev.creditBalance + amount,
    }));
  };

  // Handle fee claim confirmation
  const handleConfirmClaim = (appId: string, claimedAmount: number) => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            wallet: {
              ...app.wallet,
              unclaimedFeesEth: 0,
              totalFeesClaimedEth: app.wallet.totalFeesClaimedEth + claimedAmount,
              ethBalance: app.wallet.ethBalance + claimedAmount,
            },
          };
        }
        return app;
      })
    );

    const targetApp = apps.find((a) => a.id === appId);
    if (targetApp) {
      const claimEvent: ShippedEvent = {
        id: `evt_claim_${Date.now()}`,
        timestamp: 'Just now',
        type: 'fees_claimed',
        appName: targetApp.name,
        appSlug: targetApp.slug,
        detail: `Creator claimed ${claimedAmount.toFixed(4)} ETH in 60% Uniswap v4 trading fees`,
        badge: 'FEE CLAIMED',
        badgeColor: 'green',
        txHash: '0x' + Math.random().toString(16).slice(2, 10) + '...',
      };
      setShippedEvents((prev) => [claimEvent, ...prev]);
    }
  };

  const handleOpenClaimModal = (appId: string) => {
    if (!canClaimFees) {
      alert(`Your active role (${user.role}) lacks 'claim_fees' permission. Switch to APP_OWNER or SUPER_ADMIN in the settings.`);
      return;
    }
    const found = apps.find((a) => a.id === appId);
    if (found) setClaimModalApp(found);
  };

  // Handle repository linking update
  const handleUpdateAppRepo = (appId: string, repoUrl: string) => {
    setApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, githubRepoUrl: repoUrl } : app))
    );
    if (selectedWorkspaceApp && selectedWorkspaceApp.id === appId) {
      setSelectedWorkspaceApp((prev) => (prev ? { ...prev, githubRepoUrl: repoUrl } : null));
    }
    const target = apps.find((a) => a.id === appId);
    if (target) {
      const gitEvent: ShippedEvent = {
        id: `evt_git_${Date.now()}`,
        timestamp: 'Just now',
        type: 'build_completed',
        appName: target.name,
        appSlug: target.slug,
        detail: `Linked and synced to GitHub repository: ${repoUrl}`,
        badge: 'GITHUB SYNCED',
        badgeColor: 'blue',
      };
      setShippedEvents((prev) => [gitEvent, ...prev]);
    }
  };

  // Handle selecting a template to create/launch into Workspace
  const handleSelectTemplateForApp = (template: AppTemplate) => {
    const newApp: AppItem = {
      id: `app_${Date.now()}`,
      name: template.title,
      slug: `${template.slug}-${Date.now().toString(36).slice(-4)}`,
      tagline: template.tagline,
      description: template.description,
      type: template.type,
      category: template.category || 'Utilities & AI Tools',
      featured: false,
      author: {
        name: user.name,
        handle: user.handle,
        avatarUrl: user.avatarUrl,
        verifiedX: user.xVerified,
        farcasterFid: user.farcasterFid,
        address: user.address,
      },
      createdAt: new Date().toISOString(),
      status: 'live',
      accentColor: template.previewColor || '#A020F0',
      neonBorderColor: (template.neonGlow as any) || 'purple',
      wallet: {
        address: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        ethBalance: 0.05,
        tokenBalance: 1000000,
        usdcBalance: 250,
        unclaimedFeesEth: 0,
        totalFeesClaimedEth: 0,
        privateKeyMasked: '0x••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••',
      },
      metrics: {
        opens: 1,
        uniqueUsers: 1,
        totalTransactions: 0,
        rating: 5.0,
        feedbackCount: 0,
      },
      platforms: {
        web: true,
        farcaster: true,
        telegram: true,
        world: true,
        celo: true,
        base: true,
      },
      farcasterManifest: {
        name: template.title,
        iconUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&h=200&q=80',
        homeUrl: `https://${template.slug}.aistudio.run`,
        imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&h=630&q=80',
        buttonTitle: 'Open Miniapp ⚡',
        splashImageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&h=800&q=80',
        splashBackgroundColor: '#070913',
        webhookUrl: `https://${template.slug}.aistudio.run/api/webhook`,
      },
      githubRepoUrl: template.githubRepoUrl || `https://github.com/aistudio-builds/${template.slug}`,
      vercelDeployUrl: template.liveDemoUrl || `https://${template.slug}.aistudio.run`,
      keyFeatures: template.keyFeatures || template.suggestedFeatures || [],
      files: template.codePreset,
      buildSteps: [],
    };

    setApps((prev) => [newApp, ...prev]);
    setSelectedWorkspaceApp(newApp);
    setActiveTab('workspace');

    // Increment template instantiation counter
    setTemplates((prev) =>
      prev.map((t) => (t.id === template.id ? { ...t, instantiations: (t.instantiations || 0) + 1 } : t))
    );
  };

  // Open Workspace with a prompt from the landing page
  const handleOpenWorkspaceWithPrompt = (promptText: string) => {
    const newApp: AppItem = {
      id: `app_${Date.now()}`,
      name: promptText.length > 24 ? `${promptText.slice(0, 22)}...` : promptText,
      slug: `ai-${Date.now().toString(36)}`,
      tagline: 'Enterprise-grade onchain miniapp',
      description: promptText,
      type: 'custom',
      category: 'ai',
      featured: false,
      author: {
        name: user.name,
        handle: user.handle,
        avatarUrl: user.avatarUrl,
        verifiedX: user.xVerified,
        farcasterFid: user.farcasterFid,
        address: user.address,
      },
      status: 'live',
      accentColor: '#A020F0',
      neonBorderColor: 'purple',
      wallet: {
        address: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        ethBalance: 0.05,
        tokenBalance: 1000000,
        usdcBalance: 250,
        unclaimedFeesEth: 0.12,
        totalFeesClaimedEth: 0,
        privateKeyMasked: '0x••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••',
      },
      metrics: {
        opens: 1,
        uniqueUsers: 1,
        totalTransactions: 4,
        rating: 5.0,
        feedbackCount: 1,
      },
      platforms: {
        web: true,
        farcaster: true,
        telegram: true,
        world: true,
        celo: true,
        base: true,
      },
      farcasterManifest: {
        name: promptText,
        iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80',
        homeUrl: 'https://aistudio.build/app',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        buttonTitle: 'Launch Miniapp',
        splashImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        splashBackgroundColor: '#070913',
        webhookUrl: 'https://api.aistudio.build/farcaster-events',
      },
      githubRepoUrl: 'https://github.com/ai-studio/generated-miniapp',
      vercelDeployUrl: 'https://aistudio.build/live-app',
      files: {
        'src/app/page.tsx': `export default function App() {\n  return <div>${promptText}</div>;\n}`,
      },
      buildSteps: [],
      createdAt: new Date().toISOString(),
    };

    setApps((prev) => [newApp, ...prev]);
    setSelectedWorkspaceApp(newApp);
    setActiveTab('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Mini Pop-Up "Open Full Page" action
  const handleOpenFullPageFromMini = (item: MiniWindowItem) => {
    if (item.appId) {
      const app = apps.find((a) => a.id === item.appId);
      if (app) {
        setSelectedWorkspaceApp(app);
      }
    }
    setActiveTab('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background Cyber Grid & Subtle Glow Atmosphere */}
      <div className="fixed inset-0 cyber-grid opacity-35 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[500px] h-[350px] bg-[#A020F0]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/3 right-10 w-[450px] h-[450px] bg-[#3A8DFF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-10 left-10 w-[450px] h-[350px] bg-[#FF2A55]/08 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar: On landing, clean and minimal; on enterprise sections, comprehensive controls */}
      {activeTab !== 'landing' ? (
        <Navbar
          activeTab={activeTab}
          setActiveTab={(t) => setActiveTab(t)}
          onOpenSliderMenu={() => setSliderMenuOpen(true)}
          user={user}
          setUser={setUser}
          onOpenCreditsModal={() => setCreditModalOpen(true)}
          onOpenWalletModal={() => setWalletModalOpen(true)}
          onOpenProfileModal={() => setProfileModalOpen(true)}
          onOpenOnboardingTour={() => setTourOpen(true)}
          myAppsCount={apps.length}
        />
      ) : null}

      {/* Main Content Router */}
      <main className="flex-1 pb-16 md:pb-6">
        {activeTab === 'landing' && (
          <LandingView
            onOpenSliderMenu={() => setSliderMenuOpen(true)}
            onOpenWorkspaceWithPrompt={handleOpenWorkspaceWithPrompt}
            onOpenMiniWindow={(item) => setMiniWindowItem(item)}
            onOpenWorkspace={() => setActiveTab('workspace')}
            onOpenAgenticGuide={() => setAgenticModalOpen(true)}
            onOpenTemplates={() => setActiveTab('templates')}
            onOpenExplore={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'workspace' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <GeminiStudioWorkspace onOpenSimulator={() => setActiveTab('factory')} />
          </div>
        )}

        {activeTab === 'explore' && (
          <ExploreView
            onSelectApp={(app) => {
              setSelectedWorkspaceApp(app);
              setActiveTab('workspace');
            }}
            onRemixApp={(app) => {
              setSelectedWorkspaceApp(app);
              setActiveTab('workspace');
            }}
            onShareApp={(app) => setShareModalApp(app)}
            onOpenFeedback={(app) => setFeedbackModalApp(app)}
            onToggleFeatured={(appId) => {
              setApps((prev) =>
                prev.map((a) => (a.id === appId ? { ...a, featured: !a.featured } : a))
              );
            }}
            canFeatureApp={canFeatureApp}
            onSelectTemplate={handleSelectTemplateForApp}
            templates={templates}
          />
        )}

        {activeTab === 'factory' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <UniversalFactoryView />
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AgentFactoryView />
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <WorkflowFactoryView />
          </div>
        )}

        {activeTab === 'web3' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Web3FactoryView />
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AssetStudioView />
          </div>
        )}

        {activeTab === 'router' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ModelRouterView />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <GodsOperationsCenter currentUserEmail="gxqstudio@gmail.com" />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <CommercialLegalModal
              isOpen={true}
              onClose={() => setActiveTab('landing')}
              onSelectPlan={(tier) => {
                alert(`Selected tier: ${tier}. Subscription routed to payment gateway.`);
                setActiveTab('landing');
              }}
            />
          </div>
        )}

        {activeTab === 'templates' && (
          <AppTemplateManager
            user={user}
            templates={templates}
            onUpdateTemplates={(updated) => setTemplates(updated)}
            onSelectTemplateForApp={handleSelectTemplateForApp}
            onOpenWorkspaceWithApp={(app) => {
              setApps((prev) => [app, ...prev]);
              setSelectedWorkspaceApp(app);
              setActiveTab('workspace');
            }}
            onUpdateRole={(role) => setUser((u) => ({ ...u, role }))}
          />
        )}

        {activeTab === 'dashboard' && (
          <EnterpriseDashboardView
            apps={apps}
            tokens={tokens}
            events={shippedEvents}
            user={user}
            onOpenMiniWindow={(item) => setMiniWindowItem(item)}
            onOpenWorkspace={() => setActiveTab('workspace')}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            apps={apps}
            user={user}
            onSelectAppForWorkspace={(app) => {
              setSelectedWorkspaceApp(app);
              setActiveTab('workspace');
            }}
            onOpenMiniWindow={(item) => setMiniWindowItem(item)}
            onOpenShareModal={(app) => setShareModalApp(app)}
            onClaimFees={handleOpenClaimModal}
            onOpenGitHubSync={(app) => setGithubSyncApp(app)}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsView
            user={user}
            onAddCredits={handleAddCredits}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            user={user}
            onUpdateRole={(role) => setUser((u) => ({ ...u, role }))}
          />
        )}

        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto px-4 py-8">
            <UserProfileModal
              isOpen={true}
              onClose={() => setActiveTab('landing')}
              user={user}
              onUpdateUser={(updated) => setUser(updated)}
              onRestartOnboarding={() => setTourOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Slider Menu (Hidden by default, slides in from left) */}
      <SliderMenu
        isOpen={sliderMenuOpen}
        onClose={() => setSliderMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'profile') {
            setProfileModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        user={user}
      />

      {/* Fast Mini Pop-Up Window (Modal for search results, code snippets, files, images) */}
      <MiniPopupWindow
        isOpen={Boolean(miniWindowItem)}
        item={miniWindowItem}
        onClose={() => setMiniWindowItem(null)}
        onOpenFullPage={handleOpenFullPageFromMini}
      />

      {/* Floating Bottom Navigation Bar for Mobile: Home, Workspace, Projects, Menu */}
      <MobileBottomDock
        activeTab={activeTab}
        onSelectTab={(t) => setActiveTab(t)}
        onOpenMenu={() => setSliderMenuOpen(true)}
        projectsCount={apps.length}
      />

      {/* Enterprise Global Modals */}
      <CreditModal
        isOpen={creditModalOpen}
        onClose={() => setCreditModalOpen(false)}
        onAddCredits={handleAddCredits}
        currentBalance={user.creditBalance}
      />

      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        user={user}
        onSwitchAddress={(addr) => setUser((prev) => ({ ...prev, address: addr }))}
      />

      <FeeClaimModal
        app={claimModalApp}
        user={user}
        isOpen={Boolean(claimModalApp)}
        onClose={() => setClaimModalApp(null)}
        onConfirmClaim={handleConfirmClaim}
      />

      <SocialShareModal
        isOpen={Boolean(shareModalApp)}
        onClose={() => setShareModalApp(null)}
        app={shareModalApp}
      />

      <FarcasterHubsModal
        isOpen={Boolean(farcasterModalApp)}
        onClose={() => setFarcasterModalApp(null)}
        app={farcasterModalApp}
        user={user}
      />

      <FeedbackModal
        isOpen={Boolean(feedbackModalApp)}
        onClose={() => setFeedbackModalApp(null)}
        app={feedbackModalApp}
        user={user}
        onSubmitFeedback={(feedback) => {
          setFeedbacks((prev) => [feedback, ...prev]);
        }}
      />

      <OnboardingTour
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
        onComplete={() => {
          setTourOpen(false);
          setUser((u) => ({ ...u, onboardingCompleted: true }));
        }}
        onApplyPrompt={(name, prompt) => {
          handleOpenWorkspaceWithPrompt(prompt);
          setTourOpen(false);
        }}
      />

      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onUpdateUser={(updated) => setUser(updated)}
        onRestartOnboarding={() => setTourOpen(true)}
      />

      <GitHubSyncModal
        isOpen={Boolean(githubSyncApp)}
        onClose={() => setGithubSyncApp(null)}
        app={githubSyncApp}
        onUpdateAppRepo={handleUpdateAppRepo}
      />

      <AgenticPlainEnglishModal
        isOpen={agenticModalOpen}
        onClose={() => setAgenticModalOpen(false)}
        availableTemplates={templates}
        user={user}
        onLaunchWorkspaceWithApp={(app) => {
          setAgenticModalOpen(false);
          setApps((prev) => [app, ...prev]);
          setSelectedWorkspaceApp(app);
          setActiveTab('workspace');
        }}
        onSaveAsTemplate={(newTemplate) => {
          setTemplates((prev) => [newTemplate, ...prev]);
        }}
      />

      <CommercialLegalModal
        isOpen={commercialModalOpen}
        onClose={() => setCommercialModalOpen(false)}
      />
    </div>
  );
}
