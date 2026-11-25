import React from 'react';
import { HttpRequestMetric, ObservabilitySummary } from '../../types/devops';

export const RealTelemetryOverview: React.FC<{ summary: ObservabilitySummary; requests: HttpRequestMetric[]; onClear: () => void }> = ({ summary, requests, onClear }) => (
  <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg space-y-5">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
        <div className="text-xs text-slate-400">Total HTTP Requests</div>
        <div className="text-2xl font-mono font-bold text-white">{summary.totalRequests}</div>
      </div>
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
        <div className="text-xs text-slate-400">Latency (p50 / p95)</div>
        <div className="text-2xl font-mono font-bold text-cyan-400">{summary.latencyP50Ms} / {summary.latencyP95Ms} ms</div>
      </div>
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
        <div className="text-xs text-slate-400">Success Rate</div>
        <div className="text-2xl font-mono font-bold text-emerald-400">{summary.totalRequests > 0 ? (100 - summary.errorRatePercent).toFixed(1) : 100}%</div>
      </div>
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
        <div className="text-xs text-slate-400">Error Rate</div>
        <div className="text-2xl font-mono font-bold text-amber-400">{summary.errorRatePercent}%</div>
      </div>
    </div>

    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase font-mono">Live HTTP Request Traces</h4>
        <button onClick={onClear} className="text-xs text-slate-500 hover:text-slate-300">Clear</button>
      </div>
      <div className="overflow-x-auto max-h-48 overflow-y-auto border border-slate-800 rounded-lg">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-2 px-3">Time</th>
              <th className="py-2 px-3">Method</th>
              <th className="py-2 px-3">Endpoint</th>
              <th className="py-2 px-3">Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {requests.slice(0, 8).map(req => (
              <tr key={req.id}>
                <td className="py-2 px-3 text-slate-400">{req.timestamp}</td>
                <td className="py-2 px-3 text-cyan-400">{req.method}</td>
                <td className="py-2 px-3 text-slate-300 max-w-xs truncate">{req.endpoint}</td>
                <td className="py-2 px-3 text-slate-200">{req.durationMs}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);