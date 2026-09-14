'use client';

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import CheckIcon from '@mui/icons-material/Check';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import { useUiStore } from '@/store/uiStore';
import { locales, localeMeta } from '@/i18n/config';
import { useTranslation } from '@/i18n/useTranslation';

export default function LanguageSwitcher() {
  const { locale, t } = useTranslation();
  const setLocale = useUiStore((s) => s.setLocale);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <>
      <Tooltip title={t.topbar.language}>
        <IconButton size="small" aria-label={t.topbar.language} onClick={(e) => setAnchorEl(e.currentTarget)}>
          <TranslateOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {locales.map((l) => (
          <MenuItem
            key={l}
            selected={l === locale}
            onClick={() => {
              setLocale(l);
              setAnchorEl(null);
            }}
          >
            <ListItemText>{localeMeta[l].nativeLabel}</ListItemText>
            {l === locale && (
              <ListItemIcon sx={{ minWidth: 0, pl: 2, color: 'primary.main' }}>
                <CheckIcon fontSize="small" />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
