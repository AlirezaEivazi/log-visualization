import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/lib/api/services/dashboard.service';

/**
 * Ready to use against the real backend: `useDashboardSummary()` gives you
 * `{ data, isLoading, isError, error }` exactly like any other React Query
 * hook. The Dashboards page currently renders mock data (see src/mock) so
 * the UI has something to show out of the box — swap it for this hook once
 * NEXT_PUBLIC_API_BASE_URL points at a real backend implementing
 * GET /dashboard/summary.
 */
export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: dashboardService.getSummary,
  });
}
