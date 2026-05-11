import { fetchJson } from './http';

export type DataSourceStatus = 'active' | 'warning' | 'outdated';

export interface DataSource {
  id: string;
  label: string;
  provider: string;
  year: string;
  status?: DataSourceStatus;
  reliabilityScore?: number;
  reliabilityStatus?: DataSourceStatus;
  validationStatus?: string;
}

export interface DatasetStatus extends DataSource {
  lastUpdated: string;
  version: string;
  rows: number;
  size: string;
  sourceUrl?: string;
  updateCycle?: string;
}

export interface SpringDataSourceResponse {
  dataSourceId: number | null;
  datasetId: number | null;
  sourceName: string | null;
  provider: string | null;
  sourceType: string | null;
  baseDate: string | null;
  lastUpdatedAt: string | null;
  datasetStatus: string | null;
  reliabilityScore: number | null;
  reliabilityStatus: string | null;
  validationStatus: string | null;
}

export interface SpringDatasetResponse {
  datasetId: number | null;
  datasetCode: string | null;
  datasetName: string | null;
  provider: string | null;
  sourceUrl: string | null;
  updateCycle: string | null;
  status: string | null;
  lastUpdatedAt: string | null;
  version: string | null;
  rows: number | null;
  reliabilityStatus: string | null;
  validationStatus: string | null;
}

export interface SpringValidationResultResponse {
  validationResultId: number | null;
  dataSnapshotId: number | null;
  status: string;
  missingCount: number | null;
  invalidCount: number | null;
  duplicateCount: number | null;
  message: string;
  level: string;
}

export const MOCK_RESULT_DATA_SOURCES: DataSource[] = [
  { id: 'housing-stat', label: '서울시 주거비 통계', provider: '서울열린데이터광장', year: '2024', status: 'active' },
  { id: 'commute-time', label: '통근 시간 분석', provider: '서울연구원', year: '2023', status: 'active' },
  { id: 'childcare-cost', label: '보육비 지원 현황', provider: '서울시 보육포털', year: '2024', status: 'active' },
  { id: 'cashflow-model', label: '현금흐름 모델', provider: '금융감독원', year: '2024', status: 'active' },
];

export const MOCK_DATASET_STATUSES: DatasetStatus[] = [
  { id: 'rent', label: '서울시 자치구별 전월세 현황', provider: '서울열린데이터광장', lastUpdated: '2025-05-01', version: 'v2.4.1', status: 'active', rows: 1250, size: '2.4 MB', year: '2025' },
  { id: 'commute', label: '통근 시간 분석 데이터', provider: '서울연구원', lastUpdated: '2025-04-15', version: 'v1.8.0', status: 'active', rows: 840, size: '1.1 MB', year: '2025' },
  { id: 'childcare', label: '보육비 지원 정책 DB', provider: '서울시 보육포털', lastUpdated: '2025-05-03', version: 'v3.1.0', status: 'active', rows: 320, size: '0.6 MB', year: '2025' },
  { id: 'facility', label: '자치구별 생활 편의시설', provider: '국토교통부', lastUpdated: '2025-03-20', version: 'v1.2.3', status: 'warning', rows: 4200, size: '8.7 MB', year: '2025' },
  { id: 'cashflow', label: '현금흐름 모델 파라미터', provider: '금융감독원', lastUpdated: '2025-04-28', version: 'v2.0.0', status: 'active', rows: 150, size: '0.3 MB', year: '2025' },
  { id: 'youth-policy', label: '청년 정책 지원금 현황', provider: '청년정책조정실', lastUpdated: '2025-02-10', version: 'v1.5.2', status: 'outdated', rows: 280, size: '0.5 MB', year: '2025' },
  { id: 'care-center', label: '공동육아나눔터 위치 DB', provider: '서울시 여성가족재단', lastUpdated: '2025-04-30', version: 'v1.1.0', status: 'active', rows: 95, size: '0.2 MB', year: '2025' },
];

export function getMockResultDataSources(): DataSource[] {
  return MOCK_RESULT_DATA_SOURCES;
}

export function getMockDatasetStatuses(): DatasetStatus[] {
  return MOCK_DATASET_STATUSES;
}

function normalizeStatus(status: string | null | undefined): DataSourceStatus {
  if (status === 'active' || status === 'warning' || status === 'outdated') return status;
  return 'warning';
}

function yearFromDate(value: string | null | undefined): string {
  return value?.slice(0, 4) || '-';
}

function toDatasetStatus(dataset: SpringDatasetResponse): DatasetStatus {
  const lastUpdated = dataset.lastUpdatedAt ?? '';
  return {
    id: String(dataset.datasetId ?? dataset.datasetCode ?? ''),
    label: dataset.datasetName ?? dataset.datasetCode ?? '-',
    provider: dataset.provider ?? '-',
    year: yearFromDate(lastUpdated),
    lastUpdated,
    version: dataset.version ?? '-',
    rows: dataset.rows ?? 0,
    size: '-',
    status: normalizeStatus(dataset.status),
    reliabilityStatus: normalizeStatus(dataset.reliabilityStatus),
    validationStatus: dataset.validationStatus ?? undefined,
    sourceUrl: dataset.sourceUrl ?? undefined,
    updateCycle: dataset.updateCycle ?? undefined,
  };
}

function toDataSource(source: SpringDataSourceResponse): DataSource {
  const lastUpdated = source.lastUpdatedAt ?? source.baseDate ?? '';
  return {
    id: String(source.dataSourceId ?? source.datasetId ?? ''),
    label: source.sourceName ?? '-',
    provider: source.provider ?? '-',
    year: yearFromDate(lastUpdated),
    status: normalizeStatus(source.datasetStatus),
    reliabilityScore: source.reliabilityScore ?? undefined,
    reliabilityStatus: normalizeStatus(source.reliabilityStatus),
    validationStatus: source.validationStatus ?? undefined,
  };
}

export function fetchDatasetStatuses(): Promise<DatasetStatus[]> {
  return fetchJson<SpringDatasetResponse[]>('/data/datasets')
    .then((datasets) => datasets.map(toDatasetStatus));
}

export function fetchDataSources(): Promise<DataSource[]> {
  return fetchJson<SpringDataSourceResponse[]>('/data/sources')
    .then((sources) => sources.map(toDataSource));
}

export function fetchValidationResults(dataSnapshotId?: number): Promise<SpringValidationResultResponse[]> {
  const path = dataSnapshotId == null ? '/data/validations' : `/data/validations/${dataSnapshotId}`;
  return fetchJson<SpringValidationResultResponse[]>(path);
}
