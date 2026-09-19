'use client';

import * as React from 'react';
import {
  Box, Button, Dialog, FormControl, InputLabel, MenuItem, Paper,
  Select, Stack, Switch, TextField, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import type { CustomDiscoverField } from './discover.types';
import { DISCOVER_FIELDS } from './discover.types';
import type { LogEntry } from '@/types/discover.types';

interface Props {
  open: boolean;
  dataView: string;
  logs: LogEntry[];
  onClose: () => void;
  onSave: (field: CustomDiscoverField) => void;
}

type FieldType = CustomDiscoverField['type'];

export function DiscoverCreateFieldDialog({ open, dataView, logs, onClose, onSave }: Props) {
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState<FieldType>('keyword');
  const [customLabelEnabled, setCustomLabelEnabled] = React.useState(false);
  const [customLabel, setCustomLabel] = React.useState('');
  const [descriptionEnabled, setDescriptionEnabled] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [valueEnabled, setValueEnabled] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [formatEnabled, setFormatEnabled] = React.useState(false);
  const [format, setFormat] = React.useState('Default');
  const [advanced, setAdvanced] = React.useState(false);
  const [popularityEnabled, setPopularityEnabled] = React.useState(false);
  const [popularity, setPopularity] = React.useState('0');
  const [previewSearch, setPreviewSearch] = React.useState('');
  const [previewIndex, setPreviewIndex] = React.useState(0);

  React.useEffect(() => {
    if (!open) return;
    setName(''); setType('keyword'); setCustomLabelEnabled(false); setCustomLabel('');
    setDescriptionEnabled(false); setDescription(''); setValueEnabled(false); setValue('');
    setFormatEnabled(false); setFormat('Default'); setAdvanced(false); setPopularityEnabled(false);
    setPopularity('0'); setPreviewSearch(''); setPreviewIndex(0);
  }, [open]);

  const document = logs[previewIndex] ?? logs[0];
  const previewRows = React.useMemo(() => {
    const rows = DISCOVER_FIELDS.map(field => ({
      name: field.name,
      value: document?.[field.name as keyof LogEntry] == null ? 'Value not set' : String(document[field.name as keyof LogEntry]),
    }));
    if (name.trim()) rows.unshift({ name: customLabel.trim() || name.trim(), value: valueEnabled ? value : 'Value not set' });
    return rows.filter(row => row.name.toLowerCase().includes(previewSearch.toLowerCase()));
  }, [document, name, customLabel, valueEnabled, value, previewSearch]);

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({
      name: trimmed,
      type,
      label: customLabelEnabled && customLabel.trim() ? customLabel.trim() : undefined,
      description: descriptionEnabled ? description : undefined,
      value: valueEnabled ? value : undefined,
      format: formatEnabled ? format : undefined,
      popularity: popularityEnabled ? Number(popularity) || 0 : undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-container': { justifyContent: 'flex-end' }, '& .MuiDialog-paper': { width: { xs: '100vw', md: '50vw' }, maxWidth: { xs: '100vw', md: '50vw' }, height: '100dvh', maxHeight: '100dvh', m: 0, borderRadius: 0 } }}>
      <Box sx={{ height: '100dvh', display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' }, bgcolor: 'background.default' }}>
        <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', borderRight: { md: 1 }, borderColor: 'divider' }}>
          <Box sx={{ flex: 1, overflow: 'auto', px: { xs: 2, md: 3 }, py: 2.5, pb: 10 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: .25 }}>Create field</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>Data view: <Box component="span" sx={{ fontStyle: 'italic' }}>{dataView}</Box></Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField fullWidth size="small" label="Name" value={name} onChange={e => setName(e.target.value)} autoFocus />
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select label="Type" value={type} onChange={e => setType(e.target.value as FieldType)}>
                  <MenuItem value="keyword">Keyword</MenuItem><MenuItem value="text">Text</MenuItem>
                  <MenuItem value="number">Number</MenuItem><MenuItem value="date">Date</MenuItem><MenuItem value="boolean">Boolean</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <OptionSection title="Set custom label" description="Create a label to display in place of the field name in Discover, Maps, Lens, Visualize, and TSVB. Useful for shortening a long field name." enabled={customLabelEnabled} onToggle={() => setCustomLabelEnabled(v => !v)}>
              <TextField fullWidth size="small" label="Custom label" value={customLabel} onChange={e => setCustomLabel(e.target.value)} />
            </OptionSection>
            <OptionSection title="Set custom description" description="Add a description to the field. It's displayed next to the field on the Discover, Lens, and Data View Management pages." enabled={descriptionEnabled} onToggle={() => setDescriptionEnabled(v => !v)}>
              <TextField fullWidth size="small" multiline minRows={2} label="Description" value={description} onChange={e => setDescription(e.target.value)} />
            </OptionSection>
            <OptionSection title="Set value" description={<>Set a value for the field instead of retrieving it from the field with the same name in <Box component="code" sx={{ px: .5, bgcolor: 'action.hover', borderRadius: .5 }}>_source</Box>.</>} enabled={valueEnabled} onToggle={() => setValueEnabled(v => !v)}>
              <TextField fullWidth size="small" label="Value" value={value} onChange={e => setValue(e.target.value)} />
            </OptionSection>
            <OptionSection title="Set format" description="Set your preferred format for displaying the value. Changing the format can affect the value and prevent highlighting in Discover." enabled={formatEnabled} onToggle={() => setFormatEnabled(v => !v)}>
              <FormControl fullWidth size="small"><InputLabel>Format</InputLabel><Select label="Format" value={format} onChange={e => setFormat(e.target.value)}><MenuItem value="Default">Default</MenuItem><MenuItem value="Number">Number</MenuItem><MenuItem value="Date">Date</MenuItem><MenuItem value="String">String</MenuItem></Select></FormControl>
            </OptionSection>

            <Button variant="text" size="small" onClick={() => setAdvanced(v => !v)} sx={{ mt: 1, mb: 1, px: 0, textTransform: 'none' }}>{advanced ? 'Hide advanced settings' : 'Show advanced settings'}</Button>
            {advanced && (
              <OptionSection title="Set popularity" description="Adjust the popularity to make the field appear higher or lower in the fields list." enabled={popularityEnabled} onToggle={() => setPopularityEnabled(v => !v)}>
                <TextField fullWidth size="small" type="number" label="Popularity" value={popularity} onChange={e => setPopularity(e.target.value)} />
              </OptionSection>
            )}
          </Box>
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: { xs: '100%', md: '50%' }, px: 2, py: 1.5, bgcolor: 'background.default', borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button startIcon={<CloseIcon />} onClick={onClose}>Cancel</Button>
            <Button variant="contained" disabled={!name.trim()} onClick={save} sx={{ minWidth: 112 }}>Save</Button>
          </Box>
        </Box>

        <Box sx={{ minWidth: 0, overflow: 'auto', p: { xs: 2, md: 3 }, bgcolor: 'background.default' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: .25 }}>Preview</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>From: {dataView}</Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <TextField size="small" fullWidth label="Document ID" value={document?.id ?? 'No documents'} slotProps={{ input: { readOnly: true } }} />
            <Button variant="outlined" disabled={previewIndex <= 0} onClick={() => setPreviewIndex(i => Math.max(0, i - 1))} sx={{ minWidth: 40 }}><ChevronLeftIcon /></Button>
            <Button variant="outlined" disabled={previewIndex >= Math.max(0, logs.length - 1)} onClick={() => setPreviewIndex(i => Math.min(Math.max(0, logs.length - 1), i + 1))} sx={{ minWidth: 40 }}><ChevronRightIcon /></Button>
          </Stack>
          <TextField fullWidth size="small" placeholder="Filter fields" value={previewSearch} onChange={e => setPreviewSearch(e.target.value)} slotProps={{ input: { startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> } }} sx={{ mb: 1.5 }} />
          <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
            {previewRows.map(row => <Box key={row.name} sx={{ display: 'grid', gridTemplateColumns: '46% 54%', px: 1.25, py: .9, borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 }, bgcolor: row.name === (customLabel || name) ? 'action.selected' : 'transparent' }}><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: row.name === (customLabel || name) ? 700 : 400 }} noWrap>{row.name}</Typography><Typography variant="body2" color={row.value === 'Value not set' ? 'text.secondary' : 'text.primary'} noWrap>{row.value}</Typography></Box>)}
          </Paper>
        </Box>
      </Box>
    </Dialog>
  );
}

function OptionSection({ title, description, enabled, onToggle, children }: { title: string; description: React.ReactNode; enabled: boolean; onToggle: () => void; children: React.ReactNode }) {
  return <Box sx={{ py: 1.7, borderBottom: 1, borderColor: 'divider' }}>
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
      <Switch size="small" checked={enabled} onChange={onToggle} sx={{ mt: -.35, ml: -.5 }} />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: .35 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.45 }}>{description}</Typography>
        {enabled && <Box sx={{ mt: 1.5 }}>{children}</Box>}
      </Box>
    </Stack>
  </Box>;
}
