'use client';

import * as React from 'react';
import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import type { InspectResponseContext } from './inspect.types';
import { useTranslation } from '@/i18n/useTranslation';

export function InspectClusters({ response }: { response: InspectResponseContext }) {
  const { t } = useTranslation();
  const shardSummary = t.discover.inspector.shardsQueried(1);
  return (
    <Stack spacing={0}>
      <Box sx={{ px: 1, py: 1.5 }}>
        <Typography variant="subtitle2">{t.discover.inspector.clusters}</Typography>
        <Typography variant="caption" color="text.secondary">
          {t.discover.inspector.clustersDescription}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ px: 1, py: 1.25 }}>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
          <StorageOutlinedIcon fontSize="small" color="action" />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>logs-benchmark</Typography>
            <Typography variant="caption" color="text.secondary">{t.discover.inspector.primaryCluster} · {shardSummary}</Typography>
          </Box>
          <Chip icon={<CheckCircleIcon />} label={t.discover.inspector.successful} size="small" color="success" variant="outlined" />
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, p: 1 }}>
        {[
          [t.discover.inspector.total, '1'],
          [t.discover.inspector.successful, '1'],
          [t.discover.inspector.skipped, '0'],
          [t.discover.inspector.failed, '0'],
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
