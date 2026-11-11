import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Send, 
  Sparkles, 
  X, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Bot 
} from 'lucide-react';
import { CollaboratorPresence, CollaborationChatMessage, UserSession } from '../types';
import { INITIAL_COLLABORATORS, INITIAL_COLLAB_MESSAGES } from '../data/mockData';

interface Props {
  user: UserSession;
  currentAppName?: string;
  onCoEditSuggestion?: (suggestion: string) => void;
}

export function CollaborationRoom({ user, currentAppName = 'ViniApp Workspace', onCoEditSuggestion }: Props) {
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>(INITIAL_COLLABORATORS);
  const [messages, setMessages] = useState<CollaborationChatMessage[]>(INITIAL_COLLAB_MESSAGES);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTypingPeer, setIsTypingPeer] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsgText = inputMessage.trim();
    setInputMessage('');

    const newMsg: CollaborationChatMessage = {
      id: `msg_${Date.now()}`,
      sender: {
        name: user.name,
        handle: user.handle,
        avatarUrl: user.avatarUrl,
      },
      text: userMsgText,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, newMsg]);

    // Simulate collaborator reply
    setTimeout(() => {
      setIsTypingPeer(true);
      setTimeout(() => {
        setIsTypingPeer(false);
        const replyMsg: CollaborationChatMessage = {
          id: `msg_reply_${Date.now()}`,
          sender: {
            name: 'Elena Rostova',
            handle: '@elena_eth',
            avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
          },
          text: `Agreed! Let's lock in "${userMsgText.slice(0, 40)}" for ${currentAppName}. Generating verified Base contracts now.`,
          timestamp: 'Just now',
        };
        setMessages(prev => [...prev, replyMsg]);
      }, 1500);
    }, 800);
  };

  return (
    <div className="w-full">
      {/* Top Presence Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-card border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs font-mono text-cyan-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" />
            <span className="font-bold">Realtime Workspace:</span>
            <span className="text-white">{currentAppName}</span>
          </div>

          <div className="hidden sm:flex items-center -space-x-2 overflow-hidden pl-2">
            {/* Current user */}
            <img
              src={user.avatarUrl}
              alt={user.name}
              title={`You (${user.name})`}
              className="inline-block h-6 w-6 rounded-full ring-2 ring-purple-500"
            />
            {/* Collaborators */}
            {collaborators.map(c => (
              <img
                key={c.id}
                src={c.avatarUrl}
                alt={c.name}
                title={`${c.name} (${c.status})`}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-800"
              />
            ))}
          </div>

          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            3 teammates online
          </span>
        </div>

        {/* Toggle Chat Drawer Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            isChatOpen
              ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
          <span>Team Co-Edit Chat</span>
          <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-purple-500/30 text-purple-200 font-mono">
            {messages.length}
          </span>
          {isChatOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expandable Collaboration Drawer */}
      {isChatOpen && (
        <div className="mt-3 p-4 rounded-3xl glass-panel border border-purple-500/30 shadow-2xl space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold font-display text-white">Live Workspace Chat & Co-Pilot</span>
            </div>
            <span className="text-[10px] font-mono text-green-400 bg-green-950/60 px-2 py-0.5 rounded-full border border-green-500/30">
              Supabase Realtime Channel
            </span>
          </div>

          {/* Messages list */}
          <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
            {messages.map(msg => (
              <div key={msg.id} className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <img src={msg.sender.avatarUrl} alt={msg.sender.name} className="w-4 h-4 rounded-full" />
                    <span className="text-xs font-bold text-white">{msg.sender.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.sender.handle}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 leading-snug pl-5 font-sans">
                  {msg.text}
                </p>
              </div>
            ))}

            {isTypingPeer && (
              <div className="text-[11px] font-mono text-cyan-300 italic flex items-center space-x-1.5 p-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Elena Rostova is typing...</span>
              </div>
            )}
          </div>

          {/* Quick Co-Edit Prompts */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              'Route 60% Uniswap fees to creator wallet',
              'Enable Farcaster frame v2 social share',
              'Set token supply to 10M $APP',
            ].map((sug) => (
              <button
                key={sug}
                onClick={() => {
                  setInputMessage(sug);
                  if (onCoEditSuggestion) onCoEditSuggestion(sug);
                }}
                className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 text-[10px] font-mono text-purple-300 hover:text-white border border-slate-800 hover:border-purple-500 transition-all"
              >
                + {sug}
              </button>
            ))}
          </div>

          {/* Input composer */}
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2 pt-1 border-t border-white/10">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Message workspace collaborators..."
              className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs flex items-center space-x-1 shadow-[0_0_12px_rgba(168,85,247,0.5)] transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
