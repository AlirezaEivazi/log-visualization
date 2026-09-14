import Chip from '@mui/material/Chip';
import type { LogLevel } from '@/types/discover.types';

const LEVEL_STYLES: Record<LogLevel, { color: string; bg: string }> = {
  debug: { color: 'text.secondary', bg: 'action.selected' },
  info: { color: 'primary.main', bg: 'action.selected' },
  warn: { color: 'warning.main', bg: 'action.selected' },
  error: { color: 'error.main', bg: 'action.selected' },
};

export default function LogLevelChip({ level }: { level: LogLevel }) {
  const styles = LEVEL_STYLES[level];
  return (
    <Chip
      label={level.toUpperCase()}
      size="small"
      sx={{
        height: 20,
        fontSize: '0.6875rem',
        fontWeight: 700,
        letterSpacing: '0.02em',
        color: styles.color,
        bgcolor: styles.bg,
      }}
    />
  );
}
