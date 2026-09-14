export type StatId = 'events' | 'uptime' | 'latency' | 'alerts';

export interface StatMetric {
  id: StatId;
  value: string;
  deltaPct?: number;
  trend?: 'up' | 'down' | 'flat';
}

export interface TimeSeriesPoint {
  label: string;
  value: number;
}

export interface CategoryValue {
  category: string;
  value: number;
}

export interface DashboardSummary {
  stats: StatMetric[];
  eventsOverTime: TimeSeriesPoint[];
  topSources: CategoryValue[];
  statusBreakdown: CategoryValue[];
}
