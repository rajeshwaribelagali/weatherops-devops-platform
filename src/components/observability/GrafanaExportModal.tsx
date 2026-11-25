import React from 'react';
import { X, Layers } from 'lucide-react';

export const GrafanaExportModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
    <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><Layers className="w-4 h-4 text-purple-400" /> Grafana Dashboard JSON</h3>
        <button onClick={onClose}><X className="w-4 h-4" /></button>
      </div>
      <p className="text-xs text-slate-400">Import this definition in Grafana under Dashboards &rarr; Import.</p>
      <pre className="p-4 bg-black text-xs font-mono text-slate-300 rounded overflow-auto max-h-64">
        {JSON.stringify({ title: "WeatherOps Telemetry", refresh: "10s", panels: 4 }, null, 2)}
      </pre>
    </div>
  </div>
);