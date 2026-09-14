import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { DashboardSummary } from '@/types/dashboard.types';

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await axiosInstance.get<DashboardSummary>(API_ENDPOINTS.dashboard.summary);
    return data;
  },
};
