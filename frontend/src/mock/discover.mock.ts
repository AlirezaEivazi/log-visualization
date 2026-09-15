import type { LogEntry, LogLevel } from '@/types/discover.types';

const SERVICES = ['checkout-service', 'auth-service', 'api-gateway', 'search-service', 'notifications'];
const HOSTS = ['ip-10-0-1-12', 'ip-10-0-1-45', 'ip-10-0-2-08', 'ip-10-0-2-91'];
const LEVELS: LogLevel[] = ['info', 'info', 'info', 'debug', 'warn', 'error'];

const MESSAGES: Record<LogLevel, string[]> = {
  debug: ['cache lookup miss for key', 'connection pool size adjusted', 'trace span started'],
  info: [
    'request completed successfully',
    'user session created',
    'scheduled job finished',
    'payment captured',
  ],
  warn: ['retrying request after timeout', 'queue depth above threshold', 'deprecated field used in payload'],
  error: ['unhandled exception while processing request', 'upstream service returned 503', 'database connection refused'],
};

function pick<T>(arr: T[], seed: number): T {
  const item = arr[seed % arr.length];
  if (item === undefined) {
    throw new Error('pick() called with an empty array');
  }
  return item;
}

/**
 * Deterministic mock log stream so the Discover table has ~120 rows to
 * page/filter through without needing a backend. Swap for `useLogs()`
 * (src/lib/api/queries/useLogs.ts) once a real log API is available.
 */
export const mockLogs: LogEntry[] = Array.from({ length: 120 }).map((_, i) => {
  const level = pick(LEVELS, i);
  const timestamp = new Date(Date.UTC(2026, 8, 15, 15, 30, 0) - i * 47_000).toISOString();
  return {
    id: `log-${i}`,
    timestamp,
    level,
    service: pick(SERVICES, i * 3 + 1),
    host: pick(HOSTS, i * 5 + 2),
    message: pick(MESSAGES[level], i * 7 + 3),
  };
});
