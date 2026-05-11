import { fetchJson } from './http';
import type { DatasetStatus } from './dataApi';
import { fetchValidationResults, getMockDatasetStatuses, type SpringValidationResultResponse } from './dataApi';

export type ServiceStatus = 'normal' | 'warning' | 'error';
export type LogLevel = 'error' | 'warn' | 'info' | 'success';

export interface ServiceMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  status: ServiceStatus;
  max: number;
}

export interface AiServiceStatus {
  id: string;
  label: string;
  status: ServiceStatus;
  latencyMs: number;
  updatedAt: string;
}

export interface ValidationLog {
  id: string;
  level: LogLevel;
  message: string;
  source: string;
  time: string;
  actor: string;
}

export interface AdminDashboardSummary {
  activeUsers: number;
  totalSimulations: number;
  averageRiskScore: number;
  errorRate: number;
}

export interface DataOperationStatus {
  status: ServiceStatus;
  datasetCount: number;
  validationWarningCount: number;
  lastValidatedAt: string;
}

export interface RecommendationStatus {
  status: ServiceStatus;
  promptVersion: string;
  recommendationVersion: string;
  updatedAt: string;
}

export interface AdminDashboardResponse {
  summary: AdminDashboardSummary;
  serviceStatuses: ServiceMetric[];
  aiStatuses: AiServiceStatus[];
  dataOperation: DataOperationStatus;
  promptRecommendation: RecommendationStatus;
}

export const MOCK_SERVICE_METRICS: ServiceMetric[] = [
  { id: 'cpu', label: 'CPU 사용률', value: 34, unit: '%', status: 'normal', max: 100 },
  { id: 'memory', label: '메모리', value: 62, unit: '%', status: 'warning', max: 100 },
  { id: 'latency', label: '응답시간', value: 48, unit: 'ms', status: 'normal', max: 200 },
  { id: 'network', label: '네트워크', value: 128, unit: 'KB/s', status: 'normal', max: 1000 },
];

export const MOCK_AI_STATUSES: AiServiceStatus[] = [
  { id: 'gateway', label: 'AI Gateway', status: 'normal', latencyMs: 82, updatedAt: '방금 전' },
  { id: 'recommendation', label: '추천 모델', status: 'normal', latencyMs: 144, updatedAt: '1분 전' },
  { id: 'explanation', label: '해석 생성', status: 'warning', latencyMs: 310, updatedAt: '3분 전' },
];

export const MOCK_VALIDATION_LOGS: ValidationLog[] = [
  { id: 'LOG-9482', level: 'error', message: 'calculateRisk: 주거비 비율 계산에서 NaN 감지', source: 'Results.tsx', time: '14:22:31', actor: 'SIM-2841' },
  { id: 'LOG-9481', level: 'warn', message: '자치구 임대료 데이터 누락, 평균값으로 대체', source: 'DataSync', time: '14:19:05', actor: 'SYSTEM' },
  { id: 'LOG-9480', level: 'info', message: 'A/B 시나리오 비교 완료', source: 'Scenario', time: '14:17:52', actor: 'SIM-2838' },
  { id: 'LOG-9478', level: 'success', message: '데이터셋 동기화 완료: 전월세 현황 v2.4.1', source: 'DataSync', time: '14:10:00', actor: 'SYSTEM' },
];

export function getMockServiceMetrics(): ServiceMetric[] {
  return MOCK_SERVICE_METRICS;
}

export function getMockAiStatuses(): AiServiceStatus[] {
  return MOCK_AI_STATUSES;
}

export function getMockValidationLogs(): ValidationLog[] {
  return MOCK_VALIDATION_LOGS;
}

export function getMockAdminDatasets(): DatasetStatus[] {
  return getMockDatasetStatuses();
}

function normalizeServiceStatus(status: string | null | undefined): ServiceStatus {
  if (status === 'normal' || status === 'warning' || status === 'error') return status;
  return 'warning';
}

function normalizeLogLevel(level: string | null | undefined): LogLevel {
  if (level === 'error' || level === 'warn' || level === 'info' || level === 'success') return level;
  return 'info';
}

function toServiceMetric(metric: ServiceMetric): ServiceMetric {
  return {
    ...metric,
    status: normalizeServiceStatus(metric.status),
  };
}

function toAiStatus(status: AiServiceStatus): AiServiceStatus {
  return {
    ...status,
    status: normalizeServiceStatus(status.status),
  };
}

function toDataOperationStatus(status: DataOperationStatus): DataOperationStatus {
  return {
    ...status,
    status: normalizeServiceStatus(status.status),
  };
}

function toRecommendationStatus(status: RecommendationStatus): RecommendationStatus {
  return {
    ...status,
    status: normalizeServiceStatus(status.status),
  };
}

function toValidationLog(result: SpringValidationResultResponse): ValidationLog {
  return {
    id: result.validationResultId == null ? `SNAPSHOT-${result.dataSnapshotId ?? 'UNKNOWN'}` : `VAL-${result.validationResultId}`,
    level: normalizeLogLevel(result.level),
    message: result.message,
    source: result.dataSnapshotId == null ? 'DataValidation' : `Snapshot ${result.dataSnapshotId}`,
    time: '',
    actor: 'SYSTEM',
  };
}

export function fetchAdminSummary(): Promise<AdminDashboardSummary> {
  return fetchJson<AdminDashboardSummary>('/admin/summary');
}

export function fetchAdminDashboard(): Promise<AdminDashboardResponse> {
  return fetchJson<AdminDashboardResponse>('/admin/dashboard')
    .then((dashboard) => ({
      summary: dashboard.summary,
      serviceStatuses: dashboard.serviceStatuses.map(toServiceMetric),
      aiStatuses: dashboard.aiStatuses.map(toAiStatus),
      dataOperation: toDataOperationStatus(dashboard.dataOperation),
      promptRecommendation: toRecommendationStatus(dashboard.promptRecommendation),
    }));
}

export function fetchServiceStatuses(): Promise<ServiceMetric[]> {
  return fetchJson<ServiceMetric[]>('/admin/services')
    .then((metrics) => metrics.map(toServiceMetric));
}

export function fetchAiStatuses(): Promise<AiServiceStatus[]> {
  return fetchJson<AiServiceStatus[]>('/admin/ai/status')
    .then((statuses) => statuses.map(toAiStatus));
}

export function fetchDataOperationStatus(): Promise<DataOperationStatus> {
  return fetchJson<DataOperationStatus>('/admin/data/status')
    .then(toDataOperationStatus);
}

export function fetchRecommendationStatus(): Promise<RecommendationStatus> {
  return fetchJson<RecommendationStatus>('/admin/recommendations/status')
    .then(toRecommendationStatus);
}

export function fetchValidationLogs(): Promise<ValidationLog[]> {
  return fetchValidationResults()
    .then((results) => results.map(toValidationLog));
}
