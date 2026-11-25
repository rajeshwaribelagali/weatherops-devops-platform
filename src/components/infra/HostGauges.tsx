import React from 'react';
import { Cpu, HardDrive, Globe, Network } from 'lucide-react';

export const HostGauges: React.FC = () => (
  <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg space-y-4">
    <h3 className="text-sm font-bold text-white">Host System Resources</h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
        <div className="flex justify-between text-xs text-slate-400"><span>Host CPU</span><span className="text-cyan-400 font-mono font-bold">7.5%</span></div>
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-cyan-400" style={{ width: '7.5%' }} /></div>
      </div>
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
        <div className="flex justify-between text-xs text-slate-400"><span>Memory</span><span className="text-blue-400 font-mono font-bold">332 MB / 8.0 GB</span></div>
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: '4.1%' }} /></div>
      </div>
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
        <div className="flex justify-between text-xs text-slate-400"><span>Nginx Active</span><span className="text-emerald-400 font-mono font-bold">18 conn/s</span></div>
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: '12%' }} /></div>
      </div>
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
        <div className="flex justify-between text-xs text-slate-400"><span>Network RX/TX</span><span className="text-purple-400 font-mono font-bold">1.4 MB/s</span></div>
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-purple-500" style={{ width: '8%' }} /></div>
      </div>
    </div>
  </div>
);