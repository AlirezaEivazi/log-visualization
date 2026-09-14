'use client';

import { LineChart } from '@mui/x-charts/LineChart';
import { useTheme } from '@mui/material/styles';
import { fontMono } from '@/theme/typography';
import type { TimeSeriesPoint } from '@/types/dashboard.types';

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  height?: number;
}

export default function TimeSeriesChart({ data, height = 260 }: TimeSeriesChartProps) {
  const theme = useTheme();

  return (
    <LineChart
      height={height}
      xAxis={[{ scaleType: 'point', data: data.map((d) => d.label), tickLabelStyle: { fontFamily: fontMono, fontSize: 11 } }]}
      yAxis={[{ tickLabelStyle: { fontFamily: fontMono, fontSize: 11 } }]}
      series={[
        {
          data: data.map((d) => d.value),
          area: true,
          showMark: false,
          color: theme.palette.primary.main,
          curve: 'monotoneX',
        },
      ]}
      grid={{ horizontal: true }}
      margin={{ left: 44, right: 12, top: 12, bottom: 28 }}
      hideLegend
      sx={{
        '& .MuiAreaElement-root': { fillOpacity: 0.15 },
        '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': { stroke: theme.palette.divider },
        '& .MuiChartsGrid-line': { stroke: theme.palette.divider },
      }}
    />
  );
}
