export type PipelineStatus = 'success' | 'running' | 'failed' | 'queued' | 'skipped';

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  status: PipelineStatus;
  durationSeconds?: number;
  logs: string[];
}

export interface PipelineRun {
  id: string;
  buildNumber: number;
  commitSha: string;
  commitMessage: string;
  branch: string;
  author: string;
  startedAt: string;
  duration: string;
  status: 'SUCCESS' | 'FAILED' | 'RUNNING' | 'UNSTABLE';
  stages: PipelineStage[];
  imageTag: string;
}

export interface DockerImage {
  repository: string;
  tag: string;
  digest: string;
  sizeMb: number;
  created: string;
  architecture: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface ContainerService {
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'degraded';
  health: 'healthy' | 'starting' | 'unhealthy';
  uptime: string;
  ports: string[];
  cpuPercent: number;
  memoryMb: number;
  memoryLimitMb: number;
  restartPolicy: string;
  volumes: string[];
}

export interface HttpRequestMetric {
  id: string;
  timestamp: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'HEAD';
  status: number;
  durationMs: number;
  sizeBytes: number;
  success: boolean;
}

export interface ObservabilitySummary {
  totalRequests: number;
  successCount: number;
  errorCount: number;
  errorRatePercent: number;
  latencyP50Ms: number;
  latencyP95Ms: number;
  latencyP99Ms: number;
  averageLatencyMs: number;
}

export interface PrometheusTarget {
  name: string;
  endpoint: string;
  scrapeInterval: string;
  lastScrapeTime: string;
  status: 'UP' | 'DOWN' | 'UNREACHABLE';
  lastError?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'firing' | 'resolved' | 'pending';
  summary: string;
  expression: string;
  forDuration: string;
  lastFired?: string;
  resolvedAt?: string;
}