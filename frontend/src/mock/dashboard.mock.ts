import type { DashboardSummary } from '@/types/dashboard.types';

/**
 * Static stand-in for `dashboardService.getSummary()` so the UI renders
 * meaningfully with no backend attached. See src/lib/api/queries for the
 * live hook — point the Dashboards page at that instead once a real API
 * exists.
 */
export const mockDashboardSummary: DashboardSummary = {
  stats: [
    { id: 'events', value: '128,402', deltaPct: 6.4, trend: 'up' },
    { id: 'uptime', value: '99.97%', deltaPct: 0.02, trend: 'up' },
    { id: 'latency', value: '214 ms', deltaPct: -3.1, trend: 'down' },
    { id: 'alerts', value: '3', deltaPct: 50, trend: 'up' },
  ],
  eventsOverTime: [
    { label: '00:00', value: 320 },
    { label: '02:00', value: 280 },
    { label: '04:00', value: 190 },
    { label: '06:00', value: 240 },
    { label: '08:00', value: 610 },
    { label: '10:00', value: 940 },
    { label: '12:00', value: 1120 },
    { label: '14:00', value: 980 },
    { label: '16:00', value: 1230 },
    { label: '18:00', value: 1040 },
    { label: '20:00', value: 760 },
    { label: '22:00', value: 430 },
  ],
  topSources: [
    { category: 'checkout-service', value: 4210 },
    { category: 'auth-service', value: 3320 },
    { category: 'api-gateway', value: 2870 },
    { category: 'search-service', value: 1950 },
    { category: 'notifications', value: 1120 },
  ],
  statusBreakdown: [
    { category: '2xx', value: 82 },
    { category: '4xx', value: 12 },
    { category: '5xx', value: 6 },
  ],
};
