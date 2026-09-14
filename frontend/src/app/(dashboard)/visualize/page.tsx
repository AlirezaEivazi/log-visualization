'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import PageHeader from '@/components/common/PageHeader';
import PanelCard from '@/components/common/PanelCard';
import TimeSeriesChart from '@/components/charts/TimeSeriesChart';
import CategoryBarChart from '@/components/charts/CategoryBarChart';
import StatusDonutChart from '@/components/charts/StatusDonutChart';
import { mockDashboardSummary } from '@/mock/dashboard.mock';
import { useTranslation } from '@/i18n/useTranslation';
import { usePageTitle } from '@/hooks/usePageTitle';

type ChartType = 'line' | 'bar' | 'donut';
type SavedVizId = 'events' | 'sources' | 'status';

const CHART_TYPE_ORDER: ChartType[] = ['line', 'bar', 'donut'];
const CHART_TYPE_ICONS: Record<ChartType, React.ReactNode> = {
  line: <ShowChartOutlinedIcon />,
  bar: <BarChartOutlinedIcon />,
  donut: <DonutLargeOutlinedIcon />,
};

const SAVED_VIZ_ORDER: SavedVizId[] = ['events', 'sources', 'status'];

function ChartPreview({ type }: { type: ChartType }) {
  const { eventsOverTime, topSources, statusBreakdown } = mockDashboardSummary;
  if (type === 'line') return <TimeSeriesChart data={eventsOverTime} />;
  if (type === 'bar') return <CategoryBarChart data={topSources} />;
  return <StatusDonutChart data={statusBreakdown} />;
}

function SavedVisualization({ id }: { id: SavedVizId }) {
  const { eventsOverTime, topSources, statusBreakdown } = mockDashboardSummary;
  if (id === 'events') return <TimeSeriesChart data={eventsOverTime} height={200} />;
  if (id === 'sources') return <CategoryBarChart data={topSources} height={200} />;
  return <StatusDonutChart data={statusBreakdown} height={200} />;
}

export default function VisualizePage() {
  const { t } = useTranslation();
  usePageTitle(t.visualize.title);
  const [selectedType, setSelectedType] = React.useState<ChartType>('line');

  return (
    <div>
      <PageHeader
        title={t.visualize.title}
        subtitle={t.visualize.subtitle}
        actions={
          <Button startIcon={<AddOutlinedIcon />} variant="contained" size="small">
            {t.visualize.createButton}
          </Button>
        }
      />

      <Typography variant="h6" sx={{ mb: 1.5 }}>
        {t.visualize.chooseChartType}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 1.5, mb: 3 }}>
        {CHART_TYPE_ORDER.map((type) => {
          const chart = t.visualize.chartTypes[type];
          return (
            <ButtonBase
              key={type}
              onClick={() => setSelectedType(type)}
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 0.75,
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: selectedType === type ? 'primary.main' : 'divider',
                bgcolor: selectedType === type ? 'action.selected' : 'background.paper',
                textAlign: 'left',
              }}
            >
              <Box sx={{ color: selectedType === type ? 'primary.main' : 'text.secondary' }}>
                {CHART_TYPE_ICONS[type]}
              </Box>
              <Typography variant="subtitle2">{chart.label}</Typography>
              <Typography variant="caption" color="text.secondary">
                {chart.description}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>

      <PanelCard title={t.visualize.previewTitle} subtitle={t.visualize.previewSubtitle}>
        <ChartPreview type={selectedType} />
      </PanelCard>

      <Typography variant="h6" sx={{ mt: 4, mb: 1.5 }}>
        {t.visualize.savedTitle}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
        {SAVED_VIZ_ORDER.map((id) => (
          <PanelCard key={id} title={t.visualize.saved[id].title} subtitle={t.visualize.saved[id].subtitle}>
            <SavedVisualization id={id} />
          </PanelCard>
        ))}
      </Box>
    </div>
  );
}
