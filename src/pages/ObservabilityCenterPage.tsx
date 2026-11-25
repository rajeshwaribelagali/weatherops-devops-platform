import React, { useState, useEffect } from 'react';
import { observabilityService } from '../services/observabilityService';
import { PrometheusStatusCard } from '../components/observability/PrometheusStatusCard';
import { RealTelemetryOverview } from '../components/observability/RealTelemetryOverview';
import { PromqlExplorer } from '../components/observability/PromqlExplorer';
import { AlertsManager } from '../components/observability/AlertsManager';
import { GrafanaExportModal } from '../components/observability/GrafanaExportModal';

export const ObservabilityCenterPage: React.FC = () => {
  const [requests, setRequests] = useState(observabilityService.getRequests());
  const [summary, setSummary] = useState(observabilityService.getSummary());
  const [target, setTarget] = useState(observabilityService.getPrometheusTarget());
  const [alerts, setAlerts] = useState(observabilityService.getAlertRules());
  const [isGrafanaModalOpen, setIsGrafanaModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = observabilityService.subscribe(() => {
      setRequests(observabilityService.getRequests());
      setSummary(observabilityService.getSummary());
      setTarget(observabilityService.getPrometheusTarget());
      setAlerts(observabilityService.getAlertRules());
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PrometheusStatusCard target={target} onOpenGrafanaExport={() => setIsGrafanaModalOpen(true)} />
      <RealTelemetryOverview summary={summary} requests={requests} onClear={() => observabilityService.clearTelemetry()} />
      <PromqlExplorer />
      <AlertsManager alerts={alerts} />
      {isGrafanaModalOpen && <GrafanaExportModal onClose={() => setIsGrafanaModalOpen(false)} />}
    </div>
  );
};