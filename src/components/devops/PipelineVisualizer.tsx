import React from 'react';
import { Play, CheckCircle2, XCircle, Clock, Terminal, Loader2, PackageCheck, ShieldCheck, Server } from 'lucide-react';
import { PipelineRun, PipelineStage } from '../../types/devops';

export const PipelineVisualizer: React.FC<{
  currentRun: PipelineRun;
  isTriggering: boolean;
  onTriggerPipeline: () => void;
  onViewLogs: (run: PipelineRun, stage?: PipelineStage) => void;
}> = ({ currentRun, isTriggering, onTriggerPipeline, onViewLogs }) => {
  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 md:p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Branch: <strong className="text-cyan-400">{currentRun.branch}</strong></span>
            <span>·</span>
            <span>Commit: <strong className="text-slate-200">{currentRun.commitSha}</strong></span>
            <span>·</span>
            <span>Build <strong className="text-white">#{currentRun.buildNumber}</strong></span>
          </div>
          <h3 className="text-base font-bold text-white mt-1">{currentRun.commitMessage}</h3>
          <div className="text-xs text-slate-400 mt-0.5">Triggered by {currentRun.author} · Duration: {currentRun.duration}</div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onViewLogs(currentRun)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Console Logs</span>
          </button>
          <button
            onClick={onTriggerPipeline}
            disabled={isTriggering}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all ${
              isTriggering
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20'
            }`}
          >
            {isTriggering ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isTriggering ? 'Running Pipeline...' : 'Trigger CI/CD Pipeline'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {currentRun.stages.map((stage, idx) => (
          <div
            key={stage.id}
            onClick={() => onViewLogs(currentRun, stage)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:border-slate-600 ${
              stage.status === 'success' ? 'border-emerald-500/40 bg-emerald-950/20' :
              stage.status === 'running' ? 'border-cyan-500/60 bg-cyan-950/30 animate-pulse' :
              stage.status === 'failed' ? 'border-rose-500/40 bg-rose-950/20' : 'border-slate-800 bg-slate-900/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Stage 0{idx + 1}</span>
              {stage.status === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
               stage.status === 'running' ? <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" /> :
               stage.status === 'failed' ? <XCircle className="w-4 h-4 text-rose-400" /> : <Clock className="w-4 h-4 text-slate-500" />}
            </div>
            <div className="text-xs font-bold text-slate-200">{stage.name}</div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{stage.description}</p>
          </div>
        ))}
      </div>

      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <PackageCheck className="w-4 h-4 text-blue-400" />
          <span>Deployed Container: <code className="font-mono text-cyan-300 font-semibold">{currentRun.imageTag}</code></span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400"><ShieldCheck className="w-3.5 h-3.5" /> Trivy: 0 Critical</span>
          <span className="flex items-center gap-1"><Server className="w-3.5 h-3.5 text-blue-400" /> Target: Nginx Alpine</span>
        </div>
      </div>
    </div>
  );
};