import type { LogEntry } from '@/types/discover.types';

export type InspectMode = 'classic' | 'esql';
export type InspectTab = 'statistics' | 'clusters' | 'request' | 'response';
export type InspectView = 'requests' | 'profiles';

export interface InspectFilter {
  id: string;
  field: string;
  operator: '=' | '!=';
  value: string;
  enabled: boolean;
}

export interface InspectRequestContext {
  dataView: string;
  query: string;
  mode: InspectMode;
  timeRange: string;
  filters: InspectFilter[];
  size: number;
  sort: {
    field: keyof LogEntry;
    direction: 'asc' | 'desc';
  };
}

export interface InspectResponseContext {
  total: number;
  returned: number;
  rows: LogEntry[];
}

export interface InspectRequestItem {
  id: string;
  label: string;
  description: string;
  durationMs: number;
  kind: 'documents' | 'field-statistics';
}
