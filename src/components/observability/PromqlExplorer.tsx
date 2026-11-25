import React, { useState } from 'react';
import { Code2, Play } from 'lucide-react';

export const PromqlExplorer: React.FC = () => {
  const [query, setQuery] = useState('rate(weatherops_http_requests_total[5m])');
  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg space-y-4">
      <h3 className="text-sm font-bold text-white flex items-center gap-2"><Code2 className="w-4 h-4 text-purple-400" /> PromQL Query Explorer</h3>
      <div className="flex gap-2">
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded font-mono text-xs" />
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-semibold flex items-center gap-1">
          <Play className="w-3.5 h-3.5 fill-current" /> Execute
        </button>
      </div>
    </div>
  );
};