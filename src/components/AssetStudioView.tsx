/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS AI STUDIO V12.0.0 — Asset Generation Studio View
 * Section 11 Specification:
 * - Vector SVG logos, UI badges, CSS cyber textures, and audio metadata
 * - Live preview with code copy and client download
 */

import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  ShieldCheck, 
  Layers, 
  RefreshCw 
} from 'lucide-react';
import { assetStudioService, GeneratedAsset, AssetType } from '../services/assetStudioService';
import { FlashGlowCard } from './FlashGlowCard';

export const AssetStudioView: React.FC = () => {
  const [assets, setAssets] = useState<GeneratedAsset[]>(() => assetStudioService.getAllAssets());
  const [selectedAsset, setSelectedAsset] = useState<GeneratedAsset | null>(() => assets[0] || null);
  const [assetName, setAssetName] = useState<string>('Cyberpunk Security Shield');
  const [assetType, setAssetType] = useState<AssetType>('svg_logo');
  const [assetPrompt, setAssetPrompt] = useState<string>('Hexagonal cyber neon emblem with gradient stroke and glowing core');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setTimeout(() => {
      const created = assetStudioService.generateAsset({
        name: assetName,
        type: assetType,
        prompt: assetPrompt
      });
      setAssets(assetStudioService.getAllAssets());
      setSelectedAsset(created);
      setIsGenerating(false);
    }, 300);
  };

  const handleCopy = () => {
    if (!selectedAsset) return;
    navigator.clipboard.writeText(selectedAsset.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!selectedAsset) return;
    const blob = new Blob([selectedAsset.content], { type: selectedAsset.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedAsset.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${selectedAsset.type === 'cyber_texture' ? 'css' : selectedAsset.type === 'sound_fx' ? 'json' : 'svg'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <FlashGlowCard variant="cyan" intensity="medium" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ASSET GENERATION STUDIO V12.0.0
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                First-Class Vector SVGs & CSS Tokens
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Design Tokens & Asset Generator
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
              Synthesize scalable vector logos, cyber-neon UI badges, background textures, and brand tokens with instant client export.
            </p>
          </div>
        </div>
      </FlashGlowCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Generator Form */}
        <div className="space-y-4">
          <FlashGlowCard variant="cyan" intensity="subtle" className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              Synthesize New Asset
            </h3>

            <form onSubmit={handleGenerate} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Asset Name</label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Asset Type</label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                >
                  <option value="svg_logo">Vector SVG Logo</option>
                  <option value="ui_badge">Cyber UI Status Badge</option>
                  <option value="cyber_texture">CSS Grid / Neon Texture</option>
                  <option value="sound_fx">Audio Cue Metadata (JSON)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Prompt / Style Description</label>
                <textarea
                  rows={3}
                  value={assetPrompt}
                  onChange={(e) => setAssetPrompt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || !assetPrompt.trim()}
                className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Synthesizing...' : 'Generate Asset'}</span>
              </button>
            </form>
          </FlashGlowCard>

          {/* Asset List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
              Asset Manifest ({assets.length})
            </span>
            {assets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-colors flex justify-between items-center ${
                  selectedAsset?.id === asset.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                    : 'bg-[#0B1019] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="truncate">{asset.name}</span>
                <span className="text-[10px] text-slate-500 uppercase">{asset.type.replace('_', ' ')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Live Preview & Markup */}
        <div className="lg:col-span-2 space-y-4">
          {selectedAsset && (
            <FlashGlowCard variant="cyan" intensity="medium" className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedAsset.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedAsset.dimensions} • {selectedAsset.fileSizeBytes} bytes • {selectedAsset.mimeType}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 text-xs font-mono flex items-center gap-1.5 border border-cyan-500/40 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Visual Render Canvas */}
              <div className="p-8 bg-[#05070B] border border-slate-800 rounded-xl flex items-center justify-center min-h-[220px]">
                {selectedAsset.type === 'svg_logo' || selectedAsset.type === 'ui_badge' ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedAsset.content }} />
                ) : (
                  <div className="text-xs font-mono text-cyan-300 text-center space-y-2">
                    <Layers className="w-8 h-8 mx-auto text-cyan-400" />
                    <div>Code Asset ({selectedAsset.type}) Rendered</div>
                  </div>
                )}
              </div>

              {/* Source Code Inspector */}
              <div className="bg-[#070A0F] border border-slate-800 rounded-xl p-4 overflow-x-auto max-h-56">
                <pre className="text-xs font-mono text-cyan-100 leading-relaxed">
                  <code>{selectedAsset.content}</code>
                </pre>
              </div>
            </FlashGlowCard>
          )}
        </div>
      </div>
    </div>
  );
};
