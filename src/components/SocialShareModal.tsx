import React, { useState } from 'react';
import { 
  Share2, 
  Twitter, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  QrCode, 
  Code2, 
  Sparkles 
} from 'lucide-react';
import { AppItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  app: AppItem | null;
}

export function SocialShareModal({ isOpen, onClose, app }: Props) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedFrameTag, setCopiedFrameTag] = useState(false);

  if (!isOpen || !app) return null;

  const appUrl = app.vercelDeployUrl || `https://${app.slug}.vini.run`;
  const shareText = `Check out ${app.name} — a vibe-coded miniapp built on @base with 60% creator fee splits! Play live: ${appUrl} ⚡ via @viniapp_xyz`;

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareWarpcast = () => {
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      `Check out ${app.name} on Base!`
    )}&embeds[]=${encodeURIComponent(appUrl)}`;
    window.open(warpcastUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const frameMetaTag = `<meta name="fc:frame" content='{"version":"next","imageUrl":"${app.farcasterManifest.imageUrl}","button":{"title":"${app.farcasterManifest.buttonTitle}","action":{"type":"launch_frame","name":"${app.name}","url":"${appUrl}"}}}' />`;

  const handleCopyFrameTag = () => {
    navigator.clipboard.writeText(frameMetaTag);
    setCopiedFrameTag(true);
    setTimeout(() => setCopiedFrameTag(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel border border-cyan-500/40 rounded-3xl p-6 relative shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-white">Share {app.name}</h3>
            <p className="text-xs text-slate-400 font-mono">One-click viral launch to Farcaster & X</p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShareWarpcast}
            className="p-3 rounded-2xl bg-purple-950/70 hover:bg-purple-900/80 border border-purple-500/50 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
          >
            <div className="w-5 h-5 rounded-lg bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
              FC
            </div>
            <span>Share on Warpcast</span>
          </button>

          <button
            onClick={handleShareTwitter}
            className="p-3 rounded-2xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/50 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
          >
            <Twitter className="w-4 h-4 text-cyan-400" />
            <span>Share on X (Twitter)</span>
          </button>
        </div>

        {/* Miniapp Link Box */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 font-mono">Live Miniapp URL</div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-300 truncate mr-2">{appUrl}</span>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center space-x-1"
            >
              {copiedLink ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Farcaster Frame v2 Embed Meta Tag */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Farcaster Frame v2 Meta Tag</span>
            <button
              onClick={handleCopyFrameTag}
              className="text-[10px] text-purple-300 hover:underline flex items-center space-x-1"
            >
              {copiedFrameTag ? <span>Copied HTML Tag</span> : <span>Copy HTML Tag</span>}
            </button>
          </div>
          <div className="text-[11px] font-mono text-slate-400 truncate bg-black/40 p-1.5 rounded-lg">
            {frameMetaTag}
          </div>
        </div>

        {/* QR Code Preview */}
        <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center text-slate-900">
            <QrCode className="w-10 h-10" />
          </div>
          <div className="text-xs text-slate-300">
            <div className="font-bold text-white">Mobile QR Scan</div>
            <p className="text-[11px] text-slate-400">Scan with camera to launch instantly in Base App or World App.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
