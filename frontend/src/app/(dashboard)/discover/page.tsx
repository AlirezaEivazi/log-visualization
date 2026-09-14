'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import type { GridColDef } from '@mui/x-data-grid';
import PageHeader from '@/components/common/PageHeader';
import SearchBar from '@/components/common/SearchBar';
import PanelCard from '@/components/common/PanelCard';
import DataTable from '@/components/common/DataTable';
import EmptyState from '@/components/common/EmptyState';
import LogLevelChip from '@/components/common/LogLevelChip';
import { fontMono } from '@/theme/typography';
import { formatTime } from '@/utils/formatDate';
import { mockLogs } from '@/mock/discover.mock';
import { useTranslation } from '@/i18n/useTranslation';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { LogEntry, LogLevel } from '@/types/discover.types';
import type { Dictionary } from '@/i18n';

const LEVEL_FILTERS: LogLevel[] = ['debug', 'info', 'warn', 'error'];

// Column headers come from the dictionary; log-level badges (DEBUG/INFO/
// WARN/ERROR) and the timestamp/message cell contents stay in Latin script
// regardless of locale — they're technical data, not UI chrome (see the
// note in src/i18n/dictionary.types.ts).
function buildColumns(columns: Dictionary['discover']['columns']): GridColDef<LogEntry>[] {
  return [
    {
      field: 'timestamp',
      headerName: columns.time,
      width: 110,
      renderCell: (params) => (
        <span style={{ fontFamily: fontMono, fontSize: '0.75rem' }}>{formatTime(params.value as string)}</span>
      ),
    },
    {
      field: 'level',
      headerName: columns.level,
      width: 90,
      renderCell: (params) => <LogLevelChip level={params.value as LogLevel} />,
    },
    { field: 'service', headerName: columns.service, width: 170 },
    { field: 'host', headerName: columns.host, width: 150 },
    {
      field: 'message',
      headerName: columns.message,
      flex: 1,
      minWidth: 320,
      renderCell: (params) => (
        <span style={{ fontFamily: fontMono, fontSize: '0.75rem' }}>{params.value as string}</span>
      ),
    },
  ];
}

// Renders mock log data. Swap for `useLogs({ query, page, pageSize })`
// (src/lib/api/queries/useLogs.ts) once a real log API is available.
export default function DiscoverPage() {
  const { t } = useTranslation();
  usePageTitle(t.discover.title);

  const [query, setQuery] = React.useState('');
  const [activeLevels, setActiveLevels] = React.useState<Set<LogLevel>>(new Set(LEVEL_FILTERS));

  const columns = React.useMemo(() => buildColumns(t.discover.columns), [t]);

  const toggleLevel = (level: LogLevel) => {
    setActiveLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) {
        next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
  };

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockLogs.filter((log) => {
      if (!activeLevels.has(log.level)) return false;
      if (!q) return true;
      return (
        log.message.toLowerCase().includes(q) ||
        log.service.toLowerCase().includes(q) ||
        log.host.toLowerCase().includes(q)
      );
    });
  }, [query, activeLevels]);

  return (
    <div>
      <PageHeader title={t.discover.title} subtitle={t.discover.subtitle} />

      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flexGrow: 1, minWidth: 260, maxWidth: 480 }}>
          <SearchBar
            placeholder={t.discover.searchPlaceholder}
            value={query}
            onChange={setQuery}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 0.75 }}>
          {LEVEL_FILTERS.map((level) => (
            <Chip
              key={level}
              label={level.toUpperCase()}
              size="small"
              onClick={() => toggleLevel(level)}
              variant={activeLevels.has(level) ? 'filled' : 'outlined'}
              sx={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.02em' }}
            />
          ))}
        </Box>
      </Box>

      <PanelCard
        title={t.discover.panelTitle}
        subtitle={t.discover.panelSubtitleCount(filtered.length, mockLogs.length)}
        minHeight={520}
      >
        {filtered.length === 0 ? (
          <EmptyState title={t.discover.emptyTitle} description={t.discover.emptyDescription} />
        ) : (
          <Box sx={{ height: 520 }}>
            <DataTable<LogEntry> rows={filtered} columns={columns} getRowId={(row) => row.id} />
          </Box>
        )}
      </PanelCard>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
        {t.discover.mockNotice}
      </Typography>
    </div>
  );
}
