import React, { MouseEvent, useEffect, useState } from 'react';

import { NetworkAttachmentDefinitionModelGroupVersionKind } from '@kubevirt-ui/kubevirt-api/console';
import FormPFSelect from '@kubevirt-utils/components/FormPFSelect/FormPFSelect';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { getName } from '@kubevirt-utils/resources/shared';
import { isEmpty } from '@kubevirt-utils/utils/utils';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import {
  Alert,
  AlertVariant,
  Content,
  ContentVariants,
  SelectGroup,
  SelectOption,
  Skeleton,
  Title,
} from '@patternfly/react-core';

import { NetworkAttachmentDefinitionKind } from '../../../../../../OverviewTab/inventory-card/utils/types';
import {
  getLiveMigrationNetwork,
  PRIMARY_NETWORK,
  updateLiveMigrationConfig,
} from '../utils/utils';

const Network = ({ hyperConverge }) => {
  const { t } = useKubevirtTranslation();
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [nads, nadsLoaded, nadsError] = useK8sWatchResource<NetworkAttachmentDefinitionKind[]>({
    groupVersionKind: NetworkAttachmentDefinitionModelGroupVersionKind,
    isList: true,
  });

  useEffect(() => {
    if (hyperConverge) {
      const network = getLiveMigrationNetwork(hyperConverge);
      setSelectedNetwork(network ?? PRIMARY_NETWORK);
    }
  }, [hyperConverge]);

  const onSelect = (_event: MouseEvent<Element>, selectedValue: string) => {
    updateLiveMigrationConfig(
      hyperConverge,
      selectedValue !== PRIMARY_NETWORK ? selectedValue : null,
      'network',
    );
    setSelectedNetwork(selectedValue);
  };
  return (
    <>
      <Content component={ContentVariants.small}>{t('Set live migration network')}</Content>
      <Title className="live-migration-tab__network--title" headingLevel="h6" size="md">
        {t('Live migration network')}
      </Title>
      {nadsLoaded ? (
        <FormPFSelect
          onSelect={onSelect}
          popperProps={{ width: '360px' }}
          selected={selectedNetwork}
          toggleProps={{ isDisabled: isEmpty(nads) }}
        >
          <SelectOption key="primary" value={PRIMARY_NETWORK}>
            {t('Primary live migration network')}
          </SelectOption>
          <SelectGroup key="nad" label={t('Secondary NAD networks')}>
            {nads?.map((nad) => {
              const nadName = getName(nad);
              return (
                <SelectOption key={nadName} value={nadName}>
                  {nadName}
                </SelectOption>
              );
            })}
          </SelectGroup>
        </FormPFSelect>
      ) : (
        !nadsError && <Skeleton width={'360px'} />
      )}
      {nadsError && (
        <Alert
          className="live-migration-tab--error"
          isInline
          title={t('Error')}
          variant={AlertVariant.danger}
        >
          {nadsError?.message}
        </Alert>
      )}
    </>
  );
};

export default Network;
