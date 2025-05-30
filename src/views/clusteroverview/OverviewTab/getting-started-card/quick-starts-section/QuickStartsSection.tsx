import * as React from 'react';
import { FC } from 'react';

import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { useQuickStartContext } from '@openshift-console/dynamic-plugin-sdk';
import { QuickStartsLoader } from '@openshift-console/dynamic-plugin-sdk-internal';
import { AllQuickStartStates, QuickStart } from '@patternfly/quickstarts';
import { RouteIcon } from '@patternfly/react-icons';

import GettingStartedSectionContents from '../utils/getting-started-content/GettingStartedSectionContents';
import { GettingStartedLink } from '../utils/types';

import { orderQuickStarts } from './utils';

interface QuickStartsSectionProps {
  allQuickStartStates?: AllQuickStartStates;
  description?: string;
  featured?: string[];
  filter?: (QuickStart) => boolean;
  setActiveQuickStart?: (quickStartId: string, totalTasks?: number) => void;
  title?: string;
}

const QuickStartsSection: FC<QuickStartsSectionProps> = ({
  description,
  featured,
  filter,
  title,
}) => {
  const { t } = useKubevirtTranslation();
  const { allQuickStartStates, setActiveQuickStart } = useQuickStartContext();

  return (
    <QuickStartsLoader>
      {(quickStarts, loaded) => {
        const orderedQuickStarts = orderQuickStarts(
          quickStarts,
          allQuickStartStates,
          featured,
          filter,
        );
        const slicedQuickStarts = orderedQuickStarts.slice(0, 2);

        const links: GettingStartedLink[] = loaded
          ? slicedQuickStarts.map((quickStart: QuickStart) => ({
              id: quickStart.metadata.name,
              onClick: () => {
                setActiveQuickStart(quickStart.metadata.name, quickStart.spec.tasks.length);
              },
              title: quickStart.spec.displayName,
            }))
          : featured?.map((name) => ({
              id: name,
              loading: true,
            }));

        const moreLink: GettingStartedLink = {
          href: '/quickstart',
          id: 'all-quick-starts',
          title: t('View all quick starts'),
        };

        return (
          <GettingStartedSectionContents
            description={
              description ||
              t(
                'Follow guided documentation to build applications and familiarize yourself with key features.',
              )
            }
            icon={<RouteIcon aria-hidden="true" color="var(--co-global--palette--purple-600)" />}
            id="quick-start"
            links={links}
            moreLink={moreLink}
            title={title || t('Build with guided documentation')}
            titleColor={'var(--co-global--palette--purple-600)'}
          />
        );
      }}
    </QuickStartsLoader>
  );
};

export default QuickStartsSection;
