import React, { useState, useMemo } from 'react';
import { 
  LayoutTemplate, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Copy, 
  Trash2, 
  Eye, 
  Rocket, 
  Download, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Tag, 
  ShieldAlert, 
  Lock, 
  Layers, 
  Code2, 
  FileCode2, 
  ChevronRight, 
  Check, 
  X, 
  RefreshCw,
  FolderPlus,
  Coins,
  Globe,
  Smile,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { AppItem, AppTemplate, UserRole, UserProfile, MiniappType } from '../types';
import { checkPermission } from '../hooks/usePermission';
import { AgenticPlainEnglishModal } from './AgenticPlainEnglishModal';

interface Props {
  user: UserProfile;
  templates: AppTemplate[];
  onUpdateTemplates: (updated: AppTemplate[]) => void;
  onSelectTemplateForApp: (template: AppTemplate) => void;
  onOpenWorkspaceWithApp?: (app: AppItem) => void;
  onUpdateRole?: (role: UserRole) => void;
}

const DEFAULT_CATEGORIES = [
  'All',
  'Games & Entertainment',
  'Commerce & Tips',
  'DeFi & Trading',
  'Creative & NFT',
  'Social & Farcaster',
  'Utilities & AI Tools',
];

export const AppTemplateManager: React.FC<Props> = ({
  user,
  templates,
  onUpdateTemplates,
  onSelectTemplateForApp,
  onOpenWorkspaceWithApp,
  onUpdateRole,
}) => {
  // Permission Gate Check
  const hasManagePermission = checkPermission(user.role, 'manage_templates');

  // Search, Filter & View State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modals
  const [editingTemplate, setEditingTemplate] = useState<AppTemplate | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<AppTemplate | null>(null);
  const [agenticModalOpen, setAgenticModalOpen] = useState(false);

  // Template Form State
  const [formData, setFormData] = useState<Partial<AppTemplate>>({});
  const [formActiveTab, setFormActiveTab] = useState<'meta' | 'plain' | 'features' | 'code'>('meta');
  const [activeCodeFile, setActiveCodeFile] = useState<string>('page.tsx');
  const [newTagInput, setNewTagInput] = useState('');
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Extract all categories dynamically from templates
  const allCategories = useMemo(() => {
    const set = new Set<string>(['All']);
    DEFAULT_CATEGORIES.forEach(c => set.add(c));
    templates.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [templates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tmpl) => {
      // Category filter
      if (selectedCategory !== 'All' && tmpl.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && (tmpl.status || 'published') !== selectedStatus) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'all' && tmpl.difficulty !== selectedDifficulty) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tmpl.title.toLowerCase().includes(q);
        const matchesDesc = tmpl.description.toLowerCase().includes(q);
        const matchesSummary = tmpl.plainEnglishSummary?.toLowerCase().includes(q);
        const matchesTags = tmpl.tags?.some(tag => tag.toLowerCase().includes(q));
        const matchesCategory = tmpl.category?.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesSummary || matchesTags || matchesCategory;
      }
      return true;
    });
  }, [templates, selectedCategory, selectedStatus, selectedDifficulty, searchQuery]);

  // Stats
  const totalCount = templates.length;
  const publishedCount = templates.filter(t => (t.status || 'published') === 'published').length;
  const draftCount = templates.filter(t => t.status === 'draft').length;
  const totalInstantiations = templates.reduce((acc, t) => acc + (t.instantiations || 0), 0);

  // Open Edit Modal
  const handleStartEdit = (template: AppTemplate) => {
    setEditingTemplate(template);
    setFormData({
      ...template,
      codePreset: { ...template.codePreset },
      tags: [...(template.tags || [])],
      suggestedFeatures: [...template.suggestedFeatures],
      suggestedPlatforms: [...template.suggestedPlatforms],
    });
    setActiveCodeFile(Object.keys(template.codePreset)[0] || 'page.tsx');
    setIsCreatingNew(false);
    setFormActiveTab('meta');
  };

  // Open New Modal
  const handleStartNew = () => {
    const newTmpl: Partial<AppTemplate> = {
      id: `tmpl_${Date.now()}`,
      title: 'New Miniapp Blueprint',
      slug: `custom-app-${Date.now().toString(36)}`,
      icon: '✨',
      tagline: 'Instant fullstack onchain miniapp with automated fee distribution',
      description: 'A customizable miniapp blueprint built for mobile browsers and Farcaster frames.',
      type: 'custom',
      category: 'Games & Entertainment',
      difficulty: 'Beginner',
      status: 'published',
      plainEnglishSummary: 'A fast, easy-to-use miniapp where users can interact and support creators.',
      tags: ['custom', 'starter-kit', 'base-l2'],
      author: { name: user.name, handle: user.handle },
      instantiations: 0,
      suggestedFeatures: ['Mobile responsive design', 'Base smart wallet connection', 'Automated 60% fee split'],
      suggestedPlatforms: ['Farcaster Frames v2', 'Base App', 'Web Mobile'],
      monetizationModel: 'Clanker $TICKER launch with 60% Uniswap v4 trading fee split',
      previewColor: '#A020F0',
      neonGlow: 'purple',
      codePreset: {
        'page.tsx': `// Next.js 15 App Router - Starter Miniapp Core\n'use client';\nimport React, { useState } from 'react';\n\nexport default function Page() {\n  const [clicks, setClicks] = useState(0);\n  return (\n    <main className="min-h-screen bg-[#070913] text-white p-6 flex flex-col items-center justify-center">\n      <h1 className="text-3xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">\n        MINIAPP BLUEPRINT\n      </h1>\n      <p className="text-slate-400 text-sm mt-2">Interactive starter template</p>\n      <button onClick={() => setClicks(c => c + 1)} className="mt-6 px-6 py-3 rounded-xl bg-purple-600 text-white font-bold">\n        Clicks: {clicks} 🚀\n      </button>\n    </main>\n  );\n}`,
        'contracts/Contract.sol': `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.24;\n\ncontract MiniappFeeVault {\n    address public immutable creator;\n    uint256 public constant CREATOR_FEE_BPS = 6000; // 60%\n\n    constructor(address _creator) {\n        creator = _creator;\n    }\n\n    receive() external payable {\n        uint256 cut = (msg.value * CREATOR_FEE_BPS) / 10000;\n        (bool sent, ) = creator.call{value: cut}("");\n        require(sent, "Fee transfer failed");\n    }\n}`,
      },
    };
    setEditingTemplate(null);
    setFormData(newTmpl);
    setActiveCodeFile('page.tsx');
    setIsCreatingNew(true);
    setFormActiveTab('meta');
  };

  // Save Template (Create or Update)
  const handleSaveForm = () => {
    if (!formData.title?.trim()) {
      alert('Please provide a title for the template.');
      return;
    }
    const cleanSlug = formData.slug?.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const finalTemplate: AppTemplate = {
      id: formData.id || `tmpl_${Date.now()}`,
      title: formData.title,
      slug: cleanSlug,
      icon: formData.icon || '📦',
      tagline: formData.tagline || 'Modular onchain miniapp blueprint',
      description: formData.description || 'Pre-built template blueprint.',
      type: (formData.type as MiniappType) || 'custom',
      category: formData.category || 'Utilities & AI Tools',
      difficulty: formData.difficulty || 'Beginner',
      status: formData.status || 'published',
      plainEnglishSummary: formData.plainEnglishSummary || 'A guided miniapp blueprint.',
      tags: formData.tags || ['blueprint'],
      author: formData.author || { name: user.name, handle: user.handle },
      instantiations: formData.instantiations || 0,
      suggestedFeatures: formData.suggestedFeatures || ['Mobile UI', 'Base Smart Wallet'],
      suggestedPlatforms: formData.suggestedPlatforms || ['Web Mobile', 'Farcaster Frames v2'],
      monetizationModel: formData.monetizationModel || '60% creator fee split',
      previewColor: formData.previewColor || '#A020F0',
      neonGlow: (formData.neonGlow as any) || 'purple',
      codePreset: formData.codePreset || { 'page.tsx': '// Starter code' },
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isCreatingNew) {
      onUpdateTemplates([finalTemplate, ...templates]);
    } else {
      onUpdateTemplates(templates.map(t => t.id === finalTemplate.id ? finalTemplate : t));
    }

    setEditingTemplate(null);
    setIsCreatingNew(false);
  };

  // Duplicate Template
  const handleDuplicate = (template: AppTemplate) => {
    const cloned: AppTemplate = {
      ...template,
      id: `tmpl_${Date.now()}`,
      title: `${template.title} (Copy)`,
      slug: `${template.slug}-copy-${Date.now().toString(36).slice(-4)}`,
      status: 'draft',
      instantiations: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onUpdateTemplates([cloned, ...templates]);
  };

  // Delete Template
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this miniapp template blueprint?')) {
      onUpdateTemplates(templates.filter(t => t.id !== id));
    }
  };

  // Export Templates JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(templates, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aistudio-templates-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Templates JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onUpdateTemplates([...parsed, ...templates]);
            alert(`Successfully imported ${parsed.length} templates!`);
          } else {
            alert('Invalid template JSON format.');
          }
        } catch (err) {
          alert('Could not parse template file.');
        }
      };
    }
  };

  // AI Boilerplate Generator inside the editor
  const handleGenerateBoilerplateWithAI = () => {
    const title = formData.title || 'Custom App';
    const cat = formData.category || 'General';
    const aiGeneratedCode = `// Next.js 15 App Router - Generated for "${title}" (${cat})\n'use client';\n\nimport React, { useState } from 'react';\n\nexport default function ${title.replace(/[^a-zA-Z0-9]/g, '')}Page() {\n  const [state, setState] = useState({ score: 0, completed: false });\n\n  const handleAction = () => {\n    setState(s => ({ ...s, score: s.score + 10, completed: true }));\n  };\n\n  return (\n    <main className="min-h-screen bg-[#070913] text-white p-6 flex flex-col items-center justify-center">\n      <div className="p-6 bg-white/5 border border-purple-500/30 rounded-3xl max-w-sm w-full backdrop-blur-md text-center shadow-[0_0_30px_rgba(160,32,240,0.2)]">\n        <h1 className="text-2xl font-black font-display text-white uppercase">\n          ${title}\n        </h1>\n        <p className="text-xs text-slate-400 mt-2">${formData.plainEnglishSummary || 'Interactive miniapp'}</p>\n        <div className="my-6 p-4 rounded-2xl bg-black/40 border border-white/5">\n          <span className="text-[10px] font-mono text-slate-500 block uppercase">Real-Time State</span>\n          <span className="text-2xl font-mono font-bold text-[#00FF9D]">Score: {state.score}</span>\n        </div>\n        <button onClick={handleAction} className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all">\n          Execute Action ⚡\n        </button>\n      </div>\n    </main>\n  );\n}`;

    setFormData(prev => ({
      ...prev,
      codePreset: {
        ...(prev.codePreset || {}),
        'page.tsx': aiGeneratedCode,
      },
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* ACCESS DENIED STATE (IF LACKING PERMISSION) */}
      {!hasManagePermission && (
        <div className="p-6 rounded-3xl bg-amber-950/40 border border-amber-500/40 text-amber-200 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">Administrative Access Required</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 font-bold">
                  manage_templates permission
                </span>
              </div>
              <p className="text-xs text-amber-300/80 mt-1">
                Your current role is <strong className="text-white font-mono">{user.role}</strong>. Creating, editing, and managing miniapp blueprints is restricted to <strong className="text-white">PLATFORM_SUPER_ADMIN</strong>, <strong className="text-white">ORG_OWNER</strong>, and <strong className="text-white">ORG_ADMIN</strong>.
              </p>
            </div>
          </div>
          {onUpdateRole && (
            <button
              onClick={() => onUpdateRole('PLATFORM_SUPER_ADMIN')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shrink-0 shadow-lg shadow-amber-500/30 transition-transform active:scale-95"
            >
              Simulate Super Admin Role 🔓
            </button>
          )}
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2">
            <LayoutTemplate className="w-3.5 h-3.5 text-purple-400" />
            <span>AI STUDIO BLUEPRINT ARCHITECTURE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-white">
            App Template Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Upload, edit, categorize, and deploy pre-built miniapp templates that power the Create App Flow and Agentic Builder.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Agentic Builder Assistant Button */}
          <button
            onClick={() => setAgenticModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(160,32,240,0.4)] flex items-center space-x-1.5 transition-all hover:scale-105"
          >
            <Smile className="w-3.5 h-3.5 text-yellow-300" />
            <span>Agentic Assistant (Plain English)</span>
          </button>

          {/* New Template Button (Admin) */}
          <button
            onClick={handleStartNew}
            disabled={!hasManagePermission}
            className="px-4 py-2.5 rounded-xl bg-[#00FF9D] hover:bg-emerald-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(0,255,157,0.3)] disabled:opacity-40 flex items-center space-x-1.5 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Blueprint</span>
          </button>

          {/* Import JSON */}
          <label className={`px-3 py-2.5 rounded-xl border border-white/10 hover:border-white/30 text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-1 cursor-pointer transition-colors ${!hasManagePermission ? 'opacity-40 pointer-events-none' : ''}`}>
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="px-3 py-2.5 rounded-xl border border-white/10 hover:border-white/30 text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-1 transition-colors"
            title="Export all templates as JSON"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* QUICK STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Blueprints</span>
          <span className="text-xl font-mono font-bold text-white">{totalCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Published</span>
          <span className="text-xl font-mono font-bold text-[#00FF9D]">{publishedCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Drafts</span>
          <span className="text-xl font-mono font-bold text-yellow-400">{draftCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Categories</span>
          <span className="text-xl font-mono font-bold text-cyan-400">{allCategories.length - 1}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">Instantiations</span>
          <span className="text-xl font-mono font-bold text-purple-300">{totalInstantiations} apps</span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3 backdrop-blur-md">
        {/* Categories Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, features, tags..."
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none font-mono"
            >
              <option value="all">Status: All</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="archived">Archived</option>
            </select>

            {/* Difficulty Select */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none font-mono"
            >
              <option value="all">Difficulty: All</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-black/40 border border-white/10 rounded-xl">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs ${viewMode === 'cards' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Card View"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs ${viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Table View"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TEMPLATES LISTING */}
      {filteredTemplates.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
          <LayoutTemplate className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No template blueprints matched your filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your search query or create a brand-new template blueprint for this category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedStatus('all');
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const glowBorder = template.neonGlow === 'green' ? 'hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(0,255,157,0.2)]'
              : template.neonGlow === 'blue' ? 'hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(58,141,255,0.2)]'
              : template.neonGlow === 'yellow' ? 'hover:border-yellow-500/50 hover:shadow-[0_0_25px_rgba(234,179,8,0.2)]'
              : template.neonGlow === 'orange' ? 'hover:border-orange-500/50 hover:shadow-[0_0_25px_rgba(249,115,22,0.2)]'
              : 'hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(160,32,240,0.2)]';

            return (
              <div
                key={template.id}
                className={`p-5 rounded-3xl bg-[#0a0e1e]/90 border border-white/10 transition-all flex flex-col justify-between group ${glowBorder}`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Icon, Badges, Category */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {template.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                            {template.title}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono text-purple-400 block mt-0.5">
                          {template.category || 'General'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        template.status === 'draft' ? 'bg-yellow-950/80 text-yellow-300 border border-yellow-500/40'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {template.status || 'published'}
                      </span>
                      {template.difficulty && (
                        <span className="text-[9px] font-mono text-slate-400">
                          {template.difficulty}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Plain English Summary (Crucial for Non-Technical Users!) */}
                  {template.plainEnglishSummary && (
                    <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-purple-200 text-xs">
                      <span className="font-bold block text-[10px] uppercase text-purple-300 font-mono mb-0.5">
                        💡 Plain English Purpose:
                      </span>
                      <p className="line-clamp-2">{template.plainEnglishSummary}</p>
                    </div>
                  )}

                  {/* Tagline & Description */}
                  <p className="text-xs text-slate-300 line-clamp-2 font-sans">
                    {template.tagline || template.description}
                  </p>

                  {/* Suggested Features Tags */}
                  <div className="flex flex-wrap gap-1">
                    {template.suggestedFeatures?.slice(0, 3).map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-300"
                      >
                        {feat}
                      </span>
                    ))}
                    {(template.suggestedFeatures?.length || 0) > 3 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-500">
                        +{(template.suggestedFeatures?.length || 0) - 3} more
                      </span>
                    )}
                  </div>

                  {/* Monetization Model */}
                  <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-400">
                    <Coins className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="truncate">{template.monetizationModel}</span>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-500">
                    <span>{template.instantiations || 0} builds</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* Test Preview */}
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Test live preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Blueprint (Admin) */}
                    <button
                      onClick={() => handleStartEdit(template)}
                      disabled={!hasManagePermission}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30"
                      title="Edit template blueprint"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicate(template)}
                      disabled={!hasManagePermission}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30"
                      title="Duplicate template"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(template.id)}
                      disabled={!hasManagePermission}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors disabled:opacity-30"
                      title="Delete template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Create App With This Template */}
                    <button
                      onClick={() => onSelectTemplateForApp(template)}
                      className="ml-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1 shadow-md shadow-purple-500/30 transition-transform active:scale-95"
                    >
                      <Rocket className="w-3.5 h-3.5" />
                      <span>Use</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Template</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Difficulty</th>
                  <th className="py-3 px-3">Monetization</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Builds</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xl">{template.icon}</span>
                        <div>
                          <span className="font-bold text-white block">{template.title}</span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">{template.tagline}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-purple-300">
                      {template.category || 'General'}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {template.difficulty || 'Beginner'}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400 max-w-[200px] truncate">
                      {template.monetizationModel}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        template.status === 'draft' ? 'bg-yellow-950 text-yellow-300' : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        {template.status || 'published'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {template.instantiations || 0}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="p-1 rounded text-slate-400 hover:text-white"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStartEdit(template)}
                          disabled={!hasManagePermission}
                          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectTemplateForApp(template)}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-xs"
                        >
                          Build
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TEMPLATE EDITOR MODAL (UPLOAD / EDIT) */}
      {(editingTemplate || isCreatingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#0a0e1e] border border-purple-500/30 rounded-3xl shadow-[0_0_50px_rgba(160,32,240,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xl text-purple-300">
                  {formData.icon || '📦'}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-display text-white">
                    {isCreatingNew ? 'Create New Miniapp Blueprint' : `Edit Template: ${formData.title}`}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Configure code presets, plain English summaries, and monetization models.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingTemplate(null);
                  setIsCreatingNew(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center space-x-2 px-5 pt-3 border-b border-white/10 bg-white/[0.01]">
              {[
                { id: 'meta', label: '1. Basic Info & Category' },
                { id: 'plain', label: '2. Plain English Guidance' },
                { id: 'features', label: '3. Features & Monetization' },
                { id: 'code', label: '4. Code Blueprints & Files' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFormActiveTab(tab.id as any)}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-all ${
                    formActiveTab === tab.id
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* TAB 1: META */}
              {formActiveTab === 'meta' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Blueprint Title</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Cyber Trivia Arena"
                        className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Emoji Icon</label>
                      <input
                        type="text"
                        value={formData.icon || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                        placeholder="🕹️"
                        className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white text-center focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Category</label>
                      <input
                        type="text"
                        value={formData.category || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g. Games & Entertainment"
                        list="categories-list"
                        className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                      <datalist id="categories-list">
                        {allCategories.filter(c => c !== 'All').map(c => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Miniapp Type</label>
                      <select
                        value={formData.type || 'custom'}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as MiniappType }))}
                        className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="arcade">Arcade Game</option>
                        <option value="tipping">Tipping & Commerce</option>
                        <option value="meme">Meme Generator</option>
                        <option value="poll">Community Poll</option>
                        <option value="blog">Micro Blog</option>
                        <option value="casino">DeFi / Casino</option>
                        <option value="nft_gallery">NFT Gallery</option>
                        <option value="calendar">Event Calendar</option>
                        <option value="ai_agent">AI Agent</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Difficulty</label>
                      <select
                        value={formData.difficulty || 'Beginner'}
                        onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                        className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="Beginner">Beginner-Friendly</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Status</label>
                      <select
                        value={formData.status || 'published'}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Neon Glow Theme</label>
                      <select
                        value={formData.neonGlow || 'purple'}
                        onChange={(e) => setFormData(prev => ({ ...prev, neonGlow: e.target.value as any }))}
                        className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="purple">Purple Glow</option>
                        <option value="blue">Blue Glow</option>
                        <option value="green">Green Glow</option>
                        <option value="yellow">Yellow Glow</option>
                        <option value="orange">Orange Glow</option>
                        <option value="cyan">Cyan Glow</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Tagline</label>
                    <input
                      type="text"
                      value={formData.tagline || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="One-line punchy description"
                      className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PLAIN ENGLISH */}
              {formActiveTab === 'plain' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs">
                    <span className="font-bold block text-white mb-1">
                      Connecting with Non-Technical / Agentic Users:
                    </span>
                    Explain how the app works in simple, conversational language without technical jargon like &apos;bonding curve&apos; or &apos;ERC-721&apos;. This copy is shown to creators when using the Plain English Assistant.
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">
                      Plain English Purpose (How it works simply)
                    </label>
                    <textarea
                      value={formData.plainEnglishSummary || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, plainEnglishSummary: e.target.value }))}
                      placeholder="e.g. A digital tip jar where visitors can tap $1, $5, or $20 and see an instant thank-you badge..."
                      rows={3}
                      className="w-full bg-slate-900 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Full Technical Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full bg-slate-900 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  {/* Tags input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-slate-400">Tags / Keywords</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {formData.tags?.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-white/10 text-white text-xs flex items-center space-x-1 font-mono">
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tags: prev.tags?.filter((_, idx) => idx !== i) }))}
                            className="text-slate-400 hover:text-red-400"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTagInput.trim()) {
                            e.preventDefault();
                            setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), newTagInput.trim()] }));
                            setNewTagInput('');
                          }
                        }}
                        placeholder="Add a tag and press Enter..."
                        className="flex-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newTagInput.trim()) {
                            setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), newTagInput.trim()] }));
                            setNewTagInput('');
                          }
                        }}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-mono text-white"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FEATURES & MONETIZATION */}
              {formActiveTab === 'features' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Monetization Engine Model</label>
                    <select
                      value={formData.monetizationModel || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, monetizationModel: e.target.value }))}
                      className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none mb-1"
                    >
                      <option value="Clanker $TICKER launch with 60% Uniswap v4 trading fee split">
                        Clanker 60% Trading Fee Split (Recommended)
                      </option>
                      <option value="60% protocol fee cut on all tips routed to creator smart wallet">
                        Base USDC Micro-Tips (60% Creator Cut)
                      </option>
                      <option value="0.001 ETH mint fee with 60% creator split + secondary royalties">
                        Base NFT Access Pass with 60% Split
                      </option>
                      <option value="x402 Pay-Per-Query (0.0005 ETH per prompt response)">
                        x402 Pay-Per-Use Micro-Transactions
                      </option>
                      <option value="100% Free / Community Grant Funded">
                        Free for Everyone (Zero Fees)
                      </option>
                    </select>
                    <input
                      type="text"
                      value={formData.monetizationModel || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, monetizationModel: e.target.value }))}
                      placeholder="Or enter custom monetization details..."
                      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono"
                    />
                  </div>

                  {/* Suggested Features */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-slate-400">Suggested Features</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {formData.suggestedFeatures?.map((feat, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-200 text-xs flex items-center space-x-1">
                          <span>{feat}</span>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, suggestedFeatures: prev.suggestedFeatures?.filter((_, idx) => idx !== i) }))}
                            className="text-purple-400 hover:text-red-400 ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newFeatureInput}
                        onChange={(e) => setNewFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newFeatureInput.trim()) {
                            e.preventDefault();
                            setFormData(prev => ({ ...prev, suggestedFeatures: [...(prev.suggestedFeatures || []), newFeatureInput.trim()] }));
                            setNewFeatureInput('');
                          }
                        }}
                        placeholder="e.g. Real-time Leaderboard, Gasless Transactions..."
                        className="flex-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newFeatureInput.trim()) {
                            setFormData(prev => ({ ...prev, suggestedFeatures: [...(prev.suggestedFeatures || []), newFeatureInput.trim()] }));
                            setNewFeatureInput('');
                          }
                        }}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-mono text-white"
                      >
                        Add Feature
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CODE BLUEPRINTS */}
              {formActiveTab === 'code' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      {Object.keys(formData.codePreset || {}).map(fileName => (
                        <button
                          key={fileName}
                          onClick={() => setActiveCodeFile(fileName)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                            activeCodeFile === fileName
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {fileName}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          const name = prompt('Enter new file path (e.g. contracts/Vault.sol or vercel.yml):');
                          if (name && name.trim()) {
                            setFormData(prev => ({
                              ...prev,
                              codePreset: {
                                ...(prev.codePreset || {}),
                                [name.trim()]: '// New file\n',
                              },
                            }));
                            setActiveCodeFile(name.trim());
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-purple-300"
                        title="Add File"
                      >
                        + File
                      </button>
                    </div>

                    <button
                      onClick={handleGenerateBoilerplateWithAI}
                      className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-mono flex items-center space-x-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      <span>AI Generate Code Boilerplate</span>
                    </button>
                  </div>

                  <textarea
                    value={formData.codePreset?.[activeCodeFile] || ''}
                    onChange={(e) => {
                      const updatedCode = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        codePreset: {
                          ...(prev.codePreset || {}),
                          [activeCodeFile]: updatedCode,
                        },
                      }));
                    }}
                    rows={14}
                    className="w-full bg-slate-950 border border-white/15 rounded-2xl p-4 font-mono text-xs text-purple-200 focus:outline-none focus:border-purple-500 resize-none"
                    placeholder="Enter file code..."
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
              <button
                onClick={() => {
                  setEditingTemplate(null);
                  setIsCreatingNew(false);
                }}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveForm}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xs shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isCreatingNew ? 'Publish Template' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW TEST MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0a0e1e] border border-purple-500/40 rounded-3xl shadow-[0_0_50px_rgba(160,32,240,0.4)] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center space-x-2.5">
                <span className="text-2xl">{previewTemplate.icon}</span>
                <div>
                  <h3 className="font-bold text-white text-sm">{previewTemplate.title}</h3>
                  <span className="text-[10px] font-mono text-emerald-400">LIVE PREVIEW SIMULATOR</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 bg-[#070913] text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-purple-500/30 flex items-center justify-center text-3xl mx-auto shadow-[0_0_20px_rgba(160,32,240,0.3)]">
                {previewTemplate.icon}
              </div>
              <h2 className="text-xl font-black font-display text-white">
                {previewTemplate.title}
              </h2>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                {previewTemplate.plainEnglishSummary || previewTemplate.tagline}
              </p>

              {/* Sample Interactive UI */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-xs mx-auto space-y-3">
                <span className="text-[10px] font-mono text-purple-300 block uppercase">
                  Simulated Interaction
                </span>
                <button
                  onClick={() => alert(`Simulated action executed in ${previewTemplate.title}!`)}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-xs font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-transform"
                >
                  Test User Action 🚀
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-500">
                Monetization: {previewTemplate.monetizationModel}
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  const target = previewTemplate;
                  setPreviewTemplate(null);
                  onSelectTemplateForApp(target);
                }}
                className="px-4 py-2 bg-[#00FF9D] text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20"
              >
                Create App From This Template ⚡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AGENTIC PLAIN-ENGLISH ASSISTANT MODAL */}
      <AgenticPlainEnglishModal
        isOpen={agenticModalOpen}
        onClose={() => setAgenticModalOpen(false)}
        availableTemplates={templates}
        user={user}
        onLaunchWorkspaceWithApp={(app) => {
          setAgenticModalOpen(false);
          if (onOpenWorkspaceWithApp) {
            onOpenWorkspaceWithApp(app);
          }
        }}
        onSaveAsTemplate={(newTemplate) => {
          onUpdateTemplates([newTemplate, ...templates]);
        }}
      />
    </div>
  );
};
