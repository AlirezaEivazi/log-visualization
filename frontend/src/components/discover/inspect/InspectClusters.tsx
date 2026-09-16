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
      <Box sx={{ px: 1.5, py: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>{t.discover.inspector.clusters}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '12px' }}>
          {t.discover.inspector.clustersDescription}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ px: 1.5, py: 1.75 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <StorageOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px' }}>Local cluster</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '12px' }}>{shardSummary}</Typography>
          </Box>
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
            label={t.discover.inspector.successful}
            size="small"
            sx={{
              bgcolor: 'success.light',
              color: 'success.dark',
              fontWeight: 600,
              fontSize: '12px',
              height: 24,
              '& .MuiChip-icon': { color: 'success.main' }
            }}
          />
        </Stack>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ px: 1.5, pb: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: '13px' }}>Shards</Typography>
        <Stack direction="row" spacing={1.5}>
          {[
            [t.discover.inspector.total, '1'],
            [t.discover.inspector.successful, '1 ' + t.discover.inspector.of + ' 1'],
          ].map(([label, value]) => (
            <Box key={label} sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', display: 'block', mb: 0.5 }}>{label}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px' }}>{value}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
