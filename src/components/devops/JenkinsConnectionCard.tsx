import React, { useState } from 'react';
import { Server, ExternalLink } from 'lucide-react';
import { observabilityService } from '../../services/observabilityService';

export const JenkinsConnectionCard: React.FC = () => {
  const [jenkinsUrl, setJenkinsUrl] = useState('http://localhost:8080');
  const [jobName, setJobName] = useState('weatherops-production-pipeline');
  const [isProbing, setIsProbing] = useState(false);
  const [probeResult, setProbeResult] = useState<{ status: 'untested' | 'connected' | 'disconnected'; message: string }>({
    status: 'untested',
    message: 'Integration unverified. Test local Jenkins instance or use standalone pipeline simulation.',
  });

  const handleProbe = async () => {
    setIsProbing(true);
    const probe = await observabilityService.probeEndpoint(jenkinsUrl);
    setIsProbing(false);
    if (probe.success) {
      setProbeResult({ status: 'connected', message: `Connected to Jenkins server (HTTP response latency: ${probe.latencyMs}ms)` });
    } else {
      setProbeResult({ status: 'disconnected', message: `Integration Offline: No response from ${jenkinsUrl}. Displaying standalone simulated pipeline state.` });
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <Server className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Jenkins CI/CD Integration</h3>
            <p className="text-xs text-slate-400">Automated build orchestrator &amp; webhook trigger</p>
          </div>
        </div>
        <div>
          {probeResult.status === 'connected' ? (
            <span className="px-2.5 py-1 rounded text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">Connected</span>
          ) : (
            <span className="px-2.5 py-1 rounded text-xs font-mono bg-amber-950 text-amber-400 border border-amber-800">Standalone Mode (Local)</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Jenkins Base URL</label>
          <input type="text" value={jenkinsUrl} onChange={e => setJenkinsUrl(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded font-mono text-xs" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Job Identifier</label>
          <input type="text" value={jobName} onChange={e => setJobName(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded font-mono text-xs" />
        </div>
        <div className="flex items-end gap-2">
          <button onClick={handleProbe} disabled={isProbing} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-medium">
            {isProbing ? 'Pinging...' : 'Probe Connection'}
          </button>
          <a href={`${jenkinsUrl}/job/${jobName}`} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
      <div className="text-xs text-slate-400">{probeResult.message}</div>
    </div>
  );
};