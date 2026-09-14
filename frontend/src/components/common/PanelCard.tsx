import * as React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PanelCardProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  minHeight?: number;
}

/**
 * The single wrapper every dashboard panel (chart, table, stat group) uses,
 * so panels stay visually consistent without each page reimplementing the
 * header/body layout.
 */
export default function PanelCard({ title, subtitle, actions, children, minHeight }: PanelCardProps) {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography variant="h6">{title}</Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions}
      </Box>
      <Box sx={{ p: 2, flexGrow: 1, minHeight }}>{children}</Box>
    </Card>
  );
}
