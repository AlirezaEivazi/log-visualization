'use client';

import * as React from 'react';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { fontMono } from '@/theme/typography';
import { stringifyJson } from './inspect.utils';

interface InspectJsonPanelProps {
  value: unknown;
  label: string;
}

export function InspectJsonPanel({ value, label }: InspectJsonPanelProps) {
  const [copied, setCopied] = React.useState(false);
  const text = React.useMemo(() => stringifyJson(value), [value]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard can be unavailable in insecure/local browser contexts.
    }
  };

  return (
    <Box sx={{ minHeight: 390, border: 1, borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.5, py: 0.75, borderBottom: 1, borderColor: 'divider', bgcolor: 'action.hover' }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Tooltip title={copied ? 'Copied' : 'Copy'}>
          <IconButton size="small" onClick={copy} aria-label={copied ? 'Copied' : `Copy ${label}`}>
            {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Stack>
      <Box component="pre" sx={{ m: 0, p: 1.5, maxHeight: 470, overflow: 'auto', bgcolor: 'background.default', fontFamily: fontMono, fontSize: 12, lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {text}
      </Box>
    </Box>
  );
}
