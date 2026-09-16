'use client';

import * as React from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import type { InspectRequestContext, InspectRequestItem, InspectResponseContext } from './inspect.types';
import { buildStatisticsPayload } from './inspect.utils';
import { useTranslation } from '@/i18n/useTranslation';

interface InspectStatisticsProps {
  request: InspectRequestContext;
  response: InspectResponseContext;
  requestItem: InspectRequestItem;
}

export function InspectStatistics({ request, response, requestItem }: InspectStatisticsProps) {
  const { t } = useTranslation();
  const stats = React.useMemo(() => buildStatisticsPayload(request, response, requestItem), [request, response, requestItem]);

  const labels: Record<string, string> = {
    Hits: t.discover.inspector.hits,
    'Hits (total)': t.discover.inspector.hitsTotal,
    'Data view': t.discover.inspector.dataView,
    'Query time': t.discover.inspector.queryTime,
    'Kibana API route': t.discover.inspector.apiRoute,
    'Time range': t.discover.inspector.timeRange,
  };

  return (
    <Stack spacing={0}>
      {stats.map((stat, index) => (
        <React.Fragment key={stat.label}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(170px, 0.7fr) minmax(0, 1.3fr)', gap: 2, px: 1, py: 1.35 }}>
            <Typography variant="body2" color="text.secondary">{labels[stat.label] ?? stat.label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-word', color: ['Data view', 'Data view ID', 'Kibana API route'].includes(stat.label) ? 'primary.main' : 'text.primary' }}>{stat.value}</Typography>
          </Box>
          {index < stats.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Stack>
  );
}
