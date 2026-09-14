'use client';

import PageHeader from '@/components/common/PageHeader';
import PanelCard from '@/components/common/PanelCard';
import StatCard from '@/components/common/StatCard';
import TimeSeriesChart from '@/components/charts/TimeSeriesChart';
import CategoryBarChart from '@/components/charts/CategoryBarChart';
import StatusDonutChart from '@/components/charts/StatusDonutChart';
import { mockDashboardSummary } from '@/mock/dashboard.mock';
import { useTranslation } from '@/i18n/useTranslation';
import { usePageTitle } from '@/hooks/usePageTitle';

// Rendering mock data directly; swap for `useDashboardSummary()`
// (src/lib/api/queries/useDashboardSummary.ts) once a real API is wired up.
export default function DashboardsPage() {
  const { t } = useTranslation();
  usePageTitle(t.dashboards.title);
  const { stats, eventsOverTime, topSources, statusBreakdown } = mockDashboardSummary;

  return (
    <div>
      <PageHeader title={t.dashboards.title} subtitle={t.dashboards.subtitle} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PanelCard title={t.dashboards.eventsOverTime.title} subtitle={t.dashboards.eventsOverTime.subtitle}>
            <TimeSeriesChart data={eventsOverTime} />
          </PanelCard>
        </div>
        <PanelCard title={t.dashboards.responseStatus.title} subtitle={t.dashboards.responseStatus.subtitle}>
          <StatusDonutChart data={statusBreakdown} />
        </PanelCard>
      </div>

      <div className="mt-4 grid grid-cols-1">
        <PanelCard title={t.dashboards.topSources.title} subtitle={t.dashboards.topSources.subtitle}>
          <CategoryBarChart data={topSources} />
        </PanelCard>
      </div>
    </div>
  );
}
