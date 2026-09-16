/**
 * Every UI string in the app lives behind one of these keys. Both
 * src/i18n/locales/en.ts and fa.ts implement this exact shape, so a
 * missing translation is a TypeScript error, not a silent blank in the UI.
 *
 * What's deliberately NOT in here: service/host names, log messages, and
 * log-level badges (INFO/WARN/ERROR/DEBUG). Those are data/technical
 * identifiers, not UI chrome, so they stay as-is regardless of locale —
 * same reason error codes or field names usually aren't translated either.
 */
export interface Dictionary {
  nav: {
    dashboards: { label: string; description: string };
    discover: { label: string; description: string };
    visualize: { label: string; description: string };
    management: { label: string; description: string };
  };
  sidebar: {
    toggle: string;
  };
  topbar: {
    searchPlaceholder: string;
    timeRanges: [string, string, string, string];
    lightMode: string;
    darkMode: string;
    notifications: string;
    language: string;
  };
  dashboards: {
    title: string;
    subtitle: string;
    vsYesterday: string;
    stats: Record<'events' | 'uptime' | 'latency' | 'alerts', string>;
    eventsOverTime: { title: string; subtitle: string };
    responseStatus: { title: string; subtitle: string };
    topSources: { title: string; subtitle: string };
  };
  discover: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    panelTitle: string;
    panelSubtitleCount: (shown: number, total: number) => string;
    emptyTitle: string;
    emptyDescription: string;
    columns: { time: string; level: string; service: string; host: string; message: string };
    mockNotice: string;
    moreActions: {
      openSession: string;
      newSession: string;
      backgroundSearches: string;
      exportTabResults: string;
      exportCsv: string;
      exportJson: string;
      inspectTab: string;
      createAlertRule: string;
      close: string;
      sessionMock: string;
      backgroundMock: string;
      alertMock: string;
    };
    toolbar: {
      share: string;
      queryInEsql: string;
      classicKql: string;
      moreActions: string;
      save: string;
      newTab: string;
    };
    inspector: {
      title: string;
      view: string;
      requests: string;
      profiles: string;
      requestCount: (count: number) => string;
      statistics: string;
      clusters: string;
      request: string;
      response: string;
      documents: string;
      hits: string;
      hitsTotal: string;
      dataViewId: string;
      requestTimestamp: string;
      copy: string;
      copied: string;
      openConsole: string;
      successful: string;
      of: string;
      primaryCluster: string;
      shardsQueried: (count: number) => string;
      total: string;
      skipped: string;
      failed: string;
      profilesUnavailable: string;
      profilesUnavailableDescription: string;
      clustersDescription: string;
      dataView: string;
      queryTime: string;
      apiRoute: string;
      timeRange: string;
      documentsRequest: (dataView: string) => string;
      fieldStatisticsRequest: string;
    };
  };
  visualize: {
    title: string;
    subtitle: string;
    createButton: string;
    chooseChartType: string;
    chartTypes: Record<'line' | 'bar' | 'donut', { label: string; description: string }>;
    previewTitle: string;
    previewSubtitle: string;
    savedTitle: string;
    saved: Record<'events' | 'sources' | 'status', { title: string; subtitle: string }>;
  };
  management: {
    title: string;
    subtitle: string;
    sections: Record<
      'indexPatterns' | 'dataSources' | 'alertRules' | 'apiKeys' | 'usersRoles' | 'retention',
      { title: string; description: string }
    >;
  };
}
