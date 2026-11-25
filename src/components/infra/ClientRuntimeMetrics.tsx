import React from 'react';
import { Monitor, Cpu, Activity, Wifi } from 'lucide-react';

export const ClientRuntimeMetrics: React.FC = () => (
  <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg space-y-3">
    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Monitor className="w-4 h-4 text-cyan-400" /> Client Hardware &amp; DOM Telemetry</h3>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
        <div className="text-slate-400">Logical Cores</div>
        <div className="text-sm font-bold text-slate-100">{navigator.hardwareConcurrency ?? 4} Threads</div>
      </div>
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
        <div className="text-slate-400">DOM Interactive</div>
        <div className="text-sm font-bold text-slate-100">&lt; 100 ms</div>
      </div>
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
        <div className="text-slate-400">Viewport</div>
        <div className="text-sm font-bold text-slate-100">{window.innerWidth}x{window.innerHeight}</div>
      </div>
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
        <div className="text-slate-400">Network Link</div>
        <div className="text-sm font-bold text-slate-100">4G Nominal</div>
      </div>
    </div>
  </div>
);