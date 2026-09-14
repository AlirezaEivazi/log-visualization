/**
 * Every backend route the app calls, in one place. Services should never
 * hardcode a path string — they import it from here. When the real backend
 * is ready, this is the only file that needs to match its contract.
 */
export const API_ENDPOINTS = {
  dashboard: {
    summary: '/dashboard/summary',
  },
  discover: {
    logs: '/discover/logs',
  },
  health: {
    check: '/health',
  },
} as const;
