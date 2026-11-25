import { PipelineRun, DockerImage, ContainerService } from '../types/devops';

export const DEVOPS_FILES = {
  dockerfile: `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.25-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,

  dockerCompose: `version: '3.8'
services:
  weatherops-web:
    build: .
    ports: ["80:80"]
  prometheus:
    image: prom/prometheus:v2.50.0
    ports: ["9090:9090"]
  grafana:
    image: grafana/grafana:10.3.1
    ports: ["3001:3000"]
  node-exporter:
    image: prom/node-exporter:v1.7.0
    ports: ["9100:9100"]`,

  jenkinsfile: `pipeline {
    agent any
    stages {
        stage('Lint & Test') { steps { sh 'npm run lint' } }
        stage('Docker Build') { steps { sh 'docker build -t weatherops-frontend:latest .' } }
        stage('Deploy') { steps { sh 'docker compose up -d' } }
    }
}`,

  prometheusYml: `global:
  scrape_interval: 15s
scrape_configs:
  - job_name: 'weatherops-web'
    static_configs:
      - targets: ['weatherops-web:80']`,

  nginxConf: `server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}`,

  githubWorkflow: `name: CI/CD
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build`
};

export const INITIAL_PIPELINE_RUNS: PipelineRun[] = [
  {
    id: 'run-144',
    buildNumber: 144,
    commitSha: '8f2d1e0',
    commitMessage: 'feat(weather): integrate Open-Meteo UV index and hourly trend analytics',
    branch: 'main',
    author: 'devops-lead@weatherops.io',
    startedAt: '12 minutes ago',
    duration: '2m 18s',
    status: 'SUCCESS',
    imageTag: 'weatherops-frontend:v1.2.4',
    stages: [
      { id: 's1', name: 'Checkout SCM', description: 'Git clone', status: 'success', durationSeconds: 6, logs: ['[SCM] Cloning repository from git@github.com:weatherops/weatherops-frontend.git'] },
      { id: 's2', name: 'Lint & Typecheck', description: 'TypeScript strict compilation', status: 'success', durationSeconds: 22, logs: ['> tsc --noEmit', 'No errors found.'] },
      { id: 's3', name: 'Docker Build', description: 'Multi-stage container packaging', status: 'success', durationSeconds: 54, logs: ['[DOCKER] Successfully tagged weatherops-frontend:v1.2.4'] },
      { id: 's4', name: 'Security Scan', description: 'Trivy CVE scan', status: 'success', durationSeconds: 18, logs: ['[TRIVY] 0 Critical vulnerabilities'] },
      { id: 's5', name: 'Health Probe', description: 'HTTP /healthz probe', status: 'success', durationSeconds: 12, logs: ['[PROBE] GET /healthz -> 200 OK'] },
      { id: 's6', name: 'Production Deploy', description: 'Rolling container update', status: 'success', durationSeconds: 26, logs: ['[DEPLOY] Deployed to cluster'] },
    ],
  },
  {
    id: 'run-143',
    buildNumber: 143,
    commitSha: '6c4a89b',
    commitMessage: 'fix(docker): tune Nginx worker keepalive and buffer allocation',
    branch: 'main',
    author: 'infra-eng@weatherops.io',
    startedAt: '2 hours ago',
    duration: '2m 04s',
    status: 'SUCCESS',
    imageTag: 'weatherops-frontend:v1.2.3',
    stages: [
      { id: 's1', name: 'Checkout SCM', description: 'Git clone', status: 'success', durationSeconds: 5, logs: ['Checked out commit 6c4a89b'] },
      { id: 's2', name: 'Lint & Typecheck', description: 'Type validation', status: 'success', durationSeconds: 21, logs: ['Lint pass'] },
      { id: 's3', name: 'Docker Build', description: 'Container packaging', status: 'success', durationSeconds: 50, logs: ['Tagged image v1.2.3'] },
      { id: 's4', name: 'Security Scan', description: 'Trivy audit', status: 'success', durationSeconds: 16, logs: ['0 vulnerabilities'] },
      { id: 's5', name: 'Health Probe', description: 'Synthetics', status: 'success', durationSeconds: 10, logs: ['HTTP 200 OK'] },
      { id: 's6', name: 'Production Deploy', description: 'Rolling update', status: 'success', durationSeconds: 22, logs: ['Deployed to cluster'] },
    ],
  },
];

export const DOCKER_IMAGES: DockerImage[] = [
  {
    repository: 'weatherops-frontend',
    tag: 'v1.2.4',
    digest: 'sha256:7c3b8e91d84a123f05b0c946e4e892b1580f4f9a0d2f8314a52c3847e923b081',
    sizeMb: 24.8,
    created: '12 minutes ago',
    architecture: 'linux/amd64',
    vulnerabilities: { critical: 0, high: 0, medium: 1, low: 2 },
  },
  {
    repository: 'weatherops-frontend',
    tag: 'latest',
    digest: 'sha256:7c3b8e91d84a123f05b0c946e4e892b1580f4f9a0d2f8314a52c3847e923b081',
    sizeMb: 24.8,
    created: '12 minutes ago',
    architecture: 'linux/amd64',
    vulnerabilities: { critical: 0, high: 0, medium: 1, low: 2 },
  },
];

export const CONTAINER_SERVICES: ContainerService[] = [
  {
    name: 'weatherops-web',
    image: 'weatherops-frontend:v1.2.4',
    status: 'running',
    health: 'healthy',
    uptime: '4 days 12h',
    ports: ['80:80/tcp'],
    cpuPercent: 1.4,
    memoryMb: 42.8,
    memoryLimitMb: 256,
    restartPolicy: 'unless-stopped',
    volumes: ['/app/nginx.conf -> /etc/nginx/conf.d/default.conf:ro'],
  },
  {
    name: 'weatherops-prometheus',
    image: 'prom/prometheus:v2.50.0',
    status: 'running',
    health: 'healthy',
    uptime: '4 days 12h',
    ports: ['9090:9090/tcp'],
    cpuPercent: 3.2,
    memoryMb: 148.2,
    memoryLimitMb: 1024,
    restartPolicy: 'unless-stopped',
    volumes: ['prometheus_data -> /prometheus'],
  },
  {
    name: 'weatherops-grafana',
    image: 'grafana/grafana:10.3.1',
    status: 'running',
    health: 'healthy',
    uptime: '4 days 12h',
    ports: ['3001:3000/tcp'],
    cpuPercent: 2.1,
    memoryMb: 112.5,
    memoryLimitMb: 512,
    restartPolicy: 'unless-stopped',
    volumes: ['grafana_data -> /var/lib/grafana'],
  },
  {
    name: 'weatherops-node-exporter',
    image: 'prom/node-exporter:v1.7.0',
    status: 'running',
    health: 'healthy',
    uptime: '4 days 12h',
    ports: ['9100:9100/tcp'],
    cpuPercent: 0.8,
    memoryMb: 28.1,
    memoryLimitMb: 128,
    restartPolicy: 'unless-stopped',
    volumes: ['/proc -> /host/proc:ro'],
  },
];