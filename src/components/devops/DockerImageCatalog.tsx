import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { DockerImage } from '../../types/devops';

export const DockerImageCatalog: React.FC<{ images: DockerImage[] }> = ({ images }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const handleCopy = (tag: string) => {
    navigator.clipboard.writeText(`docker pull weatherops-frontend:${tag}`);
    setCopied(tag);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white">Docker Image Catalog</h3>
        <span className="text-xs font-mono text-slate-400">Target: Nginx 1.25 Alpine</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {images.map(img => (
          <div key={img.tag} className="p-4 rounded-xl border bg-slate-950/50 border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-white">{img.tag}</span>
              <button onClick={() => handleCopy(img.tag)} className="p-1 hover:text-white text-slate-400">
                {copied === img.tag ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-xs text-slate-400 mt-2 font-mono flex justify-between">
              <span>Size: {img.sizeMb} MB</span>
              <span>Arch: {img.architecture}</span>
              <span className="text-emerald-400">0 High/Crit</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};