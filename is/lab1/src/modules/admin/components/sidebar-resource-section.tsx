// @ts-nocheck
import { Navigation } from '@adminjs/design-system';
import {
  type SidebarResourceSectionProps,
  useNavigationResources,
  useTranslation,
} from 'adminjs';
import React, { FC } from 'react';

const SidebarResourceSection: FC<SidebarResourceSectionProps> = ({
  resources,
}) => {
  // console.log('resources', resources);
  // const elements = useNavigationResources(resources);
  // const { translateLabel } = useTranslation();

  const openUrl = (url: string) => () => {
    window.open(url, '_blank');
  };

  // console.log('elements', elements);

  const elements = [];

  elements.unshift({
    icon: 'Truck',
    label: 'kanbanBoard',
    onClick: openUrl('https://github.com/orgs/SoftwareBrothers/projects/5'),
  });

  elements.unshift({
    icon: 'PieChart',
    label: 'stats',
    onClick: openUrl('https://stats.adminjs.co'),
  });

  return <Navigation label="test" elements={elements} />;
};

export default SidebarResourceSection;
