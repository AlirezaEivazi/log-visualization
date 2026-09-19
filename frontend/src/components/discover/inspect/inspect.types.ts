import type { LogEntry } from '@/types/discover.types';

export type InspectMode = 'classic' | 'esql';
export type InspectTab = 'statistics' | 'clusters' | 'request' | 'response';
export type InspectView = 'requests' | 'profiles';

export type InspectFilterOperator = 'is' | 'is not' | 'is one of' | 'exists' | 'does not exist';

export interface InspectFilter {
  id: string;
  field: string;
  operator: InspectFilterOperator;
  value: string;
  values?: string[];
  enabled: boolean;
  negate?: boolean;
  label?: string;
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
