import React, { useState } from 'react';
import { Activity, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { PrometheusTarget } from '../../types/devops';
import { observabilityService } from '../../services/observabilityService';

export const PrometheusStatusCard: React.FC<{ target: PrometheusTarget; onOpenGrafanaExport: () => void }> = ({ target, onOpenGrafanaExport }) => {
  const [endpoint, setEndpoint] = useState(target.endpoint);
  const [isProbing, setIsProbing] = useState(false);
  const [status, setStatus] = useState<'untested' | 'connected' | 'disconnected'>('untested');

  const handleVerify = async () => {
    setIsProbing(true);
    const res = await observabilityService.probeEndpoint(endpoint);
    setIsProbing(false);
    setStatus(res.success ? 'connected' : 'disconnected');
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Prometheus &amp; Grafana Observability</h3>
            <p className="text-xs text-slate-400">Scrape target status &amp; visual dashboard access</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === 'connected' ? (
            <span className="px-2.5 py-1 rounded text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Prometheus UP
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              Target: {endpoint}
            </span>
          )}
          <button onClick={onOpenGrafanaExport} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded border border-slate-700">
            Grafana JSON
          </button>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded flex items-center gap-1 shadow-sm"
          >
            Open Grafana (:3001) <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={endpoint}
          onChange={e => setEndpoint(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-950 text-slate-200 border border-slate-800 rounded font-mono text-xs focus:outline-none"
        />
        <button
          onClick={handleVerify}
          disabled={isProbing}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm"
        >
          {isProbing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          <span>{isProbing ? 'Pinging...' : 'Verify Connection'}</span>
        </button>
      </div>
    </div>
  );
};