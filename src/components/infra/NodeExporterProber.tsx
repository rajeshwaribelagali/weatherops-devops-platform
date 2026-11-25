import React, { useState } from 'react';
import { Zap, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { observabilityService } from '../../services/observabilityService';

export const NodeExporterProber: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState('http://localhost:9100/metrics');
  const [result, setResult] = useState<string | null>(null);

  const handleProbe = async () => {
    const res = await observabilityService.probeEndpoint(targetUrl);
    setResult(res.success ? `Node Exporter responded in ${res.latencyMs}ms.` : 'Target unreachable or offline.');
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg space-y-4">
      <h3 className="text-sm font-bold text-white flex items-center gap-2"><Zap className="w-4 h-4 text-cyan-400" /> Target Health Prober</h3>
      <div className="flex gap-3">
        <input type="text" value={targetUrl} onChange={e => setTargetUrl(e.target.value)} className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded font-mono text-xs" />
        <button onClick={handleProbe} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold">Execute Probe</button>
      </div>
      {result && <div className="text-xs text-slate-400">{result}</div>}
    </div>
  );
};