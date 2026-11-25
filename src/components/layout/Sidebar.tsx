import React from 'react';
import { 
  CloudSun, 
  GitBranch, 
  Server, 
  Activity, 
  FileCode2, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Layers
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenRunbook: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onOpenRunbook,
}) => {
  const navItems = [
    {
      id: 'weather',
      label: 'Weather Dashboard',
      icon: CloudSun,
      badge: 'Live',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border border-cyan-800/40',
    },
    {
      id: 'devops',
      label: 'DevOps Control Center',
      icon: GitBranch,
      badge: 'Pipeline',
      badgeColor: 'text-blue-400 bg-blue-950/60 border border-blue-800/40',
    },
    {
      id: 'infra',
      label: 'Infrastructure Monitoring',
      icon: Server,
      badge: '4 Units',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40',
    },
    {
      id: 'observability',
      label: 'Observability Center',
      icon: Activity,
      badge: 'PromQL',
      badgeColor: 'text-purple-400 bg-purple-950/60 border border-purple-800/40',
    },
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 lg:static flex flex-col bg-[#0b1120] border-r border-slate-800/80 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20">
              <Layers className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold text-white tracking-tight">WeatherOps</span>
                <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">SaaS Platform</span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-md transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
              Platform Modules
            </div>
          )}

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-slate-800/90 text-cyan-400 font-semibold shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="text-xs truncate">{item.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-800/60 my-2">
            {!isCollapsed && (
              <div className="px-3 pb-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                Deploy &amp; Config
              </div>
            )}
            <button
              onClick={() => {
                onOpenRunbook();
                onCloseMobile();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors"
            >
              <FileCode2 className="w-5 h-5 shrink-0 text-amber-400/80" />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-xs font-medium">DevOps Configs</span>
                  <span className="text-[10px] font-mono text-amber-400/80">6 Files</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="p-3.5 m-3 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="font-semibold text-slate-300">Architecture</span>
              <span className="text-[10px] font-mono text-cyan-400">v1.2.4</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
              React + Vite containerized with Nginx, monitored via Prometheus &amp; Grafana.
            </p>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 flex items-center gap-1 transition-colors text-[11px] text-slate-400"
            >
              <span>Open-Meteo API</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </aside>
    </>
  );
};