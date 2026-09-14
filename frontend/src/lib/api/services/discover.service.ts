import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { LogEntry } from '@/types/discover.types';
import type { PaginatedResponse } from '@/types/api.types';

export interface GetLogsParams {
  query?: string;
  page?: number;
  pageSize?: number;
}

export const discoverService = {
  async getLogs(params: GetLogsParams = {}): Promise<PaginatedResponse<LogEntry>> {
    const { data } = await axiosInstance.get<PaginatedResponse<LogEntry>>(
      API_ENDPOINTS.discover.logs,
      { params }
    );
    return data;
  },
};
