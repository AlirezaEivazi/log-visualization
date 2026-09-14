'use client';

import { PieChart } from '@mui/x-charts/PieChart';
import { useTheme } from '@mui/material/styles';
import type { CategoryValue } from '@/types/dashboard.types';

interface StatusDonutChartProps {
  data: CategoryValue[];
  height?: number;
}

export default function StatusDonutChart({ data, height = 260 }: StatusDonutChartProps) {
  const theme = useTheme();
  const colors = [theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main];

  return (
    <PieChart
      height={height}
      series={[
        {
          data: data.map((d, i) => ({ id: d.category, value: d.value, label: d.category, color: colors[i % colors.length] })),
          innerRadius: 48,
          outerRadius: 90,
          paddingAngle: 2,
          cornerRadius: 3,
        },
      ]}
      slotProps={{
        legend: {
          direction: 'vertical',
          position: { vertical: 'middle', horizontal: 'end' },
          sx: { fontSize: 12, color: theme.palette.text.secondary },
        },
      }}
    />
  );
}
