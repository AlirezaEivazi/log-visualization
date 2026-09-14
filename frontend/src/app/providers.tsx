'use client';

import * as React from 'react';
import ThemeRegistry from '@/components/layout/ThemeRegistry';
import QueryProvider from '@/components/layout/QueryProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeRegistry>{children}</ThemeRegistry>
    </QueryProvider>
  );
}
