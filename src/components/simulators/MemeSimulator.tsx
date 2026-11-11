import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, CheckCircle, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppItem } from '../../types';

interface Props {
  app: AppItem;
  onTxSuccess?: (txHash: string) => void;
}

const TEMPLATES = [
  { id: '1', title: 'Cyber Doge', bg: 'from-purple-900 to-indigo-950', emoji: '🐕' },
  { id: '2', title: 'Laser Pepe', bg: 'from-emerald-950 to-slate-900', emoji: '🐸' },
  { id: '3', title: 'Chad Base', bg: 'from-blue-900 to-slate-950', emoji: '🗿' },
  { id: '4', title: 'AI Robot', bg: 'from-pink-950 to-slate-900', emoji: '🤖' },
];

export function MemeSimulator({ app, onTxSuccess }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [topText, setTopText] = useState('WHEN YOU VIBE CODE ON BASE');
  const [bottomText, setBottomText] = useState('60% CREATOR FEES HIT INSTANTLY');
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNft, setMintedNft] = useState<string | null>(null);

  const handleMint = () => {
    setIsMinting(true);
    setTimeout(() => {
      const tx = '0x' + Math.random().toString(16).slice(2) + 'b44f';
      setMintedNft(tx);
      setIsMinting(false);
      if (onTxSuccess) onTxSuccess(tx);
      try {
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }, 1100);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto p-3 text-slate-200">
      {/* Template picker */}
      <div className="w-full flex space-x-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => setSelectedTemplate(tmpl)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 border transition-all ${
              selectedTemplate.id === tmpl.id
                ? 'bg-purple-600/40 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{tmpl.emoji}</span>
            <span>{tmpl.title}</span>
          </button>
        ))}
      </div>

      {/* Meme Canvas Preview */}
      <div className={`relative w-full h-52 rounded-2xl bg-gradient-to-br ${selectedTemplate.bg} border-2 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.3)] flex flex-col justify-between items-center p-3 text-center overflow-hidden mb-3`}>
        <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
        
        {/* Top Text */}
        <div className="relative z-10 text-xs font-extrabold text-white tracking-wider uppercase font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-[90%]">
          {topText || 'TOP TEXT HERE'}
        </div>

        {/* Center Emoji / Art */}
        <div className="relative z-10 text-5xl filter drop-shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-pulse">
          {selectedTemplate.emoji}
        </div>

        {/* Bottom Text */}
        <div className="relative z-10 text-xs font-extrabold text-yellow-300 tracking-wider uppercase font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-[90%]">
          {bottomText || 'BOTTOM TEXT HERE'}
        </div>

        {/* Watermark badge */}
        <div className="absolute bottom-1 right-2 text-[9px] text-white/50 font-mono">
          minted via {app.name}
        </div>
      </div>

      {/* Inputs */}
      <div className="w-full space-y-2 mb-3">
        <input 
          type="text" 
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
          placeholder="Top meme caption"
          className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-green-400 uppercase font-mono"
        />
        <input 
          type="text" 
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
          placeholder="Bottom meme caption"
          className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-green-400 uppercase font-mono"
        />
      </div>

      {/* Action button */}
      <button
        onClick={handleMint}
        disabled={isMinting}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-98 transition-all"
      >
        {isMinting ? (
          <span>Minting ERC-721 on Base...</span>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5" />
            <span>MINT AS BASE NFT (FREE GAS)</span>
          </>
        )}
      </button>

      {mintedNft && (
        <div className="mt-2.5 w-full p-2 rounded-xl bg-green-950/40 border border-green-500/40 text-[11px] text-green-300 font-mono flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
            <span>NFT Token #8492 Minted</span>
          </span>
          <span className="text-[10px] text-slate-400">{mintedNft.slice(0, 10)}...</span>
        </div>
      )}
    </div>
  );
}
