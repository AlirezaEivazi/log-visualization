'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined';
import PageHeader from '@/components/common/PageHeader';
import { useTranslation } from '@/i18n/useTranslation';
import { usePageTitle } from '@/hooks/usePageTitle';

type SectionKey = 'indexPatterns' | 'dataSources' | 'alertRules' | 'apiKeys' | 'usersRoles' | 'retention';

const SECTION_ORDER: SectionKey[] = [
  'indexPatterns',
  'dataSources',
  'alertRules',
  'apiKeys',
  'usersRoles',
  'retention',
];

const SECTION_ICONS: Record<SectionKey, ReactNode> = {
  indexPatterns: <StorageOutlinedIcon />,
  dataSources: <CloudSyncOutlinedIcon />,
  alertRules: <NotificationsActiveOutlinedIcon />,
  apiKeys: <KeyOutlinedIcon />,
  usersRoles: <GroupOutlinedIcon />,
  retention: <RuleOutlinedIcon />,
};

export default function ManagementPage() {
  const { t } = useTranslation();
  usePageTitle(t.management.title);

  return (
    <div>
      <PageHeader title={t.management.title} subtitle={t.management.subtitle} />

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 2 }}>
        {SECTION_ORDER.map((key) => {
          const section = t.management.sections[key];
          return (
            <Card key={key} sx={{ p: 2.5, display: 'flex', gap: 1.5, cursor: 'pointer' }}>
              <Box sx={{ color: 'primary.main', mt: 0.25 }}>{SECTION_ICONS[key]}</Box>
              <Box>
                <Typography variant="subtitle2">{section.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {section.description}
                </Typography>
              </Box>
            </Card>
          );
        })}
      </Box>
    </div>
  );
}
