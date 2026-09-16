'use client';

import * as React from 'react';
import { Box, Button, Divider, IconButton, InputAdornment, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TuneIcon from '@mui/icons-material/Tune';
import type { DiscoverTabState } from './discover.types';
import { DISCOVER_FIELDS, META_FIELDS } from './discover.types';
import { fontMono } from '@/theme/typography';

interface Props {
  tab: DiscoverTabState;
  search: string;
  onSearch: (value: string) => void;
  onChange: (patch: Partial<DiscoverTabState>) => void;
  onAddField: () => void;
}

function FieldIcon({ type }: { type: string }) {
  return <Box component="span" sx={{ width: 17, height: 17, border: 1, borderColor: 'divider', borderRadius: .5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: type === 'date' ? 'warning.main' : 'primary.main' }}>{type === 'date' ? '◷' : type === 'number' ? '#' : 'K'}</Box>;
}

export function DiscoverFieldsSidebar({ tab, search, onSearch, onChange, onAddField }: Props) {
  const [availableOpen, setAvailableOpen] = React.useState(true);
  const [emptyOpen, setEmptyOpen] = React.useState(true);
  const [metaOpen, setMetaOpen] = React.useState(true);
  const normalized = search.trim().toLowerCase();
  const available = DISCOVER_FIELDS.filter(f => f.name.includes(normalized));
  const empty = available.filter(f => !['created_at', 'id', 'level', 'message', 'service', 'host'].includes(f.name));

  const removeColumn = (column: string) => onChange({ columns: tab.columns.filter(item => item !== column) });
  const addColumn = (column: string) => onChange({ columns: tab.columns.includes(column) ? tab.columns : [...tab.columns, column] });

  return (
    <Paper variant="outlined" square sx={{ width: 296, minWidth: 296, height: '100%', minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', borderTop: 0, borderBottom: 0, borderLeft: 0, borderRadius: 0 }}>
      <Box sx={{ p: 1 }}>
        <TextField fullWidth size="small" value={search} onChange={e => onSearch(e.target.value)} placeholder="Search field names" slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>, endAdornment: <Tooltip title="Filter fields"><IconButton size="small"><TuneIcon fontSize="small" /></IconButton></Tooltip> } }} />
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        <SectionHeader label="Available fields" count={available.length} open={availableOpen} onToggle={() => setAvailableOpen(v => !v)} />
        {availableOpen && (
          <Stack spacing={.15} sx={{ mb: 1.25 }}>
            {available.map(field => {
              const selected = tab.columns.includes(field.name);
              return (
                <Box key={field.name} sx={{ display: 'flex', alignItems: 'center', minHeight: 30, px: .5, borderRadius: .5, '&:hover': { bgcolor: 'action.hover' } }}>
                  <FieldIcon type={field.type} />
                  <Typography sx={{ ml: .75, flex: 1, fontFamily: fontMono, fontSize: 11.5 }} noWrap>{field.name}</Typography>
                  {selected ? <IconButton size="small" onClick={() => removeColumn(field.name)}><CloseIcon sx={{ fontSize: 14 }} /></IconButton> : <IconButton size="small" onClick={() => addColumn(field.name)}><AddIcon sx={{ fontSize: 15 }} /></IconButton>}
                </Box>
              );
            })}
          </Stack>
        )}
        <SectionHeader label="Empty fields" count={empty.length || 5} open={emptyOpen} onToggle={() => setEmptyOpen(v => !v)} />
        {emptyOpen && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: .5, py: 1.25 }}>No values in the current mock result set.</Typography>}
        <SectionHeader label="Meta fields" count={META_FIELDS.length} open={metaOpen} onToggle={() => setMetaOpen(v => !v)} />
        {metaOpen && <Stack spacing={.15}>{META_FIELDS.map(field => <Box key={field} sx={{ display: 'flex', alignItems: 'center', minHeight: 28, px: .5 }}><FieldIcon type="keyword" /><Typography sx={{ ml: .75, fontFamily: fontMono, fontSize: 11.5 }}>{field}</Typography></Box>)}</Stack>}
      </Box>
      <Divider />
      <Box sx={{ p: 1 }}><Button fullWidth variant="outlined" size="small" startIcon={<AddIcon />} onClick={onAddField}>Add a field</Button></Box>
    </Paper>
  );
}

function SectionHeader({ label, count, open, onToggle }: { label: string; count: number; open: boolean; onToggle: () => void }) {
  return <Box onClick={onToggle} sx={{ display: 'flex', alignItems: 'center', gap: .25, py: .75, cursor: 'pointer', userSelect: 'none' }}><KeyboardArrowDownIcon sx={{ fontSize: 17, transform: open ? 'rotate(0)' : 'rotate(-90deg)' }} /><Typography variant="subtitle2" sx={{ flex: 1 }}>{label}</Typography><Box sx={{ minWidth: 22, px: .5, borderRadius: .5, bgcolor: 'action.hover', textAlign: 'center', fontSize: 11 }}>{count}</Box></Box>;
}
