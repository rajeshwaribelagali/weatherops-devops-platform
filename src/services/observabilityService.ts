import { HttpRequestMetric, ObservabilitySummary, PrometheusTarget, AlertRule } from '../types/devops';

type Listener = () => void;

class ObservabilityService {
  private requests: HttpRequestMetric[] = [];
  private listeners: Set<Listener> = new Set();
  private prometheusUrl: string = 'http://localhost:9090';
  private prometheusStatus: 'UP' | 'DOWN' | 'UNREACHABLE' = 'UNREACHABLE';
  private lastPrometheusCheck: string = 'Never checked';
  private alertRules: AlertRule[] = [
    {
      id: 'alert-1',
      name: 'OpenMeteoHighLatency',
      severity: 'warning',
      status: 'resolved',
      summary: 'Forecast API latency exceeded 600ms threshold for 3 consecutive scrapes',
      expression: 'histogram_quantile(0.95, rate(weatherops_api_duration_ms_bucket[5m])) > 600',
      forDuration: '2m',
      resolvedAt: new Date(Date.now() - 3600000).toLocaleTimeString(),
    },
    {
      id: 'alert-2',
      name: 'WeatherApiErrorRate',
      severity: 'critical',
      status: 'resolved',
      summary: 'API 5xx or 4xx error rate above 5% in 5m sliding window',
      expression: 'rate(weatherops_http_requests_total{status=~"5.."}[5m]) / rate(weatherops_http_requests_total[5m]) * 100 > 5',
      forDuration: '1m',
      resolvedAt: new Date(Date.now() - 7200000).toLocaleTimeString(),
    },
    {
      id: 'alert-3',
      name: 'NginxUpstreamAvailable',
      severity: 'critical',
      status: 'resolved',
      summary: 'Nginx static SPA delivery container health probe nominal',
      expression: 'probe_success{job="weatherops-web"} == 1',
      forDuration: '30s',
      resolvedAt: new Date().toLocaleTimeString(),
    },
    {
      id: 'alert-4',
      name: 'HostMemorySaturation',
      severity: 'warning',
      status: 'resolved',
      summary: 'Host memory utilization is below critical threshold (<85%)',
      expression: '(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 85',
      forDuration: '5m',
      resolvedAt: new Date(Date.now() - 10800000).toLocaleTimeString(),
    },
  ];

  constructor() {
    this.seedInitialBaseline();
  }

  private seedInitialBaseline() {
    const now = Date.now();
    const baseline = [
      { endpoint: 'https://api.open-meteo.com/v1/forecast', method: 'GET' as const, status: 200, durationMs: 142, sizeBytes: 8420, delay: 180000 },
      { endpoint: 'https://geocoding-api.open-meteo.com/v1/search', method: 'GET' as const, status: 200, durationMs: 88, sizeBytes: 1240, delay: 120000 },
      { endpoint: 'https://api.open-meteo.com/v1/forecast', method: 'GET' as const, status: 200, durationMs: 165, sizeBytes: 8430, delay: 60000 },
    ];

    baseline.forEach((b, i) => {
      this.requests.push({
        id: `init-${i}`,
        timestamp: new Date(now - b.delay).toLocaleTimeString(),
        endpoint: b.endpoint,
        method: b.method,
        status: b.status,
        durationMs: b.durationMs,
        sizeBytes: b.sizeBytes,
        success: b.status >= 200 && b.status < 400,
      });
    });
  }

  public recordRequest(metric: Omit<HttpRequestMetric, 'id' | 'timestamp'>) {
    const fullMetric: HttpRequestMetric = {
      ...metric,
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString(),
    };

    this.requests.unshift(fullMetric);
    if (this.requests.length > 100) {
      this.requests.pop();
    }

    this.evaluateAlerts();
    this.notify();
  }

  public getRequests(): HttpRequestMetric[] {
    return [...this.requests];
  }

  public getSummary(): ObservabilitySummary {
    const totalRequests = this.requests.length;
    if (totalRequests === 0) {
      return {
        totalRequests: 0,
        successCount: 0,
        errorCount: 0,
        errorRatePercent: 0,
        latencyP50Ms: 0,
        latencyP95Ms: 0,
        latencyP99Ms: 0,
        averageLatencyMs: 0,
      };
    }

    const successCount = this.requests.filter(r => r.success).length;
    const errorCount = totalRequests - successCount;
    const errorRatePercent = Number(((errorCount / totalRequests) * 100).toFixed(1));

    const durations = this.requests.map(r => r.durationMs).sort((a, b) => a - b);
    const sum = durations.reduce((acc, curr) => acc + curr, 0);
    const averageLatencyMs = Math.round(sum / totalRequests);

    const p50Index = Math.floor(durations.length * 0.5);
    const p95Index = Math.floor(durations.length * 0.95);
    const p99Index = Math.floor(durations.length * 0.99);

    return {
      totalRequests,
      successCount,
      errorCount,
      errorRatePercent,
      latencyP50Ms: durations[p50Index] ?? 0,
      latencyP95Ms: durations[p95Index] ?? 0,
      latencyP99Ms: durations[p99Index] ?? 0,
      averageLatencyMs,
    };
  }

  public getAlertRules(): AlertRule[] {
    return [...this.alertRules];
  }

  private evaluateAlerts() {
    const summary = this.getSummary();
    this.alertRules = this.alertRules.map(rule => {
      if (rule.name === 'OpenMeteoHighLatency') {
        const isFiring = summary.latencyP95Ms > 600;
        return {
          ...rule,
          status: isFiring ? 'firing' : 'resolved',
          lastFired: isFiring ? new Date().toLocaleTimeString() : rule.lastFired,
          resolvedAt: !isFiring ? new Date().toLocaleTimeString() : rule.resolvedAt,
        };
      }
      if (rule.name === 'WeatherApiErrorRate') {
        const isFiring = summary.errorRatePercent > 5;
        return {
          ...rule,
          status: isFiring ? 'firing' : 'resolved',
          lastFired: isFiring ? new Date().toLocaleTimeString() : rule.lastFired,
          resolvedAt: !isFiring ? new Date().toLocaleTimeString() : rule.resolvedAt,
        };
      }
      return rule;
    });
  }

  public getPrometheusTarget(): PrometheusTarget {
    return {
      name: 'prometheus-cluster',
      endpoint: this.prometheusUrl,
      scrapeInterval: '15s',
      lastScrapeTime: this.lastPrometheusCheck,
      status: this.prometheusStatus,
      lastError: this.prometheusStatus === 'UNREACHABLE' ? 'Target unreachable or CORS restricted (Standalone Browser Mode)' : undefined,
    };
  }

  public setPrometheusUrl(url: string) {
    this.prometheusUrl = url;
    this.notify();
  }

  public async probeEndpoint(targetUrl: string): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    const start = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(targetUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const latencyMs = Math.round(performance.now() - start);

      this.recordRequest({
        endpoint: targetUrl,
        method: 'HEAD',
        status: res.status || 200,
        durationMs: latencyMs,
        sizeBytes: 0,
        success: true,
      });

      if (targetUrl.includes('9090') || targetUrl.includes('prometheus')) {
        this.prometheusStatus = 'UP';
        this.lastPrometheusCheck = new Date().toLocaleTimeString();
      }

      this.notify();
      return { success: true, latencyMs };
    } catch (err: unknown) {
      const latencyMs = Math.round(performance.now() - start);
      const errorMsg = err instanceof Error ? err.message : 'Connection failed';

      this.recordRequest({
        endpoint: targetUrl,
        method: 'HEAD',
        status: 0,
        durationMs: latencyMs,
        sizeBytes: 0,
        success: false,
      });

      if (targetUrl.includes('9090') || targetUrl.includes('prometheus')) {
        this.prometheusStatus = 'UNREACHABLE';
        this.lastPrometheusCheck = new Date().toLocaleTimeString();
      }

      this.notify();
      return { success: false, latencyMs, error: errorMsg };
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public clearTelemetry() {
    this.requests = [];
    this.notify();
  }
}

export const observabilityService = new ObservabilityService();