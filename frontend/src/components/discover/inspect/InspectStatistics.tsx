'use client';

import * as React from 'react';
import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
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
    'Data view ID': t.discover.inspector.dataViewId || 'Data view ID',
    'Query time': t.discover.inspector.queryTime,
    'Request timestamp': t.discover.inspector.requestTimestamp || 'Request timestamp',
    'Kibana API route': t.discover.inspector.apiRoute,
    'Time range': t.discover.inspector.timeRange,
  };

  const tooltips: Record<string, string> = {
    'Hits': 'The number of documents returned by the query',
    'Query time': 'The time it took to process the query',
    'Data view ID': 'The unique identifier for this data view',
  };

  return (
    <Stack spacing={0}>
      {stats.map((stat, index) => (
        <React.Fragment key={stat.label}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 0.65fr) minmax(0, 1.35fr)', gap: 2, px: 1.5, py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                {labels[stat.label] ?? stat.label}
              </Typography>
              {tooltips[stat.label] && (
                <Tooltip title={tooltips[stat.label]} placement="top">
                  <HelpOutlineOutlinedIcon sx={{ fontSize: 15, color: 'text.disabled', cursor: 'help' }} />
                </Tooltip>
              )}
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                wordBreak: 'break-word',
                fontSize: '13px',
                color: ['Data view', 'Data view ID'].includes(stat.label) ? 'primary.main' : 'text.primary'
              }}
            >
              {stat.value}
            </Typography>
          </Box>
          {index < stats.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Stack>
  );
}
