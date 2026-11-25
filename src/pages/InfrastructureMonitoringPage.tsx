import React from 'react';
import { CONTAINER_SERVICES } from '../services/devopsService';
import { ContainerFleetGrid } from '../components/infra/ContainerFleetGrid';
import { HostGauges } from '../components/infra/HostGauges';
import { NodeExporterProber } from '../components/infra/NodeExporterProber';
import { ClientRuntimeMetrics } from '../components/infra/ClientRuntimeMetrics';
import { TerraformStatusPanel } from '../components/infra/TerraformStatusPanel';

export const InfrastructureMonitoringPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Terraform Infrastructure as Code (IaC) */}
      <TerraformStatusPanel />

      {/* Docker Compose Container Fleet */}
      <ContainerFleetGrid containers={CONTAINER_SERVICES} />

      {/* Host & Nginx Resource Gauges */}
      <HostGauges />

      {/* Exporter Prober */}
      <NodeExporterProber />

      {/* Real Hardware & DOM Navigation Telemetry */}
      <ClientRuntimeMetrics />
    </div>
  );
};