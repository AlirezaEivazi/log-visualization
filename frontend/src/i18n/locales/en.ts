import type { Dictionary } from '../dictionary.types';

export const en: Dictionary = {
  nav: {
    dashboards: { label: 'Dashboards', description: 'Overview of system activity' },
    discover: { label: 'Discover', description: 'Search and explore raw log events' },
    visualize: { label: 'Visualize', description: 'Build charts from your data' },
    management: { label: 'Management', description: 'Data sources, index patterns, settings' },
  },
  sidebar: {
    toggle: 'Toggle sidebar',
  },
  topbar: {
    searchPlaceholder: 'Search events, hosts, services…',
    timeRanges: ['Last 15 minutes', 'Last 1 hour', 'Last 24 hours', 'Last 7 days'],
    lightMode: 'Switch to light mode',
    darkMode: 'Switch to dark mode',
    notifications: 'Notifications',
    language: 'Language',
  },
  dashboards: {
    title: 'Overview',
    subtitle: 'System activity across all connected services',
    vsYesterday: 'vs. yesterday',
    stats: {
      events: 'Events (24h)',
      uptime: 'Uptime',
      latency: 'p95 latency',
      alerts: 'Active alerts',
    },
    eventsOverTime: { title: 'Events over time', subtitle: 'Last 24 hours' },
    responseStatus: { title: 'Response status', subtitle: 'Share of requests by status class' },
    topSources: { title: 'Top sources', subtitle: 'Event volume by service' },
  },
  discover: {
    title: 'Discover',
    subtitle: 'Search and explore raw log events',
    searchPlaceholder: 'Search messages, service, host…',
    panelTitle: 'Log stream',
    panelSubtitleCount: (shown, total) =>
      `${shown.toLocaleString('en-US')} of ${total.toLocaleString('en-US')} events`,
    emptyTitle: 'No events match this search',
    emptyDescription: 'Try removing a level filter or a search term.',
    columns: { time: 'Time', level: 'Level', service: 'Service', host: 'Host', message: 'Message' },
    mockNotice:
      'Showing mock data for demo purposes — connect NEXT_PUBLIC_API_BASE_URL to a real backend to replace it.',
  },
  visualize: {
    title: 'Visualize',
    subtitle: "Build new charts or open something you've already saved",
    createButton: 'Create visualization',
    chooseChartType: 'Choose a chart type',
    chartTypes: {
      line: { label: 'Line', description: 'Track a metric across time' },
      bar: { label: 'Bar', description: 'Compare values across categories' },
      donut: { label: 'Donut', description: 'Show proportion of a whole' },
    },
    previewTitle: 'Preview',
    previewSubtitle: 'Built from sample event data',
    savedTitle: 'Saved visualizations',
    saved: {
      events: { title: 'Events over time', subtitle: 'Last 24 hours' },
      sources: { title: 'Top sources', subtitle: 'By event volume' },
      status: { title: 'Response status', subtitle: 'By status class' },
    },
  },
  management: {
    title: 'Management',
    subtitle: 'Data sources, index patterns, and platform settings',
    sections: {
      indexPatterns: {
        title: 'Index patterns',
        description: 'Define which data sources Discover and Visualize can query.',
      },
      dataSources: {
        title: 'Data sources',
        description: 'Connect and configure upstream services and databases.',
      },
      alertRules: {
        title: 'Alert rules',
        description: 'Set thresholds that trigger notifications automatically.',
      },
      apiKeys: {
        title: 'API keys',
        description: 'Issue and revoke credentials used to call the API.',
      },
      usersRoles: {
        title: 'Users & roles',
        description: 'Control who can view or edit dashboards and data.',
      },
      retention: {
        title: 'Retention policy',
        description: 'Decide how long raw events are kept before deletion.',
      },
    },
  },
};
