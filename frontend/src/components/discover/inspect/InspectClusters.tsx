'use client';

import * as React from 'react';
import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import type { InspectResponseContext } from './inspect.types';

export function InspectClusters({ response }: { response: InspectResponseContext }) {
  return (
    <Stack spacing={0}>
      <Box sx={{ px: 1, py: 1.5 }}>
        <Typography variant="subtitle2">Clusters and shards</Typography>
        <Typography variant="caption" color="text.secondary">
          Elasticsearch clusters and shards involved in this request.
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ px: 1, py: 1.25 }}>
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <StorageOutlinedIcon fontSize="small" color="action" />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>logs-benchmark</Typography>
            <Typography variant="caption" color="text.secondary">Primary cluster · 1 shard queried</Typography>
          </Box>
          <Chip icon={<CheckCircleIcon />} label="Successful" size="small" color="success" variant="outlined" />
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, p: 1 }}>
        {[
          ['Total', '1'],
          ['Successful', '1'],
          ['Skipped', '0'],
          ['Failed', '0'],
        ].map(([label, value]) => (
          <Box key={label} sx={{ p: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25 }}>{label === 'Total' ? response.returned > 0 ? value : '0' : value}</Typography>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
