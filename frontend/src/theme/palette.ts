import { PaletteOptions } from '@mui/material/styles';

/**
 * Color tokens for the app.
 *
 * The look is deliberately "control room" rather than "marketing site":
 * a dark, low-chroma base with a single bright accent (signal.cyan) that
 * means "active / healthy", plus amber/red reserved strictly for warning
 * and error states. This mirrors the vernacular of monitoring tools
 * (Kibana, Grafana, terminals) where the audience scans for status at a
 * glance rather than reading a page top to bottom.
 */
export const tokens = {
  ink: {
    950: '#0a0e14',
    900: '#10151f',
    800: '#1a2130',
    700: '#242c3d',
    600: '#333d52',
  },
  slate: {
    50: '#f5f7fa',
    100: '#e7ebf1',
    300: '#aab3c5',
    400: '#8792a6',
    500: '#69748a',
  },
  signal: {
    cyan: '#2fd9c4',
    cyanDim: '#1f9e90',
    amber: '#f5a623',
    red: '#f0506e',
    violet: '#7c8cf8',
  },
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: tokens.signal.cyan,
    dark: tokens.signal.cyanDim,
    contrastText: tokens.ink[950],
  },
  secondary: {
    main: tokens.signal.violet,
    contrastText: '#ffffff',
  },
  error: { main: tokens.signal.red },
  warning: { main: tokens.signal.amber },
  success: { main: tokens.signal.cyan },
  background: {
    default: tokens.ink[950],
    paper: tokens.ink[900],
  },
  divider: 'rgba(148, 163, 184, 0.12)',
  text: {
    primary: '#e7ebf1',
    secondary: tokens.slate[400],
  },
};

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: tokens.signal.cyanDim,
    contrastText: '#ffffff',
  },
  secondary: {
    main: tokens.signal.violet,
    contrastText: '#ffffff',
  },
  error: { main: '#d1324f' },
  warning: { main: '#b9760e' },
  success: { main: tokens.signal.cyanDim },
  background: {
    default: tokens.slate[50],
    paper: '#ffffff',
  },
  divider: 'rgba(15, 23, 42, 0.09)',
  text: {
    primary: '#161c2b',
    secondary: tokens.slate[500],
  },
};
