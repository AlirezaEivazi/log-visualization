import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/theme/theme';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';

interface UiState {
  themeMode: ThemeMode;
  sidebarOpen: boolean;
  locale: Locale;
  /** Whether the mobile overlay nav (temporary Drawer, below the `md` breakpoint) is open. */
  mobileNavOpen: boolean;
  toggleThemeMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLocale: (locale: Locale) => void;
  openMobileNav: () => void;
  closeMobileNav: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      themeMode: 'dark',
      sidebarOpen: true,
      locale: DEFAULT_LOCALE,
      mobileNavOpen: false,
      toggleThemeMode: () =>
        set((s) => ({ themeMode: s.themeMode === 'dark' ? 'light' : 'dark' })),
      setThemeMode: (mode) => set({ themeMode: mode }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setLocale: (locale) => set({ locale }),
      openMobileNav: () => set({ mobileNavOpen: true }),
      closeMobileNav: () => set({ mobileNavOpen: false }),
    }),
    {
      name: 'ui-store',
      // We rehydrate manually (see ThemeRegistry) after mount, so the first
      // client render matches the server render exactly and React doesn't
      // warn about a hydration mismatch when a returning visitor has a
      // persisted preference different from the defaults above.
      skipHydration: true,
      // mobileNavOpen is a transient overlay state, not a preference — a
      // fresh page load should always start with it closed, so it's
      // deliberately left out of what gets written to localStorage.
      partialize: (state) => ({
        themeMode: state.themeMode,
        sidebarOpen: state.sidebarOpen,
        locale: state.locale,
      }),
    }
  )
);
