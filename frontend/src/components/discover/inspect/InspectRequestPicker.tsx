'use client';

import * as React from 'react';
import { Box, Button, Menu, MenuItem, Stack, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { InspectRequestItem } from './inspect.types';
import { useTranslation } from '@/i18n/useTranslation';

interface InspectRequestPickerProps {
  items: InspectRequestItem[];
  selectedId: string;
  onChange: (id: string) => void;
}

export function InspectRequestPicker({ items, selectedId, onChange }: InspectRequestPickerProps) {
  const { t } = useTranslation();
  const selected = items.find(item => item.id === selectedId) ?? items[0];
  const selectedLabel = selected?.id === 'field-statistics'
    ? t.discover.inspector.statistics
    : t.discover.inspector.documents;
  const selectedDescription = selected?.id === 'field-statistics'
    ? t.discover.inspector.fieldStatisticsRequest
    : t.discover.inspector.documentsRequest(
        selected?.description.match(/queries (.+?) to fetch/)?.[1] ?? 'logs-*'
      );

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorEl);

  return (
    <Stack spacing={0.65}>
      <Typography variant="caption" color="text.primary" sx={{ fontSize: 12 }}>
        {t.discover.inspector.requestCount(items.length)}
      </Typography>

      <Button
        fullWidth
        variant="outlined"
        size="small"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={menuOpen ? 'true' : undefined}
        sx={{
          minHeight: 40,
          px: 1.5,
          justifyContent: 'space-between',
          textTransform: 'none',
          color: 'text.primary',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' },
        }}
        endIcon={<KeyboardArrowDownIcon fontSize="small" />}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1, textAlign: 'left' }}>
          <Typography component="span" variant="body2" sx={{ pr: 1.5, mr: 1.5, borderRight: 1, borderColor: 'divider', fontWeight: 500, flexShrink: 0 }}>
            {t.discover.inspector.request}
          </Typography>
          <Typography component="span" variant="body2" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedLabel}
          </Typography>
        </Box>
      </Button>

      <Menu
        sx={{ zIndex: 1600 }}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        disablePortal={false}
        slotProps={{
          paper: {
            sx: { minWidth: anchorEl?.clientWidth ?? 260, maxHeight: 320, zIndex: 1600 },
          },
        }}
        MenuListProps={{ dense: true }}
      >
        {items.map(item => (
          <MenuItem
            key={item.id}
            selected={item.id === selected?.id}
            onClick={() => {
              onChange(item.id);
              setAnchorEl(null);
            }}
          >
            {item.id === 'field-statistics' ? t.discover.inspector.statistics : t.discover.inspector.documents}
          </MenuItem>
        ))}
      </Menu>

      <Typography variant="caption" color="text.primary" sx={{ fontSize: 12, lineHeight: 1.45 }}>
        {selectedDescription}
      </Typography>
    </Stack>
  );
}
