import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCw, Cpu, Activity, Menu, X, CloudSun } from 'lucide-react';
import { TemperatureUnit } from '../../types/weather';
import { observabilityService } from '../../services/observabilityService';

interface HeaderProps {
  activeTab: string;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  onRefresh: () => void;
  onOpenRunbook: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  unit,
  onToggleUnit,
  onRefresh,
  onOpenRunbook,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [reqSummary, setReqSummary] = useState(observabilityService.getSummary());

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' UTC');
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = observabilityService.subscribe(() => {
      setReqSummary(observabilityService.getSummary());
    });
    return () => unsubscribe();
  }, []);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'weather': return 'Weather Forecasting Telemetry';
      case 'devops': return 'CI/CD Pipeline & Jenkins Center';
      case 'infra': return 'Container & Host Infrastructure';
      case 'observability': return 'Prometheus & Grafana Observability';
      default: return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 md:gap-8 px-4 md:px-6 py-3.5 bg-[#0b1120]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-md transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <a href="#weather" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/30 transition-shadow">
            <CloudSun className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Weather<span className="text-cyan-400 font-extrabold">Ops</span>
          </span>
        </a>
      </div>

      <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Workspace /</span>
          <span className="text-slate-200 font-semibold">{getPageTitle(activeTab)}</span>
        </div>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono tabular-nums">{reqSummary.totalRequests} reqs</span>
          <span className="text-slate-600">({reqSummary.latencyP50Ms}ms p50)</span>
        </div>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <div className="flex items-center gap-1.5 font-mono text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span className="tabular-nums">us-east-1a</span>
          <span className="text-slate-600">· {currentTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onToggleUnit}
          title={`Switch to ${unit === 'metric' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}`}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg transition-colors whitespace-nowrap"
        >
          <span className={unit === 'metric' ? 'text-cyan-400 font-bold' : 'text-slate-400'}>°C</span>
          <span className="text-slate-600">/</span>
          <span className={unit === 'imperial' ? 'text-cyan-400 font-bold' : 'text-slate-400'}>°F</span>
        </button>

        <button
          onClick={onRefresh}
          title="Refresh forecast data & run probes"
          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 border border-slate-800 rounded-lg transition-colors"
          aria-label="Refresh weather data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenRunbook}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-lg shadow-sm shadow-cyan-500/20 transition-all whitespace-nowrap"
        >
          <Terminal className="w-3.5 h-3.5 text-slate-950" />
          <span>DevOps Runbook</span>
        </button>
      </div>
    </header>
  );
};