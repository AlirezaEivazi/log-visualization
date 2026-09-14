'use client';

import { useEffect } from 'react';

/**
 * Pages are client components (they call useTranslation, a client-only
 * hook), so they can't export a server `metadata.title` — Next.js only
 * allows that in Server Components. This is the client-side equivalent:
 * call it once per page with the already-translated title.
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · OpsBoard`;
  }, [title]);
}
