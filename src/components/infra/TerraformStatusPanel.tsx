import React, { useState } from 'react';
import {
  Blocks,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Network,
  Box,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { observabilityService } from '../../services/observabilityService';

interface ProbeStatus {
  tested: boolean;
  up: boolean;
  latencyMs: number;
}

interface TerraformResourceItem {
  address: string;
  type: 'network' | 'image' | 'container';
  detail: string;
  url?: string;
  probeUrl?: string;
}

const TERRAFORM_RESOURCES: TerraformResourceItem[] = [
  {
    address: 'docker_network.weatherops_tf_net',
    type: 'network',
    detail: 'Bridge network: weatherops-tf-net',
  },
  {
    address: 'docker_image.prometheus',
    type: 'image',
    detail: 'prom/prometheus:v2.50.0 (keep_locally = true)',
  },
  {
    address: 'docker_image.grafana',
    type: 'image',
    detail: 'grafana/grafana:10.3.1 (keep_locally = true)',
  },
  {
    address: 'docker_container.weatherops_web',
    type: 'container',
    detail: 'weatherops-frontend:v1.0.0 -> Port 8082:80',
    url: 'http://localhost:8082',
    probeUrl: 'http://localhost:8082/healthz',
  },
  {
    address: 'docker_container.prometheus',
    type: 'container',
    detail: 'prom/prometheus:v2.50.0 -> Port 9091:9090',
    url: 'http://localhost:9091',
    probeUrl: 'http://localhost:9091/-/healthy',
  },
  {
    address: 'docker_container.grafana',
    type: 'container',
    detail: 'grafana/grafana:10.3.1 -> Port 3002:3000',
    url: 'http://localhost:3002',
    probeUrl: 'http://localhost:3002/api/health',
  },
];

const TERRAFORM_HCL_SNIPPET = `terraform {
  required_version = ">= 1.5.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

resource "docker_network" "weatherops_tf_net" {
  name = "weatherops-tf-net"
}

resource "docker_container" "weatherops_web" {
  name    = "weatherops-tf-web"
  image   = "weatherops-frontend:v1.0.0"
  restart = "unless-stopped"
  ports {
    internal = 80
    external = 8082
  }
  networks_advanced {
    name = docker_network.weatherops_tf_net.name
  }
}

resource "docker_container" "prometheus" {
  name    = "weatherops-tf-prometheus"
  image   = docker_image.prometheus.image_id
  restart = "unless-stopped"
  ports {
    internal = 9090
    external = 9091
  }
  networks_advanced {
    name = docker_network.weatherops_tf_net.name
  }
}

resource "docker_container" "grafana" {
  name    = "weatherops-tf-grafana"
  image   = docker_image.grafana.image_id
  restart = "unless-stopped"
  ports {
    internal = 3000
    external = 3002
  }
  networks_advanced {
    name = docker_network.weatherops_tf_net.name
  }
  depends_on = [docker_container.prometheus]
}`;

export const TerraformStatusPanel: React.FC = () => {
  const [probing, setProbing] = useState(false);
  const [probeMap, setProbeMap] = useState<Record<string, ProbeStatus>>({});
  const [showCode, setShowCode] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleVerifyStack = async () => {
    setProbing(true);
    const targets = TERRAFORM_RESOURCES.filter(r => r.probeUrl);
    const nextMap: Record<string, ProbeStatus> = {};

    await Promise.all(
      targets.map(async item => {
        const res = await observabilityService.probeEndpoint(item.probeUrl!);
        nextMap[item.address] = {
          tested: true,
          up: res.success,
          latencyMs: res.latencyMs,
        };
      })
    );

    setProbeMap(nextMap);
    setProbing(false);
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(key);
    setTimeout(() => setCopiedCmd(null), 1800);
  };

  const testedCount = Object.values(probeMap).filter(p => p.tested).length;
  const upCount = Object.values(probeMap).filter(p => p.up).length;

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30">
            <Blocks className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white">Terraform Infrastructure as Code (IaC)</h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-700/50">
                v1.17.2 · kreuzwerker/docker
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/50">
                $0 Local Mode (AWS-Ready)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              6 managed resources declared in <code className="text-purple-300">terraform/main.tf</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {testedCount > 0 && (
            <span
              className={`text-xs font-mono px-2.5 py-1 rounded-lg border font-semibold ${
                upCount === testedCount
                  ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60'
                  : 'bg-amber-950/70 text-amber-400 border-amber-800/60'
              }`}
            >
              {upCount} / {testedCount} Endpoints Live
            </span>
          )}
          <button
            onClick={() => setShowCode(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>main.tf</span>
            {showCode ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <button
            onClick={handleVerifyStack}
            disabled={probing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors shadow-sm shadow-purple-500/20 disabled:opacity-60"
          >
            {probing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Probing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Verify Stack Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {TERRAFORM_RESOURCES.map(res => {
          const probe = probeMap[res.address];
          return (
            <div
              key={res.address}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {res.type === 'network' ? (
                    <Network className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  ) : res.type === 'image' ? (
                    <Box className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  ) : (
                    <Blocks className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  )}
                  <span className="text-xs font-mono font-bold text-slate-100 truncate" title={res.address}>
                    {res.address}
                  </span>
                </div>

                {res.probeUrl ? (
                  probe?.tested ? (
                    probe.up ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        UP ({probe.latencyMs}ms)
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/60 flex items-center gap-1 shrink-0">
                        <AlertCircle className="w-2.5 h-2.5" />
                        OFFLINE
                      </span>
                    )
                  ) : (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                      Not Probed
                    </span>
                  )
                ) : (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-800/40 shrink-0">
                    Managed
                  </span>
                )}
              </div>

              <div className="text-[11px] font-mono text-slate-400 truncate">{res.detail}</div>

              {res.url && (
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-400 hover:text-purple-300 pt-1"
                >
                  <span>{res.url}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
        {[
          { key: 'plan', label: 'Check Drift', cmd: 'terraform -chdir=terraform plan' },
          { key: 'apply', label: 'Provision Stack', cmd: 'terraform -chdir=terraform apply -auto-approve' },
          { key: 'destroy', label: 'Teardown Stack', cmd: 'terraform -chdir=terraform destroy -auto-approve' },
        ].map(item => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono"
          >
            <div className="min-w-0">
              <span className="text-slate-400 block text-[10px] uppercase">{item.label}</span>
              <code className="text-purple-300 truncate block">{item.cmd}</code>
            </div>
            <button
              onClick={() => handleCopy(item.key, item.cmd)}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded border border-slate-800 shrink-0"
              title="Copy command"
            >
              {copiedCmd === item.key ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        ))}
      </div>

      {showCode && (
        <div className="rounded-xl bg-black border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono">
            <span className="text-purple-300">terraform/main.tf</span>
            <button
              onClick={() => handleCopy('hcl', TERRAFORM_HCL_SNIPPET)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              {copiedCmd === 'hcl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCmd === 'hcl' ? 'Copied' : 'Copy HCL'}</span>
            </button>
          </div>
          <pre className="p-4 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-72">
            {TERRAFORM_HCL_SNIPPET}
          </pre>
        </div>
      )}
    </div>
  );
};