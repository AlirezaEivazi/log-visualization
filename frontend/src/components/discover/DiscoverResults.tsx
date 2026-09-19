'use client';

import * as React from 'react';
import { Box, Chip, IconButton, MenuItem, Paper, Select, Stack, Tooltip, Typography } from '@mui/material';
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined';
import SortIcon from '@mui/icons-material/Sort';
import TuneIcon from '@mui/icons-material/Tune';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import type { LogEntry } from '@/types/discover.types';
import type { CustomDiscoverField, Density, DiscoverMode, DiscoverTabState } from './discover.types';
import { COLUMN_LABELS } from './discover.types';
import { formatDateTime, formatTime } from '@/utils/formatDate';
import { fontMono } from '@/theme/typography';
import { useTheme } from '@mui/material/styles';

interface Props {
  logs: LogEntry[];
  tab: DiscoverTabState;
  density: Density;
  mode: DiscoverMode;
  page: number;
  rowsPerPage: number;
  onPage: (page: number) => void;
  onRowsPerPage: (rows: number) => void;
  onOpenDocument: (log: LogEntry) => void;
  onColumns: () => void;
  onSort: () => void;
  onDisplay: () => void;
  onFullscreen: () => void;
  customFields: CustomDiscoverField[];
}

function summary(log: LogEntry) {
  return `created_at ${formatDateTime(log.timestamp)}  id ${log.id.replace('log-', '')}  level ${log.level.toUpperCase()}  message ${log.message}  service ${log.service}  host ${log.host}  _id ${log.id}  _index logs-benchmark  _score (null)`;
}

export function DiscoverResults({ logs, tab, density, mode, page, rowsPerPage, onPage, onRowsPerPage, onOpenDocument, onColumns, onSort, onDisplay, onFullscreen, customFields }: Props) {
  const theme = useTheme();
  const start = page * rowsPerPage;
  const visible = logs.slice(start, start + rowsPerPage);
  const totalPages = Math.max(1, Math.ceil(logs.length / rowsPerPage));
  const cellFont = density === 'compact' ? 11 : density === 'expanded' ? 13 : 12;
  const columns = tab.columns.length ? tab.columns : ['timestamp', 'summary'];

  return <Paper variant="outlined" sx={{ borderRadius: 0, flex: 1, minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
    <Box sx={{ minHeight: 48, px: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 650, color: 'primary.main', fontSize: 14 }}>{mode === 'classic' ? 'Documents' : 'Results'}</Typography>
        <Chip size="small" label={logs.length.toLocaleString()} sx={{ height: 22 }} />
      </Stack>
      <Stack direction="row" spacing={.25}>
        <Tooltip title="Sort fields"><IconButton size="small" onClick={onSort}><SortIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Columns"><IconButton size="small" onClick={onColumns}><ViewColumnOutlinedIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Display options"><IconButton size="small" onClick={onDisplay}><TuneIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Search in results"><IconButton size="small"><SearchIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Fullscreen"><IconButton size="small" onClick={onFullscreen}><FullscreenIcon fontSize="small" /></IconButton></Tooltip>
      </Stack>
    </Box>
    <Box sx={{
      flex: 1,
      minHeight: 0,
      minWidth: 0,
      overflow: 'auto',
      bgcolor: 'background.paper',
      '& thead th': {
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
      '& tbody tr:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    }}>
      <table style={{ width: '100%', minWidth: columns.length <= 2 ? 850 : 980, borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead><tr>
          <th style={{ width: 40, borderBottom: `1px solid ${theme.palette.divider}`, background: theme.palette.background.default }} />
          {columns.map(column => <th key={column} style={{ position: 'sticky', top: 0, zIndex: 2, width: column === 'summary' || column === 'message' ? 620 : 145, textAlign: 'left', padding: '9px 10px', borderBottom: `1px solid ${theme.palette.divider}`, fontSize: 12, fontWeight: 700, background: theme.palette.background.default, color: theme.palette.text.primary, boxShadow: `inset 0 -1px 0 ${theme.palette.divider}` }}>{COLUMN_LABELS[column] ?? column}</th>)}
        </tr></thead>
        <tbody>
          {visible.map(log => <tr key={log.id} style={{ borderBottom: '1px solid rgba(148,163,184,.14)' }}>
            <td style={{ textAlign: 'center', verticalAlign: 'top' }}><IconButton size="small" onClick={() => onOpenDocument(log)}><KeyboardArrowDownIcon fontSize="small" /></IconButton></td>
            {columns.map(column => <td key={column} title={String(log[column as keyof LogEntry] ?? '')} style={{ padding: density === 'expanded' ? '11px 10px' : '7px 10px', verticalAlign: 'top', fontSize: cellFont, lineHeight: 1.5, whiteSpace: column === 'summary' || column === 'message' ? 'normal' : 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: column === 'timestamp' || column === 'summary' ? fontMono : 'inherit' }}>
              {column === 'timestamp' ? formatTime(log.timestamp) : column === 'summary' ? summary(log) : column === 'level' ? <Chip size="small" label={log.level.toUpperCase()} color={log.level === 'error' ? 'error' : log.level === 'warn' ? 'warning' : 'default'} sx={{ height: 20, fontSize: 10, fontWeight: 700 }} /> : customFields.find(field => field.name === column)?.value ?? String(log[column as keyof LogEntry] ?? '')}
            </td>)}
          </tr>)}
        </tbody>
      </table>
    </Box>
    <Box sx={{ minHeight: 48, px: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: 1, borderColor: 'divider' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">Rows per page</Typography>
        <Select size="small" value={rowsPerPage} onChange={e => { onRowsPerPage(Number(e.target.value)); onPage(0); }} sx={{ height: 30, minWidth: 75 }}>
          <MenuItem value={25}>25</MenuItem><MenuItem value={50}>50</MenuItem><MenuItem value={100}>100</MenuItem>
        </Select>
      </Stack>
      <Stack direction="row" spacing={.25} sx={{ alignItems: 'center' }}>
        <IconButton size="small" disabled={page === 0} onClick={() => onPage(page - 1)}>‹</IconButton>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => <IconButton key={i} size="small" color={page === i ? 'primary' : 'default'} onClick={() => onPage(i)}>{i + 1}</IconButton>)}
        <IconButton size="small" disabled={page >= totalPages - 1} onClick={() => onPage(page + 1)}>›</IconButton>
      </Stack>
    </Box>
  </Paper>;
}
