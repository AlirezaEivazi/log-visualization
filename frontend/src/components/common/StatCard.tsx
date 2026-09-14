'use client';

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { fontMono } from '@/theme/typography';
import { useTranslation } from '@/i18n/useTranslation';
import type { StatMetric } from '@/types/dashboard.types';

/**
 * A rising number isn't automatically "good" (e.g. active alerts, error
 * rate) — the color follows this per-metric sense, not the raw direction
 * of the arrow.
 */
const GOOD_WHEN_UP = new Set(['events', 'uptime']);

export default function StatCard({ id, value, deltaPct, trend }: StatMetric) {
  const { t } = useTranslation();
  const label = t.dashboards.stats[id];
  const isGoodDirection = trend === 'up' ? GOOD_WHEN_UP.has(id) : !GOOD_WHEN_UP.has(id);
  const trendColor = trend === 'flat' || deltaPct === undefined ? 'text.secondary' : isGoodDirection ? 'success.main' : 'error.main';

  return (
    <Card sx={{ p: 2, height: '100%' }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ fontFamily: fontMono, fontSize: '1.75rem', fontWeight: 600, mt: 0.5, lineHeight: 1.2 }}>
        {value}
      </Typography>
      {deltaPct !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.75, color: trendColor }}>
          {trend === 'up' ? (
            <ArrowUpwardRoundedIcon sx={{ fontSize: 16 }} />
          ) : trend === 'down' ? (
            <ArrowDownwardRoundedIcon sx={{ fontSize: 16 }} />
          ) : null}
          <Typography variant="caption" sx={{ fontFamily: fontMono }}>
            {Math.abs(deltaPct)}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t.dashboards.vsYesterday}
          </Typography>
        </Box>
      )}
    </Card>
  );
}
