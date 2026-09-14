import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { IBM_Plex_Sans, IBM_Plex_Mono, Vazirmatn } from 'next/font/google';
import Providers from './providers';
import { DEFAULT_LOCALE, localeMeta } from '@/i18n/config';
import './globals.css';

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

// Persian UI font — a connected (cursive) script needs a typeface actually
// designed for it. See src/theme/typography.ts for how this and
// IBM Plex Sans are switched between at runtime.
const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fa',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OpsBoard',
  description: 'A bilingual (English/Persian), Kibana-style operations dashboard built with Next.js and MUI.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Tints mobile browser chrome (e.g. Android's address bar) to match
  // whichever palette background is active, instead of the OS default.
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0e14' },
    { media: '(prefers-color-scheme: light)', color: '#f5f7fa' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Server render always uses the configured default locale (see
  // src/i18n/config.ts); ThemeRegistry corrects `dir`/`lang` client-side
  // right after mount if a returning visitor had picked the other language
  // — the same pattern already used for the dark/light theme preference.
  return (
    <html
      lang={DEFAULT_LOCALE}
      dir={localeMeta[DEFAULT_LOCALE].dir}
      className={`${plexSans.variable} ${plexMono.variable} ${vazirmatn.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
