import { TypographyVariantsOptions } from '@mui/material/styles';
import type { Locale } from '@/i18n/config';

/**
 * Three type families, each with a real job:
 *  - `--font-sans` (IBM Plex Sans): English UI chrome — nav, headings, body.
 *  - `--font-fa` (Vazirmatn): Persian UI chrome. Persian is written in a
 *    connected (cursive) script, so it needs a typeface actually designed
 *    for it rather than the Latin font's fallback glyphs.
 *  - `--font-mono` (IBM Plex Mono): genuine tabular/numeric data only —
 *    stat card values, timestamps, log lines. This is a functional choice
 *    (digit alignment, scanability), not a decorative one, so it's used
 *    for data regardless of locale — timestamps and service names in the
 *    log stream stay in Latin script either way.
 *
 * All three CSS variables are always loaded (see src/app/layout.tsx), so
 * switching locale at runtime just changes which var() the theme points
 * at — no extra font request, no layout-shifting reflow.
 */
export const fontMono = 'var(--font-mono), "SFMono-Regular", Menlo, monospace';

function getFontSans(locale: Locale) {
  return locale === 'fa'
    ? 'var(--font-fa), var(--font-sans), sans-serif'
    : 'var(--font-sans), var(--font-fa), sans-serif';
}

export function getTypography(locale: Locale): TypographyVariantsOptions {
  const fontSans = getFontSans(locale);
  // Negative/positive letter-spacing is a Latin-typography convention for
  // tightening tracking; applied to Persian's connected letterforms it can
  // visibly break the joins between characters, so we neutralize it for fa.
  const headingTracking = locale === 'fa' ? 'normal' : '-0.01em';
  const overlineTracking = locale === 'fa' ? 'normal' : '0.02em';

  return {
    fontFamily: fontSans,
    h1: { fontFamily: fontSans, fontWeight: 600, fontSize: '2rem', letterSpacing: headingTracking },
    h2: { fontFamily: fontSans, fontWeight: 600, fontSize: '1.5rem', letterSpacing: headingTracking },
    h3: { fontFamily: fontSans, fontWeight: 600, fontSize: '1.25rem' },
    h4: { fontFamily: fontSans, fontWeight: 600, fontSize: '1.0625rem' },
    h5: { fontFamily: fontSans, fontWeight: 600, fontSize: '0.9375rem' },
    h6: { fontFamily: fontSans, fontWeight: 600, fontSize: '0.875rem' },
    subtitle1: { fontSize: '0.875rem' },
    subtitle2: { fontSize: '0.8125rem', fontWeight: 500 },
    body1: { fontSize: '0.875rem', lineHeight: 1.55 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
    overline: { textTransform: 'none', fontSize: '0.75rem', letterSpacing: overlineTracking },
  };
}
