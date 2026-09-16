'use client';

import * as React from 'react';
import {
  Box, Button, Chip, Divider, Drawer, IconButton, Menu, MenuItem, Stack,
  Tab, Tabs, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { LogEntry } from '@/types/discover.types';
import type {
  InspectMode,
  InspectRequestContext,
  InspectTab,
  InspectView,
} from './inspect.types';
import {
  buildRequestItems,
  buildRequestPayload,
  buildResponsePayload,
} from './inspect.utils';
import { InspectCodePanel } from './InspectCodePanel';
import { InspectStatistics } from './InspectStatistics';
import { InspectClusters } from './InspectClusters';
import { InspectRequestPicker } from './InspectRequestPicker';
import { useTranslation } from '@/i18n/useTranslation';

interface InspectDialogProps {
  open: boolean;
  onClose: () => void;
  dataView: string;
  query: string;
  mode: InspectMode;
  timeRange: string;
  filters: InspectRequestContext['filters'];
  size: number;
  sort: InspectRequestContext['sort'];
  filteredLogs: LogEntry[];
}

const TAB_VALUES: InspectTab[] = ['statistics', 'clusters', 'request', 'response'];

export function InspectDialog({
  open,
  onClose,
  dataView,
  query,
  mode,
  timeRange,
  filters,
  size,
  sort,
  filteredLogs,
}: InspectDialogProps) {
  const { t, dir } = useTranslation();
  const [tab, setTab] = React.useState<InspectTab>('response');
  const [view, setView] = React.useState<InspectView>('requests');
  const [selectedRequestId, setSelectedRequestId] = React.useState('documents');
  const [viewAnchorEl, setViewAnchorEl] = React.useState<HTMLElement | null>(null);

  const request = React.useMemo<InspectRequestContext>(() => ({
    dataView,
    query,
    mode,
    timeRange,
    filters,
    size,
    sort,
  }), [dataView, query, mode, timeRange, filters, size, sort]);

  const response = React.useMemo(() => ({
    total: filteredLogs.length,
    returned: Math.min(size, filteredLogs.length),
    rows: filteredLogs.slice(0, size),
  }), [filteredLogs, size]);

  const requestItems = React.useMemo(() => buildRequestItems(request), [request]);
  const selectedRequest = requestItems.find(item => item.id === selectedRequestId) ?? requestItems[0]!;
  const selectedRequestDescription = selectedRequest.kind === 'documents'
    ? t.discover.inspector.documentsRequest(dataView)
    : t.discover.inspector.fieldStatisticsRequest;
  const requestPayload = React.useMemo(() => buildRequestPayload(request, selectedRequest), [request, selectedRequest]);
  const responsePayload = React.useMemo(() => buildResponsePayload(response, selectedRequest), [response, selectedRequest]);

  React.useEffect(() => {
    if (!open) {
      setTab('response');
      setView('requests');
      setSelectedRequestId('documents');
    }
  }, [open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      slotProps={{
        backdrop: { sx: { bgcolor: 'rgba(31, 41, 55, 0.38)' } },
        paper: {
          sx: {
            width: { xs: '100vw', sm: 800, md: 800 },
            maxWidth: '100vw',
            height: '100dvh',
            overflow: 'hidden',
            bgcolor: 'background.paper',
            zIndex: 1400,
          },
        },
      }}
    >
      <Box
        dir={dir}
        sx={{
          width: '100%',
          maxWidth: '100vw',
          height: '100dvh',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ px: 2.5, py: 1.35, minHeight: 68, flex: '0 0 68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, borderBottom: 1, borderColor: 'divider', position: 'relative', zIndex: 2, bgcolor: 'background.paper' }}>
          <Typography variant="h6" sx={{ fontWeight: 650 }}>{t.discover.inspector.title}</Typography>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">{t.discover.inspector.view}:</Typography>
            <Button
              size="small"
              onClick={(event) => setViewAnchorEl(event.currentTarget)}
              aria-haspopup="menu"
              aria-expanded={viewAnchorEl ? 'true' : undefined}
              endIcon={<KeyboardArrowDownIcon fontSize="small" />}
              sx={{
                minWidth: 120,
                px: 0.75,
                py: 0.25,
                textTransform: 'none',
                color: 'primary.main',
                fontWeight: 600,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              {view === 'requests' ? t.discover.inspector.requests : t.discover.inspector.profiles}
            </Button>
            <Menu
              anchorEl={viewAnchorEl}
              open={Boolean(viewAnchorEl)}
              onClose={() => setViewAnchorEl(null)}
              slotProps={{ paper: { sx: { minWidth: 150, zIndex: 1600 } } }}
            >
              <MenuItem selected={view === 'requests'} onClick={() => { setView('requests'); setViewAnchorEl(null); }}>
                {t.discover.inspector.requests}
              </MenuItem>
              <MenuItem selected={view === 'profiles'} onClick={() => { setView('profiles'); setViewAnchorEl(null); }}>
                {t.discover.inspector.profiles}
              </MenuItem>
            </Menu>
            <IconButton size="small" onClick={onClose} sx={{ ml: 1 }} aria-label="Close inspector">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        {view === 'requests' ? (
          <Box sx={{ flex: '1 1 auto', minHeight: 0, minWidth: 0, display: 'grid', gridTemplateRows: 'auto 43px minmax(0, 1fr)', overflow: 'hidden' }}>
            <Box sx={{ px: 3, pt: 2.5, pb: 1.5, minWidth: 0, overflow: 'visible' }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <InspectRequestPicker
                    items={requestItems}
                    selectedId={selectedRequest.id}
                    onChange={id => {
                      setSelectedRequestId(id);
                      setTab('response');
                    }}
                  />
                </Box>
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: 17 }} />}
                  label={`${selectedRequest.durationMs} ms`}
                  size="small"
                  sx={{ mt: 2.25, height: 26, bgcolor: 'success.light', color: 'success.dark', fontWeight: 700, '& .MuiChip-icon': { color: 'success.main' } }}
                />
              </Stack>
              <Typography variant="body2" sx={{ mt: 1.15, color: 'text.primary', lineHeight: 1.45 }}>
                {selectedRequestDescription}
              </Typography>
            </Box>

            <Box
              sx={{
                px: 3,
                minHeight: 43,
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                position: 'relative',
                zIndex: 2,
                overflow: 'hidden',
                minWidth: 0,
              }}
            >
              <Tabs
                value={tab}
                onChange={(_, value: InspectTab) => setTab(value)}
                variant="scrollable"
                scrollButtons={false}
                sx={{
                  height: 43,
                  minHeight: 43,
                  '& .MuiTabs-flexContainer': { height: 43 },
                  '& .MuiTabs-indicator': { height: 2, zIndex: 5 },
                  '& .MuiTab-root': {
                    minHeight: 43,
                    height: 43,
                    px: 1.2,
                    py: 0,
                    textTransform: 'none',
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  },
                  '& .Mui-selected': { fontWeight: 650 },
                }}
              >
                {TAB_VALUES.map(value => (
                  <Tab
                    id={`inspect-tab-${value}`}
                    key={value}
                    value={value}
                    label={value === 'statistics'
                      ? t.discover.inspector.statistics
                      : value === 'clusters'
                        ? t.discover.inspector.clusters
                        : value === 'request'
                          ? t.discover.inspector.request
                          : t.discover.inspector.response}
                  />
                ))}
              </Tabs>
            </Box>

            <Box
              role="tabpanel"
              aria-labelledby={`inspect-tab-${tab}`}
              sx={{
                minHeight: 0,
                minWidth: 0,
                overflow: 'hidden',
                position: 'relative',
                bgcolor: 'background.paper',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  minHeight: 0,
                  minWidth: 0,
                  overflow: 'auto',
                  overscrollBehavior: 'contain',
                  px: 3,
                  py: 1.5,
                  boxSizing: 'border-box',
                }}
              >
                {tab === 'statistics' && <InspectStatistics request={request} response={response} requestItem={selectedRequest} />}
                {tab === 'clusters' && <InspectClusters response={response} />}
                {tab === 'request' && <InspectCodePanel value={requestPayload} label={t.discover.inspector.request} showConsole />}
                {tab === 'response' && <InspectCodePanel value={responsePayload} label={t.discover.inspector.response} />}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 650 }}>{t.discover.inspector.profilesUnavailable}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t.discover.inspector.profilesUnavailableDescription}
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
