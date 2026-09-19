'use client';

import * as React from 'react';
import { Box, Button, Divider, IconButton, InputAdornment, Paper, Stack, TextField, Tooltip, Typography, Popover, LinearProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TuneIcon from '@mui/icons-material/Tune';
import type { CustomDiscoverField, DiscoverTabState } from './discover.types';
import { DISCOVER_FIELDS, META_FIELDS } from './discover.types';
import { fontMono } from '@/theme/typography';
import type { LogEntry } from '@/types/discover.types';

interface Props {
  tab: DiscoverTabState;
  search: string;
  onSearch: (value: string) => void;
  onChange: (patch: Partial<DiscoverTabState>) => void;
  onAddField: () => void;
  filteredLogs: LogEntry[];
  customFields: CustomDiscoverField[];
}

function FieldIcon({ type }: { type: string }) {
  return <Box component="span" sx={{ width: 17, height: 17, border: 1, borderColor: 'divider', borderRadius: .5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: type === 'date' ? 'warning.main' : 'primary.main' }}>{type === 'date' ? '◷' : type === 'number' ? '#' : 'K'}</Box>;
}

interface FieldValue {
  value: string;
  count: number;
  percentage: number;
}

function FieldValuesPopover({
  field,
  logs,
  anchorEl,
  onClose
}: {
  field: string;
  logs: LogEntry[];
  anchorEl: HTMLElement | null;
  onClose: () => void;
}) {
  const values = React.useMemo<FieldValue[]>(() => {
    const counts = new Map<string, number>();
    logs.forEach(log => {
      const value = String(log[field as keyof LogEntry] ?? '');
      counts.set(value, (counts.get(value) || 0) + 1);
    });

    const total = logs.length;
    return Array.from(counts.entries())
      .map(([value, count]) => ({
        value,
        count,
        percentage: (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 values
  }, [field, logs]);

  const maxCount = values[0]?.count || 1;

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{ paper: { sx: { width: 320, maxHeight: 400 } } }}
    >
      <Box sx={{ p: 1.5 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontFamily: fontMono, fontSize: 12 }}>
          Top values for {field}
        </Typography>
        <Stack spacing={1}>
          {values.map(({ value, count, percentage }) => (
            <Box key={value}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.25 }}>
                <Typography variant="body2" sx={{ flex: 1, fontFamily: fontMono, fontSize: 11, wordBreak: 'break-word' }} noWrap>
                  {value || '(empty)'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                  {count} ({percentage.toFixed(1)}%)
                </Typography>
              </Stack>
              <Box sx={{ position: 'relative', height: 4, bgcolor: 'action.hover', borderRadius: 0.5 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${(count / maxCount) * 100}%`,
                    bgcolor: 'primary.main',
                    borderRadius: 0.5
                  }}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Popover>
  );
}

export function DiscoverFieldsSidebar({ tab, search, onSearch, onChange, onAddField, filteredLogs, customFields }: Props) {
  const [selectedFieldsOpen, setSelectedFieldsOpen] = React.useState(true);
  const [availableOpen, setAvailableOpen] = React.useState(true);
  const [emptyOpen, setEmptyOpen] = React.useState(false);
  const [metaOpen, setMetaOpen] = React.useState(false);
  const [popoverAnchor, setPopoverAnchor] = React.useState<HTMLElement | null>(null);
  const [popoverField, setPopoverField] = React.useState<string>('');

  const normalized = search.trim().toLowerCase();

  // Categorize fields based on filtered data
  const { selectedFields, availableFields, emptyFields } = React.useMemo(() => {
    type FieldType = { name: string; type: string };
    const selected: FieldType[] = [];
    const available: FieldType[] = [];
    const empty: FieldType[] = [];

    const allFields = [
      ...DISCOVER_FIELDS,
      ...customFields.map(field => ({ name: field.name, type: field.type })),
    ];

    allFields.forEach(field => {
      // Check if field name matches search
      if (normalized && !field.name.toLowerCase().includes(normalized)) {
        return;
      }

      // Check if field is in selected columns
      const isSelected = tab.columns.includes(field.name);

      // Check if field has values in filtered results
      const hasValues = filteredLogs.some(log => {
        const value = log[field.name as keyof LogEntry];
        return value !== undefined && value !== null && value !== '';
      });

      if (isSelected) {
        selected.push(field);
      } else if (hasValues) {
        available.push(field);
      } else {
        empty.push(field);
      }
    });

    return { selectedFields: selected, availableFields: available, emptyFields: empty };
  }, [tab.columns, filteredLogs, normalized, customFields]);

  const removeColumn = (column: string) => onChange({ columns: tab.columns.filter(item => item !== column) });
  const addColumn = (column: string) => onChange({ columns: tab.columns.includes(column) ? tab.columns : [...tab.columns, column] });

  const handleFieldClick = (e: React.MouseEvent<HTMLElement>, fieldName: string) => {
    setPopoverField(fieldName);
    setPopoverAnchor(e.currentTarget);
  };

  const highlightMatch = (text: string, search: string) => {
    if (!search) return text;
    const index = text.toLowerCase().indexOf(search.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.substring(0, index)}
        <Box component="span" sx={{ bgcolor: 'warning.light', color: 'warning.dark', px: 0.25 }}>
          {text.substring(index, index + search.length)}
        </Box>
        {text.substring(index + search.length)}
      </>
    );
  };

  return (
    <Paper variant="outlined" square sx={{ width: 296, minWidth: 296, height: '100%', minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', borderTop: 0, borderBottom: 0, borderLeft: 0, borderRadius: 0 }}>
      <Box sx={{ p: 1 }}>
        <TextField fullWidth size="small" value={search} onChange={e => onSearch(e.target.value)} placeholder="Search field names" slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>, endAdornment: <Tooltip title="Filter fields"><IconButton size="small"><TuneIcon fontSize="small" /></IconButton></Tooltip> } }} />
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        {/* Selected fields */}
        {selectedFields.length > 0 && (
          <>
            <SectionHeader label="Selected fields" count={selectedFields.length} open={selectedFieldsOpen} onToggle={() => setSelectedFieldsOpen(v => !v)} />
            {selectedFieldsOpen && (
              <Stack spacing={.15} sx={{ mb: 1.25 }}>
                {selectedFields.map(field => (
                  <Box
                    key={field.name}
                    sx={{ display: 'flex', alignItems: 'center', minHeight: 30, px: .5, borderRadius: .5, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    onClick={(e) => handleFieldClick(e, field.name)}
                  >
                    <FieldIcon type={field.type} />
                    <Typography sx={{ ml: .75, flex: 1, fontFamily: fontMono, fontSize: 11.5 }} noWrap>
                      {highlightMatch(field.name, normalized)}
                    </Typography>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeColumn(field.name); }}>
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}
          </>
        )}

        {/* Available fields */}
        <SectionHeader label="Available fields" count={availableFields.length} open={availableOpen} onToggle={() => setAvailableOpen(v => !v)} />
        {availableOpen && (
          <Stack spacing={.15} sx={{ mb: 1.25 }}>
            {availableFields.map(field => (
              <Box
                key={field.name}
                sx={{ display: 'flex', alignItems: 'center', minHeight: 30, px: .5, borderRadius: .5, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                onClick={(e) => handleFieldClick(e, field.name)}
              >
                <FieldIcon type={field.type} />
                <Typography sx={{ ml: .75, flex: 1, fontFamily: fontMono, fontSize: 11.5 }} noWrap>
                  {highlightMatch(field.name, normalized)}
                </Typography>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); addColumn(field.name); }}>
                  <AddIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Box>
            ))}
          </Stack>
        )}

        {/* Empty fields */}
        {emptyFields.length > 0 && (
          <>
            <SectionHeader label="Empty fields" count={emptyFields.length} open={emptyOpen} onToggle={() => setEmptyOpen(v => !v)} />
            {emptyOpen && (
              <Stack spacing={.15} sx={{ mb: 1.25 }}>
                {emptyFields.map(field => (
                  <Box
                    key={field.name}
                    sx={{ display: 'flex', alignItems: 'center', minHeight: 30, px: .5, borderRadius: .5, opacity: 0.6 }}
                  >
                    <FieldIcon type={field.type} />
                    <Typography sx={{ ml: .75, flex: 1, fontFamily: fontMono, fontSize: 11.5 }} noWrap>
                      {highlightMatch(field.name, normalized)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </>
        )}

        {/* Meta fields */}
        <SectionHeader label="Meta fields" count={META_FIELDS.length} open={metaOpen} onToggle={() => setMetaOpen(v => !v)} />
        {metaOpen && <Stack spacing={.15}>{META_FIELDS.map(field => <Box key={field} sx={{ display: 'flex', alignItems: 'center', minHeight: 28, px: .5 }}><FieldIcon type="keyword" /><Typography sx={{ ml: .75, fontFamily: fontMono, fontSize: 11.5 }}>{field}</Typography></Box>)}</Stack>}
      </Box>
      <Divider />
      <Box sx={{ p: 1 }}><Button fullWidth variant="outlined" size="small" startIcon={<AddIcon />} onClick={onAddField}>Add a field</Button></Box>

      <FieldValuesPopover
        field={popoverField}
        logs={filteredLogs}
        anchorEl={popoverAnchor}
        onClose={() => setPopoverAnchor(null)}
      />
    </Paper>
  );
}

function SectionHeader({ label, count, open, onToggle }: { label: string; count: number; open: boolean; onToggle: () => void }) {
  return <Box onClick={onToggle} sx={{ display: 'flex', alignItems: 'center', gap: .25, py: .75, cursor: 'pointer', userSelect: 'none' }}><KeyboardArrowDownIcon sx={{ fontSize: 17, transform: open ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} /><Typography variant="subtitle2" sx={{ flex: 1 }}>{label}</Typography><Box sx={{ minWidth: 22, px: .5, borderRadius: .5, bgcolor: 'action.hover', textAlign: 'center', fontSize: 11 }}>{count}</Box></Box>;
}
