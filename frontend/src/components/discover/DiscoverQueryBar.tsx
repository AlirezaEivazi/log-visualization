'use client';

import * as React from 'react';
import { Box, Chip, FormControl, IconButton, InputAdornment, MenuItem, Select, Stack, TextField, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import type { DiscoverMode, DiscoverTabState } from './discover.types';

interface Props {
  tab: DiscoverTabState;
  queryDraft: string;
  onQueryChange: (value: string) => void;
  onQueryRun: () => void;
  onTabChange: (patch: Partial<DiscoverTabState>) => void;
  onAddFilter: () => void;
  onRefresh: () => void;
}

export function DiscoverQueryBar({ tab, queryDraft, onQueryChange, onQueryRun, onTabChange, onAddFilter, onRefresh }: Props) {
  const esql = tab.mode === 'esql';
  return (
    <Box sx={{ px: 1, py: .75, borderBottom: 1, borderColor: 'divider' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={.5} sx={{ '& > *': { minWidth: 0 }, alignItems: { xs: 'stretch', md: 'center' } }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select value={tab.dataView} onChange={e => onTabChange({ dataView: e.target.value })} displayEmpty>
            <MenuItem value="logs-*">All logs</MenuItem>
            <MenuItem value="logs-benchmark">logs-benchmark</MenuItem>
            <MenuItem value="app-logs-*">app-logs-*</MenuItem>
            <MenuItem value="audit-*">audit-*</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Add filter"><IconButton size="small" onClick={onAddFilter}><AddIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="More query options"><IconButton size="small"><MoreVertIcon fontSize="small" /></IconButton></Tooltip>
        <TextField
          fullWidth
          size="small"
          value={queryDraft}
          onChange={e => onQueryChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onQueryRun(); }}
          placeholder={esql ? 'FROM logs-* | WHERE level == "error"' : 'Filter your data using KQL syntax'}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
              endAdornment: <InputAdornment position="end"><Chip size="small" label={esql ? 'ES|QL' : 'KQL'} variant="outlined" /></InputAdornment>,
            },
          }}
        />
        <Tooltip title="Refresh"><IconButton color="primary" onClick={onRefresh}><RefreshIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Run query"><IconButton color="primary" onClick={onQueryRun}><PlayArrowIcon fontSize="small" /></IconButton></Tooltip>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select value={tab.timeRange} onChange={e => onTabChange({ timeRange: e.target.value })} startAdornment={<AccessTimeIcon sx={{ fontSize: 17, ml: .5, mr: .25 }} />}>
            <MenuItem value="Last 15 minutes">Last 15 minutes</MenuItem>
            <MenuItem value="Last 1 hour">Last 1 hour</MenuItem>
            <MenuItem value="Last 24 hours">Last 24 hours</MenuItem>
            <MenuItem value="Last 7 days">Last 7 days</MenuItem>
            <MenuItem value="Custom">Custom…</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}
