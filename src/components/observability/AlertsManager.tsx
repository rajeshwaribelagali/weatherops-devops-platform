import React from 'react';
import { Bell } from 'lucide-react';
import { AlertRule } from '../../types/devops';

export const AlertsManager: React.FC<{ alerts: AlertRule[] }> = ({ alerts }) => (
  <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg space-y-3">
    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Bell className="w-4 h-4 text-cyan-400" /> Prometheus Alertmanager Rules</h3>
    <div className="space-y-2">
      {alerts.map(a => (
        <div key={a.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between items-center text-xs">
          <div>
            <span className="font-bold font-mono text-white mr-2">{a.name}</span>
            <span className="text-slate-400">{a.summary}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">{a.status}</span>
        </div>
      ))}
    </div>
  </div>
);