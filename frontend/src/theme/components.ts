import { Components, Theme, alpha } from '@mui/material/styles';

/**
 * Component overrides shared by both palettes.
 *
 * Deliberate choice: panels/cards separate from the page using a 1px
 * hairline border plus a slight background shift, not a drop shadow.
 * This keeps the "instrument panel" flatness instead of the generic
 * soft-grey-shadow-on-every-card look.
 */
export function getComponentOverrides(theme: Theme): Components {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: theme.palette.background.default,
        },
        '*::-webkit-scrollbar': { width: 8, height: 8 },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: alpha(theme.palette.text.secondary, 0.25),
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
        },
      },
      defaultProps: { elevation: 0 },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          borderRadius: theme.shape.borderRadius,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: theme.shape.borderRadius, boxShadow: 'none' },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
      defaultProps: { disableElevation: true },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 500 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: theme.palette.divider },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius,
          '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
            '& .MuiListItemIcon-root': { color: theme.palette.primary.main },
            '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.18) },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[700],
          fontSize: '0.75rem',
        },
      },
    },
  };
}
