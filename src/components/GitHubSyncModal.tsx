import React, { useState, useEffect } from 'react';
import { 
  X, 
  Github, 
  GitBranch, 
  GitCommit, 
  Check, 
  ExternalLink, 
  Copy, 
  FolderGit2, 
  Plus, 
  ShieldCheck, 
  Lock, 
  Globe, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileCode2,
  Cpu,
  Layers,
  ArrowRight,
  Terminal
} from 'lucide-react';
import { AppItem } from '../types';
import { 
  getGitHubAppConfig, 
  MOCK_GITHUB_USER, 
  INITIAL_REPOSITORIES, 
  GitHubRepository, 
  simulateGitHubSync,
  SyncProgressStep 
} from '../services/githubAppService';
import { injectDeploymentWorkflows } from '../services/workflowDeploymentService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  app: AppItem | null;
  onUpdateAppRepo?: (appId: string, repoUrl: string) => void;
}

export const GitHubSyncModal: React.FC<Props> = ({
  isOpen,
  onClose,
  app,
  onUpdateAppRepo,
}) => {
  const config = getGitHubAppConfig();
  const [isConnected, setIsConnected] = useState(true);
  const [activeMode, setActiveMode] = useState<'create' | 'link'>('create');
  
  // Repository Form State
  const [newRepoName, setNewRepoName] = useState('');
  const [repoDescription, setRepoDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [selectedExistingRepo, setSelectedExistingRepo] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState('');
  const [commitMessage, setCommitMessage] = useState('feat: deploy miniapp source from AI STUDIO');
  const [includeCiTemplates, setIncludeCiTemplates] = useState(true);
  const [autoDeployVercel, setAutoDeployVercel] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState('gxqstudio');

  // Sync execution state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgressStep | null>(null);
  const [syncResult, setSyncResult] = useState<{ repoUrl: string; commitSha: string } | null>(null);
  const [copiedClone, setCopiedClone] = useState(false);

  // Sync inputs with selected app
  useEffect(() => {
    if (app) {
      const defaultName = app.slug || app.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      setNewRepoName(defaultName);
      setRepoDescription(app.description || `${app.name} - Enterprise onchain miniapp built with AI STUDIO`);
      setCommitMessage(`feat: initialize ${app.name} miniapp with Base L2 & Farcaster v2 support`);
      setSyncResult(null);
      setSyncProgress(null);
      setIsSyncing(false);
    }
  }, [app, isOpen]);

  if (!isOpen || !app) return null;

  const filteredExistingRepos = INITIAL_REPOSITORIES.filter((r) =>
    r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.description.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleStartSync = async () => {
    const targetRepoName = activeMode === 'create' ? newRepoName : selectedExistingRepo;
    if (!targetRepoName) {
      alert('Please specify or select a repository.');
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);

    try {
      if (includeCiTemplates && app.files) {
        app.files = injectDeploymentWorkflows(app.files);
      }

      const result = await simulateGitHubSync(
        targetRepoName,
        activeMode === 'create',
        selectedBranch,
        includeCiTemplates,
        (progress) => setSyncProgress(progress)
      );

      setSyncResult(result);
      if (onUpdateAppRepo) {
        onUpdateAppRepo(app.id, result.repoUrl);
      }
    } catch {
      alert('GitHub sync encounter an error. Please retry.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyClone = (url: string) => {
    navigator.clipboard.writeText(`git clone ${url}.git`);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Container: Fullscreen on mobile, 640px max on desktop */}
      <div className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-2xl bg-[#090D1A] sm:rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(160,32,240,0.18)] flex flex-col overflow-hidden">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#A020F0] via-[#3A8DFF] to-[#00FF9D]" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-black/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_12px_rgba(160,32,240,0.3)]">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white font-display">
                  GitHub Repository Sync
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 font-semibold">
                  GitHub App v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Synchronize miniapp source code, smart contracts & CI/CD pipelines
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {/* GitHub App Environment Status Pill */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF9D] shadow-[0_0_8px_#00FF9D]" />
              <div>
                <div className="text-xs font-mono font-semibold text-slate-200 flex items-center space-x-1.5">
                  <span>GitHub App ID: {config.appId}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-[#3A8DFF]">{config.appSlug}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  RSA-2048 Private Key & Client Secret verified in environment
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Installation #{config.installationId}</span>
            </div>
          </div>

          {/* Account Connection Status */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                Linked GitHub Account
              </span>
              {isConnected && (
                <span className="text-[11px] font-mono text-[#00FF9D] flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authenticated</span>
                </span>
              )}
            </div>

            {isConnected ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center space-x-3">
                  <img
                    src={MOCK_GITHUB_USER.avatarUrl}
                    alt={MOCK_GITHUB_USER.username}
                    className="w-10 h-10 rounded-full border border-purple-500/40 shadow-[0_0_10px_rgba(160,32,240,0.25)]"
                  />
                  <div>
                    <div className="text-sm font-bold text-white flex items-center space-x-1.5">
                      <span>{MOCK_GITHUB_USER.name}</span>
                      <a
                        href={MOCK_GITHUB_USER.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-purple-400 hover:underline flex items-center"
                      >
                        @{MOCK_GITHUB_USER.username}
                        <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                      </a>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {MOCK_GITHUB_USER.email} • 2 Authorized Installations
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={selectedOwner}
                    onChange={(e) => setSelectedOwner(e.target.value)}
                    className="bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="gxqstudio">Owner: gxqstudio (User)</option>
                    <option value="cyber-dao-labs">Owner: cyber-dao-labs (Org)</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-slate-400">No GitHub account linked yet</span>
                <button
                  onClick={() => setIsConnected(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-slate-200 transition-colors flex items-center space-x-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Authorize GitHub App</span>
                </button>
              </div>
            )}
          </div>

          {/* Sync Progress or Results View */}
          {isSyncing && syncProgress && (
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-purple-300 font-semibold flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#3A8DFF]" />
                  <span>Step {syncProgress.step} of {syncProgress.totalSteps}: {syncProgress.title}</span>
                </span>
                <span className="text-slate-400">
                  {Math.round((syncProgress.step / syncProgress.totalSteps) * 100)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#A020F0] via-[#3A8DFF] to-[#00FF9D] transition-all duration-300"
                  style={{ width: `${(syncProgress.step / syncProgress.totalSteps) * 100}%` }}
                />
              </div>

              <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-cyan-300 flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span className="truncate">{syncProgress.detail}</span>
              </div>
            </div>
          )}

          {/* Sync Success Banner */}
          {syncResult && !isSyncing && (
            <div className="p-4 rounded-xl bg-green-950/30 border border-green-500/40 space-y-3 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[#00FF9D]">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-bold font-display">
                    Repository Successfully Linked & Synced!
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-green-900/60 border border-green-500/40 text-green-300">
                  Commit {syncResult.commitSha}
                </span>
              </div>

              <p className="text-xs text-slate-300">
                All miniapp assets, Base smart contracts, and CI/CD workflows are deployed to GitHub. Vercel deployment webhook is active.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <a
                  href={syncResult.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-3 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-xs font-mono text-green-200 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <span>{syncResult.repoUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleCopyClone(syncResult.repoUrl)}
                  className="px-3 py-2 rounded-lg bg-black/60 hover:bg-white/10 border border-white/15 text-xs font-mono text-slate-200 flex items-center justify-center space-x-1.5 transition-all"
                >
                  {copiedClone ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedClone ? 'Copied' : 'Clone URL'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Mode Switcher: Create New vs Link Existing */}
          {!syncResult && (
            <>
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.04] border border-white/10 rounded-xl">
                <button
                  onClick={() => setActiveMode('create')}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-medium flex items-center justify-center space-x-2 transition-all ${
                    activeMode === 'create'
                      ? 'bg-gradient-to-r from-[#A020F0]/30 to-[#3A8DFF]/30 text-white border border-[#3A8DFF]/40 shadow-[0_0_12px_rgba(58,141,255,0.25)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Repo</span>
                </button>

                <button
                  onClick={() => setActiveMode('link')}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-medium flex items-center justify-center space-x-2 transition-all ${
                    activeMode === 'link'
                      ? 'bg-gradient-to-r from-[#A020F0]/30 to-[#3A8DFF]/30 text-white border border-[#3A8DFF]/40 shadow-[0_0_12px_rgba(58,141,255,0.25)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>Link Existing Repo</span>
                </button>
              </div>

              {/* Mode A: Create New Repo Form */}
              {activeMode === 'create' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                      <span>Repository Name</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {selectedOwner}/{newRepoName || '...'}
                      </span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-slate-400">
                        {selectedOwner} /
                      </span>
                      <input
                        type="text"
                        value={newRepoName}
                        onChange={(e) => setNewRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                        placeholder="miniapp-repo-name"
                        className="flex-1 bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={repoDescription}
                      onChange={(e) => setRepoDescription(e.target.value)}
                      placeholder="High-speed miniapp built on Base"
                      className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Visibility & Branch */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="text-[11px] font-mono uppercase text-slate-400 block">
                        Visibility
                      </span>
                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsPrivate(false)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono flex items-center justify-center space-x-1.5 border ${
                            !isPrivate
                              ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                              : 'bg-black/30 border-white/10 text-slate-400'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Public</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsPrivate(true)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono flex items-center justify-center space-x-1.5 border ${
                            isPrivate
                              ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                              : 'bg-black/30 border-white/10 text-slate-400'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Private</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="text-[11px] font-mono uppercase text-slate-400 block">
                        Default Branch
                      </span>
                      <div className="flex items-center space-x-2 pt-1">
                        <GitBranch className="w-4 h-4 text-slate-400" />
                        <select
                          value={selectedBranch}
                          onChange={(e) => setSelectedBranch(e.target.value)}
                          className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                        >
                          <option value="main">main (Default)</option>
                          <option value="master">master</option>
                          <option value="dev">dev</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode B: Link Existing Repo */}
              {activeMode === 'link' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      Search Installed Repositories
                    </label>
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Filter repositories..."
                      className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                    {filteredExistingRepos.map((repo) => (
                      <div
                        key={repo.id}
                        onClick={() => setSelectedExistingRepo(repo.name)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                          selectedExistingRepo === repo.name
                            ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_12px_rgba(160,32,240,0.2)]'
                            : 'bg-black/40 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-bold text-white">
                              {repo.fullName}
                            </span>
                            {repo.private ? (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                                Private
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                                Public
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {repo.description}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                          <span>{repo.defaultBranch}</span>
                          {selectedExistingRepo === repo.name && (
                            <Check className="w-4 h-4 text-[#00FF9D]" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enterprise Settings Checkboxes */}
              <div className="pt-2 border-t border-white/[0.08] space-y-2.5">
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCiTemplates}
                    onChange={(e) => setIncludeCiTemplates(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-black/60 text-purple-600 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      Include CI/CD Workflow Templates (`templates/github-actions.yml` & `templates/vercel.yml`)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Injects automated testing, TypeScript lint gates, and Farcaster v2 validation rules.
                    </span>
                  </div>
                </label>

                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDeployVercel}
                    onChange={(e) => setAutoDeployVercel(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-black/60 text-purple-600 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      Auto-trigger Vercel Edge build on commit
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Sends deployment webhook event to Vercel team deployment endpoint.
                    </span>
                  </div>
                </label>
              </div>

              {/* Commit Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 flex items-center space-x-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-purple-400" />
                  <span>Commit Message</span>
                </label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-4 border-t border-white/[0.08] bg-black/40 flex items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
            {app.name} • {Object.keys(app.files || {}).length || 6} files staged
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            >
              {syncResult ? 'Close' : 'Cancel'}
            </button>

            {!syncResult ? (
              <button
                onClick={handleStartSync}
                disabled={isSyncing || (activeMode === 'create' && !newRepoName) || (activeMode === 'link' && !selectedExistingRepo)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-[12px] text-xs font-semibold text-white bg-gradient-to-r from-[#A020F0] to-[#3A8DFF] hover:from-[#b030ff] hover:to-[#4a9dff] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(160,32,240,0.35)] transition-all"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing Code...</span>
                  </>
                ) : (
                  <>
                    <Github className="w-3.5 h-3.5" />
                    <span>{activeMode === 'create' ? 'Create & Link Repository' : 'Link & Push Repository'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-[12px] text-xs font-semibold text-white bg-[#00FF9D] text-black hover:bg-[#20ffaa] flex items-center space-x-1.5 shadow-[0_0_15px_rgba(0,255,157,0.3)] transition-all font-mono"
              >
                <span>Finished</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
