'use client';

import * as React from 'react';
import { Box, FormControl, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import type { InspectRequestItem } from './inspect.types';

interface InspectRequestPickerProps {
  items: InspectRequestItem[];
  selectedId: string;
  onChange: (id: string) => void;
}

export function InspectRequestPicker({ items, selectedId, onChange }: InspectRequestPickerProps) {
  const handleChange = (event: SelectChangeEvent<string>) => onChange(event.target.value);
  const selected = items.find(item => item.id === selectedId) ?? items[0];

  return (
    <Stack spacing={0.75}>
      <Typography variant="caption" color="text.secondary">{items.length} requests were made</Typography>
      <FormControl size="small" fullWidth>
        <Select
          value={selected?.id ?? ''}
          onChange={handleChange}
          displayEmpty
          sx={{ minHeight: 38, '& .MuiSelect-select': { py: 0.75 } }}
          renderValue={() => (
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{selected?.label ?? 'Request'}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap>{selected?.description}</Typography>
            </Box>
          )}
        >
          {items.map(item => (
            <MenuItem key={item.id} value={item.id}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.label}</Typography>
                <Typography variant="caption" color="text.secondary">{item.description}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
