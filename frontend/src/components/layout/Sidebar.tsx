'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import { NAV_ITEMS } from '@/config/navigation';
import { LAYOUT } from '@/theme/theme';
import { useUiStore } from '@/store/uiStore';
import { useTranslation } from '@/i18n/useTranslation';

function BrandRow({ collapsed }: { collapsed: boolean }) {
  return (
    <Box
      sx={{
        height: LAYOUT.TOPBAR_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: collapsed ? 1.25 : 2,
        flexShrink: 0,
      }}
    >
      <HubOutlinedIcon sx={{ color: 'primary.main' }} />
      {!collapsed && (
        <Typography variant="h6" noWrap sx={{ fontSize: '0.9375rem' }}>
          OpsBoard
        </Typography>
      )}
    </Box>
  );
}

/**
 * The nav list itself, shared between the desktop (permanent, collapsible)
 * and mobile (temporary overlay) drawers so the two never drift apart.
 * `onNavigate` is only passed by the mobile drawer — tapping a link should
 * close the overlay; the desktop drawer has no reason to do that.
 */
function NavList({
  collapsed,
  dir,
  onNavigate,
}: {
  collapsed: boolean;
  dir: 'ltr' | 'rtl';
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <List sx={{ px: 1, flexGrow: 1 }}>
      {NAV_ITEMS.map((item) => {
        const label = t.nav[item.key].label;
        const selected = pathname?.startsWith(item.href) ?? false;
        const button = (
          <ListItemButton
            component={NextLink}
            href={item.href}
            selected={selected}
            onClick={onNavigate}
            sx={{
              minHeight: 40,
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1 : 1.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 1.5,
                justifyContent: 'center',
                color: 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText primary={label} slotProps={{ primary: { sx: { fontSize: '0.8125rem' } } }} />
            )}
          </ListItemButton>
        );

        return (
          <ListItem key={item.href} disablePadding sx={{ display: 'block', mb: 0.25 }}>
            {collapsed ? (
              <Tooltip title={label} placement={dir === 'rtl' ? 'left' : 'right'}>
                {button}
              </Tooltip>
            ) : (
              button
            )}
          </ListItem>
        );
      })}
    </List>
  );
}

/**
 * Renders two drawers and shows exactly one at a time via CSS (`sx.display`
 * breakpoints), following MUI's own responsive-drawer pattern:
 *  - `md` and up: the existing permanent drawer, collapsible between full
 *    width and an icon rail (unchanged from desktop behavior).
 *  - below `md`: a temporary drawer that overlays the page, closed by
 *    default and opened via the menu button in TopBar. It always shows
 *    full labels (an icon-only rail isn't very tappable) and closes itself
 *    when a nav item is tapped.
 */
export default function Sidebar() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen);
  const closeMobileNav = useUiStore((s) => s.closeMobileNav);
  const { t, dir } = useTranslation();

  const desktopWidth = sidebarOpen ? LAYOUT.SIDEBAR_WIDTH : LAYOUT.SIDEBAR_WIDTH_COLLAPSED;

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: desktopWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          transition: (theme) => theme.transitions.create('width', { duration: 180 }),
          '& .MuiDrawer-paper': {
            width: desktopWidth,
            overflowX: 'hidden',
            transition: (theme) => theme.transitions.create('width', { duration: 180 }),
            boxSizing: 'border-box',
          },
        }}
      >
        <BrandRow collapsed={!sidebarOpen} />
        <NavList collapsed={!sidebarOpen} dir={dir} />
        <Box sx={{ display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center', p: 1 }}>
          <IconButton onClick={toggleSidebar} size="small" aria-label={t.sidebar.toggle}>
            {sidebarOpen ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileNavOpen}
        onClose={closeMobileNav}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: LAYOUT.SIDEBAR_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <BrandRow collapsed={false} />
        <NavList collapsed={false} dir={dir} onNavigate={closeMobileNav} />
      </Drawer>
    </>
  );
}
