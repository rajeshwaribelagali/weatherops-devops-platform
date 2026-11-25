import React, { useState } from 'react';
import { PipelineRun, PipelineStage } from '../types/devops';
import { INITIAL_PIPELINE_RUNS, DOCKER_IMAGES } from '../services/devopsService';
import { PipelineVisualizer } from '../components/devops/PipelineVisualizer';
import { JenkinsConnectionCard } from '../components/devops/JenkinsConnectionCard';
import { BuildHistoryTable } from '../components/devops/BuildHistoryTable';
import { DockerImageCatalog } from '../components/devops/DockerImageCatalog';
import { ConsoleLogsModal } from '../components/devops/ConsoleLogsModal';

export const DevOpsControlCenterPage: React.FC = () => {
  const [runs, setRuns] = useState<PipelineRun[]>(INITIAL_PIPELINE_RUNS);
  const [selectedRun, setSelectedRun] = useState<PipelineRun>(INITIAL_PIPELINE_RUNS[0]);
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [logModalState, setLogModalState] = useState<{ isOpen: boolean; run: PipelineRun | null; stage?: PipelineStage | null }>({
    isOpen: false, run: null, stage: null,
  });

  const handleTriggerPipeline = () => {
    if (isTriggering) return;
    setIsTriggering(true);
    const nextNum = runs[0].buildNumber + 1;
    const newRun: PipelineRun = {
      id: `run-${nextNum}`,
      buildNumber: nextNum,
      commitSha: Math.random().toString(36).substring(2, 9),
      commitMessage: 'feat: automated trigger from WeatherOps Control Center',
      branch: 'main',
      author: 'devops-operator@weatherops.io',
      startedAt: 'Just now',
      duration: '1m 24s',
      status: 'SUCCESS',
      imageTag: `weatherops-frontend:v1.2.${nextNum}`,
      stages: [
        { id: 's1', name: 'Checkout SCM', description: 'Git clone', status: 'success', durationSeconds: 6, logs: ['[SCM] Commit checked out.'] },
        { id: 's2', name: 'Lint & Typecheck', description: 'TypeScript validation', status: 'success', durationSeconds: 18, logs: ['Lint pass'] },
        { id: 's3', name: 'Docker Build', description: 'Container packaging', status: 'success', durationSeconds: 42, logs: ['Built image'] },
        { id: 's4', name: 'Security Scan', description: 'Trivy audit', status: 'success', durationSeconds: 14, logs: ['0 vulnerabilities'] },
        { id: 's5', name: 'Health Probe', description: 'HTTP probe', status: 'success', durationSeconds: 10, logs: ['200 OK'] },
        { id: 's6', name: 'Production Deploy', description: 'Rolling update', status: 'success', durationSeconds: 22, logs: ['Deployed'] },
      ],
    };
    setTimeout(() => {
      setRuns(prev => [newRun, ...prev]);
      setSelectedRun(newRun);
      setIsTriggering(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PipelineVisualizer
        currentRun={selectedRun}
        isTriggering={isTriggering}
        onTriggerPipeline={handleTriggerPipeline}
        onViewLogs={(run, stage) => setLogModalState({ isOpen: true, run, stage: stage || null })}
      />
      <JenkinsConnectionCard />
      <BuildHistoryTable
        runs={runs}
        onSelectRun={setSelectedRun}
        onViewLogs={run => setLogModalState({ isOpen: true, run, stage: null })}
      />
      <DockerImageCatalog images={DOCKER_IMAGES} />
      {logModalState.isOpen && (
        <ConsoleLogsModal
          run={logModalState.run}
          stage={logModalState.stage}
          onClose={() => setLogModalState({ isOpen: false, run: null, stage: null })}
        />
      )}
    </div>
  );
};