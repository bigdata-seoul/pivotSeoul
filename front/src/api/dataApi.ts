import { fetchJson } from './http';

export type DataSourceStatus = 'active' | 'warning' | 'outdated';

export interface DataSource {
  id: string;
  label: string;
  provider: string;
  year: string;
  status?: DataSourceStatus;
}

export interface DatasetStatus extends DataSource {
  lastUpdated: string;
  version: string;
  rows: number;
  size: string;
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

export function fetchDatasetStatuses(): Promise<DatasetStatus[]> {
  return fetchJson<DatasetStatus[]>('/data/datasets');
}
