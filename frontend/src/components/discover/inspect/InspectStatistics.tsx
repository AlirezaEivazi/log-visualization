'use client';

import * as React from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import type { InspectRequestContext, InspectRequestItem, InspectResponseContext } from './inspect.types';
import { buildStatisticsPayload } from './inspect.utils';

interface InspectStatisticsProps {
  request: InspectRequestContext;
  response: InspectResponseContext;
  requestItem: InspectRequestItem;
}

export function InspectStatistics({ request, response, requestItem }: InspectStatisticsProps) {
  const stats = React.useMemo(() => buildStatisticsPayload(request, response, requestItem), [request, response, requestItem]);

  return (
    <Stack spacing={0}>
      {stats.map((stat, index) => (
        <React.Fragment key={stat.label}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(170px, 0.7fr) minmax(0, 1.3fr)', gap: 2, px: 1, py: 1.35 }}>
            <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>{stat.value}</Typography>
          </Box>
          {index < stats.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Stack>
  );
}
