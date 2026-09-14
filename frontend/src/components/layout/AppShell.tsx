'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { LAYOUT } from '@/theme/theme';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <TopBar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          mt: `${LAYOUT.TOPBAR_HEIGHT}px`,
          p: { xs: 2, md: 3 },
          bgcolor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
