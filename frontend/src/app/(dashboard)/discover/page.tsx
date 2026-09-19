'use client';

import * as React from 'react';
import {
  Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, FormControlLabel, IconButton, Menu, MenuItem,
  Paper, Select, Stack, Switch, TextField, Tooltip, Typography, ListItemText, ListItemIcon, Divider, Autocomplete,
} from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import { mockLogs } from '@/mock/discover.mock';
import type { LogEntry } from '@/types/discover.types';
import { fontMono } from '@/theme/typography';
import { useTranslation } from '@/i18n/useTranslation';
import { usePageTitle } from '@/hooks/usePageTitle';
import { InspectDialog } from '@/components/discover/inspect';
import { DiscoverTabs } from '@/components/discover/DiscoverTabs';
import { DiscoverQueryBar } from '@/components/discover/DiscoverQueryBar';
import { DiscoverFieldsSidebar } from '@/components/discover/DiscoverFieldsSidebar';
import { DiscoverChart } from '@/components/discover/DiscoverChart';
import { DiscoverResults } from '@/components/discover/DiscoverResults';
import { DiscoverFieldStatistics } from '@/components/discover/DiscoverFieldStatistics';
import { DiscoverCreateFieldDialog } from '@/components/discover/DiscoverCreateFieldDialog';
import type { CustomDiscoverField, Density, DiscoverTabState, Filter, FilterOperator } from '@/components/discover/discover.types';
import { COLUMN_LABELS } from '@/components/discover/discover.types';
import { DISCOVER_FIELDS } from '@/components/discover/discover.types';

const seedTab = (id: string, title: string): DiscoverTabState => ({
  id,
  title,
  query: '',
  dataView: 'logs-*',
  timeRange: 'Last 15 minutes',
  filters: [],
  columns: ['timestamp', 'summary'],
  sort: { field: 'timestamp', direction: 'desc' },
  mode: 'classic',
});

// Get latest timestamp from mockLogs for relative time filtering
const getLatestTimestamp = () => {
  const timestamps = mockLogs.map(log => new Date(log.timestamp).getTime());
  return Math.max(...timestamps);
};

const LATEST_TIMESTAMP = getLatestTimestamp();

// Parse time range string to milliseconds
const parseTimeRange = (range: string): number => {
  if (range === 'Last 15 minutes') return 15 * 60 * 1000;
  if (range === 'Last 1 hour') return 60 * 60 * 1000;
  if (range === 'Last 24 hours') return 24 * 60 * 60 * 1000;
  if (range === 'Last 7 days') return 7 * 24 * 60 * 60 * 1000;
  return 15 * 60 * 1000;
};

// Extract unique values for a field from filtered logs
const getUniqueValues = (logs: LogEntry[], field: string): string[] => {
  const values = new Set<string>();
  logs.forEach(log => {
    const value = log[field as keyof LogEntry];
    if (value !== undefined && value !== null) {
      values.add(String(value));
    }
  });
  return Array.from(values).sort();
};

export default function DiscoverPage() {
  const { t, dir } = useTranslation();
  usePageTitle('Discover');

  const [tabs, setTabs] = React.useState<DiscoverTabState[]>([seedTab('tab-1', 'Untitled')]);
  const [activeId, setActiveId] = React.useState('tab-1');
  const [fieldSearch, setFieldSearch] = React.useState('');
  const [fieldStats, setFieldStats] = React.useState(false);
  const [chartVisible, setChartVisible] = React.useState(false);
  const [sidebarVisible, setSidebarVisible] = React.useState(true);
  const [density, setDensity] = React.useState<Density>('compact');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [selectedDoc, setSelectedDoc] = React.useState<LogEntry | null>(null);
  const [documentMode, setDocumentMode] = React.useState<'table' | 'json'>('table');
  const [inspectOpen, setInspectOpen] = React.useState(false);
  const [saveOpen, setSaveOpen] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [columnsOpen, setColumnsOpen] = React.useState(false);
  const [createFieldOpen, setCreateFieldOpen] = React.useState(false);
  const [customFields, setCustomFields] = React.useState<CustomDiscoverField[]>([]);
  const [sortOpen, setSortOpen] = React.useState(false);
  const [displayOpen, setDisplayOpen] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [newFilterField, setNewFilterField] = React.useState('service');
  const [newFilterValue, setNewFilterValue] = React.useState('');
  const [newFilterOp, setNewFilterOp] = React.useState<FilterOperator>('is');
  const [newFilterValues, setNewFilterValues] = React.useState<string[]>([]);
  const [newFilterNegate, setNewFilterNegate] = React.useState(false);
  const [newFilterLabel, setNewFilterLabel] = React.useState('');
  const [editingFilterId, setEditingFilterId] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [moreActionsAnchor, setMoreActionsAnchor] = React.useState<null | HTMLElement>(null);
  const [exportAnchor, setExportAnchor] = React.useState<null | HTMLElement>(null);
  const [utilityDialog, setUtilityDialog] = React.useState<'session' | 'background' | 'alert' | null>(null);

  const active = tabs.find(tab => tab.id === activeId) ?? tabs[0]!;

  // Track query draft state per tab
  const [queryDrafts, setQueryDrafts] = React.useState<Record<string, string>>({});
  const queryDraft = queryDrafts[activeId] ?? active.query;

  const handleQueryChange = React.useCallback((value: string) => {
    setQueryDrafts(prev => ({ ...prev, [activeId]: value }));
  }, [activeId]);

  const updateActive = React.useCallback((patch: Partial<DiscoverTabState>) => {
    setTabs(current => current.map(tab => tab.id === activeId ? { ...tab, ...patch } : tab));
  }, [activeId]);

  const addTab = (duplicate = false) => {
    const id = `tab-${Date.now()}`;
    const next = duplicate
      ? { ...active, id, title: `${active.title} copy`, filters: active.filters.map(filter => ({ ...filter })), columns: [...active.columns] }
      : seedTab(id, `Untitled ${tabs.length + 1}`);
    setTabs(current => [...current, next]);
    setActiveId(id);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) return;
    const index = tabs.findIndex(tab => tab.id === id);
    const next = tabs.filter(tab => tab.id !== id);
    setTabs(next);
    if (id === activeId) {
      const fallbackId = next[Math.max(0, index - 1)]?.id ?? next[0]?.id;
      if (fallbackId) setActiveId(fallbackId);
    }
  };

  const renameTab = () => {
    const value = window.prompt('Discover tab name', active.title);
    if (value?.trim()) updateActive({ title: value.trim() });
  };

  const runQuery = () => {
    updateActive({ query: queryDraft });
    setPage(0);
  };

  // Check if log passes filter
  const passesFilter = (log: LogEntry, filter: Filter): boolean => {
    if (!filter.enabled) return true;

    const fieldValue = log[filter.field as keyof LogEntry];
    const value = String(fieldValue ?? '').toLowerCase();

    let result = false;

    switch (filter.operator) {
      case 'is':
        result = value === filter.value.toLowerCase();
        break;
      case 'is not':
        result = value !== filter.value.toLowerCase();
        break;
      case 'is one of':
        result = (filter.values || []).some(v => value === v.toLowerCase());
        break;
      case 'exists':
        result = fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
        break;
      case 'does not exist':
        result = fieldValue === undefined || fieldValue === null || fieldValue === '';
        break;
      default:
        result = true;
    }

    return filter.negate ? !result : result;
  };

  // Check if log is within time range
  const withinTimeRange = (log: LogEntry, timeRange: string): boolean => {
    const logTime = new Date(log.timestamp).getTime();
    const rangeMs = parseTimeRange(timeRange);
    return logTime >= LATEST_TIMESTAMP - rangeMs;
  };

  const filtered = React.useMemo(() => {
    const q = active.query.trim().toLowerCase();
    return [...mockLogs]
      .filter(log => {
        // Time range filter
        if (!withinTimeRange(log, active.timeRange)) return false;

        // Query filter
        if (q && !`${log.message} ${log.service} ${log.host} ${log.level}`.toLowerCase().includes(q)) return false;

        // Field filters
        return active.filters.every(filter => passesFilter(log, filter));
      })
      .sort((a, b) => {
        const left = String(a[active.sort.field]);
        const right = String(b[active.sort.field]);
        return active.sort.direction === 'asc' ? left.localeCompare(right) : right.localeCompare(left);
      });
  }, [active.query, active.timeRange, active.filters, active.sort]);

  const histogram = React.useMemo(() => Array.from({ length: 44 }, (_, index) => 3 + ((index * 19 + filtered.length * 5) % 23)), [filtered.length]);

  // Get autocomplete values for current filter field
  const autocompleteValues = React.useMemo(() => {
    return getUniqueValues(mockLogs, newFilterField);
  }, [newFilterField]);

  const openFilterDialog = (filter?: Filter) => {
    if (filter) {
      setEditingFilterId(filter.id);
      setNewFilterField(filter.field);
      setNewFilterOp(filter.operator);
      setNewFilterValue(filter.value);
      setNewFilterValues(filter.values || []);
      setNewFilterNegate(filter.negate || false);
      setNewFilterLabel(filter.label || '');
    } else {
      setEditingFilterId(null);
      setNewFilterField('service');
      setNewFilterOp('is');
      setNewFilterValue('');
      setNewFilterValues([]);
      setNewFilterNegate(false);
      setNewFilterLabel('');
    }
    setFilterOpen(true);
  };

  const addOrUpdateFilter = () => {
    const needsValue = newFilterOp !== 'exists' && newFilterOp !== 'does not exist';
    const hasValue = newFilterOp === 'is one of' ? newFilterValues.length > 0 : newFilterValue.trim() !== '';

    if (needsValue && !hasValue) return;

    const filter: Filter = {
      id: editingFilterId || `filter-${Date.now()}`,
      field: newFilterField,
      operator: newFilterOp,
      value: newFilterOp === 'is one of' ? newFilterValues.join(', ') : newFilterValue.trim(),
      values: newFilterOp === 'is one of' ? newFilterValues : undefined,
      enabled: true,
      negate: newFilterNegate,
      label: newFilterLabel.trim() || undefined,
    };

    if (editingFilterId) {
      updateActive({ filters: active.filters.map(f => f.id === editingFilterId ? filter : f) });
    } else {
      updateActive({ filters: [...active.filters, filter] });
    }

    setFilterOpen(false);
  };

  const getFilterLabel = (filter: Filter): string => {
    if (filter.label) return filter.label;

    const op = filter.operator === 'is' ? ':' : filter.operator === 'is not' ? ' is not ' : filter.operator === 'is one of' ? ' is one of ' : ` ${filter.operator}`;
    const value = filter.operator === 'exists' || filter.operator === 'does not exist' ? '' : ` ${filter.value}`;
    const negate = filter.negate ? 'NOT ' : '';

    return `${negate}${filter.field}${op}${value}`;
  };

  const toggleColumn = (column: string) => updateActive({ columns: active.columns.includes(column) ? active.columns.filter(item => item !== column) : [...active.columns, column] });

  const sortField = (field: keyof LogEntry, direction: 'asc' | 'desc') => {
    updateActive({ sort: { field, direction } });
    setSortOpen(false);
  };

  const downloadResults = (format: 'json' | 'csv') => {
    const rows = filtered.slice(0, rowsPerPage);
    const payload = format === 'json'
      ? JSON.stringify(rows, null, 2)
      : ['id,created_at,level,service,host,message', ...rows.map(log => [log.id, log.timestamp, log.level, log.service, log.host, JSON.stringify(log.message)].join(','))].join('\n');
    const blob = new Blob([payload], { type: format === 'json' ? 'application/json' : 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${active.title.replace(/[^a-z0-9-_]+/gi, '-') || 'discover-results'}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
    setExportAnchor(null);
    setMoreActionsAnchor(null);
  };

  const shellSx = fullscreen
    ? { position: 'fixed' as const, inset: 0, zIndex: 1400, bgcolor: 'background.default', overflow: 'hidden' }
    : { minWidth: 0, height: { xs: 'calc(100dvh - 88px)', md: 'calc(100dvh - 104px)' }, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' as const };

  return (
    <Box dir={dir} sx={shellSx}>
      {/* Kibana-style session header */}
      <Box sx={{ minHeight: 50, px: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Stack direction="row" sx={{ minWidth: 0, alignItems: 'center' }}>
          <Typography sx={{ px: 1.25, fontWeight: 600, fontSize: 13 }}>{active.title}</Typography>
          <Tooltip title={t.discover.toolbar.newTab}><IconButton size="small" onClick={() => addTab()}><AddIcon fontSize="small" /></IconButton></Tooltip>
        </Stack>
        <Stack direction="row" spacing={.25} sx={{ alignItems: 'center' }}>
          <Button size="small" variant="text" startIcon={<ShareOutlinedIcon fontSize="small" />} onClick={() => setShareOpen(true)}>{t.discover.toolbar.share}</Button>
          <Button size="small" variant="text" startIcon={<CodeOutlinedIcon fontSize="small" />} onClick={() => updateActive({ mode: active.mode === 'classic' ? 'esql' : 'classic' })}>{active.mode === 'classic' ? t.discover.toolbar.queryInEsql : t.discover.toolbar.classicKql}</Button>
          <Tooltip title={t.discover.toolbar.moreActions}><IconButton size="small" onClick={e => setMoreActionsAnchor(e.currentTarget)} aria-label={t.discover.toolbar.moreActions} aria-haspopup="menu" aria-expanded={Boolean(moreActionsAnchor)}><MoreVertIcon fontSize="small" /></IconButton></Tooltip>
          <Button size="small" variant="outlined" startIcon={<SaveOutlinedIcon fontSize="small" />} onClick={() => setSaveOpen(true)} sx={{ ml: .5 }}>{t.discover.toolbar.save}</Button>
          <IconButton size="small"><KeyboardArrowDownIcon fontSize="small" /></IconButton>
        </Stack>
      </Box>


      <Menu
        anchorEl={moreActionsAnchor}
        open={Boolean(moreActionsAnchor)}
        onClose={() => { setMoreActionsAnchor(null); setExportAnchor(null); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 220, mt: .75, borderRadius: 1.25, boxShadow: theme => theme.shadows[8] } } }}
      >
        <MenuItem onClick={() => { setUtilityDialog('session'); setMoreActionsAnchor(null); }}>
          <ListItemIcon sx={{ minWidth: 34 }}><SaveOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={t.discover.moreActions.openSession} />
        </MenuItem>
        <MenuItem onClick={() => { addTab(); setMoreActionsAnchor(null); }}>
          <ListItemIcon sx={{ minWidth: 34 }}><AddIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={t.discover.moreActions.newSession} />
        </MenuItem>
        <MenuItem onClick={() => { setUtilityDialog('background'); setMoreActionsAnchor(null); }}>
          <ListItemIcon sx={{ minWidth: 34 }}><AnalyticsOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={t.discover.moreActions.backgroundSearches} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={e => setExportAnchor(e.currentTarget)}>
          <ListItemIcon sx={{ minWidth: 34 }}><ViewColumnOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={t.discover.moreActions.exportTabResults} />
          <Typography color="text.secondary" sx={{ fontSize: 18, lineHeight: 1, transform: dir === 'rtl' ? 'rotate(180deg)' : 'none' }}>›</Typography>
        </MenuItem>
        <MenuItem onClick={() => { setInspectOpen(true); setMoreActionsAnchor(null); }}>
          <ListItemIcon sx={{ minWidth: 34 }}><CodeOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={t.discover.moreActions.inspectTab} />
        </MenuItem>
        <MenuItem onClick={() => { setUtilityDialog('alert'); setMoreActionsAnchor(null); }}>
          <ListItemIcon sx={{ minWidth: 34 }}><AnalyticsOutlinedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={t.discover.moreActions.createAlertRule} />
          <Typography color="text.secondary" sx={{ fontSize: 18, lineHeight: 1, transform: dir === 'rtl' ? 'rotate(180deg)' : 'none' }}>›</Typography>
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={exportAnchor}
        open={Boolean(exportAnchor)}
        onClose={() => setExportAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: dir === 'rtl' ? 'left' : 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: dir === 'rtl' ? 'right' : 'left' }}
        slotProps={{ paper: { sx: { minWidth: 170, borderRadius: 1.25 } } }}
      >
        <MenuItem onClick={() => downloadResults('csv')}><ListItemText primary={t.discover.moreActions.exportCsv} /></MenuItem>
        <MenuItem onClick={() => downloadResults('json')}><ListItemText primary={t.discover.moreActions.exportJson} /></MenuItem>
      </Menu>

      <DiscoverTabs tabs={tabs} activeId={activeId} onChange={setActiveId} onAdd={addTab} onClose={closeTab} onRename={renameTab} onCloseOthers={() => setTabs(current => current.filter(tab => tab.id === activeId))} />
      <DiscoverQueryBar tab={active} queryDraft={queryDraft} onQueryChange={handleQueryChange} onQueryRun={runQuery} onTabChange={updateActive} onAddFilter={() => openFilterDialog()} onRefresh={() => setRefreshKey(key => key + 1)} />

      {active.filters.length > 0 && (
        <Box sx={{ px: 1, py: .5, borderBottom: 1, borderColor: 'divider', display: 'flex', gap: .5, flexWrap: 'wrap' }}>
          {active.filters.map(filter => (
            <Chip
              key={filter.id}
              size="small"
              color={filter.enabled ? 'primary' : 'default'}
              variant={filter.enabled ? 'filled' : 'outlined'}
              label={getFilterLabel(filter)}
              onDelete={() => updateActive({ filters: active.filters.filter(item => item.id !== filter.id) })}
              onClick={() => openFilterDialog(filter)}
            />
          ))}
          <Button size="small" onClick={() => updateActive({ filters: [] })}>Clear all</Button>
        </Box>
      )}

      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden' }}>
        {sidebarVisible && <DiscoverFieldsSidebar tab={active} search={fieldSearch} onSearch={setFieldSearch} onChange={updateActive} onAddField={() => setCreateFieldOpen(true)} filteredLogs={filtered} customFields={customFields} />}
        <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, px: 1, py: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Stack direction="row" sx={{ mb: .75, alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={.5} sx={{ alignItems: 'center' }}>
              {!sidebarVisible && <Button size="small" startIcon={<ViewColumnOutlinedIcon />} onClick={() => setSidebarVisible(true)}>Show fields</Button>}
              {chartVisible ? <Button size="small" startIcon={<AnalyticsOutlinedIcon />} onClick={() => setChartVisible(false)}>Hide chart</Button> : <Button size="small" startIcon={<AnalyticsOutlinedIcon />} onClick={() => setChartVisible(true)}>Show chart</Button>}
            </Stack>
            <Typography variant="caption" color="text.secondary">{filtered.length.toLocaleString()} matching documents</Typography>
          </Stack>

          {chartVisible && <Box sx={{ flex: '0 0 auto' }}><DiscoverChart data={histogram} count={filtered.length} onHide={() => setChartVisible(false)} /></Box>}

          <Box sx={{ flex: '0 0 auto', borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
            <Button onClick={() => setFieldStats(false)} sx={{ borderRadius: 0, px: 1.5, color: fieldStats ? 'text.primary' : 'primary.main', fontWeight: fieldStats ? 500 : 700 }}>Documents ({filtered.length.toLocaleString()})</Button>
            <Button onClick={() => setFieldStats(true)} sx={{ borderRadius: 0, px: 1.5, color: fieldStats ? 'primary.main' : 'text.primary', fontWeight: fieldStats ? 700 : 500 }}>Field statistics</Button>
          </Box>

          {fieldStats ? <Paper variant="outlined" sx={{ flex: 1, minHeight: 0, overflow: 'auto', borderTop: 0, borderRadius: 0 }}><DiscoverFieldStatistics logs={filtered} /></Paper> : <DiscoverResults logs={filtered} tab={active} density={density} mode={active.mode} page={page} rowsPerPage={rowsPerPage} onPage={setPage} onRowsPerPage={setRowsPerPage} onOpenDocument={log => { setSelectedDoc(log); }} onColumns={() => setColumnsOpen(true)} customFields={customFields} onSort={() => setSortOpen(true)} onDisplay={() => setDisplayOpen(true)} onFullscreen={() => setFullscreen(value => !value)} />}
        </Box>
      </Box>

      <DocumentDialog document={selectedDoc} mode={documentMode} onMode={setDocumentMode} onClose={() => setSelectedDoc(null)} />

      <InspectDialog open={inspectOpen} onClose={() => setInspectOpen(false)} dataView={active.dataView} query={active.query} mode={active.mode} timeRange={active.timeRange} filters={active.filters} size={rowsPerPage} sort={active.sort} filteredLogs={filtered} />


      <Dialog open={utilityDialog !== null} onClose={() => setUtilityDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle>
          {utilityDialog === 'session' && t.discover.moreActions.openSession}
          {utilityDialog === 'background' && t.discover.moreActions.backgroundSearches}
          {utilityDialog === 'alert' && t.discover.moreActions.createAlertRule}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            {utilityDialog === 'session' && t.discover.moreActions.sessionMock}
            {utilityDialog === 'background' && t.discover.moreActions.backgroundMock}
            {utilityDialog === 'alert' && t.discover.moreActions.alertMock}
          </Typography>
        </DialogContent>
        <DialogActions><Button onClick={() => setUtilityDialog(null)}>{t.discover.moreActions.close}</Button></DialogActions>
      </Dialog>

      <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingFilterId ? 'Edit filter' : 'Add filter'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <Select value={newFilterField} onChange={e => setNewFilterField(e.target.value)}>
              {DISCOVER_FIELDS.map(field => <MenuItem key={field.name} value={field.name}>{field.name}</MenuItem>)}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            <FormControl size="small" sx={{ width: 140 }}>
              <Select value={newFilterOp} onChange={e => setNewFilterOp(e.target.value as FilterOperator)}>
                <MenuItem value="is">is</MenuItem>
                <MenuItem value="is not">is not</MenuItem>
                <MenuItem value="is one of">is one of</MenuItem>
                <MenuItem value="exists">exists</MenuItem>
                <MenuItem value="does not exist">does not exist</MenuItem>
              </Select>
            </FormControl>

            {newFilterOp === 'is one of' ? (
              <Autocomplete
                multiple
                freeSolo
                fullWidth
                size="small"
                options={autocompleteValues}
                value={newFilterValues}
                onChange={(_, newValue) => setNewFilterValues(newValue)}
                renderInput={(params) => <TextField {...params} label="Values" />}
              />
            ) : (newFilterOp !== 'exists' && newFilterOp !== 'does not exist') && (
              <Autocomplete
                freeSolo
                fullWidth
                size="small"
                options={autocompleteValues}
                value={newFilterValue}
                onInputChange={(_, newValue) => setNewFilterValue(newValue)}
                renderInput={(params) => <TextField {...params} label="Value" onKeyDown={e => { if (e.key === 'Enter') addOrUpdateFilter(); }} />}
              />
            )}
          </Stack>

          <FormControlLabel
            sx={{ mt: 1.5 }}
            control={<Checkbox checked={newFilterNegate} onChange={e => setNewFilterNegate(e.target.checked)} />}
            label="Negate filter"
          />

          <TextField
            fullWidth
            size="small"
            label="Custom label (optional)"
            value={newFilterLabel}
            onChange={e => setNewFilterLabel(e.target.value)}
            sx={{ mt: 1.5 }}
            placeholder="e.g., Production errors"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={addOrUpdateFilter}
            disabled={
              (newFilterOp !== 'exists' && newFilterOp !== 'does not exist') &&
              (newFilterOp === 'is one of' ? newFilterValues.length === 0 : !newFilterValue.trim())
            }
          >
            {editingFilterId ? 'Update filter' : 'Add filter'}
          </Button>
        </DialogActions>
      </Dialog>

      <DiscoverCreateFieldDialog
        open={createFieldOpen}
        dataView={active.dataView}
        logs={filtered}
        onClose={() => setCreateFieldOpen(false)}
        onSave={(field) => {
          setCustomFields(current => current.some(item => item.name === field.name) ? current.map(item => item.name === field.name ? field : item) : [...current, field]);
          updateActive({ columns: active.columns.includes(field.name) ? active.columns : [...active.columns, field.name] });
          setCreateFieldOpen(false);
        }}
      />

      <Dialog open={columnsOpen} onClose={() => setColumnsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Columns</DialogTitle>
        <DialogContent dividers>{[...['timestamp', 'summary', 'level', 'service', 'host', 'message'], ...customFields.map(field => field.name)].map(column => <FormControlLabel key={column} sx={{ display: 'flex' }} control={<Checkbox checked={active.columns.includes(column)} onChange={() => toggleColumn(column)} />} label={COLUMN_LABELS[column] ?? customFields.find(field => field.name === column)?.label ?? column} />)}</DialogContent>
        <DialogActions><Button onClick={() => setColumnsOpen(false)}>Done</Button></DialogActions>
      </Dialog>

      <Dialog open={sortOpen} onClose={() => setSortOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Sort fields</DialogTitle>
        <DialogContent dividers>{(['timestamp', 'level', 'service', 'host'] as Array<keyof LogEntry>).map(field => <Box key={field} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: .5 }}><Typography sx={{ fontFamily: fontMono, fontSize: 12 }}>{field}</Typography><Stack direction="row"><Button size="small" onClick={() => sortField(field, 'asc')}>Ascending</Button><Button size="small" onClick={() => sortField(field, 'desc')}>Descending</Button></Stack></Box>)}</DialogContent>
      </Dialog>

      <Dialog open={displayOpen} onClose={() => setDisplayOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Display options</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mt: 1 }}>Density</Typography>
          <Stack direction="row" spacing={.5} sx={{ mt: 1 }}>{(['compact', 'normal', 'expanded'] as Density[]).map(value => <Button key={value} variant={density === value ? 'contained' : 'outlined'} size="small" onClick={() => setDensity(value)}>{value}</Button>)}</Stack>
          <FormControlLabel sx={{ mt: 1 }} control={<Switch checked={chartVisible} onChange={e => setChartVisible(e.target.checked)} />} label="Show chart" />
          <FormControlLabel control={<Switch checked={sidebarVisible} onChange={e => setSidebarVisible(e.target.checked)} />} label="Show fields" />
        </DialogContent>
      </Dialog>

      <Dialog open={saveOpen} onClose={() => setSaveOpen(false)} maxWidth="xs" fullWidth><DialogTitle>Save Discover session</DialogTitle><DialogContent><TextField fullWidth size="small" label="Title" defaultValue={active.title} sx={{ mt: 1 }} /><TextField fullWidth size="small" label="Description" sx={{ mt: 1 }} /></DialogContent><DialogActions><Button onClick={() => setSaveOpen(false)}>Cancel</Button><Button variant="contained" onClick={() => setSaveOpen(false)}>Save</Button></DialogActions></Dialog>
      <Dialog open={shareOpen} onClose={() => setShareOpen(false)} maxWidth="sm" fullWidth><DialogTitle>Share</DialogTitle><DialogContent><Typography variant="body2" sx={{ mt: 1 }}>A shareable URL for this mock Discover session.</Typography><TextField fullWidth size="small" value="http://localhost:3000/discover?_a=mock-session" sx={{ mt: 2 }} slotProps={{ input: { readOnly: true } }} /></DialogContent><DialogActions><Button onClick={() => setShareOpen(false)}>Close</Button><Button variant="contained" onClick={() => setShareOpen(false)}>Copy link</Button></DialogActions></Dialog>
    </Box>
  );
}

function DocumentDialog({ document, mode, onMode, onClose }: { document: LogEntry | null; mode: 'table' | 'json'; onMode: (mode: 'table' | 'json') => void; onClose: () => void }) {
  if (!document) return null;
  return <Dialog open onClose={onClose} fullWidth maxWidth="md" slotProps={{ paper: { sx: { m: 0, ml: 'auto', mr: 0, height: '100%', maxHeight: '100%', borderRadius: 0 } } }}>
    <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Box><Typography variant="subtitle1">Document</Typography><Typography variant="caption" color="text.secondary" sx={{ fontFamily: fontMono }}>{document.id}</Typography></Box><IconButton onClick={onClose}><CloseIcon /></IconButton></DialogTitle>
    <Box sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}><Stack direction="row"><Button onClick={() => onMode('table')} sx={{ borderRadius: 0, color: mode === 'table' ? 'primary.main' : 'text.primary' }}>Table</Button><Button onClick={() => onMode('json')} sx={{ borderRadius: 0, color: mode === 'json' ? 'primary.main' : 'text.primary' }}>JSON</Button></Stack></Box>
    <DialogContent dividers>{mode === 'table' ? <Stack spacing={1}>{Object.entries(document).map(([key, value]) => <Box key={key} sx={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 1, py: .75, borderBottom: 1, borderColor: 'divider' }}><Typography variant="caption" color="text.secondary" sx={{ fontFamily: fontMono }}>{key}</Typography><Typography variant="body2" sx={{ fontFamily: fontMono, wordBreak: 'break-word' }}>{String(value)}</Typography></Box>)}</Stack> : <Box component="pre" sx={{ m: 0, p: 1.5, overflow: 'auto', bgcolor: 'action.hover', borderRadius: 1, fontFamily: fontMono, fontSize: 12 }}>{JSON.stringify({ _index: 'logs-benchmark', _id: document.id, _source: document }, null, 2)}</Box>}</DialogContent>
  </Dialog>;
}
