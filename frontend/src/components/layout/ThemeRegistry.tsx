'use client';

import * as React from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import type { EmotionCache } from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from '@/theme/theme';
import { useUiStore } from '@/store/uiStore';
import { localeMeta } from '@/i18n/config';

function createTrackedCache(key: string, rtl: boolean): { cache: EmotionCache; flush: () => string[] } {
  const cache = createCache({
    key,
    stylisPlugins: rtl ? [prefixer, rtlPlugin] : undefined,
  });
  cache.compat = true;

  let inserted: string[] = [];
  const prevInsert = cache.insert;
  cache.insert = (...args) => {
    const serialized = args[1];
    if (cache.inserted[serialized.name] === undefined) {
      inserted.push(serialized.name);
    }
    return prevInsert(...args);
  };

  const flush = () => {
    const prev = inserted;
    inserted = [];
    return prev;
  };

  return { cache, flush };
}

/**
 * Standard MUI recipe for the Next.js App Router, extended for RTL: two
 * Emotion caches are kept alive at once — a plain one ('mui-ltr') and one
 * running the stylis RTL plugin ('mui-rtl') — and whichever the current
 * locale needs is handed to <CacheProvider>. Every component's existing
 * `sx` (margins, paddings, borders, positions, …) is written once, in the
 * physical (left/right) form, and gets mirrored automatically when Persian
 * is active — nothing in Sidebar/TopBar/etc. needs direction-specific code.
 */
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [{ ltr, rtl }] = React.useState(() => ({
    ltr: createTrackedCache('mui-ltr', false),
    rtl: createTrackedCache('mui-rtl', true),
  }));

  const themeMode = useUiStore((s) => s.themeMode);
  const locale = useUiStore((s) => s.locale);
  const dir = localeMeta[locale].dir;
  const active = dir === 'rtl' ? rtl : ltr;

  useServerInsertedHTML(() => {
    const names = active.flush();
    if (names.length === 0) return null;
    let styles = '';
    for (const name of names) {
      styles += active.cache.inserted[name];
    }
    return (
      <style
        key={active.cache.key}
        data-emotion={`${active.cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  // The store skips auto-hydration (see src/store/uiStore.ts) so the first
  // client render matches the server render; rehydrate from localStorage
  // right after mount instead.
  React.useEffect(() => {
    useUiStore.persist.rehydrate();
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
    document.documentElement.style.colorScheme = themeMode;
  }, [themeMode]);

  React.useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [dir, locale]);

  const theme = React.useMemo(() => getTheme(themeMode, locale), [themeMode, locale]);

  return (
    <CacheProvider value={active.cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
