import type { LogEntry } from '@/types/discover.types';

export type FilterOperator = 'is' | 'is not' | 'is one of' | 'exists' | 'does not exist';

export type Filter = {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
  values?: string[]; // For "is one of" operator
  enabled: boolean;
  negate?: boolean;
  label?: string; // Custom display name
};

export type DiscoverMode = 'classic' | 'esql';
export type Density = 'compact' | 'normal' | 'expanded';

export type CustomDiscoverField = {
  name: string;
  type: 'keyword' | 'text' | 'number' | 'date' | 'boolean';
  label?: string;
  description?: string;
  value?: string;
  format?: string;
  popularity?: number;
};

export type DiscoverTabState = {
  id: string;
  title: string;
  query: string;
  dataView: string;
  timeRange: string;
  filters: Filter[];
  columns: string[];
  sort: { field: keyof LogEntry; direction: 'asc' | 'desc' };
  mode: DiscoverMode;
};

export const DISCOVER_FIELDS = [
  { name: 'created_at', type: 'date' },
  { name: 'id', type: 'number' },
  { name: 'level', type: 'keyword' },
  { name: 'message', type: 'text' },
  { name: 'service', type: 'keyword' },
  { name: 'host', type: 'keyword' },
] as const;

export const META_FIELDS = ['_id', '_index', '_ignored', '_score'];

export const COLUMN_LABELS: Record<string, string> = {
  timestamp: '@timestamp',
  summary: 'Summary',
  created_at: 'created_at',
  id: 'id',
  level: 'level',
  service: 'service',
  host: 'host',
  message: 'message',
};
