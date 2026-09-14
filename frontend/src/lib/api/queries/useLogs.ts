import { useQuery } from '@tanstack/react-query';
import { discoverService, type GetLogsParams } from '@/lib/api/services/discover.service';

/**
 * Same idea as useDashboardSummary — wired up and ready. The Discover page
 * renders mock log data until a real backend is available; switch it to
 * this hook once GET /discover/logs exists.
 */
export function useLogs(params: GetLogsParams) {
  return useQuery({
    queryKey: ['discover', 'logs', params],
    queryFn: () => discoverService.getLogs(params),
  });
}
