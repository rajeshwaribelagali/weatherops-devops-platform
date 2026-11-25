import React, { useState } from 'react';
import { X, FileCode2 } from 'lucide-react';
import { DEVOPS_FILES } from '../../services/devopsService';

export const DevOpsRunbookModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<keyof typeof DEVOPS_FILES>('dockerfile');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(DEVOPS_FILES[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl h-[85vh] flex flex-col rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">WeatherOps Production DevOps Configs</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded font-mono">
              {copied ? 'Copied' : 'Copy File'}
            </button>
            <button onClick={onClose}><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800 overflow-x-auto text-xs font-mono">
          {(Object.keys(DEVOPS_FILES) as Array<keyof typeof DEVOPS_FILES>).map(key => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-1.5 rounded ${activeTab === key ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400'}`}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="flex-1 p-6 overflow-y-auto bg-black font-mono text-xs text-slate-200">
          <pre>{DEVOPS_FILES[activeTab]}</pre>
        </div>
      </div>
    </div>
  );
};