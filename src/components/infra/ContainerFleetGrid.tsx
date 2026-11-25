import React from 'react';
import { Server, CheckCircle2, Cpu, HardDrive } from 'lucide-react';
import { ContainerService } from '../../types/devops';

export const ContainerFleetGrid: React.FC<{ containers: ContainerService[] }> = ({ containers }) => (
  <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg space-y-4">
    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
      <h3 className="text-sm font-bold text-white">Docker Compose Container Fleet</h3>
      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">4 / 4 Healthy</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {containers.map(c => (
        <div key={c.name} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-100 font-mono">{c.name}</span>
            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />{c.health}</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">{c.image}</div>
          <div className="text-xs font-mono text-slate-300 pt-2 border-t border-slate-800 flex justify-between">
            <span>CPU: {c.cpuPercent}%</span>
            <span>RAM: {c.memoryMb}M</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);