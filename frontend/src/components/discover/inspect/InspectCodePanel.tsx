'use client';

import * as React from 'react';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from '@/i18n/useTranslation';
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
  const { t } = useTranslation();
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
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%', boxSizing: 'border-box' }}>
      <Stack direction="row" sx={{ px: 1.5, py: 0.75, minHeight: 42, borderBottom: 1, borderColor: 'divider', alignItems: 'center', justifyContent: 'space-between'}}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Stack direction="row" spacing={0.5}>
          {showConsole && (
            <Tooltip title={t.discover.inspector.openConsole}>
              <Button size="small" variant="text" startIcon={<TerminalIcon fontSize="small" />} sx={{ textTransform: 'none' }}>
                {t.discover.inspector.openConsole}
              </Button>
            </Tooltip>
          )}
          <Tooltip title={copied ? t.discover.inspector.copied : t.discover.inspector.copy}>
            <Button size="small" variant="text" startIcon={copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />} onClick={copy} sx={{ textTransform: 'none' }}>
              {copied ? t.discover.inspector.copied : t.discover.inspector.copy}
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 1.75,
          flex: '1 1 auto',
          minHeight: 0,
          overflow: 'auto',
          bgcolor: 'background.default',
          color: 'text.primary',
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
