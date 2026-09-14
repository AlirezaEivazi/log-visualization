export const locales = ['en', 'fa'] as const;
export type Locale = (typeof locales)[number];

/**
 * Change this one line to flip which language the app starts in for a
 * fresh visitor (no persisted preference yet). Everything else — theme
 * direction, fonts, <html dir/lang> — follows from this automatically.
 */
export const DEFAULT_LOCALE: Locale = 'fa';

export const localeMeta: Record<Locale, { label: string; nativeLabel: string; dir: 'ltr' | 'rtl' }> = {
  en: { label: 'English', nativeLabel: 'English', dir: 'ltr' },
  fa: { label: 'Persian', nativeLabel: 'فارسی', dir: 'rtl' },
};
