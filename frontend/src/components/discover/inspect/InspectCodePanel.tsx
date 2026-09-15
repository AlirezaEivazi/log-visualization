'use client';

import * as React from 'react';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TerminalIcon from '@mui/icons-material/Terminal';
import CheckIcon from '@mui/icons-material/Check';
import { fontMono } from '@/theme/typography';
import { stringifyJson } from './inspect.utils';

interface InspectCodePanelProps {
  value: unknown;
  label: string;
  showConsole?: boolean;
}

export function InspectCodePanel({ value, label, showConsole = false }: InspectCodePanelProps) {
  const [copied, setCopied] = React.useState(false);
  const text = React.useMemo(() => stringifyJson(value), [value]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard may be unavailable in local browser contexts.
    }
  };

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden', bgcolor: 'background.paper' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.5, py: 0.75, minHeight: 42, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Stack direction="row" spacing={0.5}>
          {showConsole && (
            <Tooltip title="Open in Console">
              <Button size="small" variant="text" startIcon={<TerminalIcon fontSize="small" />} sx={{ textTransform: 'none' }}>
                Open in Console
              </Button>
            </Tooltip>
          )}
          <Tooltip title={copied ? 'Copied' : 'Copy to clipboard'}>
            <Button size="small" variant="text" startIcon={copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />} onClick={copy} sx={{ textTransform: 'none' }}>
              {copied ? 'Copied' : 'Copy to clipboard'}
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 1.75,
          height: 'calc(100vh - 300px)',
          minHeight: 300,
          maxHeight: 620,
          overflow: 'auto',
          bgcolor: '#fff',
          color: '#263238',
          fontFamily: fontMono,
          fontSize: 12,
          lineHeight: 1.65,
          whiteSpace: 'pre',
        }}
      >
        {text}
      </Box>
    </Box>
  );
}
