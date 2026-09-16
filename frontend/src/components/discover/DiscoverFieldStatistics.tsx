'use client';

import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import type { LogEntry } from '@/types/discover.types';

export function DiscoverFieldStatistics({ logs }: { logs: LogEntry[] }) {
  const fields = [
    { name: 'service', values: new Set(logs.map(log => log.service)).size, top: logs[0]?.service ?? '—' },
    { name: 'level', values: new Set(logs.map(log => log.level)).size, top: logs[0]?.level ?? '—' },
    { name: 'host', values: new Set(logs.map(log => log.host)).size, top: logs[0]?.host ?? '—' },
    { name: 'message', values: new Set(logs.map(log => log.message)).size, top: logs[0]?.message ?? '—' },
  ];
  return <Box sx={{ p: 1.5 }}>
    <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'center'}}>
      <AnalyticsOutlinedIcon fontSize="small" color="primary" />
      <Typography sx={{ fontWeight: 650 }}>Field statistics</Typography>
      <Chip size="small" label={`${logs.length.toLocaleString()} documents`} />
    </Stack>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 1 }}>
      {fields.map(field => <Paper key={field.name} variant="outlined" sx={{ p: 1.5 }}>
        <Typography sx={{ fontFamily: 'var(--font-mono), monospace', fontSize: 12 }}>{field.name}</Typography>
        <Typography variant="h6" sx={{ mt: .5 }}>{field.values.toLocaleString()}</Typography>
        <Typography variant="caption" color="text.secondary">unique values · example: {field.top}</Typography>
      </Paper>)}
    </Box>
  </Box>;
}
