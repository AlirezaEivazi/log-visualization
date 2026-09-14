'use client';

import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { fontMono } from '@/theme/typography';
import type { CategoryValue } from '@/types/dashboard.types';

interface CategoryBarChartProps {
  data: CategoryValue[];
  height?: number;
}

export default function CategoryBarChart({ data, height = 260 }: CategoryBarChartProps) {
  const theme = useTheme();

  return (
    <BarChart
      height={height}
      layout="horizontal"
      yAxis={[{ scaleType: 'band', data: data.map((d) => d.category), tickLabelStyle: { fontSize: 11 } }]}
      xAxis={[{ tickLabelStyle: { fontFamily: fontMono, fontSize: 11 } }]}
      series={[{ data: data.map((d) => d.value), color: theme.palette.secondary.main }]}
      grid={{ vertical: true }}
      margin={{ left: 110, right: 16, top: 12, bottom: 24 }}
      hideLegend
      sx={{
        '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': { stroke: theme.palette.divider },
        '& .MuiChartsGrid-line': { stroke: theme.palette.divider },
      }}
    />
  );
}
