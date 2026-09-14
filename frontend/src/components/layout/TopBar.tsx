'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { LAYOUT } from '@/theme/theme';
import { useUiStore } from '@/store/uiStore';
import { useTranslation } from '@/i18n/useTranslation';
import SearchBar from '@/components/common/SearchBar';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function TopBar() {
  const themeMode = useUiStore((s) => s.themeMode);
  const toggleThemeMode = useUiStore((s) => s.toggleThemeMode);
  const openMobileNav = useUiStore((s) => s.openMobileNav);
  const { t } = useTranslation();
  // Store the *index* into t.topbar.timeRanges rather than the string
  // itself, so the selection survives a language switch even though the
  // display text changes underneath it.
  const [timeRangeIndex, setTimeRangeIndex] = React.useState(2);
  const [timeMenuAnchor, setTimeMenuAnchor] = React.useState<null | HTMLElement>(null);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar
        variant="dense"
        sx={{ height: LAYOUT.TOPBAR_HEIGHT, minHeight: LAYOUT.TOPBAR_HEIGHT, gap: { xs: 0.75, sm: 1.5 } }}
      >
        {/* Opens the overlay nav below the `md` breakpoint — the permanent
            sidebar (see Sidebar.tsx) takes over from `md` up, and this
            button disappears at the same breakpoint. */}
        <IconButton
          onClick={openMobileNav}
          size="small"
          aria-label={t.sidebar.toggle}
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
        >
          <MenuOutlinedIcon fontSize="small" />
        </IconButton>

        <Box sx={{ flexGrow: 1, maxWidth: 480 }}>
          <SearchBar placeholder={t.topbar.searchPlaceholder} />
        </Box>

        {/* Full time-range picker — hidden on the narrowest screens, where
            its fixed width would force the toolbar to overflow. */}
        <Select
          size="small"
          value={timeRangeIndex}
          onChange={(e) => setTimeRangeIndex(Number(e.target.value))}
          sx={{ ml: 'auto', minWidth: 168, fontSize: '0.8125rem', display: { xs: 'none', sm: 'inline-flex' } }}
        >
          {t.topbar.timeRanges.map((range, i) => (
            <MenuItem key={range} value={i} sx={{ fontSize: '0.8125rem' }}>
              {range}
            </MenuItem>
          ))}
        </Select>

        {/* Same control, collapsed to an icon + menu so it still fits at
            the narrowest widths. */}
        <IconButton
          size="small"
          aria-label={t.topbar.timeRanges[timeRangeIndex]}
          onClick={(e) => setTimeMenuAnchor(e.currentTarget)}
          sx={{ ml: 'auto', display: { xs: 'inline-flex', sm: 'none' } }}
        >
          <AccessTimeOutlinedIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={timeMenuAnchor} open={Boolean(timeMenuAnchor)} onClose={() => setTimeMenuAnchor(null)}>
          {t.topbar.timeRanges.map((range, i) => (
            <MenuItem
              key={range}
              selected={i === timeRangeIndex}
              onClick={() => {
                setTimeRangeIndex(i);
                setTimeMenuAnchor(null);
              }}
            >
              {range}
            </MenuItem>
          ))}
        </Menu>

        <LanguageSwitcher />

        <Tooltip title={themeMode === 'dark' ? t.topbar.lightMode : t.topbar.darkMode}>
          <IconButton onClick={toggleThemeMode} size="small" aria-label={t.topbar.darkMode}>
            {themeMode === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        {/* Notifications is secondary chrome (nothing populates it yet) —
            the first thing to give up room on the narrowest screens. */}
        <Tooltip title={t.topbar.notifications}>
          <IconButton
            size="small"
            aria-label={t.topbar.notifications}
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            <NotificationsNoneOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Avatar sx={{ width: 30, height: 30, fontSize: '0.8125rem', bgcolor: 'primary.dark' }}>OP</Avatar>
      </Toolbar>
    </AppBar>
  );
}
