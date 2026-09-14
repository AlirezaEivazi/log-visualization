'use client';

import { useUiStore } from '@/store/uiStore';
import { dictionaries, localeMeta } from '@/i18n';

/**
 * `const { t } = useTranslation()` then reference `t.nav.dashboards.label`
 * etc. Because `t` is typed as `Dictionary`, a typo or a missing key is a
 * compile error instead of a blank string in production.
 */
export function useTranslation() {
  const locale = useUiStore((s) => s.locale);
  return {
    locale,
    dir: localeMeta[locale].dir,
    t: dictionaries[locale],
  };
}
