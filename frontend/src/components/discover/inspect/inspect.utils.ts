import type { LogEntry } from '@/types/discover.types';
import type {
  InspectRequestContext,
  InspectRequestItem,
  InspectResponseContext,
} from './inspect.types';

export function buildRequestItems(context: InspectRequestContext): InspectRequestItem[] {
  return [
    {
      id: 'documents',
      label: 'Documents',
      description: `This request queries ${context.dataView} to fetch the documents.`,
      durationMs: 194,
      kind: 'documents',
    },
    {
      id: 'field-statistics',
      label: 'Field statistics',
      description: 'This request calculates field-level statistics for the current Discover view.',
      durationMs: 53,
      kind: 'field-statistics',
    },
  ];
}

export function buildRequestPayload(context: InspectRequestContext, request: InspectRequestItem) {
  if (request.kind === 'field-statistics') {
    return {
      index: context.dataView,
      body: {
        size: 0,
        query: buildQuery(context),
        aggs: {
          fields: {
            terms: {
              field: 'service.keyword',
              size: 20,
            },
          },
        },
      },
    };
  }

  if (context.mode === 'esql') {
    return {
      query: context.query || `FROM ${context.dataView} | LIMIT ${context.size}`,
      params: {
        time_range: context.timeRange,
        filters: context.filters.filter(f => f.enabled),
      },
    };
  }

  return {
    index: context.dataView,
    body: {
      size: context.size,
      query: buildQuery(context),
      sort: [{ [context.sort.field]: { order: context.sort.direction } }],
    },
  };
}

function buildQuery(context: InspectRequestContext) {
  return {
    bool: {
      must: context.query
        ? [{ query_string: { query: context.query } }]
        : [{ match_all: {} }],
      filter: context.filters.filter(f => f.enabled).map(f =>
        f.operator === '='
          ? { term: { [f.field]: f.value } }
          : { bool: { must_not: [{ term: { [f.field]: f.value } }] } },
      ),
    },
  };
}

export function buildResponsePayload(response: InspectResponseContext, request: InspectRequestItem) {
  if (request.kind === 'field-statistics') {
    return {
      took: request.durationMs,
      timed_out: false,
      aggregations: {
        fields: {
          buckets: [
            { key: 'api-service', doc_count: response.total },
            { key: 'database-service', doc_count: Math.max(0, Math.floor(response.total * 0.72)) },
            { key: 'search-service', doc_count: Math.max(0, Math.floor(response.total * 0.46)) },
          ],
        },
      },
    };
  }

  return {
    took: request.durationMs,
    timed_out: false,
    _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
    hits: {
      total: {
        value: response.total,
        relation: 'eq',
      },
      max_score: null,
      hits: response.rows.map((row: LogEntry, index) => ({
        _index: 'logs-benchmark',
        _id: row.id,
        _version: 1,
        _score: null,
        fields: {
          created_at: [row.timestamp],
          id: [row.id],
          level: [row.level],
          service: [row.service],
          message: [row.message],
        },
        sort: [index],
      })),
    },
  };
}

export function buildStatisticsPayload(
  request: InspectRequestContext,
  response: InspectResponseContext,
  requestItem: InspectRequestItem,
) {
  const generateSearchId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateDataViewId = () => {
    return 'discover-observability-solution-all-logs';
  };

  const generateTimestamp = () => {
    const now = new Date();
    return now.toISOString();
  };

  return [
    { label: 'Hits', value: response.returned.toLocaleString() },
    { label: 'Data view', value: request.dataView },
    { label: 'Data view ID', value: generateDataViewId() },
    { label: 'Query time', value: `${requestItem.durationMs}ms` },
    { label: 'Request timestamp', value: generateTimestamp() },
  ];
}

export function stringifyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}
