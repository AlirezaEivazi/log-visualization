'use client';

import * as React from 'react';
import {
  Box, Chip, Divider, Drawer, FormControl, IconButton, MenuItem, Select, Stack,
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

const TAB_LABELS: Array<{ value: InspectTab; label: string }> = [
  { value: 'statistics', label: 'Statistics' },
  { value: 'clusters', label: 'Clusters and shards' },
  { value: 'request', label: 'Request' },
  { value: 'response', label: 'Response' },
];

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
  const [tab, setTab] = React.useState<InspectTab>('response');
  const [view, setView] = React.useState<InspectView>('requests');
  const [selectedRequestId, setSelectedRequestId] = React.useState('documents');

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
  const selectedRequest = requestItems.find(item => item.id === selectedRequestId) ?? requestItems[0];
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
      ModalProps={{ keepMounted: true }}
      slotProps={{
        backdrop: {
          sx: { bgcolor: 'rgba(38, 50, 56, 0.46)' },
        },
      }}
    >
      <Box
        dir="ltr"
        sx={{
          width: { xs: '100vw', sm: 760, md: 790 },
          maxWidth: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#fff',
        }}
      >
        <Box sx={{ px: 2.5, py: 1.35, minHeight: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 650 }}>Inspector</Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body2" color="text.secondary">View:</Typography>
            <Select
              variant="standard"
              value={view}
              onChange={e => setView(e.target.value as InspectView)}
              IconComponent={KeyboardArrowDownIcon}
              disableUnderline
              sx={{
                minWidth: 115,
                '& .MuiSelect-select': { py: 0.25, pr: 3, color: 'primary.main', fontWeight: 600 },
                '& .MuiSvgIcon-root': { color: 'primary.main' },
              }}
            >
              <MenuItem value="requests">Requests</MenuItem>
              <MenuItem value="profiles">Profiles</MenuItem>
            </Select>
            <IconButton size="small" onClick={onClose} sx={{ ml: 1 }} aria-label="Close inspector">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        {view === 'requests' ? (
          <>
            <Box sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
              <Stack direction="row" alignItems="flex-start" spacing={1.25}>
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
                  sx={{ mt: 2.5, bgcolor: '#dff7e8', color: '#087443', fontWeight: 700, '& .MuiChip-icon': { color: '#0b8f55' } }}
                />
              </Stack>
              <Typography variant="body2" sx={{ mt: 1.1, color: 'text.primary' }}>
                {selectedRequest.description}
              </Typography>
            </Box>

            <Box sx={{ px: 2.5, borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tab}
                onChange={(_, value: InspectTab) => setTab(value)}
                variant="scrollable"
                scrollButtons={false}
                sx={{
                  minHeight: 42,
                  '& .MuiTab-root': { minHeight: 42, px: 1.2, textTransform: 'none', fontSize: 13, fontWeight: 500 },
                  '& .Mui-selected': { fontWeight: 650 },
                }}
              >
                {TAB_LABELS.map(item => <Tab key={item.value} value={item.value} label={item.label} />)}
              </Tabs>
            </Box>

            <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 2.5, py: 1.5 }}>
              {tab === 'statistics' && <InspectStatistics request={request} response={response} requestItem={selectedRequest} />}
              {tab === 'clusters' && <InspectClusters response={response} />}
              {tab === 'request' && <InspectCodePanel value={requestPayload} label="Request" showConsole />}
              {tab === 'response' && <InspectCodePanel value={responsePayload} label="Response" />}
            </Box>
          </>
        ) : (
          <Box sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 650 }}>Profiles</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Request profiles will be available when the real query and profile API are connected.
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
