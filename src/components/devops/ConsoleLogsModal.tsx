import React, { useState } from 'react';
import { X, Terminal } from 'lucide-react';
import { PipelineRun, PipelineStage } from '../../types/devops';

export const ConsoleLogsModal: React.FC<{
  run: PipelineRun | null;
  stage?: PipelineStage | null;
  onClose: () => void;
}> = ({ run, stage, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!run) return null;

  const logs = stage ? stage.logs : run.stages.flatMap(s => s.logs);
  const handleCopy = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[80vh] flex flex-col rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-slate-200">Build #{run.buildNumber} Logs</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="px-2 py-1 text-xs bg-slate-800 rounded font-mono">
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button onClick={onClose}><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto font-mono text-xs bg-black text-slate-300 space-y-1">
          {logs.map((line, i) => (
            <div key={i}><span className="text-slate-600 select-none mr-3">{i + 1}</span>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
};