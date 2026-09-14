import type { ReactNode } from 'react';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

export type NavKey = 'dashboards' | 'discover' | 'visualize' | 'management';

export interface NavItem {
  key: NavKey;
  href: string;
  icon: ReactNode;
}

/**
 * The Sidebar renders straight from this list, looking up the label and
 * description for each `key` from the active dictionary (see
 * src/i18n/dictionary.types.ts -> nav). Add a page to the app by adding an
 * entry here plus a matching `nav.<key>` block in both locale files —
 * nothing else in the layout needs to change.
 */
export const NAV_ITEMS: NavItem[] = [
  { key: 'dashboards', href: '/dashboards', icon: <SpaceDashboardOutlinedIcon fontSize="small" /> },
  { key: 'discover', href: '/discover', icon: <ManageSearchOutlinedIcon fontSize="small" /> },
  { key: 'visualize', href: '/visualize', icon: <InsightsOutlinedIcon fontSize="small" /> },
  { key: 'management', href: '/management', icon: <TuneOutlinedIcon fontSize="small" /> },
];
