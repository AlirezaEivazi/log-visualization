import type { Locale } from './config';
import type { Dictionary } from './dictionary.types';
import { en } from './locales/en';
import { fa } from './locales/fa';

export * from './config';
export type { Dictionary } from './dictionary.types';

export const dictionaries: Record<Locale, Dictionary> = { en, fa };
