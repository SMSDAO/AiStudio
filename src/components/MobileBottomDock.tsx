import React from 'react';
import { Home, Code2, FolderKanban, Menu, Compass } from 'lucide-react';
import { EnterpriseTab } from './SliderMenu';

interface Props {
  activeTab: EnterpriseTab;
  onSelectTab: (tab: EnterpriseTab) => void;
  onOpenMenu: () => void;
  projectsCount?: number;
}

export function MobileBottomDock({ activeTab, onSelectTab, onOpenMenu, projectsCount }: Props) {
  const items = [
    { id: 'landing' as EnterpriseTab, label: 'Home', icon: Home },
    { id: 'workspace' as EnterpriseTab, label: 'Workspace', icon: Code2 },
    { id: 'explore' as EnterpriseTab, label: 'Explore', icon: Compass },
    { id: 'projects' as EnterpriseTab, label: 'Projects', icon: FolderKanban, badge: projectsCount },
  ];

  return (
    <div className="fixed bottom-3 left-4 right-4 z-40 md:hidden flex justify-center">
      <div className="w-full max-w-md rounded-2xl bg-[#0a0e1e]/90 backdrop-blur-2xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(160,32,240,0.25)] p-1.5 flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center rounded-xl relative transition-all ${
                isActive
                  ? 'text-white bg-purple-600/30 border border-purple-500/50 shadow-[0_0_12px_rgba(160,32,240,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-purple-600 rounded-full text-[9px] font-mono font-bold text-white flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold mt-0.5 leading-none">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Menu button to trigger Slider Menu */}
        <button
          onClick={onOpenMenu}
          className="flex-1 py-1.5 flex flex-col items-center justify-center rounded-xl text-slate-400 hover:text-white transition-all"
        >
          <Menu className="w-4 h-4 text-purple-400" />
          <span className="text-[10px] font-semibold mt-0.5 leading-none">
            Menu
          </span>
        </button>
      </div>
    </div>
  );
}
