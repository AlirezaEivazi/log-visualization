'use client';
import { Box, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { alpha, useTheme } from '@mui/material/styles';

export function DiscoverChart({ data, count, onHide }: { data: number[]; count: number; onHide: () => void }) {
  const theme = useTheme();
  const max = Math.max(...data, 1);
  return <Paper variant="outlined" sx={{ mb: 1, overflow: 'hidden' }}>
    <Box sx={{ px: 1.25, pt: .75, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="caption" color="text.secondary">{count.toLocaleString()} events</Typography>
      <Tooltip title="Collapse chart"><IconButton size="small" onClick={onHide}><KeyboardArrowUpIcon fontSize="small" /></IconButton></Tooltip>
    </Box>
    <Box sx={{ height: 108, px: 1.5, pt: 1, display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
      {data.map((value, index) => <Box key={index} sx={{ flex: 1, minWidth: 2, height: `${Math.max(4, value / max * 100)}%`, bgcolor: alpha(theme.palette.primary.main, index > data.length - 7 ? .9 : .5), borderRadius: '2px 2px 0 0' }} />)}
    </Box>
  </Paper>;
}
