import React, { useState } from 'react';
import { 
  User, 
  ExternalLink, 
  Edit3, 
  Check, 
  X, 
  Radio, 
  Wallet, 
  Coins, 
  HelpCircle,
  Sparkles,
  Twitter,
  Globe,
  Github
} from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onRestartOnboarding: () => void;
}

export function UserProfileModal({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onRestartOnboarding,
}: Props) {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      username,
      handle: `@${username.replace(/^@/, '')}`,
      bio,
      avatarUrl,
    };
    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel border border-purple-500/40 rounded-3xl p-6 sm:p-7 relative shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 ring-2 ring-slate-900 flex items-center justify-center text-[9px] text-slate-900 font-bold">
              ✓
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-white">{name}</h3>
            <p className="text-xs text-purple-300 font-mono">@{username} • {user.role.replace(/_/g, ' ')}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-1">
              Avatar Image URL
            </label>
            <input
              type="text"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-1">
              Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Connected Accounts badges */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Radio className="w-3.5 h-3.5 text-purple-400" />
                <span>Farcaster Account:</span>
              </span>
              <span className="text-purple-300 font-bold">FID #{user.farcasterFid || 9821} (Synced)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                <span>Base Smart Wallet:</span>
              </span>
              <span className="text-cyan-300 truncate max-w-[180px]">{user.address}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Coins className="w-3.5 h-3.5 text-yellow-400" />
                <span>Credit Balance:</span>
              </span>
              <span className="text-yellow-400 font-bold">{user.creditBalance} CR</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-2 pt-1 text-slate-400">
            {user.socialLinks.twitter && (
              <a href={user.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-800 hover:text-white">
                <Twitter className="w-3.5 h-3.5 text-cyan-400" />
              </a>
            )}
            {user.socialLinks.farcaster && (
              <a href={user.socialLinks.farcaster} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-800 hover:text-white">
                <span className="text-xs font-bold text-purple-400">FC</span>
              </a>
            )}
            {user.socialLinks.website && (
              <a href={user.socialLinks.website} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-800 hover:text-white">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
              </a>
            )}
            {user.socialLinks.github && (
              <a href={user.socialLinks.github} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-800 hover:text-white">
                <Github className="w-3.5 h-3.5 text-slate-300" />
              </a>
            )}
          </div>

          {/* Restart Onboarding Tour Button */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onClose();
                onRestartOnboarding();
              }}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Restart Guided Tour</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center space-x-1.5 transition-all"
            >
              {isSaved ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'SAVED' : 'SAVE PROFILE'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
