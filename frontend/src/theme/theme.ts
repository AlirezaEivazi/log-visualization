import { createTheme, Theme } from '@mui/material/styles';
import { darkPalette, lightPalette } from './palette';
import { getTypography } from './typography';
import { getComponentOverrides } from './components';
import { localeMeta, type Locale } from '@/i18n/config';

export type ThemeMode = 'light' | 'dark';

/** Shared layout measurements, kept in one place so components agree on them. */
export const LAYOUT = {
  SIDEBAR_WIDTH: 248,
  SIDEBAR_WIDTH_COLLAPSED: 68,
  TOPBAR_HEIGHT: 56,
};

export function getTheme(mode: ThemeMode, locale: Locale): Theme {
  const base = createTheme({
    direction: localeMeta[locale].dir,
    palette: mode === 'dark' ? darkPalette : lightPalette,
    typography: getTypography(locale),
    shape: { borderRadius: 8 },
    spacing: 8,
  });

  return createTheme(base, {
    components: getComponentOverrides(base),
  });
}
