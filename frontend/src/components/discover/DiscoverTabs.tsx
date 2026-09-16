'use client';

import * as React from 'react';
import { Box, IconButton, Menu, MenuItem, Paper, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { DiscoverTabState } from './discover.types';

interface Props {
  tabs: DiscoverTabState[];
  activeId: string;
  onChange: (id: string) => void;
  onAdd: (duplicate?: boolean) => void;
  onClose: (id: string) => void;
  onRename: () => void;
  onCloseOthers: () => void;
}

export function DiscoverTabs({ tabs, activeId, onChange, onAdd, onClose, onRename, onCloseOthers }: Props) {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  return (
    <Paper variant="outlined" square sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}>
      <Box sx={{ minHeight: 48, display: 'flex', alignItems: 'center' }}>
        <Tabs
          value={activeId}
          onChange={(_, value) => onChange(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ flex: 1, minHeight: 48, '& .MuiTab-root': { minHeight: 48, px: 2, textTransform: 'none', fontSize: 13, alignItems: 'flex-start' } }}
        >
          {tabs.map(tab => (
            <Tab
              key={tab.id}
              value={tab.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: .75 }}>
                  <Typography component="span" sx={{ fontSize: 13 }}>{tab.title}</Typography>
                  {tabs.length > 1 && (
                    <IconButton
                      size="small"
                      aria-label={`Close ${tab.title}`}
                      onClick={event => { event.stopPropagation(); onClose(tab.id); }}
                      sx={{ p: .2, mt: -.15 }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>
        <Tooltip title="New Discover tab"><IconButton size="small" onClick={() => onAdd()} sx={{ mr: .25 }}><AddIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Tab options"><IconButton size="small" onClick={e => setAnchor(e.currentTarget)} sx={{ mr: .75 }}><MoreVertIcon fontSize="small" /></IconButton></Tooltip>
      </Box>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem onClick={() => { onAdd(true); setAnchor(null); }}><ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />Duplicate tab</MenuItem>
        <MenuItem onClick={() => { onRename(); setAnchor(null); }}>Rename tab</MenuItem>
        <MenuItem disabled={tabs.length === 1} onClick={() => { onCloseOthers(); setAnchor(null); }}>Close other tabs</MenuItem>
        <MenuItem disabled={tabs.length === 1} onClick={() => { onClose(activeId); setAnchor(null); }}>Close tab</MenuItem>
      </Menu>
    </Paper>
  );
}
