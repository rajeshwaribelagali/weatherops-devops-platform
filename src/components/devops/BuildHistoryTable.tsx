import React from 'react';
import { Terminal } from 'lucide-react';
import { PipelineRun } from '../../types/devops';

export const BuildHistoryTable: React.FC<{
  runs: PipelineRun[];
  onSelectRun: (run: PipelineRun) => void;
  onViewLogs: (run: PipelineRun) => void;
}> = ({ runs, onSelectRun, onViewLogs }) => (
  <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg space-y-4">
    <h3 className="text-sm font-bold text-white">Deployment &amp; Pipeline History</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="text-slate-400 border-b border-slate-800 font-mono text-[11px]">
            <th className="pb-3">Build</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Commit</th>
            <th className="pb-3">Duration</th>
            <th className="pb-3">Triggered</th>
            <th className="pb-3 text-right">Logs</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {runs.map(run => (
            <tr key={run.id} onClick={() => onSelectRun(run)} className="hover:bg-slate-800/40 cursor-pointer">
              <td className="py-3 font-mono font-bold text-white">#{run.buildNumber}</td>
              <td className="py-3">
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${run.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                  {run.status}
                </span>
              </td>
              <td className="py-3 max-w-xs truncate text-slate-200">{run.commitMessage}</td>
              <td className="py-3 font-mono text-slate-300">{run.duration}</td>
              <td className="py-3 text-slate-400">{run.startedAt}</td>
              <td className="py-3 text-right">
                <button onClick={(e) => { e.stopPropagation(); onViewLogs(run); }} className="p-1 hover:text-cyan-400">
                  <Terminal className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);